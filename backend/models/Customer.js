const mongoose = require("mongoose");

const PaymentCardSchema = new mongoose.Schema({
  token: { type: String, required: true },
  last4: { type: String, required: true },
  brand: { type: String, required: true },
  expMonth: { type: Number, required: true },
  expYear: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
});

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "Email address already taken"],
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      sparse: true,
    },
    mobileNumber: {
      type: String,
      unique: [true, "Phone Number already taken"],
      trim: true,
      minlength: [10, "Mobile number must be at least 10 digits"],
      maxlength: [15, "Mobile number cannot exceed 15 digits"],
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
    },
    dateOfBirth: Date,
    status: { type: String, enum: ["ACTIVE", "SUSPENDED", "DELETED"] },
    signupSource: {
      type: String,
      enum: ["WEB", "IOS", "ANDROID"],
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin customer" },
    paymentCards: [PaymentCardSchema],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Customer", customerSchema);
