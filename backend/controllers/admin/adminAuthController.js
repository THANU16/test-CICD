const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidEmail } = require("../../utils/validators");
const Admin = require("../../models/Admin");
const { countDocuments } = require("../../models/Customer");

//@desc API to login as an admin
//@route POST /login
//@access public
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Username is required",
          solution: "Please provide a valid email address",
        },
      });
    if (!password)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Password is required",
          solution: "Please provide a valid password",
        },
      });
    let isEmail = isValidEmail(username);

    // Validate the email
    if (!isEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Invalid username",
          solution: "Please provide a valid email address",
        },
      });
    }

    // Check admin exist
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 404,
          details: "Username not found",
          solution: "Please provide a valid email address",
        },
      });
    }

    // Compare the hash password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Invalid password",
          solution: "Please provide a valid email address and password",
        },
      });
    }

    // Create the JWT Token for manage the login time
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set the token in the cookie
    res.cookie("BEReload_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        admin: { id: admin._id, username: admin.username },
        token: token,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to register an admin
//@route POST /register
//@access public
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Username is required",
          solution: "Please provide a valid email address",
        },
      });
    if (!password)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Password is required",
          solution: "Please provide a valid password",
        },
      });
    const isEmail = isValidEmail(username);

    // Validate the email
    if (!isEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Invalid username",
          solution: "Please provide a valid email address",
        },
      });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        data: null,
        error: {
          code: 400,
          details: "Username already exists",
          solution: "Please provide a different email address",
        },
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin and save to the database
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();

    // Create JWT token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set token in a cookie
    res.cookie("BEReload_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin: { id: newAdmin._id, username: newAdmin.username },
        token: token,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

exports.adminLogin = adminLogin;
exports.registerAdmin = registerAdmin;
