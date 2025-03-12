const express = require("express");
const multer = require("multer");
const validateToken = require("../../middleware/validateTokenHandler");
const {
  addBrandByAdmin,
  getBrandById,
  getAllBrandsName,
  getAllBrands,
  updateBrandByAdmin,
  updateBrandStatusByAdmin,
} = require("../../controllers/admin/adminBrandController");

const router = express.Router();
router.use(validateToken);

// Set up multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add", upload.single("logo"), addBrandByAdmin);
router.get("/", getAllBrands);
// we don't need to get brand by id
// router.get("/brands", getBrandById);
router.get("/get/names", getAllBrandsName);
router.put("/update", upload.single("logo"), updateBrandByAdmin);
router.patch("/update/status", updateBrandStatusByAdmin);

module.exports = router;
