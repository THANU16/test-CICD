const mongoose = require("mongoose");

const redeemableCodeBatchSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batchName: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    batchManualId: { type: String, required: true },
    totalCodes: { type: Number, required: true },
    redeemedCodes: { type: Number, default: 0 },
    updatedBy: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model(
  "Redeemable_Code_Batch",
  redeemableCodeBatchSchema
);
