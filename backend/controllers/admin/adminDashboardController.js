const Customer = require("../../models/Customer");
const Order = require("../../models/Order");
const International_Reload = require("../../models/International_Reload");
const Brand = require("../../models/Brand");
const mongoose = require("mongoose");
const { isValidDate } = require("../../utils/validators");
const Redeemable_Code = require("../../models/Redeemable_Code");
const Product = require("../../models/Product");

// Helper function to get start and end dates for day, week, month, and year
const getStartEndDates = (date) => {
  const givenDate = new Date(date);

  // Start & End of the Day
  const startOfDay = new Date(givenDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(givenDate.setHours(23, 59, 59, 999));

  // Start & End of the Week (Sunday - Saturday)
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay()); // Move to Sunday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  // Start & End of the Month
  const startOfMonth = new Date(
    givenDate.getFullYear(),
    givenDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    givenDate.getFullYear(),
    givenDate.getMonth() + 1,
    0
  );
  endOfMonth.setHours(23, 59, 59, 999);

  // Start & End of the Year
  const startOfYear = new Date(givenDate.getFullYear(), 0, 1);
  const endOfYear = new Date(givenDate.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
  };
};

// Function to get total orders count
// It takes a date and status as arguments and returns the total number of orders with that status created on that date
// If no date is provided, it defaults to the current date
// It returns the total orders for the day, week, month, and year
const helperGetTotalOrdersCount = async (date, status) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfYear,
      endOfMonth,
      startOfYear,
    } = getStartEndDates(date);

    const counts = await Order.aggregate([
      {
        $match: { orderStatus: status },
      },
      {
        $unionWith: {
          coll: "international_reloads",
          pipeline: [{ $match: { orderStatus: status } }],
        },
      },
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $count: "total" },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            { $count: "total" },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $count: "total" },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $count: "total" },
          ],
        },
      },
    ]);

    return {
      daily: counts[0].daily[0]?.total || 0,
      weekly: counts[0].weekly[0]?.total || 0,
      monthly: counts[0].monthly[0]?.total || 0,
      yearly: counts[0].yearly[0]?.total || 0,
    };
  } catch (error) {
    throw new Error("Database query failed");
  }
};

//  Function to get total customers excluding deleted ones
// It takes a date as an argument and returns the total number of customers created on that date
// If no date is provided, it defaults to the current date
const helperGetCustomersCount = async (date) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);

    const counts = await Customer.aggregate([
      {
        $match: { status: { $ne: "DELETED" } },
      },
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $count: "total" },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            { $count: "total" },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $count: "total" },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $count: "total" },
          ],
        },
      },
    ]);

    return {
      daily: counts[0].daily[0]?.total || 0,
      weekly: counts[0].weekly[0]?.total || 0,
      monthly: counts[0].monthly[0]?.total || 0,
      yearly: counts[0].yearly[0]?.total || 0,
    };
  } catch (error) {
    throw new Error("Database query failed");
  }
};

// Function to calculate total sales from completed orders
// It returns the total sales for the day, week, month, and year
// The date parameter is optional and defaults to the current date
// It returns total completed orders sales only
const helperGetTotalSales = async (date) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);

    const sales = await Order.aggregate([
      //   {
      //     $match: { orderStatus: "COMPLETED" },
      //   },
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ]);

    return {
      daily: sales[0].daily[0]?.total || 0,
      weekly: sales[0].weekly[0]?.total || 0,
      monthly: sales[0].monthly[0]?.total || 0,
      yearly: sales[0].yearly[0]?.total || 0,
    };
  } catch (error) {
    throw new Error("Database query failed");
  }
};

// Function to get all top level dashboard data
// It returns total customers, total sales, total completed orders, and total pending orders
// The date parameter is optional and defaults to the current date
const helperGetDashboardTopTotalData = async (date) => {
  const [totalCustomers, totalCompletedOrders, totalPendingOrders, totalSales] =
    await Promise.all([
      helperGetCustomersCount(date),
      helperGetTotalOrdersCount(date, "COMPLETED"),
      helperGetTotalOrdersCount(date, "PENDING"),
      helperGetTotalSales(date),
    ]);

  return {
    totalCustomers,
    totalSales,
    totalCompletedOrders,
    totalPendingOrders,
  };
};

