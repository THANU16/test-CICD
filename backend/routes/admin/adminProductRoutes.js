const express = require("express");
const multer = require("multer");
const validateToken = require("../../middleware/validateTokenHandler");
const {
  addProductByAdmin,
  getAllProductsByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  updateProductStatusByAdmin,
  importMobileCodesByAdmin,
  exportMobileCodesByAdmin,
  updateBatchStatusByAdmin,
} = require("../../controllers/admin/adminProductController");

const router = express.Router();
router.use(validateToken);

// Set up multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add", upload.single("codes"), addProductByAdmin);
router.get("/", getAllProductsByAdmin);
router.put("/update", updateProductByAdmin);
router.delete("/delete", deleteProductByAdmin);
router.patch("/update/status", updateProductStatusByAdmin);
router.post("/import/codes", upload.single("codes"), importMobileCodesByAdmin);
router.get("/export/codes", exportMobileCodesByAdmin);
router.patch("/update/batch/status", updateBatchStatusByAdmin);

module.exports = router;
