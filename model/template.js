import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";

const schema = new Schema(
  {
    name: String,
    subject: String,
    body: String,

    user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
    status: { type: Number, default: 0 },
  },
  { timestamps: true, collection: COLLECTIONS.TEMPLATES },
);

export default model(COLLECTIONS.TEMPLATES, schema);
