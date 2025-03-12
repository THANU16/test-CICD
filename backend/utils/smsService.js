const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtpSms = async (mobileNumber, otp) => {
  try {
    twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+" + mobileNumber,
    });
  } catch (error) {
    return res.status(500).res.json({ message: "Failed to send OTP" });
  }
};

module.exports = { sendOtpSms };
