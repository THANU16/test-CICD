const express = require("express");
const router = express.Router();

const {
  getAllOrdersAndInternationalReloadsForCustomer,
  createOrder,
} = require("../controllers/customer/orderControllers");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.get("/:userId", getAllOrdersAndInternationalReloadsForCustomer);
router.post("/:userId", createOrder);

module.exports = router;
