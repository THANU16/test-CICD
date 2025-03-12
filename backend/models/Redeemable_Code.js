const mongoose = require("mongoose");

const RedeemableCodeSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Redeemable_Code_Batch",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["UNSOLD", "RESERVED", "SOLD"],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Redeemable_Code", RedeemableCodeSchema);
