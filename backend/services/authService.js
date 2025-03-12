const crypto = require("crypto");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../utils/emailService");
const { sendOtpSms } = require("../utils/smsService");

const generateOtp = async (userId) => {
  try {
    const otp = crypto.randomInt(1000, 9999).toString();
    await Otp.findOneAndUpdate(
      { userId },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    return otp;
  } catch (error) {
    return res
      .status(500)
      .res.json({ message: "Failed to generate OTP. Please try again." });
  }
};

const sendOtp = async (userId, otp, isEmail, isPhone) => {
  try {
    if (isEmail) {
      await sendOtpEmail(userId, otp);
    } else if (isPhone) {
      await sendOtpSms(userId, otp);
    }
  } catch (error) {
    return res.status(500).res.json({ message: "Failed to send OTP" });
  }
};

module.exports = { generateOtp, sendOtp };
