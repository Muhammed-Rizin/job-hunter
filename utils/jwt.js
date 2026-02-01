import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/index.js";

import models from "../model/index.js";

export const generateTokens = async (id) => {
  try {
    const accessToken = generateAccessToken(id);
    let refreshToken = generateRefreshToken(id);

    await models.UserToken.deleteMany({ userId: id });
    await models.UserToken({ userId: id, token: refreshToken }).save();

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const details = await models.UserToken.findOne({ token: refreshToken });
    if (!details) throw new Error("Invalid refresh token", 400);

    const tokenDetails = jwt.verify(details.token, REFRESH_TOKEN.SECRET);
    return tokenDetails;
  } catch (error) {
    console.error("refresh error", error);
    throw new Error("Invalid refresh token", 400);
  }
};

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, ACCESS_TOKEN.SECRET, { expiresIn: ACCESS_TOKEN.EXPIRATION });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, REFRESH_TOKEN.SECRET, { expiresIn: REFRESH_TOKEN.EXPIRATION });
};
