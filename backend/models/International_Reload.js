const mongoose = require("mongoose");

const internationalReloadSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    mobileNumber: { type: String },
    subtotal: { type: mongoose.Schema.Types.Decimal128, required: true },
    vat: { type: mongoose.Schema.Types.Decimal128, required: true },
    totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
    paymentMethod: {
      type: String,
      enum: ["VISA", "MASTER", "PAYPAL", "BANCONTACT"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentReferenceNumber: { type: String },
  },
  { timestamps: true, versionKey: false }
);

internationalReloadSchema.set("toJSON", {
  transform: (doc, ret) => {
    ["subtotal", "vat", "totalAmount"].forEach((field) => {
      if (ret[field]) ret[field] = ret[field].toString();
    });
    return ret;
  },
});

module.exports = mongoose.model(
  "International_Reload",
  internationalReloadSchema
);
