const Brand = require("../../models/Brand");

// @desc Get inventory by admin
// @route GET /api/inventory
// @access Private
// @role Admin
//
// This function fetches the inventory by admin
// It aggregates the Brand model to get the inventory
// It then returns the inventory
// Inventory structure: [{ name, image, products: { id, name, totalCodes, redeemedCodes }, totalProducts }]
const getInventoryByAdmin = async (req, res) => {
  try {
    // Aggregate the Brand model to get the inventory
    const inventories = await Brand.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brand",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "redeemable_code_batches",
          localField: "products._id",
          foreignField: "product",
          as: "batches",
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                id: "$$product._id",
                name: "$$product.name",
                totalCodes: {
                  $sum: {
                    $filter: {
                      input: "$batches",
                      as: "batch",
                      cond: { $eq: ["$$batch.product", "$$product._id"] },
                    },
                  },
                },
                redeemedCodes: {
                  $sum: {
                    $map: {
                      input: "$batches",
                      as: "batch",
                      in: "$$batch.redeemedCodes",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalProducts: {
            $size: {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $ne: ["$$product.id", null] }, // Ensure only valid products are counted
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          products: 1,
          totalProducts: 1,
        },
      },
    ]);

    res
      .status(200)
      .json({ message: "Inventory fetched successfully", inventories });
  } catch (error) {
    res.status(500).json({ error: `Server Error: ${error.message}` });
  }
};

module.exports = { getInventoryByAdmin };
