const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    category: { type: String, enum: ["Monthly plan", "Mobile TOPUP"] },
    skuId: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryDuration: { type: String },
    tag: { type: String },
    status: {
      type: String,
      index: true,
      enum: ["ACTIVE", "INACTIVE"],
    },
    dataAmount: { type: String },
    validityPeriod: { type: String },
    planIncludes: { type: [String], enum: ["data", "call", "text"] },
    price: {
      type: mongoose.Schema.Types.Decimal128,
    },
    expense: {
      type: mongoose.Schema.Types.Decimal128,
    },
    vat: { type: Number },
    specifications: [String],
    availableCountries: [String],
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
