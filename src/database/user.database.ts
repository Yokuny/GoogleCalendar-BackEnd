import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 26, required: true },
  email: { type: String, minlength: 5, maxlength: 50, required: true, unique: true },
  password: { type: String, minlength: 5, maxlength: 200, required: true },
  googleAuth: {
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    expiresAt: { type: Date, required: false },
  },
  googleCalendarID: { type: String, required: false },
});

export const User = mongoose.model("User", userSchema);
