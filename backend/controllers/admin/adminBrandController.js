const sharp = require("sharp");
const Brand = require("../../models/Brand");
const { isValidBrandStatus } = require("../../utils/validators");

//@desc API to Add Brand by admin
//@route POST /brand/add
//@access private
//By default, the status of the brand is set to "ACTIVE"
//The brand logo is uploaded as a file using the "logo" field in the request body
//The brand name is required and must be unique
// The brand logo is resized to 24x24 pixels and converted to JPEG format
// TODO: Add validation for the image file type
const addBrandByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, status = "ACTIVE" } = req.body || {};
    const logo = req.file;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
        data: null,
        error: {
          code: 401,
          details: "Admin not authorized",
          solution: "Please login as an admin to access this feature",
        },
      });
    }
    // Validate the name and logo
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand name",
        data: null,
        error: {
          code: 400,
          details: "Brand name is required",
          solution: "Please provide a valid brand name",
        },
      });
    }
    if (!logo) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand logo",
        data: null,
        error: {
          code: 400,
          details: "Brand logo is required",
          solution: "Please provide a valid brand logo",
        },
      });
    }

    // Brand name is unique, check if it already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand name already exists",
        data: null,
        error: {
          code: 400,
          details: "Brand name already exists",
          solution: "Please provide a unique brand name",
        },
      });
    }
    if (!isValidBrandStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand status",
        data: null,
        error: {
          code: 400,
          details: "Invalid brand status",
          solution: "Please provide a valid brand status",
        },
      });
    }
    // Resize the image to 24x24 pixels and convert to JPEG format
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 24, height: 24 })
      .toFormat("jpeg")
      .toBuffer();

    const newBrand = new Brand({
      name,
      image: resizedImageBuffer,
      contentType: req.file.mimetype,
      status,
      createdBy: adminId,
    });

    const savedBrand = await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Brand added successfully",
      data: { brand: savedBrand },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to Get Brand by Id
