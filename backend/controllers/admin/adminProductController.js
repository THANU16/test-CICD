const Product = require("../../models/Product");
const RedeemableCodeBatch = require("../../models/Redeemable_Code_Batch");
const RedeemableCode = require("../../models/Redeemable_Code");
const Brand = require("../../models/Brand");
const mongoose = require("mongoose");
const {
  isValidProductStatus,
  isValidPlanInclude,
  isValidProductCategory,
  isValidProductTag,
  isValidCountryCodes,
  isValidBatchStatus,
} = require("../../utils/validators");

// @desc    Add a product by admin
// @route   POST /products/add
// @access  Private (Admin)
// In this function, the required fields to add a product are:
// - name, brand (brandID), category, skuId, amountOfData, validityPeriod, price, expense, vat, specifications, availableCountries, tags, and at least one code file (text file) are required.
// This API supports only text files, where each line should contain comma-separated values representing codes, amounts, and locations for batch processing.
// The function starts a session for atomic operations using mongoose's session and transaction.
// It first checks if the necessary data is passed in the request, ensuring all required fields are present. If any are missing, it returns an error message.
// The file uploaded must be a text file, as we only support this format for code batch uploads. If no file is provided or the wrong format is uploaded, the function returns an error.
// Validation checks for various product attributes are performed:
// 1. Ensuring numeric fields like price, expense, VAT, amountOfData, and validityPeriod are valid numbers and greater than zero.
// 2. Validating the country codes and ensuring they are an array of valid codes.
// 3. Ensuring that the product SKU is unique for the selected brand.
// 4. Checking for the correct format and required structure of the specifications, planIncludes, and availableCountries fields.
// 5. Ensuring the price in the batch file matches the price entered for the product.
// The function proceeds to parse the uploaded text file containing the codes, checking for the following conditions:
// - The file should have at least one valid line of data.
// - Each line should contain exactly 6 fields representing batch manual ID(combine first 2 fields- 0 and 1), mobile code(3), price(4), and location(5).
// - It checks that all mobil codes are unique and that batch details like batch manual ID, price, and location are consistent across all lines.
// - The batch manual ID should be unique within the brand, and the batch file should not contain duplicate codes.
// - Any invalid lines or empty lines are counted and reported to the user.
// If everything is valid, the product is saved to the database, followed by the redeemable codes and redeemable code batch data.
// Transactions are committed only if all operations succeed, ensuring atomicity. If any error occurs during the process, the transaction is aborted and the product is marked inactive.
// Detailed error messages are returned if the batch file or product details do not meet the validation criteria (e.g., duplicate SKU, inconsistent pricing, invalid batch manual ID).
// If everything goes smoothly, a success response is sent back, including details of the product, the redeemable code batch, and the total number of codes processed.
// TODO: Add the functionality for handling duplicate codes in the batch file now we throw the error
const addProductByAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // TODO: For postman testing, we are sending the data as a string. In the future, we need to change this to JSON (in future as json - req.body)
    const productData = JSON.parse(req.body.data);
    // List of required fields
    const requiredFields = [
      "name",
      "brand",
      "category",
      "skuId",
      "tag",
      "status",
      "amountOfData",
      "validityPeriod",
      "planIncludes",
      "price",
      "expense",
      "vat",
      "specifications",
      "availableCountries",
      "description",
    ];

    // Check for missing fields
    const missingFields = requiredFields.filter(
      (field) => productData[field] === undefined || productData[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    const adminId = req.user.id;

    const {
      name,
      brand,
      category,
      skuId,
      tag,
      status = "INACTIVE",
      amountOfData,
      validityPeriod,
      planIncludes,
      price,
      expense,
      vat,
      specifications,
      availableCountries,
      description = "",
    } = productData;
    // TODO: In future implement the multiple file upload. For now, only one file is allowed. We need to change in the router of this API as well.
    const file = req.file;

    if (!adminId) {
      return res.status(400).json({ error: "Admin not authorized" });
    }
    if (!file) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    // Validate the required fields
    if (
      !name ||
      !brand ||
      !category ||
      !skuId ||
      !amountOfData ||
      !validityPeriod ||
      !price ||
      !expense ||
      !vat ||
      !specifications ||
      !specifications.length ||
      !planIncludes ||
      !planIncludes.length ||
      !availableCountries ||
      !availableCountries.length
    ) {
      return res.status(400).json({
        error:
          "Please provide all required fields. Required fields: name, brand, category, skuId, amountOfData, validityPeriod, price, expense, vat, specifications, planIncludes, availableCountries",
      });
    }

    // Validate the brand
    const brandExist = await Brand.findById(brand);
    if (!brandExist) {
      return res.status(404).json({ error: "Brand not found" });
    }

    if (!isValidProductStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const validAmountOfData = Number(amountOfData);
    const validValidityPeriod = Number(validityPeriod);
    const validPrice = Number(price);
    const validExpense = Number(expense);
    const validVat = Number(vat);

    if (isNaN(validPrice) || isNaN(validExpense) || isNaN(validVat)) {
      return res.status(400).json({ error: "Invalid price, expense or vat" });
    }

    if (isNaN(validAmountOfData) || isNaN(validValidityPeriod)) {
      return res
        .status(400)
        .json({ error: "Invalid amount of data or validity period" });
    }

    if (validAmountOfData <= 0 || validValidityPeriod <= 0) {
      return res.status(400).json({
        error: "Amount of data and validity period must be greater than 0",
      });
    }

    if (validVat <= 0 || validVat >= 100) {
      return res.status(400).json({ error: "Vat must be between 0 and 100" });
    }
    if (validPrice <= 0 || validExpense <= 0) {
      return res
        .status(400)
        .json({ error: "Price and expense must be greater than 0" });
    }

    // Validate the country codes
    if (!Array.isArray(availableCountries)) {
      return res
        .status(400)
        .json({ error: "Invalid country codes. It should be an array" });
    }
    if (!isValidCountryCodes(availableCountries)) {
      return res.status(400).json({ error: "Invalid country codes" });
    }

    // Validate the plan includes
    if (!Array.isArray(planIncludes)) {
      return res
        .status(400)
        .json({ error: "Invalid plan includes. It should be an array" });
    }
    if (!isValidPlanInclude(planIncludes)) {
      return res.status(400).json({ error: "Invalid plan includes" });
    }

    // validate the SKU ID. It should be unique for products in the same brand
    const productExist = await Product.findOne({
      brand: brand,
      skuId: skuId,
    });
    if (productExist) {
      return res
        .status(400)
        .json({ error: "SKU ID already exists in this brand" });
    }

    // Validate the specifications
    if (!Array.isArray(specifications)) {
      return res
        .status(400)
        .json({ error: "Invalid specifications. It should be an array" });
    }

    const validateFields = {
      name: name,
      brand: brand,
      category: category,
      skuId: skuId,
      tag: tag,
      status: status,
      amountOfData: validAmountOfData,
      validityPeriod: validValidityPeriod,
      price: validPrice,
      expense: validExpense,
      vat: validVat,
      specifications: specifications,
      availableCountries: availableCountries,
      description: description,
      createdBy: adminId,
    };

    //  Validate the category
    try {
      validateFields.category = isValidProductCategory(category);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    // Validate the tag
    try {
      validateFields.tag = isValidProductTag(tag);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Save the product
    const product = new Product(validateFields);
    await product.save({ session });

    // Save the redeemable codes
    const lines = file.buffer.toString().trim().split("\n");
    const batchManualIds = [];
    const codes = [];
    const amounts = [];
    const locations = [];
    let emptyLines = 0;
    let invalidLines = 0;
    lines.forEach((line, index) => {
      const parts = line.trim().split(",");
      if (!line.trim()) {
        emptyLines++;
        return;
      }

      if (parts.length < 5) {
        invalidLines++;
      } else {
        // The combine of first 2 parts should be the batch manual id
        batchManualIds.push(parts[0] + parts[1]);
        codes.push(parts[3]);
        amounts.push(parts[4]);
        locations.push(parts[5]);
      }
    });

    const amountSet = new Set(amounts);
    const locationSet = new Set(locations);
    const totalCodeSet = new Set(codes);
    const batchManualIdSet = new Set(batchManualIds);
    const totalCodes = totalCodeSet.size;

    if (batchManualIdSet.size !== 1) {
      await Product.findByIdAndUpdate(
        product._id,
        { status: "INACTIVE" },
        { session }
      );
      await session.commitTransaction();
      return res.status(400).json({
        error: `The batch file contains combine batch file data. Failed to add batch file. But product added successfully`,
        productId: product._id,
      });
    }

    // Batch manual id should be unique inside the brand
    const productIds = await Product.find({ brand: brand }, { _id: 1 });

    const existBatch = await RedeemableCodeBatch.findOne({
      batchManualId: batchManualIdSet.values().next().value,
      product: { $in: productIds },
    });

    if (existBatch) {
      await Product.findByIdAndUpdate(
        product._id,
        { status: "INACTIVE" },
        { session }
      );
      await session.commitTransaction();
      return res.status(400).json({
        error: `Batch file with the same batch manual id already exists. Failed to add batch file. But product added successfully`,
        productId: product._id,
      });
    }

    if (amountSet.size !== 1) {
      await Product.findByIdAndUpdate(
        product._id,
        { status: "INACTIVE" },
        { session }
      );
      await session.commitTransaction();
      return res.status(400).json({
        error: `Price of data should be same for all codes. Found ${amountSet.size} different price. Failed to add batch file. But product added successfully`,
        productId: product._id,
      });
    }

    if (locationSet.size !== 1) {
      await Product.findByIdAndUpdate(
        product._id,
        { status: "INACTIVE" },
        { session }
      );
      await session.commitTransaction();
      return res.status(400).json({
        error: `Location should be same for all codes. Found ${locationSet.size} different locations. Failed to add batch file. But product added successfully`,
        productId: product._id,
      });
    }

    // If file is empty or all lines are empty, Add the product only and status is INACTIVE
    if (emptyLines === lines.length) {
      await Product.findByIdAndUpdate(
        product._id,
        { status: "INACTIVE" },
        { session }
      );
      await session.commitTransaction();
      return res.status(400).json({
        error:
          "No valid codes found. File is empty. Failed to add  batch. But product added successfully",
        productId: product._id,
      });
    }

    const filePrice = Number(amountSet.values().next().value);
    if (filePrice !== price) {
      await session.abortTransaction();
      return res.status(400).json({
        error:
          "Price in file does not match entered price. and product price. Failed to add product and batch file",
      });
    }

    // Save the redeemable code batch including manual id and total codes
    const redeemableCodeBatch = new RedeemableCodeBatch({
      product: product._id,
      batchName: file.originalname,
      status: "ACTIVE",
      batchManualId: batchManualIdSet.values().next().value,
      totalCodes: totalCodes,
      uploadedBy: adminId,
    });
    await redeemableCodeBatch.save({ session });

    // Save Redeemable Codes
    const redeemableCodes = [...totalCodeSet].map((code) => ({
      product: product._id,
      batch: redeemableCodeBatch._id,
      code: code,
      status: "UNSOLD",
    }));

    await RedeemableCode.insertMany(redeemableCodes, { session });
    await session.commitTransaction();
    return res.status(201).json({
      message: `Product added successfully. Total lines: ${
        lines.length
      }, Total codes: ${totalCodes}, Empty lines: ${emptyLines}, Invalid lines: ${invalidLines}, Duplicate codes: ${
        codes.length - totalCodes
      }`,
      productId: product._id,
      batchId: redeemableCodeBatch._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Brand id is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc    Get all products by admin
// @route   GET /products
// @access  Private (Admin)
// In this function, the admin can retrieve all products from the database.
// This API support pagination, filtering by brand and search functionality.
// This search functionality allows the admin to search for products by name, SKU ID, price, expenses, vat and available codes.
// The function retrieves the page and limit from the request body, along with the brand and search parameters.
// It constructs a query object based on the brand and search parameters provided.
// If a brand is specified, it checks if the brand exists in the database before proceeding.
const getAllProductsByAdmin = async (req, res) => {
  try {
    const {
      pagination: { page = 1, limit = 10 },
      brand = "",
      search = "",
    } = req.body || {};
    const query = {};
    if (brand) {
      query.brand = brand;
      const existBrand = await Brand.findById(brand).select("_id").lean();
      if (!existBrand) {
        return res.status(404).json({ error: "Brand not found" });
      }
    }

    // Add search functionality
    if (search) {
      const searchNumber = parseFloat(search);

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { skuId: { $regex: search, $options: "i" } },
      ];

      if (!isNaN(searchNumber)) {
        query.$or.push(
          { price: searchNumber },
          { expense: searchNumber },
          { vat: searchNumber }
        );
      }
    }

    // We send the product , brand details and sort by createdAt in descending order and includes batches
    const products = await Product.find(query)
      .select(
        "_id name brand category skuId deliveryDuration tag status dataAmount validityPeriod planIncludes price expense vat specifications availableCountries description createdAt"
      )
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const productIds = products.map((product) => product._id);
    const batches = await RedeemableCodeBatch.find({
      product: { $in: productIds },
    })
      .select("batchName status totalCodes redeemedCodes product")
      .lean();

    // Attach batches to their corresponding products
    const productsWithBatches = products.map((product) => ({
      ...product,
      redeemable_code_batches: batches.filter(
        (batch) => batch.product.toString() === product._id.toString()
      ),
    }));
    const totalProducts = await Product.countDocuments(query);
    res.status(200).json({
      product: productsWithBatches,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts: totalProducts,
    });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc    Get a product by ID for admin
// @route   GET /products/update
// @access  Private (Admin)
// In this function, the admin can retrieve a product by ID from the database.
// The function first checks if the admin is authorized.
// It then validates the product ID provided in the request body.
// If the product ID is missing, it returns an error message.
// If the product ID is valid, it retrieves the product details from the database and sends a response with the product data.
// At least one field is required to update the product
// TODO: We need to add functionality for  change the product price, because we consider the mobile  price as the product price
const updateProductByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const {
      productId,
      name,
      brand,
      category,
      skuId,
      tag,
      status,
      amountOfData,
      validityPeriod,
      planIncludes,
      price,
      expense,
      vat,
      specifications,
      availableCountries,
      description = "",
    } = req.body || {};

    if (!adminId) {
      return res.status(400).json({ error: "Admin not authorized" });
    }
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    // At least one field is required to update
    if (
      !name &&
      !brand &&
      !category &&
      !skuId &&
      !tag &&
      !status &&
      !amountOfData &&
      !validityPeriod &&
      !planIncludes &&
      !price &&
      !expense &&
      !vat &&
      !specifications &&
      !availableCountries &&
      !description
    ) {
      return res.status(400).json({ error: "At least one field is required" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (name) {
      if (name === product.name) {
        return res.status(400).json({ error: "Name is already updated" });
      }
    }

    if (brand) {
      const brandExist = await Brand.findById(brand);
      if (!brandExist) {
        return res.status(404).json({ error: "Brand not found" });
      }
      product.brand = brand;
    }

    if (category) {
      try {
        product.category = isValidProductCategory(category);
      } catch (error) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    if (skuId) {
      const productExistUsingSkiId = await Product.findOne({
        brand: brand || product.brand._id,
        skuId: skuId,
      });
      if (productExistUsingSkiId) {
        return res
          .status(400)
          .json({ error: "SKU ID already exists in this brand" });
      }
      product.skuId = skuId;
    }

    if (tag) {
      try {
        product.tag = isValidProductTag(tag);
      } catch (error) {
        return res.status(400).json({ error: "Invalid tag" });
      }
    }

    if (status) {
      if (!isValidProductStatus(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      product.status = status;
    }

    if (amountOfData) {
      const validAmountOfData = Number(amountOfData);
      if (isNaN(validAmountOfData) || validAmountOfData <= 0) {
        return res.status(400).json({ error: "Invalid amount of data" });
      }
      product.amountOfData = validAmountOfData;
    }

    if (validityPeriod) {
      const validValidityPeriod = Number(validityPeriod);
      if (isNaN(validValidityPeriod) || validValidityPeriod <= 0) {
        return res.status(400).json({ error: "Invalid validity period" });
      }
      product.validityPeriod = validValidityPeriod;
    }

    if (planIncludes) {
      if (!Array.isArray(planIncludes)) {
        return res
          .status(400)
          .json({ error: "Invalid plan includes. It should be an array" });
      }
      if (!isValidPlanInclude(planIncludes)) {
        return res.status(400).json({ error: "Invalid plan includes" });
      }
      product.planIncludes = planIncludes;
    }

    if (price) {
      const validPrice = Number(price);
      if (isNaN(validPrice) || validPrice <= 0) {
        return res.status(400).json({ error: "Invalid price" });
      }
      if (product.price !== validPrice) {
        return res.status(400).json({
          error:
            "Price can not be updated. We need to consider existing batch codes for this product",
        });
      }
      product.price = validPrice;
    }

    if (expense) {
      const validExpense = Number(expense);
      if (isNaN(validExpense) || validExpense <= 0) {
        return res.status(400).json({ error: "Invalid expense" });
      }
      product.expense = validExpense;
    }

    if (vat) {
      const validVat = Number(vat);
      if (isNaN(validVat) || validVat <= 0 || validVat >= 100) {
        return res.status(400).json({ error: "Invalid vat" });
      }
      product.vat = validVat;
    }

    if (specifications) {
      if (!Array.isArray(specifications)) {
        return res
          .status(400)
          .json({ error: "Invalid specifications. It should be an array" });
      }
      product.specifications = specifications;
    }

    if (availableCountries) {
      if (!Array.isArray(availableCountries)) {
        return res
          .status(400)
          .json({ error: "Invalid country codes. It should be an array" });
      }
      if (!isValidCountryCodes(availableCountries)) {
        return res.status(400).json({ error: "Invalid country codes" });
      }
      product.availableCountries = availableCountries;
    }

    if (description) {
      product.description = description;
    }

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Product ID is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc    Delete a product by admin
// @route   DELETE /products/delete
// @access  Private (Admin)
// In this function, the admin can delete a product by ID.
// The function first checks if the product exists in the database.
// If the product is found, it proceeds to delete the product and all related batches and codes.
// It starts a session for atomic operations using mongoose's session and transaction.
// We send the response with the number of deleted batches and codes.
// If any error occurs during the process, the transaction is aborted and an error message is returned.
const deleteProductByAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { productId } = req.body || {};
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.deleteOne({ _id: productId }, { session });

    // Find all batch IDs linked to the product
    const batchIds = await RedeemableCodeBatch.find({ product: productId })
      .select("_id")
      .session(session);
    const batchIdArray = batchIds.map((batch) => batch._id);

    // Delete batches and get the count of deleted batches
    const deletedBatchResult = await RedeemableCodeBatch.deleteMany(
      { product: productId },
      { session }
    );

    // Delete only UNSOLD redeemable codes and get the count of deleted codes
    const deletedCodeResult = await RedeemableCode.deleteMany(
      { batch: { $in: batchIdArray }, status: "UNSOLD" },
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    // Send response with deleted counts
    res.status(200).json({
      message: "Product deleted successfully",
      deletedBatches: deletedBatchResult.deletedCount,
      deletedCodes: deletedCodeResult.deletedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Product ID is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc    Update product status by admin
// @route   PATCH /products/update/status
// @access  Private (Admin)
// In this function, the admin can update the status of a product by ID.
// The function first checks if the admin is authorized.
// It then validates the product ID and status provided in the request body.
// Status can be either "ACTIVE" or "INACTIVE". and it should not be the same as the current status.
const updateProductStatusByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId)
      return res.status(400).json({ error: "Admin not authorized" });
    const { productId, status } = req.body || {};
    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    if (!isValidProductStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.status === status) {
      return res
        .status(400)
        .json({ error: `Product is already in ${status} status` });
    }
    product.status = status;
    product.updatedBy = adminId;
    await product.save();
    res.status(200).json({ message: "Product status updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Product ID is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc   Import mobile codes by admin
// @route  POST /products/import/codes
// @access Private (Admin)
// In this function, the admin can import mobile codes for a product by ID.
// The function first checks if the admin is authorized.
// It then validates the product ID and file provided in the request body.
// The file should be a text file containing mobile codes, amounts, and locations.
// The function starts a session for atomic operations using mongoose's session and transaction.
// It reads the file and processes each line, checking for the correct format and required fields.
// The batch manual ID should be unique within the brand(using first 2 fields), and the batch file should not contain duplicate codes.
// If the file is empty or all lines are empty, Failed to add the batch.
// Is there any duplicate codes found, Remove that line and add the rest of the codes.
// response with the total codes, duplicate codes, empty lines, and invalid lines.
const importMobileCodesByAdmin = async (req, res) => {
  session = await mongoose.startSession();
  session.startTransaction();
  adminId = req.user.id;
  try {
    const { productId } = req.body || {};
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const product = await Product.findById(productId).session(session);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const lines = file.buffer.toString().trim().split("\n");
    const batchManualIds = [];
    const codes = [];
    const amounts = [];
    const locations = [];
    let emptyLines = 0;
    let invalidLines = 0;
    lines.forEach((line, index) => {
      const parts = line.trim().split(",");
      if (!line.trim()) {
        emptyLines++;
        return;
      }

      // TODO: What i do is there any line missing the format but other lines are correct
      if (parts.length < 5) {
        invalidLines++;
      } else {
        // The combine of first 2 parts should be the batch manual id
        batchManualIds.push(parts[0] + parts[1]);
        codes.push(parts[3]);
        amounts.push(parts[4]);
        locations.push(parts[5]);
      }
    });
    const amountSet = new Set(amounts);
    const locationSet = new Set(locations);
    const codeSet = new Set(codes);
    const batchManualIdSet = new Set(batchManualIds);
    const totalCodes = codeSet.size;
    const countDuplicateCodes = totalCodes - codeSet.size;

    if (batchManualIdSet.size !== 1) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `The batch file contains combine batch file data. Failed to add batch file.`,
        productId: product._id,
      });
    }

    // Batch manual id should be unique inside the brand
    const productIds = await Product.find({ brand: product.brand }, { _id: 1 });

    const existBatch = await RedeemableCodeBatch.findOne({
      batchManualId: batchManualIdSet.values().next().value,
      product: { $in: productIds },
    });

    if (existBatch) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Batch file with the same batch manual id already exists. Failed to add batch file.`,
        productId: product._id,
      });
    }

    if (amountSet.size !== 1) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Price of data should be same for all codes. Found ${amountSet.size} different price. Failed to add batch file.`,
        productId: product._id,
      });
    }

    if (locationSet.size !== 1) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Location should be same for all codes. Found ${locationSet.size} different locations. Failed to add batch file.`,
        productId: product._id,
      });
    }

    // If file is empty or all lines are empty, Add the product but delete the batch
    if (emptyLines === lines.length) {
      await session.abortTransaction();
      res.status(400).json({
        error: "No valid codes found. File is empty. Failed to add  batch.",
        productId: product._id,
      });
    }

    const filePrice = Number(amountSet.values().next().value);
    if (filePrice.toString() !== product.price.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        error:
          "Price in file does not match product price. Failed to batch file",
        productId: product._id,
      });
    }

    // Save the redeemable code batch including manual id and total codes
    const redeemableCodeBatch = new RedeemableCodeBatch({
      product: product._id,
      batchName: file.originalname,
      status: "ACTIVE",
      batchManualId: batchManualIdSet.values().next().value,
      totalCodes: totalCodes,
      uploadedBy: adminId,
    });
    await redeemableCodeBatch.save({ session });

    // Save Redeemable Codes
    const redeemableCodes = [...codeSet].map((code) => ({
      product: product._id,
      batch: redeemableCodeBatch._id,
      code: code,
      status: "UNSOLD",
    }));
    await RedeemableCode.insertMany(redeemableCodes, { session });
    await session.commitTransaction();
    return res.status(201).json({
      message: `Product added successfully. Total codes: ${totalCodes}, duplicate codes: ${countDuplicateCodes}, Empty lines: ${emptyLines}, Invalid lines: ${invalidLines}`,
      productId: product._id,
      batchId: redeemableCodeBatch._id,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Brand id is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc   Export mobile codes by admin
// @route  POST /products/export/codes
// @access Private (Admin)
// In this function, the admin can export mobile codes for a batch by ID.
// The function first checks if the admin is authorized.
// It then validates the batch ID provided in the request body.
// The function retrieves all unsold codes for the batch and constructs a string containing all codes.
// The codes are then written to a text file for download.
const exportMobileCodesByAdmin = async (req, res) => {
  try {
    const { batchId = "67c6aaab55adba6c2a8ce536" } = req.body || {};
    if (!batchId) {
      return res.status(400).json({ error: "Batch ID is required" });
    }
    const batch = await RedeemableCodeBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }
    const codes = await RedeemableCode.find({
      batch: batchId,
      status: "UNSOLD",
    })
      .select("code")
      .lean();

    if (!codes.length) {
      return res.status(404).json({ error: "No unsold codes found" });
    }

    const codesArray = codes.map((code) => code.code);
    const codesString = codesArray.join("\n");

    // Set headers for the file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + batch.batchName + ".txt"
    );
    res.setHeader("Content-Type", "text/plain");
    res.write(codesString);
    res.end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Batch ID is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// @desc   Update batch status by admin
// @route  PATCH /products/update/batch/status
// @access Private (Admin)
// In this function, the admin can update the status of a batch by ID.
// The function first checks if the admin is authorized.
// It then validates the batch ID and status provided in the request body.
// Status can be either "ACTIVE" or "INACTIVE" and should not be the same as the current status.
const updateBatchStatusByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    if (!adminId)
      return res.status(400).json({ error: "Admin not authorized" });
    const { batchId, status } = req.body || {};
    if (!batchId)
      return res.status(400).json({ error: "Batch ID is required" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    if (!isValidBatchStatus(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const batch = await RedeemableCodeBatch.findById(batchId);
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    if (batch.status === status) {
      return res
        .status(400)
        .json({ error: `Batch is already in ${status} status` });
    }
    batch.status = status;
    batch.updatedBy = adminId;
    await batch.save();
    res.status(200).json({ message: "Batch status updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Batch ID is invalid" });
    }
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

module.exports = {
  addProductByAdmin,
  getAllProductsByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  updateProductStatusByAdmin,
  importMobileCodesByAdmin,
  exportMobileCodesByAdmin,
  updateBatchStatusByAdmin,
};
