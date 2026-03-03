import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/index.js";

import models from "../model/index.js";

export const generateTokens = async (id, deviceId = null) => {
  try {
    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id, deviceId);

    const condition = { userId: id };
    if (deviceId) condition.deviceId = deviceId;

    await models.UserToken.deleteMany(condition);
    await models.UserToken({ userId: id, token: refreshToken, deviceId }).save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = async (refreshToken, deviceId = null) => {
  try {
    const details = await models.UserToken.findOne({ token: refreshToken });
    if (!details) throw new Error("Invalid refresh token", 400);

    if (deviceId && details.deviceId && details.deviceId !== deviceId) {
      throw new Error("Invalid refresh token", 400);
    }

    const tokenDetails = jwt.verify(details.token, REFRESH_TOKEN.SECRET);
    if (deviceId && tokenDetails.deviceId && tokenDetails.deviceId !== deviceId) {
      throw new Error("Invalid refresh token", 400);
    }

    return tokenDetails;
  } catch (error) {
    throw new Error("Invalid refresh token", 400);
  }
};

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, ACCESS_TOKEN.SECRET, { expiresIn: ACCESS_TOKEN.EXPIRATION });
};

export const generateRefreshToken = (id, deviceId = null) => {
  const payload = { id };
  if (deviceId) payload.deviceId = deviceId;
  return jwt.sign(payload, REFRESH_TOKEN.SECRET, { expiresIn: REFRESH_TOKEN.EXPIRATION });
};
