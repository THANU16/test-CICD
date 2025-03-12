const express = require("express");
const {
  getAllOrdersByAdmin,
  getAllOrdersByAdminForExport,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../../controllers/admin/adminOrderController");
const validateToken = require("../../middleware/validateTokenHandler");

const router = express.Router();
router.use(validateToken);

// Route the admin order controller
router.get("/", getAllOrdersByAdmin);
router.patch("/:orderId/status", updateOrderStatus);
router.patch("/:orderId/payment", updatePaymentStatus);
router.get("/export", getAllOrdersByAdminForExport);

module.exports = router;
