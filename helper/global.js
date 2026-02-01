import Response from "../utils/responseHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";

import moment from "moment";
import { Types } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";

global.isNull = (field) => {
  return (
    field === undefined ||
    field === "undefined" ||
    field === "" ||
    field === null ||
    field === "null"
  ); // || !!!field;
};

global.asyncErrorHandler = asyncErrorHandler;
global.Error = ErrorHandler;
global.Response = Response;

global.ObjectId = (obj) => new Types.ObjectId(obj);

global.COLLECTIONS = COLLECTIONS;
global.moment = moment;

global.OPTIONS_FIELD = { label: "$name", value: "$_id" };
