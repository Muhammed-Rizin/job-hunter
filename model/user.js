import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../config/collections.js";
import { getDate, getTime } from "../helper/functions.js";

const schema = new Schema(
  {
    // Auth / basic
    name: String,
    image: String,
    email: String,
    mobile: String,
    username: String,
    password: String,

    // Profile (Job App related)
    title: String,
    location: String,
    summary: String,
    skills: String,

    noticePeriod: String,
    currentCtc: String,
    expectedCtc: String,

    resumeName: String,
    resumeLink: String,

    // Goal
    goal: {
      targetRole: String,
      targetCount: Number,
      targetDate: String,
    },

    // System
    ip: String,
    uniqueId: String,

    status: { type: Number, default: 0 },
    date: { type: String, default: () => getDate() },
    time: { type: String, default: () => getTime() },

    upDate: { type: String, default: () => getDate() },
    upTime: { type: String, default: () => getTime() },
  },
  { timestamps: true, collection: COLLECTIONS.USERS },
);

schema.methods.generatePasswordHash = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

schema.methods.validatePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export default model(COLLECTIONS.USERS, schema);
