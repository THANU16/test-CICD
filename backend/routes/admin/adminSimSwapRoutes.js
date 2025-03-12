const express = require("express");
const router = express.Router();
const validateToken = require("../../middleware/validateTokenHandler");
const {
  getAllSimSwapByAdmin,
  updateSimSwapStatus,
  exportAllSimSwap,
} = require("../../controllers/admin/adminSimSwapController");

router.use(validateToken);

router.get("/", getAllSimSwapByAdmin);
router.patch("/update/status", updateSimSwapStatus);
router.get("/export", exportAllSimSwap);

module.exports = router;