// Function to get sales and income data for the dashboard
// It returns weekly, monthly, and yearly sales data
// The date parameter is optional and defaults to the current date
// It returns sales data for the last 6 years
// The weekly sales data is grouped by day of the week (Sunday → Saturday)
// The monthly sales data is grouped by month (January → December)
// The yearly sales data is grouped by year
const helperGetDashboardSalesIncomeData = async (date) => {
  try {
    const {
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);
    const currentYear = new Date(date).getFullYear();

    const salesData = await Order.aggregate([
      {
        // Last 6 years sales data
        $match: { createdAt: { $gte: new Date(currentYear - 6) } },
      },
      {
        $facet: {
          //   day: [
          //     { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
          //     {
          //       $group: {
          //         _id: { $dateToString: { format: "%w", date: "$createdAt" } },
          //         total: { $sum: "$totalAmount" },
          //       },
          //     },
          //   ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            {
              $group: {
                _id: { $dateToString: { format: "%w", date: "$createdAt" } },
                total: { $sum: "$totalAmount" },
              },
            },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            {
              $group: {
                _id: { $month: "$createdAt" }, // Group by Month (1-12)
                total: { $sum: "$totalAmount" },
              },
            },
          ],
          yearly: [
            {
              $group: {
                _id: { $year: "$createdAt" }, // Group by year
                total: { $sum: "$totalAmount" },
              },
            },
          ],
        },
      },
    ]);

    // Format Weekly Sales Data (Sunday → Saturday)
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // Format the weekly sales data using the weekDays object if not found use the default value 0
    const weeklySalesData = salesData[0].weekly.reduce(
      (acc, { _id, total }) => {
        acc[weekDays[_id] || 0] = total;
        return acc;
      },
      {}
    );

    // Format Yearly Sales Data (January → December)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Format the months sales data using the months object if not found use the default value 0
    const monthlySalesData = salesData[0].monthly.reduce(
      (acc, { _id, total }) => {
        acc[months[_id - 1] || 0] = total;
        return acc;
      },
      {}
    );

    const yearlySalesData = salesData[0].yearly.reduce(
      (acc, { _id, total }) => {
        acc[_id] = total;
        return acc;
      },
      {}
    );
    return {
      weeklySalesData: weeklySalesData,
      monthlySalesData: monthlySalesData,
      yearlySalesData: yearlySalesData,
    };
  } catch (error) {
    throw new Error("Database query failed");
  }
};

// Function to get current stock of products
// It takes an optional brandId as an argument
// If brandId is provided, it fetches the current stock of products for that brand
// It returns the current stock of products
// The products are grouped by brand
// The totalCodes, redeemedCodes, and availableCodes are calculated for each product
// The totalCodes is the sum of total codes in all batches for that product
// The redeemedCodes is the sum of redeemed codes in all batches for that product
// The availableCodes is the difference between totalCodes and redeemedCodes
// The totalProducts is the total number of products for that brand
const helperCurrentStock = async (brandId) => {
  try {
    const filter = brandId ? { _id: new mongoose.Types.ObjectId(brandId) } : {};
    // Aggregate the Brand model to get the inventory
    const inventories = await Brand.aggregate([
      {
        $match: filter,
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
                    $map: {
                      input: "$batches",
                      as: "batch",
                      in: {
                        $cond: [
                          { $eq: ["$$batch.product", "$$product._id"] },
                          "$$batch.totalCodes",
                          0,
                        ],
                      },
                    },
                  },
                },
                redeemedCodes: {
                  $sum: {
                    $map: {
                      input: "$batches",
                      as: "batch",
                      in: {
                        $cond: [
                          { $eq: ["$$batch.product", "$$product._id"] },
                          "$$batch.redeemedCodes",
                          0,
                        ],
                      },
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
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                id: "$$product.id",
                name: "$$product.name",
                totalCodes: "$$product.totalCodes",
                redeemedCodes: "$$product.redeemedCodes",
                availableCodes: {
                  $subtract: [
                    "$$product.totalCodes",
                    "$$product.redeemedCodes",
                  ],
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
                cond: { $ne: ["$$product.id", null] },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          products: 1,
          totalProducts: 1,
        },
      },
    ]);

    return inventories;
  } catch (error) {
    throw new Error("Database query failed");
  }
};

const helperOnBoardedDevices = async (date) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);

    const onBoardedDevices = await Customer.aggregate([
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $group: { _id: "$signupSource", total: { $sum: 1 } } },
            { $project: { _id: 0, k: "$_id", v: "$total" } },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            { $group: { _id: "$signupSource", total: { $sum: 1 } } },
            { $project: { _id: 0, k: "$_id", v: "$total" } },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: "$signupSource", total: { $sum: 1 } } },
            { $project: { _id: 0, k: "$_id", v: "$total" } },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            { $group: { _id: "$signupSource", total: { $sum: 1 } } },
            { $project: { _id: 0, k: "$_id", v: "$total" } },
          ],
        },
      },
      {
        $project: {
          daily: { $arrayToObject: "$daily" },
          weekly: { $arrayToObject: "$weekly" },
          monthly: { $arrayToObject: "$monthly" },
          yearly: { $arrayToObject: "$yearly" },
        },
      },
    ]);

    return onBoardedDevices[0];
  } catch (error) {
    throw new Error("Database query failed");
  }
};

