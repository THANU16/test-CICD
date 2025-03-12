const express = require("express");
const router = express.Router();
const validateToken = require("../../middleware/validateTokenHandler");
const {
  getAllDashboardData,
  getDashboardTopTotalData,
  getDashboardSalesIncomeData,
  getCurrentStock,
  getOnBoardedDevices,
  getSalesProducts,
  getTopSellingProducts,
} = require("../../controllers/admin/adminDashboardController");

router.use(validateToken);

router.get("/total", getDashboardTopTotalData);
router.get("/sales-income", getDashboardSalesIncomeData);
router.get("/", getAllDashboardData);
router.get("/current-stock", getCurrentStock);
router.get("/onboarded-devices", getOnBoardedDevices);
router.get("/sales-products", getSalesProducts);
router.get("/top-selling-products", getTopSellingProducts);

module.exports = router;
