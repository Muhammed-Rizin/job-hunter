import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config/index.js";
import models from "../model/index.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "./asyncErrorHandler.js";

const auth = asyncErrorHandler(async (req, res, next) => {
  try {
    // console.log("Authenticating request...");
    const headerToken = req.headers["x-access-token"];
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;

    // console.log("Extracted tokens:", {
    //   cookieToken: req.cookies?.accessToken,
    //   headerToken,
    //   bearer,
    // });
    const token = req.cookies?.accessToken || headerToken || bearer;
    // console.log("Using token:", token);
    if (!token) throw new ErrorHandler("Access Denied: No token provided", 403);

    const tokenData = jwt.verify(token, ACCESS_TOKEN.SECRET);
    const user = await models.User.findById(tokenData.id).select("-password").lean();
    if (!user) throw new ErrorHandler("Access Denied: User not found", 403);

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    if (error.name === "TokenExpiredError") {
      throw new ErrorHandler("Access Denied: Token Expired", 403);
    }
    if (error.name === "JsonWebTokenError") {
      throw new ErrorHandler("Access Denied: Invalid token", 403);
    }
    throw new ErrorHandler(`Access Denied: ${error.name}`, 403);
  }
});

export default auth;
