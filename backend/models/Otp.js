const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto delete after 5 mins
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Otp", otpSchema);