// @route GET /brand/:brandId
// @access private
// This API returns the brand name and logo by brand ID
// The brand logo is returned as a base64 string
const getBrandById = async (req, res) => {
  const { brandId } = req.query;

  try {
    if (!brandId) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
        data: null,
        error: {
          code: 400,
          details: "Brand ID is required",
          solution: "Please provide a valid brand ID",
        },
      });
    }
    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        data: null,
        error: {
          code: 404,
          details: "Brand not found",
          solution: "Please provide a valid brand ID",
        },
      });
    }

    let brandWithImage = {
      name: brand.name,
    };

    // If the brand has an image, convert it to base64.
    if (brand.image) {
      const imageBase64 = brand.image.toString("base64");
      brandWithImage.logo = `data:${brand.contentType};base64,${imageBase64}`;
    }

    res.status(200).json({
      success: true,
      message: "Brand found",
      data: { brand: brandWithImage },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to Get All Brands Name and Id
//@route GET /brands/names
//@access private
//This API returns the name and id of all ACTIVE brands
const getAllBrandsName = async (req, res) => {
  try {
    const brands = await Brand.find({ status: "ACTIVE" }).select("name _id");
    if (!brands) {
      return res.status(404).json({
        success: false,
        message: "No brands found",
        data: null,
        error: {
          code: 404,
          details: "No brands found",
          solution: "Please add a new brand",
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: { brands: brands },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to Get All Brands
//@route POST /brands
//@access private
//This API returns all brands with the product count and pagination
// THe brand logo is returned as a base64 string
//The API supports pagination
// The API also supports search functionality based on the brand name
// The search query is case-insensitive
// The API returns the total number of brands and the total number of pages
const getAllBrands = async (req, res) => {
  try {
    const { page, limit } = req.body?.pagination || { page: 1, limit: 10 };
    const { search = "" } = req.body || {};

    // We need add search functionality here
    // We can use the search string to filter the brands by name
    // We can use the $regex operator to perform a case-insensitive search
    // We can also use the $or operator to search for multiple fields
    const searchQuery = {
      $or: [{ name: { $regex: search, $options: "i" } }],
    };
    const brands = await Brand.aggregate([
      {
        $match: searchQuery,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brand",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: { $size: "$products" },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Calculate total brands including the search query
    const totalBrands = await Brand.aggregate([
      {
        $match: searchQuery,
      },
      { $count: "totalCount" },
    ]);

    if (!brands.length) {
      return res.status(404).json({
        success: false,
        message: "No brands found",
        data: null,
        error: {
          code: 404,
          details: "No brands found",
          solution: "Please add a new brand",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: {
        brands: brands,
        totalBrands: totalBrands[0].totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalBrands[0].totalCount / limit),
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to Update Brand by Admin
//@route PUT /brands/update
//@access private
//This API updates the brand name , logo or status by brand ID
//The brand name must be unique
//The brand logo is uploaded as a file using the "logo" field in the request body
// The brand logo is resized to 24x24 pixels and converted to JPEG format
const updateBrandByAdmin = async (req, res) => {
  try {
    adminId = req.user.id;
    const { brandId, name, status } = req.body || {};
    const logo = req.file;
    if (!adminId)
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
        data: null,
        error: {
          code: 401,
          details: "Admin not authorized",
          solution: "Please login as an admin to access this feature",
        },
      });
    if (!brandId)
      return res.status(400).json({
        success: false,
        message: "Brand ID is required for update",
        data: null,
        error: {
          code: 400,
          details: "Brand ID is required",
          solution: "Please provide a valid brand ID",
        },
      });
    if (!name && !status && !logo)
      return res.status(400).json({
        success: false,
        message: "No update fields provided",
        data: null,
        error: {
          code: 400,
          details: "No update fields provided",
          solution: "Please provide a valid field to update",
        },
      });
    const brand = await Brand.findById(brandId);

    if (!brand)
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        data: null,
        error: {
          code: 404,
          details: "Brand not found",
          solution: "Please provide a valid brand ID",
        },
      });

    if (name) {
      // Brand name is unique, check if it already exists
      const existingBrand = await Brand.findOne({ name });
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand name already exists",
          data: null,
          error: {
            code: 400,
            details: "Brand name already exists",
            solution: "Please provide a unique brand name",
          },
        });
      }
      brand.name = name;
    }
    brand.updatedBy = adminId;
    if (status) {
      if (!isValidBrandStatus(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand status",
          data: null,
          error: {
            code: 400,
            details: "Invalid brand status",
            solution: "Please provide a valid brand status",
          },
        });
      }
      brand.status = status;
    }
    if (logo) {
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 24, height: 24 })
        .toFormat("jpeg")
        .toBuffer();
      brand.image = resizedImageBuffer;
      brand.contentType = req.file.mimetype;
    }

    const updatedBrand = await brand.save();
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: { brand: updatedBrand },
      error: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
        data: null,
        error: {
          code: 400,
          details: "Invalid brand ID",
          solution: "Please provide a valid brand ID",
        },
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

//@desc API to Update Brand Status by Admin
//@route PATCH /brands/update/status
//@access private
//This API updates the status of the brand by brand ID
//The status must be either "ACTIVE" or "INACTIVE"
//The brand status is is different from the previous status
const updateBrandStatusByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { brandId, status } = req.body || {};
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
        data: null,
        error: {
          code: 401,
          details: "Admin not authorized",
          solution: "Please login as an admin to access this feature",
        },
      });
    }
    if (!brandId) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
        data: null,
        error: {
          code: 400,
          details: "Brand ID is required",
          solution: "Please provide a valid brand ID",
        },
      });
    }
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Brand status is required",
        data: null,
        error: {
          code: 400,
          details: "Brand status is required",
          solution: "Please provide a valid brand status",
        },
      });
    }
    if (!isValidBrandStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand status",
        data: null,
        error: {
          code: 400,
          details: "Invalid brand status",
          solution: "Please provide a valid brand status",
        },
      });
    }
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
        data: null,
        error: {
          code: 404,
          details: "Brand not found",
          solution: "Please provide a valid brand ID",
        },
      });
    }
    if (brand.status === status) {
      return res.status(400).json({
        success: false,
        message: "Brand status is already set to " + status,
        data: null,
        error: {
          code: 400,
          details: "Brand status is already set to " + status,
          solution: "Please provide a different brand status",
        },
      });
    }
    brand.status = status;
    brand.updatedBy = adminId;
    const updatedBrand = await brand.save();
    res.status(200).json({
      success: true,
      message: "Brand status updated successfully",
      data: { brand: updatedBrand },
      error: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
        data: null,
        error: {
          code: 400,
          details: "Invalid brand ID",
          solution: "Please provide a valid brand ID",
        },
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: 500,
        details: `Internal server error: ${error.message}`,
        solution: "Please try again later",
      },
    });
  }
};

module.exports = {
  addBrandByAdmin,
  getBrandById,
  getAllBrandsName,
  getAllBrands,
  updateBrandByAdmin,
  updateBrandStatusByAdmin,
};
