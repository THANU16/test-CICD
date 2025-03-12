const jwt = require("jsonwebtoken");
const { isValidEmail, isValidPhoneNumber } = require("../../utils/validators");
const { generateOtp, sendOtp } = require("../../services/authService");
const Otp = require("../../models/Otp");
const Customer = require("../../models/Customer");
const { sendOtpEmail } = require("../../utils/emailService");
const { sendOtpSms } = require("../../utils/smsService");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//@desc API to Request OTP
//@route POST /authentication/otp-generation
//@access public

// TODO: Otp Rate Limiter not working per customer , it commonly take count of requests from all custoemrs
// TODO: add sign-up device field
const generateAndSendOtp = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Email or Phone is required" });
  }

  let isEmail = isValidEmail(userId);
  let isPhone = isValidPhoneNumber(userId);

  if (!isEmail && !isPhone) {
    return res.status(400).json({ message: "Invalid email or phone number" });
  }

  const otp = await generateOtp(userId);
  try {
    await sendOtp(userId, otp, isEmail, isPhone);
    res.json({
      userId,
      otp,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

//@desc API to Verify OTP
//@route POST /authentication/verify-otp
//@access public
const verifyOtp = async (req, res) => {
  const { email, mobileNumber, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required." });
  }
  if (!email && !mobileNumber) {
    return res
      .status(400)
      .json({ message: "Either email or mobileNumber must be provided." });
  }

  if (!isValidEmail(email) && !isValidPhoneNumber(mobileNumber)) {
    return res.status(400).json({ message: "Invalid email or phone number" });
  }

  const otpRecord = await Otp.findOne({
    $or: [{ userId: email }, { userId: mobileNumber }],
    otp,
  });

  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  // await Otp.deleteOne({ _id: otpRecord._id });

  let customer;
  if (email && mobileNumber) {
    customer = await Customer.findOne({
      $or: [{ email }, { mobileNumber }],
    });
  } else if (email) {
    customer = await Customer.findOne({
      email: email,
    });
  } else if (mobileNumber) {
    customer = await Customer.findOne({
      mobileNumber: mobileNumber,
    });
  }

  if (email && !mobileNumber) {
    if (!customer) {
      try {
        customer = await Customer.create({ email });
      } catch (error) {
        return res.status(500).json({ message: "Error creating customer" });
      }
    }
  } else if (email && mobileNumber) {
    console.log(customer);
    if (!customer) {
      try {
        customer = await Customer.create({ email, mobileNumber });
      } catch (error) {
        return res.status(500).json({ message: "Error creating customer" });
      }
    } else if (!customer.mobileNumber) {
      customer.mobileNumber = mobileNumber;
      try {
        await customer.save();
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Error updating Mobile number." });
      }
    } else if (!customer.email) {
      customer.email = email;
      try {
        await customer.save();
      } catch (error) {
        return res.status(400).json({ message: "Error updating Email." });
      }
    }
    return res.json({
      message: "OTP verified successfully",
      user: {
        id: customer._id,
        email: customer.email || null,
        mobileNumber: customer.mobileNumber || null,
      },
    });
  } else if (mobileNumber && !email) {
    if (!customer) {
      try {
        customer = await Customer.create({ mobileNumber });
      } catch (error) {
        return res.status(500).json({ message: "Error creating customer" });
      }
    }
  }
  try {
    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email || null,
        mobileNumber: customer.mobileNumber || null,
      },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("BEReload_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "OTP verified successfully",
      user: {
        id: customer._id,
        email: customer.email || null,
        mobileNumber: customer.mobileNumber || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error generating JWT Token" });
  }
};

//@desc API to Request OTP For Changing Email or Phone Number
//@route POST /authentication/update-contact/otp-generation
//@access private
const requestOtpForEmailOrPhoneUpdate = async (req, res) => {
  try {
    const { userId, type, newValue } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    if (!type || !newValue) {
      return res
        .status(400)
        .json({ message: "Type and new value are required" });
    }

    let isEmail = false;
    let isPhone = false;

    switch (type) {
      case "email":
        isEmail = isValidEmail(newValue);
        if (!isEmail)
          return res.status(400).json({ message: "Invalid email format" });
        break;

      case "phone":
        isPhone = isValidPhoneNumber(newValue);
        if (!isPhone)
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid type. Must be 'email' or 'phone'" });
    }

    const existingCustomer = await Customer.findOne({
      $or: [{ email: newValue }, { phone: newValue }],
    });

    if (existingCustomer) {
      return res
        .status(409)
        .json({ message: "This value is already in use by another account." });
    }

    const otp = await generateOtp(newValue);

    try {
      if (isEmail) {
        await sendOtpEmail(newValue, otp);
      } else if (isPhone) {
        await sendOtpSms(newValue, otp);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    return res.status(200).json({
      userId,
      otp,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

//@desc API to Verify OTP And Update Email or Phone Number
//@route POST /authentication/update-contact/verify-otp
//@access private
const verifyOtpAndUpdateEmailOrPhone = async (req, res) => {
  try {
    const { userId, type, newValue, otp } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    if (!type || !newValue) {
      return res
        .status(400)
        .json({ message: "Type and new value are required" });
    }

    if (type !== "email" && type !== "phone") {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'email' or 'phone'" });
    }

    let isEmail = false;
    let isPhone = false;

    switch (type) {
      case "email":
        isEmail = isValidEmail(newValue);
        if (!isEmail)
          return res.status(400).json({ message: "Invalid email format" });
        break;

      case "phone":
        isPhone = isValidPhoneNumber(newValue);
        if (!isPhone)
          return res
            .status(400)
            .json({ message: "Invalid phone number format" });
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid type. Must be 'email' or 'phone'" });
    }

    const otpRecord = await Otp.findOne({
      $or: [{ userId: newValue }, { userId: newValue }],
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const existingCustomer = await Customer.findOne({
      $or: [{ email: newValue }, { phone: newValue }],
    });

    if (existingCustomer) {
      return res
        .status(409)
        .json({ message: "This value is already in use by another account." });
    }

    // await Otp.deleteOne({ _id: otpRecord._id });

    const customer = await Customer.findById(req.user.id);

    if (type === "email") {
      customer.email = newValue;
    } else {
      customer.mobileNumber = newValue;
    }

    await customer.save();
    return res.status(200).json({
      userId,
      otp,
      message: "Contact information updated Successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to update contact information" });
  }
};

module.exports = {
  generateAndSendOtp,
  verifyOtp,
  requestOtpForEmailOrPhoneUpdate,
  verifyOtpAndUpdateEmailOrPhone,
};