const helperSalesProducts = async (date, brandId) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);
    const currentYear = new Date(date).getFullYear();

    const salesProducts = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      ...(brandId
        ? [
            {
              $match: {
                "productDetails.brand": brandId
                  ? new mongoose.Types.ObjectId(brandId)
                  : { $exists: true },
              },
            },
          ]
        : []),
      { $match: { createdAt: { $gte: new Date(currentYear - 1) } } },
      { $sort: { "productDetails.createdAt": 1 } },
      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                total: { $sum: "$quantity" },
              },
            },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                total: { $sum: "$quantity" },
              },
            },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                total: { $sum: "$quantity" },
              },
            },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                total: { $sum: "$quantity" },
              },
            },
          ],
        },
      },
    ]);

    return salesProducts[0];
  } catch (error) {
    throw new Error("Database query failed");
  }
};

const helperTopSellingProducts = async (date, brandId) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getStartEndDates(date);
    const currentYear = new Date(date).getFullYear();

    const TopSellingProducts = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      ...(brandId
        ? [
            {
              $match: {
                "productDetails.brand": new mongoose.Types.ObjectId(brandId),
              },
            },
          ]
        : []),

      { $match: { createdAt: { $gte: new Date(currentYear - 1) } } },

      {
        $facet: {
          daily: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                price: { $first: "$productDetails.price" },
                total: { $sum: "$quantity" },
              },
            },
            {
              $addFields: {
                totalSalesAmount: { $multiply: ["$total", "$price"] },
              },
            },
            { $sort: { totalSalesAmount: -1 } },
          ],
          weekly: [
            { $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                price: { $first: "$productDetails.price" },
                total: { $sum: "$quantity" },
              },
            },
            {
              $addFields: {
                totalSalesAmount: { $multiply: ["$total", "$price"] },
              },
            },
            { $sort: { totalSalesAmount: -1 } },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                price: { $first: "$productDetails.price" },
                total: { $sum: "$quantity" },
              },
            },
            {
              $addFields: {
                totalSalesAmount: { $multiply: ["$total", "$price"] },
              },
            },
            { $sort: { totalSalesAmount: -1 } },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
            {
              $group: {
                _id: "$product",
                name: { $first: "$productDetails.name" },
                brand: { $first: "$productDetails.brand" },
                price: { $first: "$productDetails.price" },
                total: { $sum: "$quantity" },
              },
            },
            {
              $addFields: {
                totalSalesAmount: { $multiply: ["$total", "$price"] },
              },
            },
            { $sort: { totalSalesAmount: -1 } },
          ],
        },
      },
    ]);

    return TopSellingProducts[0];
  } catch (error) {
    throw new Error("Database query failed: " + error.message);
  }
};

