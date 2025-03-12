const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  generateAndSendOtp,
  verifyOtp,
  requestOtpForEmailOrPhoneUpdate,
  verifyOtpAndUpdateEmailOrPhone,
} = require("../controllers/customer/authController");

const validateToken = require("../middleware/validateTokenHandler");

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Max 3 OTP requests per user
  message: "Too many OTP requests, please try again later.",
  keyGenerator: (req) => req.query.email || req.query.mobileNumber || req.ip, // Use userId if available, otherwise fallback to IP
  standardHeaders: true, // Returns rate limit info in headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

router.post("/otp-generation", otpLimiter, generateAndSendOtp);
router.post("/verify-otp", verifyOtp);

router.post(
  "/update-contact/otp-generation",
  validateToken,
  otpLimiter,
  requestOtpForEmailOrPhoneUpdate
);
router.post(
  "/update-contact/verify-otp",
  validateToken,
  verifyOtpAndUpdateEmailOrPhone
);

module.exports = router;
