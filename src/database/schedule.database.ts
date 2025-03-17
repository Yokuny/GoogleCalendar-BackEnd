import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  googleEventID: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
