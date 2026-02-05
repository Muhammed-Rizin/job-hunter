import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";
import { REFRESH_TOKEN } from "../config/index.js";

const schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: COLLECTIONS.USERS },
    token: { type: String, required: true },
    deviceId: { type: String, default: null, index: true },
    // expireAt: { type: Date, default: () => new Date(Date.now() + 60 * 1000), expires: 0 },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + REFRESH_TOKEN.MAX_AGE),
      expires: 0,
    },
  },
  { timestamps: true, collection: COLLECTIONS.USER_TOKEN }
);

export default model(COLLECTIONS.USER_TOKEN, schema);
