import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";

const schema = new Schema(
  {
    companyName: String,
    jobLink: String,
    email: String,

    // New high-impact fields for global applications
    package: String, // e.g. "AED 10,000/mo" or "6-8 LPA"
    location: String, // e.g. "Dubai", "Remote"
    visaSupport: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    techStack: String, // e.g. "MERN + AI"

    // New strategy fields for agent-guided applications
    winningMove: String, // Specific action to win the role
    theHook: String, // The unique selling point for this company

    // New fields for Manual Workflow optimization
    portalType: String, // e.g. "Workday", "Lever", "Greenhouse", "LinkedIn"
    customPitch: String, // Pre-generated 3-sentence elevator pitch

    // Role Details (Enhanced Tracking)
    isRemote: { type: Boolean, default: false },
    isRecentlyPosted: { type: Boolean, default: true }, // Within 1 week
    roleTitle: String, // Specific role title (Manager, Senior Dev, etc.)

    // For any additional data the agent or user wants to store
    details: { type: Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["pending", "applied", "bounced"],
      default: "pending",
    },

    mail: {
      sent: { type: Boolean, default: false },
      messageId: String,
    },

    user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
    statusFlag: { type: Number, default: 0 }, // 0: active, 1: deleted
  },
  { timestamps: true, collection: COLLECTIONS.PLANS },
);

export default model(COLLECTIONS.PLANS, schema);
