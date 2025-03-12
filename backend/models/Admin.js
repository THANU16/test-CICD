const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  // Define the schema for the admin collection.
  {
    // Username is the email address of the admin
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Admin", adminSchema);
