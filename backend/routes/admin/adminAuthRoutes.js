const express = require("express");
// Get the admin auth controller
const {
  adminLogin,
  registerAdmin,
} = require("../../controllers/admin/adminAuthController");

const router = express.Router();

// Route to login as an admin
router.post("/login", adminLogin);
router.post("/register", registerAdmin);

module.exports = router;
