import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        if (ret.createdAt) ret.createdAt = ret.createdAt.toISOString();
        if (ret.startTime) ret.startTime = ret.startTime.toISOString();
        if (ret.endTime) ret.endTime = ret.endTime.toISOString();
        return ret;
      },
    },
  }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
