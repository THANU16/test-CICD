const Product = require("../../models/Product");

//@desc API to Get All Products
//@route GET /
//@access private
const getAllProductsByCustomer = async (req, res) => {
  try {
    const { userId } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized request, invalid token" });
    }

    const products = await Product.find({ status: "ACTIVE" });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const mobileTopups = [];
    const monthlyPlans = [];

    products.forEach((product) => {
      const category = product.category;

      const price = parseFloat(product.price.toString());
      const expense = parseFloat(product.expense.toString());

      const mobileTopupsData = {
        name: product.name,
        dataAmount: product.dataAmount,
        validityPeriod: product.validityPeriod,
        price: price,
        expense: expense,
        vat: product.vat,
        tag: product.tag,
        category: product.category,
      };

      const monthlyPlansData = {
        name: product.name,
        dataAmount: product.dataAmount,
        planIncludes: product.planIncludes,
        specifications: product.specifications,
        validityPeriod: product.validityPeriod,
        price: price,
        expense: expense,
        vat: product.vat,
        tag: product.tag,
        availableCountries: product.availableCountries,
        description: product.description,
        category: product.category,
      };

      if (category === "MOBILE_TOPUP") {
        mobileTopups.push(mobileTopupsData);
      } else if (category === "MONTHLY_PLAN") {
        monthlyPlans.push(monthlyPlansData);
      }
    });

    return res.status(200).json({
      message: "Products retrieved successfully",
      data: {
        mobileTopups,
        monthlyPlans,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to retrieve products" });
  }
};

//@desc API to Get A Product Detail
//@route GET /products?userId={userId}&productId={productId}
//@access private
const getProductById = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized request, invalid token" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "INACTIVE" || product.status === "DELETED") {
      return res
        .status(404)
        .json({ message: "This product is not available now." });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = parseFloat(product.price.toString());
    const expense = parseFloat(product.expense.toString());

    const productData = {
      name: product.name,
      dataAmount: product.dataAmount,
      validityPeriod: product.validityPeriod,
      price: price,
      expense: expense,
      vat: product.vat,
      tag: product.tag,
      category: product.category,
    };
    return res.status(200).json({
      message: "Product retrieved successfully",
      data: productData,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Failed to retrieve Product" });
  }
};

module.exports = {
  getAllProductsByCustomer,
  getProductById,
};
