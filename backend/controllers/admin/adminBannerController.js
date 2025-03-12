const Banner = require("../../models/Banner");
const Product = require("../../models/Product");
const { uploadToS3 } = require("../../utils/uploadImage");
const {
  isValidBannerStatus,
  validateImageDimensions,
} = require("../../utils/validators");

// @desc Add a banner by admin
// @route POST /api/banners/add
// @access Private
// @role Admin
// This API is used to add a banner by admin
// The admin must be authenticated
// The admin must provide the title, product, status, description and image
// The admin must provide a valid product id
// The admin must provide a valid status
// The admin must provide a valid image
// The image must be of type image
// The image must have dimensions 378x140 and 418x180
// The image must be uploaded to S3
// The banner is saved to the database
// The banner is returned in the response
const addBannerByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { title, product, status, description } = req.body || {};
    const image = req.file;
    if (!adminId) {
      return res.status(400).json({ error: "Admin not authorized" });
    }
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!product) {
      return res.status(400).json({ error: "Product is required" });
    }
    const productExist = await Product.findOne({ _id: product }).select("_id");

    if (!productExist) {
      return res.status(400).json({ error: "Product not found" });
    }
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    if (!isValidBannerStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const bannerExist = await Banner.findOne({ title }).select("_id");

    if (bannerExist) {
      return res
        .status(400)
        .json({ error: "Banner already exists. Please check you title" });
    }
    // Validate the image type
    if (!image.mimetype.startsWith("image")) {
      return res.status(400).json({ error: "Invalid image type" });
    }

    // Validate the image size (dimensions)
    const { valid, message } = await validateImageDimensions(
      image.buffer,
      378,
      140,
      418,
      180
    );
    if (!valid) {
      return res.status(400).json({ error: message });
    }

    const imageUrl = await uploadToS3(image);
    if (!imageUrl) {
      return res.status(500).json({ error: "Image upload failed" });
    }
    const banner = new Banner({
      title: title,
      product: product,
      status: status,
      description: description,
      image: imageUrl,
      fileName: image.originalname,
      createdBy: adminId,
    });
    const newBanner = await banner.save();
    return res.status(201).json({
      message: "Banner added successfully",
      banner: newBanner,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    if (error.name === "Error uploading file") {
      return res.status(500).json({ error: "Image upload failed" });
    }
    if (error.name === "Error validating image dimensions") {
      return res
        .status(500)
        .json({ error: "Error validating image dimensions" });
    }
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc Get banners by admin
// @route GET /api/banners
// @access Private
// @role Admin
// This API is used to get all banners by admin
// The admin must be authenticated
// The banners are retrieved from the database
// This API supports pagination
// The banners are returned in the response
const getBannersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body?.pagination || {};

    const banners = await Banner.find()
      .populate("product", "name")
      .select(
        "title product status description image fileName createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    if (!banners || banners.length === 0)
      return res.status(404).json({ error: "Banners not found" });

    const totalBanners = await Banner.countDocuments();
    return res.status(200).json({
      message: "Banners retrieved successfully",
      data: banners,
      totalBanners: totalBanners,
      totalPages: Math.ceil(totalBanners / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc Update banner by admin
// @route PUT /api/banners/update
// @access Private
// @role Admin
// This API is used to update a banner by admin
// The admin must be authenticated
// The admin must provide the banner id
//  The admin must be provide at least one of the following: title, product, status, description, image
// The admin must provide a valid banner id
// The admin must provide a valid product id
// The admin must provide a valid status
// The admin must provide a valid image
// The image must be of type image
// The image must have dimensions 378x140 and 418x180
// The image must be uploaded to S3
// The banner is updated in the database
const updateBannerByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id, title, product, status, description } = req.body || {};
    const image = req.file;
    if (!adminId) {
      return res.status(400).json({ error: "Admin not authorized" });
    }
    if (!id) {
      return res.status(400).json({ error: "Banner id is required" });
    }
    const banner = await Banner.findOne({ _id: id });
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    if (title) {
      if (banner.title === title) {
        return res
          .status(400)
          .json({ error: "Banner title is already updated" });
      }
      const bannerExist = await Banner.findOne({ title }).select("_id");
      if (bannerExist) {
        return res
          .status(400)
          .json({ error: "Banner already exists. Please check you title" });
      }
      banner.title = title;
    }
    if (product) {
      if (banner.product === product) {
        return res
          .status(400)
          .json({ error: "Banner product is already updated" });
      }
      const productExist = await Product.findOne({ _id: product }).select(
        "_id"
      );
      if (!productExist) {
        return res.status(400).json({ error: "Product not found" });
      }
      banner.product = product;
    }
    if (status) {
      if (!isValidBannerStatus(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      if (banner.status === status) {
        return res
          .status(400)
          .json({ error: "Banner status is already updated" });
      }
      banner.status = status;
    }
    if (description) {
      banner.description = description;
    }
    if (image) {
      if (!image.mimetype.startsWith("image")) {
        return res.status(400).json({ error: "Invalid image type" });
      }
      const { valid, message } = await validateImageDimensions(
        image.buffer,
        378,
        140,
        418,
        180
      );
      if (!valid) {
        return res.status(400).json({ error: message });
      }
      const imageUrl = await uploadToS3(image);
      if (!imageUrl) {
        return res.status(500).json({ error: "Image upload failed" });
      }
      banner.image = imageUrl;
      banner.fileName = image.originalname;
    }
    banner.updatedBy = adminId;
    const updateBanner = await banner.save();
    return res
      .status(200)
      .json({ message: "Banner updated successfully", data: updateBanner });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid banner id" });
    }
    if (error.name === "Error uploading file") {
      return res.status(500).json({ error: "Image upload failed" });
    }
    if (error.name === "Error validating image dimensions") {
      return res
        .status(500)
        .json({ error: "Error validating image dimensions" });
    }
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc Update banner status by admin
// @route PATCH /api/banners/update/status
// @access Private
// @role Admin
// This API is used to update the status of a banner by admin
// The admin must be authenticated
// The admin must provide the banner id and status
// The admin must provide a valid banner id
// The admin must provide a valid status
// The status must be different from the current status
const updateBannerStatusByAdmin = async (req, res) => {
  try {
    adminId = req.user.id;
    const { id, status } = req.body || {};
    if (!adminId) {
      return res.status(400).json({ error: "Admin not authorized" });
    }
    if (!id) {
      return res.status(400).json({ error: "Banner id is required" });
    }
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    if (!isValidBannerStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const banner = await Banner.findOne({ _id: id });
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    if (banner.status === status) {
      return res
        .status(400)
        .json({ error: "Banner status is already updated" });
    }
    banner.status = status;
    banner.updatedBy = adminId;
    await banner.save();
    return res
      .status(200)
      .json({ message: "Banner status updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid banner id" });
    }
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

module.exports = {
  addBannerByAdmin,
  getBannersByAdmin,
  updateBannerByAdmin,
  updateBannerStatusByAdmin,
};
