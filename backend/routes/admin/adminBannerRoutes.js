const express = require("express");
const router = express.Router();
const validateToken = require("../../middleware/validateTokenHandler");
const {
  addBannerByAdmin,
  getBannersByAdmin,
  updateBannerByAdmin,
  updateBannerStatusByAdmin,
} = require("../../controllers/admin/adminBannerController");
const { upload } = require("../../utils/uploadImage");

router.use(validateToken);

router.post("/add", upload.single("image"), addBannerByAdmin);
router.get("/", getBannersByAdmin);
router.put("/update", upload.single("image"), updateBannerByAdmin);
router.patch("/update/status", updateBannerStatusByAdmin);

module.exports = router;
