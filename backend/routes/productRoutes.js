const express = require("express");
const router = express.Router();

const {
  getAllProductsByCustomer,
  getProductById,
} = require("../controllers/customer/productController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.get("/products", getAllProductsByCustomer);
router.get("/product", getProductById);

module.exports = router;
