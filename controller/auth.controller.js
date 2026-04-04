import axios from "axios";
import crypto from "crypto";
import { generateAccessToken, generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  COOKIE_OPTIONS,
  CLIENT_URL,
  GOOGLE_OAUTH,
  GITHUB_OAUTH,
} from "../config/index.js";

import Counter from "../helper/counter.js";
import models from "../model/index.js";

import Response from "../utils/responseHandler.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";

const isNull = (val) => val === undefined || val === null || val === "";

const accessCookieOptions = { ...COOKIE_OPTIONS.ACCESS, maxAge: ACCESS_TOKEN.MAX_AGE };
const refreshCookieOptions = { ...COOKIE_OPTIONS.REFRESH, maxAge: REFRESH_TOKEN.MAX_AGE };
const oauthCookieOptions = { ...COOKIE_OPTIONS.ACCESS, maxAge: 10 * 60 * 1000 };

const setOAuthCookies = (res, { state, deviceId, provider }) => {
  res.cookie("oauth_state", state, oauthCookieOptions);
  res.cookie("oauth_provider", provider, oauthCookieOptions);
  if (deviceId) res.cookie("oauth_device", deviceId, oauthCookieOptions);
};

const clearOAuthCookies = (res) => {
  res.clearCookie("oauth_state", COOKIE_OPTIONS.ACCESS);
  res.clearCookie("oauth_provider", COOKIE_OPTIONS.ACCESS);
  res.clearCookie("oauth_device", COOKIE_OPTIONS.ACCESS);
};

const resolveTokens = (tokens) => {
  const accessToken = tokens?.accessToken;
  const refreshToken = tokens?.refreshToken;

  if (
    !accessToken ||
    !refreshToken ||
    accessToken === "undefined" ||
    refreshToken === "undefined"
  ) {
    throw new Error("Token generation failed", 500);
  }

  return { accessToken, refreshToken };
};

const pickUsername = (email, provider, providerId) => {
  if (email) return email;
  return `${provider}_${providerId}`;
};

const findOrCreateOAuthUser = async ({ provider, providerId, email, name, image }) => {
  const providerField = provider === "google" ? "googleId" : "githubId";

  let user = await models.User.findOne({ [providerField]: providerId });
  if (user) {
    if (user.status !== 0) throw new Error("User blocked", 400);
    return user;
  }

  if (email) {
    user = await models.User.findOne({ email });
    if (user) {
      if (user.status !== 0) throw new Error("User blocked", 400);
      if (!user[providerField]) {
        user[providerField] = providerId;
        user.provider = user.provider || provider;
        user.name = user.name || name;
        user.image = user.image || image;
        await user.save();
      }
      return user;
    }
  }

  if (!email) throw new Error("Email not available from provider", 400);

  const counter = new Counter("user");
  const uniqueId = await counter.uniqueId("UR");

  const data = new models.User({
    name,
    email,
    username: pickUsername(email, provider, providerId),
    image,
    provider,
    [providerField]: providerId,
    uniqueId,
  });

  await data.save();
  await counter.save();
  return data;
};

export const register = asyncErrorHandler(async (req) => {
  let { name, email, mobile, username, password } = req.body;

  if (isNull(name)) throw new Error("The field 'Name' is required", 400);
  if (isNull(email)) throw new Error("The field 'Email' is required", 400);
  if (isNull(mobile)) throw new Error("The field 'Mobile' is required", 400);
  if (isNull(username)) throw new Error("The field 'Username' is required", 400);
  if (isNull(password)) throw new Error("The field 'Password' is required", 400);

  const exists = await models.User.findOne({
    $or: [{ email: email }, { mobile: mobile }, { username: username }],
    status: 0,
  });
  if (exists) throw new Error("Email/Mobile/Username already exist", 400);

  const counter = new Counter("user");
  const uniqueId = await counter.uniqueId("UR");

  const data = new models.User({ name, email, mobile, username, uniqueId });
  data.password = data.generatePasswordHash(password);

  await data.save();
  await counter.save();

  return new Response("Registration successfully", null, 200);
});

export const login = asyncErrorHandler(async (req, res) => {
  const { username, password, deviceId } = req.body;

  const condition = { status: 0, $or: [{ mobile: username }, { email: username }, { username }] };

  const user = await models.User.findOne(condition, "name image password");
  if (!user) throw new Error("No account found", 400);

  const passValid = user.validatePassword(password, user.password);
  if (!passValid) throw new Error("Password is incorrect", 401);

  const { accessToken, refreshToken } = resolveTokens(await generateTokens(user?._id, deviceId));

  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  delete user.password;
  return new Response(null, { accessToken, refreshToken, user }, 200);
});

export const refreshToken = asyncErrorHandler(async (req, res) => {
  try {
    const deviceId = req.body?.deviceId || req.headers["x-device-id"];
    const refreshToken =
      req.cookies?.refreshToken || req.headers["x-refresh-token"] || req.body?.refreshToken;
    if (!refreshToken) throw new Error("Invalid refresh token", 400);

    const token = await verifyRefreshToken(refreshToken, deviceId);

    const user = await models.User.findById(token.id).select("status username");
    if (!user) throw new Error("Invalid refresh token", 400);

    if (user.status !== 0) throw new Error("User blocked", 400);

    const accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, accessCookieOptions);

    return new Response(null, { accessToken }, 200);
  } catch (error) {
    res.cookie("accessToken", "");
    res.cookie("refreshToken", "");
    throw new Error(error.message, 400);
  }
});

