const express = require("express");
const router = express.Router();

const {
  updateCustomer,
  getCustomerAndBannerImages,
  getCustomerData,
  deleteCustomer,
  addPaymentCard,
  updatePaymentCard,
  getAllPaymentCards,
  deletePaymentCard,
} = require("../controllers/customer/customerController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.patch("/", updateCustomer);
router.get("/home", getCustomerAndBannerImages);
router.get("/", getCustomerData);

// router.post("/payment-cards", addPaymentCard);
// router.put("/payment-cards", updatePaymentCard);
// router.get("/payment-cards", getAllPaymentCards);
// router.delete("/payment-cards", deletePaymentCard);
router.delete("/:email", deleteCustomer);

module.exports = router;