// @desc    Get all dashboard data
// @route   GET /api/dashboard/
// @access  Private
// This api fetches all the required data for the dashboard
// The date parameter is optional and defaults to the current date
// The brandId parameter is optional and defaults to null
// The requiredData parameter is an object that contains the required data
// The required data can be totalData, salesIncome, inventory, and onBoardedDevices
// At least one of the required data should be provided such as totalData, salesIncome, inventory, onBoardedDevices (requiredData: {totalData: true})
// It returns the required data for the dashboard
const getAllDashboardData = async (req, res) => {
  try {
    const { date, brandId } = req.body || {};
    const {
      totalData,
      salesIncome,
      inventory,
      onBoardedDevices,
      salesProducts,
      topSellingProducts,
    } = req.body?.requiredData || {};

    //   At least one of the required data should be provided
    if (
      !totalData &&
      !salesIncome &&
      !inventory &&
      !onBoardedDevices &&
      !salesProducts &&
      !topSellingProducts
    ) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            "At least one required data is needed such as totalData, salesIncome, inventory, onBoardedDevices , salesProducts or topSellingProducts",
          code: 400,
          solution: "Please provide at least one of the required data",
        },
      });
    }

    if (req.body && date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }
    const validDate = date ? new Date(date) : new Date();

    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Brand not found",
            code: 404,
            solution: "Please provide a valid brand id",
          },
        });
      }
    }

    data = {};
    // Fetch data concurrently
    if (totalData && salesIncome && inventory && onBoardedDevices) {
      const [
        dashboardTotalData,
        dashboardSalesIncomeData,
        currentInventory,
        onBoardedDevicesData,
        salesProductsData,
        topSellingProductsData,
      ] = await Promise.all([
        helperGetDashboardTopTotalData(validDate),
        helperGetDashboardSalesIncomeData(validDate),
        helperCurrentStock(brandId),
        helperOnBoardedDevices(validDate),
        helperSalesProducts(validDate, brandId),
        helperTopSellingProducts(validDate, brandId),
      ]);

      return res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          totalData: dashboardTotalData,
          salesIncome: dashboardSalesIncomeData,
          inventory: currentInventory,
          onBoardedDevices: onBoardedDevicesData,
          salesProducts: salesProductsData,
          topSellingProducts: topSellingProductsData,
        },
      });
    }
    // Total data needed
    if (totalData) {
      const dashboardTotalData = await helperGetDashboardTopTotalData(date);
      data.totalData = dashboardTotalData;
      data.salesIncome = {};
      data.inventory = {};
      data.onBoardedDevices = {};
      data.salesProducts = {};
      data.topSellingProducts = {};
      res.status(200).json({
        success: true,
        message: "Dashboard total related data fetched successfully",
        data: data,
      });
    }

    // Sales and income data needed
    if (salesIncome) {
      const dashboardSalesIncomeData = await helperGetDashboardSalesIncomeData(
        date
      );
      data.totalData = {};
      data.salesIncome = dashboardSalesIncomeData;
      data.inventory = {};
      data.onBoardedDevices = {};
      data.salesProducts = {};
      data.topSellingProducts = {};
      res.status(200).json({
        success: true,
        message: "Dashboard sales and income related data fetched successfully",
        data: data,
      });
    }

    // Inventory data needed
    if (inventory) {
      const currentInventory = await helperCurrentStock(brandId);
      data.inventory = currentInventory;
      data.totalData = {};
      data.salesIncome = {};
      data.onBoardedDevices = {};
      data.salesProducts = {};
      data.topSellingProducts = {};
      res.status(200).json({
        success: true,
        message: "Inventory data fetched successfully",
        data: data,
      });
    }

    // Onboarded devices data needed
    if (onBoardedDevices) {
      const onBoardedDevicesData = await helperOnBoardedDevices(date);
      data.onBoardedDevices = onBoardedDevicesData;
      data.totalData = {};
      data.salesIncome = {};
      data.inventory = {};
      data.salesProducts = {};
      data.topSellingProducts = {};
      res.status(200).json({
        success: true,
        message: "Onboarded devices data fetched successfully",
        data: data,
      });
    }

    // Sales products data needed
    if (salesProducts) {
      const salesProductsData = await helperSalesProducts(date, brandId);
      data.salesProducts = salesProductsData;
      data.totalData = {};
      data.salesIncome = {};
      data.inventory = {};
      data.onBoardedDevices = {};
      data.topSellingProducts = {};
      res.status(200).json({
        success: true,
        message: "Sales products data fetched successfully",
        data: data,
      });
    }

    // Top selling products data needed
    if (topSellingProducts) {
      const topSellingProductsData = await helperTopSellingProducts(
        date,
        brandId
      );
      data.topSellingProducts = topSellingProductsData;
      data.totalData = {};
      data.salesIncome = {};
      data.inventory = {};
      data.onBoardedDevices = {};
      data.salesProducts = {};
      res.status(200).json({
        success: true,
        message: "Top selling products data fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    if (error.message === "CastError") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid brand id",
          code: 400,
          solution: "Please provide a valid brand id",
        },
      });
    }
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