export const logout = asyncErrorHandler(async (req, res) => {
  const deviceId = req.query?.deviceId || req.body?.deviceId || req.headers["x-device-id"];
  let userId = req.user?._id;

  if (!userId) {
    const refreshToken =
      req.cookies?.refreshToken || req.headers["x-refresh-token"] || req.body?.refreshToken;
    if (refreshToken) {
      try {
        const token = await verifyRefreshToken(refreshToken, deviceId);
        userId = token?.id;
      } catch (error) {
        userId = null;
      }
    }
  }

  if (userId) {
    const condition = { userId };
    if (deviceId) condition.deviceId = deviceId;
    await models.UserToken.deleteMany(condition);
  }

  res.cookie("accessToken", "");
  res.cookie("refreshToken", "");
  return new Response("Success", null, 200);
});

export const googleAuth = asyncErrorHandler(async (req, res) => {
  if (!GOOGLE_OAUTH.CLIENT_ID || !GOOGLE_OAUTH.CLIENT_SECRET) {
    throw new Error("Google OAuth not configured", 500);
  }

  const state = crypto.randomBytes(24).toString("hex");
  const deviceId = req.query?.deviceId || req.headers["x-device-id"];

  setOAuthCookies(res, { state, deviceId, provider: "google" });

  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH.CLIENT_ID,
    redirect_uri: GOOGLE_OAUTH.REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

export const googleCallback = asyncErrorHandler(async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies?.oauth_state;
  const storedProvider = req.cookies?.oauth_provider;

  if (!code || !state || !storedState || state !== storedState || storedProvider !== "google") {
    clearOAuthCookies(res);
    return res.redirect(`${CLIENT_URL}/login?oauth=failed`);
  }

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id: GOOGLE_OAUTH.CLIENT_ID,
        client_secret: GOOGLE_OAUTH.CLIENT_SECRET,
        code,
        redirect_uri: GOOGLE_OAUTH.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const providerAccessToken = tokenResponse.data?.access_token;
    if (!providerAccessToken) throw new Error("Google token error");

    const profileResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${providerAccessToken}` },
    });

    const { sub, email, name, picture } = profileResponse.data || {};
    const user = await findOrCreateOAuthUser({
      provider: "google",
      providerId: sub,
      email,
      name,
      image: picture,
    });

    const deviceId = req.cookies?.oauth_device || null;
    const { accessToken, refreshToken } = resolveTokens(await generateTokens(user._id, deviceId));

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    clearOAuthCookies(res);
    const redirectUrl = new URL("/oauth/callback", CLIENT_URL);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("provider", "google");
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    clearOAuthCookies(res);
    return res.redirect(`${CLIENT_URL}/login?oauth=failed`);
  }
});

export const githubAuth = asyncErrorHandler(async (req, res) => {
  if (!GITHUB_OAUTH.CLIENT_ID || !GITHUB_OAUTH.CLIENT_SECRET) {
    throw new Error("GitHub OAuth not configured", 500);
  }

  const state = crypto.randomBytes(24).toString("hex");
  const deviceId = req.query?.deviceId || req.headers["x-device-id"];

  setOAuthCookies(res, { state, deviceId, provider: "github" });

  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH.CLIENT_ID,
    redirect_uri: GITHUB_OAUTH.REDIRECT_URI,
    scope: "user:email",
    state,
  });

  return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

export const githubCallback = asyncErrorHandler(async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies?.oauth_state;
  const storedProvider = req.cookies?.oauth_provider;

  if (!code || !state || !storedState || state !== storedState || storedProvider !== "github") {
    clearOAuthCookies(res);
    return res.redirect(`${CLIENT_URL}/login?oauth=failed`);
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_OAUTH.CLIENT_ID,
        client_secret: GITHUB_OAUTH.CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_OAUTH.REDIRECT_URI,
      },
      { headers: { Accept: "application/json" } },
    );

    const providerAccessToken = tokenResponse.data?.access_token;
    if (!providerAccessToken) throw new Error("GitHub token error");

    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${providerAccessToken}`,
        "User-Agent": "job-hunter",
      },
    });

    const emailResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${providerAccessToken}`,
        "User-Agent": "job-hunter",
      },
    });

    const emails = Array.isArray(emailResponse.data) ? emailResponse.data : [];
    const primaryEmail = emails.find((item) => item.primary) || emails[0];

    const user = await findOrCreateOAuthUser({
      provider: "github",
      providerId: String(profileResponse.data?.id),
      email: primaryEmail?.email,
      name: profileResponse.data?.name || profileResponse.data?.login,
      image: profileResponse.data?.avatar_url,
    });

    const deviceId = req.cookies?.oauth_device || null;
    const { accessToken, refreshToken } = resolveTokens(await generateTokens(user._id, deviceId));

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    clearOAuthCookies(res);
    const redirectUrl = new URL("/oauth/callback", CLIENT_URL);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("provider", "github");
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    clearOAuthCookies(res);
    return res.redirect(`${CLIENT_URL}/login?oauth=failed`);
  }
});
