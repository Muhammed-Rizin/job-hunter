import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";
import { getDate, getTime } from "../helper/functions.js";

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS, required: true },

    title: String,
    targetRole: String,
    targetCount: { type: Number, required: true },
    targetDate: { type: String, required: true },

    isActive: { type: Boolean, default: true },
    status: { type: Number, default: 0 },

    date: { type: String, default: () => getDate() },
    time: { type: String, default: () => getTime() },

    upDate: { type: String, default: () => getDate() },
    upTime: { type: String, default: () => getTime() },
  },
  { timestamps: true, collection: COLLECTIONS.GOALS },
);

export default model(COLLECTIONS.GOALS, schema);
