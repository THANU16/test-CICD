const mongoose = require("mongoose");

const simSwapRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    oldMobileNumber: { type: String, required: true },
    newMobileNumber: { type: String, required: true },
    newSimSerialNumber: { type: String },
    frequentlyDialedMobileNumber: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED"],
      default: "OPEN",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("SimSwapRequest", simSwapRequestSchema);
