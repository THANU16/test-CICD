const express = require("express");
const router = express.Router();

const {
  createSimSwapRequest,
  getSimSwapRequestsByCustomer,
} = require("../controllers/customer/simSwapRequestControllers");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.post("/sim-swap-requests", createSimSwapRequest);
router.get("/sim-swap-requests", getSimSwapRequestsByCustomer);

module.exports = router;