// @desc    Get all dashboard data
// @route   GET /api/dashboard/total
// @access  Private
// This api fetch total customers, total sales, total completed orders, and total pending orders
// The date parameter is optional and defaults to the current date
// It returns the total customers, total sales, total completed orders, and total pending orders
// The daily, weekly, monthly, and yearly data is returned
const getDashboardTopTotalData = async (req, res) => {
  try {
    const { date } = req.body || new Date();
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }
    const validDate = date ? new Date(date) : new Date();
    const dashboardData = await helperGetDashboardTopTotalData(validDate);
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

// @desc    Get sales and income data for the dashboard
// @route   GET /api/dashboard/sales-income
// @access  Private
// This api fetches weekly, monthly, and yearly sales data
// The date parameter is optional and defaults to the current date
// It returns sales data for the last 6 years
// The weekly sales data is grouped by day of the week (Sunday → Saturday)
// The monthly sales data is grouped by month (January → December)
// The yearly sales data is grouped by year
const getDashboardSalesIncomeData = async (req, res) => {
  try {
    const { date } = req.body || new Date();
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }
    const validDate = date ? new Date(date) : new Date();
    const dashboardSalesIncomeData = await helperGetDashboardSalesIncomeData(
      validDate
    );
    res.status(200).json({
      success: true,
      message: "Dashboard sales and income data fetched successfully",
      data: dashboardSalesIncomeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

// @desc    Get current stock
// @route   GET /api/dashboard/current-stock
// @access  Private
// This api fetches the current stock of products
// The brandId parameter is optional and defaults to null
// If brandId is provided, it fetches the current stock of products for that brand
// It returns the current stock of products
const getCurrentStock = async (req, res) => {
  try {
    const { brandId } = req.body || null;
    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Brand not found",
            code: 404,
            solution: "Please provide a valid brand id",
          },
        });
      }
    }
    const inventory = await helperCurrentStock(brandId);
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  } catch (error) {
    if (error.message === "CastError") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid brand id",
          code: 400,
          solution: "Please provide a valid brand id",
        },
      });
    }
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

// @desc    Get on-boarded devices
// @route   GET /api/dashboard/onboarded-devices
// @access  Private
// This api fetches the on-boarded devices
// The date parameter is optional and defaults to the current date
// It returns the on-boarded devices for the day, week, month, and year
// The daily, weekly, monthly, and yearly data is returned
// The data is grouped by the signup source (WEB, IOS, ANDROID)
const getOnBoardedDevices = async (req, res) => {
  try {
    const { date } = req.body || new Date();
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }
    const validDate = date ? new Date(date) : new Date();
    const onBoardedDevices = await helperOnBoardedDevices(validDate);
    res.status(200).json({
      success: true,
      message: "Onboarded devices fetched successfully",
      data: onBoardedDevices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

const getSalesProducts = async (req, res) => {
  try {
    const { date, brandId } = req.body || {};
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }

    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Brand not found",
            code: 404,
            solution: "Please provide a valid brand id",
          },
        });
      }
    }

    const validDate = date ? new Date(date) : new Date();

    const salesProducts = await helperSalesProducts(validDate, brandId);
    res.status(200).json({
      success: true,
      message: "Sales products fetched successfully",
      data: salesProducts,
    });
  } catch (error) {
    if (error.message === "CastError") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid brand id",
          code: 400,
          solution: "Please provide a valid brand id",
        },
      });
    }
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const { date, brandId } = req.body || { date: new Date(), brandId: null };
    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Invalid date",
            code: 400,
            solution: "Please provide a valid date. date format: YYYY-MM-DD",
          },
        });
      }
    }

    if (brandId) {
      const brandExists = await Brand.exists({ _id: brandId });
      if (!brandExists) {
        return res.status(404).json({
          success: false,
          error: {
            message: "Brand not found",
            code: 404,
            solution: "Please provide a valid brand id",
          },
        });
      }
    }

    const validDate = date ? new Date(date) : new Date();
    const topSellingProducts = await helperTopSellingProducts(
      validDate,
      brandId
    );
    res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully",
      data: topSellingProducts,
    });
  } catch (error) {
    if (error.message === "CastError") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid brand id",
          code: 400,
          solution: "Please provide a valid brand id",
        },
      });
    }
    res.status(500).json({
      success: false,
      error: {
        message: `Server error: ${error.message}`,
        code: 500,
        solution: "Please try again",
      },
    });
  }
};

module.exports = {
  getAllDashboardData,
  getDashboardTopTotalData,
  getDashboardSalesIncomeData,
  getCurrentStock,
  getOnBoardedDevices,
  getSalesProducts,
  getTopSellingProducts,
};
