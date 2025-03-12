const express = require("express");
const {
  getAllCustomersByAdmin,
  getCustomersByAdminForExport,
  updateCustomerByAdmin,
  updateCustomerStatusByAdmin,
  deleteCustomerByAdmin,
} = require("../../controllers/admin/adminCustomerController");
const validateToken = require("../../middleware/validateTokenHandler");

const router = express.Router();
router.use(validateToken);

router.get("/", getAllCustomersByAdmin);
router.get("/export", getCustomersByAdminForExport);
router.put("/update", updateCustomerByAdmin);
router.patch("/update/status", updateCustomerStatusByAdmin);
router.delete("/delete", deleteCustomerByAdmin);

module.exports = router;
