const express = require("express");
const router = express.Router();
const validateToken = require("../../middleware/validateTokenHandler");
const {
  getInventoryByAdmin,
} = require("../../controllers/admin/adminInventoryController");

router.use(validateToken);

router.get("/", getInventoryByAdmin);

module.exports = router;
