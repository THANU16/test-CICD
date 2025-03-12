const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED", "DELETED"],
      default: "PENDING",
    },
    orderNotes: { type: String },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: mongoose.Schema.Types.Decimal128, required: true },
    serviceFee: { type: mongoose.Schema.Types.Decimal128, required: true },
    totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
    paymentMethod: {
      type: String,
      enum: ["Visa", "bcmc", "MasterCard"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentNotes: { type: String },
    deliveredToEmail: { type: String, required: true },
    redeemCodes: [
      {
        batchId: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    paymentReference: { type: String },
    merchantOrderReference: { type: String },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    ["subtotal", "vat", "totalAmount"].forEach((field) => {
      if (ret[field]) ret[field] = ret[field].toString();
    });
    return ret;
  },
});

module.exports = mongoose.model("Order", orderSchema);
