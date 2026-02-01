import jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config/index.js";
import models from "../model/index.js";

const auth = asyncErrorHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) throw new Error("Access Denied: No token provided", 403);

    const tokenData = jwt.verify(token, ACCESS_TOKEN.SECRET);
    const user = await models.User.findById(tokenData.id).select("-password").lean();

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    console.log(error.message);
    if (error.name === "TokenExpiredError") throw new Error("Access Denied: Token Expired", 403);
    if (error.name === "JsonWebTokenError") throw new Error("Access Denied: Invalid token", 403);
    else throw new Error(`Access Denied: ${error.name}`, 403);
  }
});

export default auth;
