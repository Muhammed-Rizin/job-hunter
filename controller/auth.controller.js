import { generateAccessToken, generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/index.js";

import Counter from "../helper/counter.js";
import models from "../model/index.js";

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
  const { username, password } = req.body;

  const condition = { status: 0, $or: [{ mobile: username }, { email: username }, { username }] };

  const user = await models.User.findOne(condition, "name image password");
  if (!user) throw new Error("No account found", 400);

  const passValid = user.validatePassword(password, user.password);
  if (!passValid) throw new Error("Password is incorrect", 401);

  const { accessToken, refreshToken } = await generateTokens(user?._id);

  res.cookie("accessToken", accessToken, {
    maxAge: ACCESS_TOKEN.MAX_AGE,
    secure: true,
    sameSite: "none",
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: REFRESH_TOKEN.MAX_AGE,
    secure: true,
    sameSite: "none",
  });

  delete user.password;
  return new Response(null, { accessToken, refreshToken, user }, 200);
});

export const refreshToken = asyncErrorHandler(async (req, res) => {
  try {
    const token = await verifyRefreshToken(req.cookies?.refreshToken);

    const user = await models.User.findById(token.id).select("status username");
    if (!user) throw new Error("Invalid refresh token", 400);

    if (user.status !== 0) throw new Error("User blocked", 400);

    const accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, {
      maxAge: ACCESS_TOKEN.MAX_AGE,
      secure: true,
      sameSite: "none",
    });

    return new Response(null, { accessToken }, 200);
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new Error(error.message, 400);
  }
});

export const logout = asyncErrorHandler(async (req, res) => {
  await models.UserToken.findOneAndDelete({ userId: req.user._id });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return new Response("Success", null, 200);
});
