import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";

const STATUS_ENUM = [
  "applied",
  "hr_contact",
  "interview",
  "technical",
  "offer",
  "rejected",
  "bounced",
];

const schema = new Schema(
  {
    company: String,
    role: String,

    status: {
      type: String,
      enum: STATUS_ENUM,
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
      sent: { type: Boolean, default: false },
      messageId: String,
    },
    statusDetails: {
      round: String,
      mode: { type: String, enum: ["online", "offline"] },
      date: String,
      time: String,
    },
    statusHistory: [
      {
        fromStatus: { type: String, enum: STATUS_ENUM, default: null },
        toStatus: { type: String, enum: STATUS_ENUM, required: true },
        statusDetails: {
          round: String,
          mode: { type: String, enum: ["online", "offline"] },
          date: String,
          time: String,
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
      },
    ],

    user: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
    statusFlag: { type: Number, default: 0 },
  },
  { timestamps: true, collection: COLLECTIONS.APPLICATIONS },
);

schema.pre("save", function (next) {
  if (this.isNew && (!Array.isArray(this.statusHistory) || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        fromStatus: null,
        toStatus: this.status,
        statusDetails: this.statusDetails || {},
        changedAt: new Date(),
        changedBy: this.user || null,
      },
    ];
  }
  next();
});

export default model(COLLECTIONS.APPLICATIONS, schema);
