import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";

const schema = new Schema(
  {
    company: String,
    role: String,

    status: {
      type: String,
      enum: ["applied", "hr_contact", "interview", "technical", "offer", "rejected"],
      default: "applied",
    },

    source: {
      type: String,
      enum: ["mail", "linkedin", "indeed", "naukri", "website"],
    },

    appliedDate: String,
    notes: String,

    mail: {
      subject: String,
      body: String,
      to: String,
    },

    user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
    statusFlag: { type: Number, default: 0 },
  },
  { timestamps: true, collection: COLLECTIONS.APPLICATIONS },
);

export default model(COLLECTIONS.APPLICATIONS, schema);
