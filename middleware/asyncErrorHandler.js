import ErrorHandler from "../utils/errorHandler.js";
import Response from "../utils/responseHandler.js";
import HttpStatus from "http-status-codes";

/**
 * Standardized async error handler that supports the custom Response object pattern.
 * It wraps async controller functions and automatically catches errors.
 *
 * @param {Function} errorFunction - The async controller function.
 * @returns {Function} Express middleware.
 */
const asyncErrorHandler = (errorFunction) => async (req, res, next) => {
  try {
    const result = await errorFunction(req, res, next);

    // If the controller returns a Response object, format and send it.
    if (result instanceof Response) {
      let response = {
        success: true,
        code: result.statusCode,
        status: HttpStatus.getReasonPhrase(result.statusCode),
      };

      if (result.status) response.message = result.status;
      if (result.data) response = { ...response, ...result.data };

      return res.status(result.statusCode).json(response);
    }
  } catch (error) {
    next(error);
  }
};

export default asyncErrorHandler;
