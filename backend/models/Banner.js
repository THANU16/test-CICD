const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
    description: { type: String },
    fileName: { type: String },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Banner", bannerSchema);
