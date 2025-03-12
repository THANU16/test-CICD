const Order = require("../../models/Order");
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const {
  isValidBelgiumPhoneNumber,
  isValidDate,
  isValidOrderStatus,
  isValidPaymentStatus,
} = require("../../utils/validators");

//@desc API to Get All Orders by admin with filters and pagination
//@route GET /orders
//@access private
// By default, the page is 1 and limit is 10
// If no filters are provided, all orders will be returned
// If filters are provided, the orders will be filtered based on the filters
// If search term is provided, the orders will be filtered based on the search term.
// Only customer name and mobile number are considered for search
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const {
      filters: {
        mobileNumber = "",
        orderStatus = "",
        paymentStatus = "",
        productName = "",
        fromDate = "",
        toDate = "",
      } = {},
      search = "",
      pagination: { page = 1, limit = 10 } = {},
    } = req.body || {};
    const skip = (page - 1) * limit;

    // Build dynamic filter object and validate the filters
    let filter = {};
    if (orderStatus) {
      if (!isValidOrderStatus(orderStatus))
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
          data: null,
          error: {
            code: 400,
            details: "Invalid order status",
            solution: "Please provide a valid order status",
          },
        });
      filter.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      if (!isValidPaymentStatus(paymentStatus))
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
          data: null,
          error: {
            code: 400,
            details: "Invalid payment status",
            solution: "Please provide a valid payment status",
          },
        });
      filter.paymentStatus = paymentStatus;
    }

    if (mobileNumber) {
      if (!isValidBelgiumPhoneNumber(mobileNumber))
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
          data: null,
          error: {
            code: 400,
            details: "Invalid phone number",
            solution: "Please provide a valid Belgium phone number",
          },
        });
      const customers = await Customer.find({ mobileNumber }).select("_id");
      const customerIds = customers.map((c) => c._id);
      if (customerIds.length === 0)
        return res
          .status(404)
          .json({ error: "No customers found with phone number" });
      filter.customer = { $in: customerIds };
    }

    if (productName) {
      const products = await Product.find({
        name: new RegExp(productName, "i"),
      }).select("_id");
      const productIds = products.map((p) => p._id);
      if (productIds.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No products found",
          data: null,
          error: {
            code: 404,
            details: "No products found",
            solution: "Please provide a valid product name",
          },
        });
      }
      filter.product = { $in: productIds };
    }

    if (fromDate || toDate) {
      if (!isValidDate(fromDate) || !isValidDate(toDate))
        return res.status(400).json({
          success: false,
          message: "Invalid date",
          data: null,
          error: {
            code: 400,
            details: "Invalid date",
            solution: "Please provide a valid date",
          },
        });
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Apply search filter if search term is provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const customers = await Customer.find({
        $or: [{ name: searchRegex }, { mobileNumber: searchRegex }],
      }).select("_id");

      const customerIds = customers.map((customer) => customer._id);
      filter.customer = { $in: customerIds };
    }

    const foundTotals = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null, // Group by all orders
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalSales = foundTotals.length > 0 ? foundTotals[0].totalSales : 0;
    const totalOrders = foundTotals.length > 0 ? foundTotals[0].totalOrders : 0;

    // Query with dynamic filters
    let orders = await Order.find(filter)
      .select(
        "id createdAt customer product orderStatus paymentMethod paymentStatus totalAmount"
      )
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate({ path: "customer", select: "name mobileNumber" })
      .populate({ path: "product", select: "name price vat" });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
        data: null,
        error: {
          code: 404,
          details: "No orders found",
          solution: "Please provide valid filters",
        },
      });
    }

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders: orders,
        currentPage: page,
        totalOrders: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        totalSales: totalSales,
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

//@desc API to Get All Orders by admin for export orders with filters and pagination
//@route GET /orders/export
//@access private
// There is no pagination in this API
// If no filters are provided, all orders will be returned
// If filters are provided, the orders will be filtered based on the filters
// TODO: Implement the search functionality for the orders
const getAllOrdersByAdminForExport = async (req, res) => {
  try {
    const {
      filters: {
        mobileNumber = "",
        orderStatus = "",
        paymentStatus = "",
        productName = "",
        fromDate = "",
        toDate = "",
      } = {},
    } = req.body || {};

    // Build dynamic filter object and validate the filters
    let filter = {};
    if (orderStatus) {
      if (!isValidOrderStatus(orderStatus))
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
          data: null,
          error: {
            code: 400,
            details: "Invalid order status",
            solution: "Please provide a valid order status",
          },
        });
      filter.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      if (!isValidPaymentStatus(paymentStatus))
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
          data: null,
          error: {
            code: 400,
            details: "Invalid payment status",
            solution: "Please provide a valid payment status",
          },
        });
      filter.paymentStatus = paymentStatus;
    }

    if (mobileNumber) {
      if (!isValidBelgiumPhoneNumber(mobileNumber))
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
          data: null,
          error: {
            code: 400,
            details: "Invalid phone number",
            solution: "Please provide a valid Belgium phone number",
          },
        });
      const customers = await Customer.find({ mobileNumber }).select("_id");
      const customerIds = customers.map((c) => c._id);
      if (customerIds.length === 0)
        return res.status(404).json({
          success: false,
          message: "No customers found with phone number",
          data: null,
          error: {
            code: 404,
            details: "No customers found with phone number",
            solution: "Please provide a valid phone number",
          },
        });
      filter.customer = { $in: customerIds };
    }

    if (productName) {
      const products = await Product.find({
        name: new RegExp(productName, "i"),
      }).select("_id");
      const productIds = products.map((p) => p._id);
      if (productIds.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No products found",
          data: null,
          error: {
            code: 404,
            details: "No products found",
            solution: "Please provide a valid product name",
          },
        });
      }
      filter.product = { $in: productIds };
    }

    if (fromDate || toDate) {
      if (!isValidDate(fromDate) || !isValidDate(toDate))
        return res.status(400).json({
          success: false,
          message: "Invalid date",
          data: null,
          error: {
            code: 400,
            details: "Invalid date",
            solution: "Please provide a valid from and to date",
          },
        });
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Query with dynamic filters
    let orders = await Order.find(filter)
      .select(
        "id createdAt customer product orderStatus paymentMethod paymentStatus totalAmount"
      )
      .sort({ createdAt: -1 })
      .populate({ path: "customer", select: "name mobileNumber" })
      .populate({ path: "product", select: "name price vat" });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
        data: null,
        error: {
          code: 404,
          details: "No orders found",
          solution: "Please provide valid filters",
        },
      });
    }

    res.json({
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", error: error.message });
  }
};

//@desc API to Update Order Status
//@route PATCH /orders/:orderId/status
//@access private
// The order status updated only if the order status is different
// The order note is compulsory
const updateOrderStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { orderId } = req.params;
    const { orderStatus, orderNote } = req.body || {};

    // validate the admin id
    if (!adminId)
      return res.status(401).json({
        success: false,
        message: "Admin not authorized",
        data: null,
        error: {
          code: 401,
          details: "Admin not authorized",
          solution: "Please login as an admin",
        },
      });

    // Check the order status is valid
    if (!isValidOrderStatus(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
        data: null,
        error: {
          code: 400,
          details: "Invalid order status",
          solution: "Please provide a valid order status",
        },
      });
    }

    // Order note is compulsory field
    if (!orderNote)
      return res.status(400).json({
        success: false,
        message: "Order note is empty",
        data: null,
        error: {
          code: 400,
          details: "Order note is empty",
          solution: "Please provide a valid order note",
        },
      });

    const order = await Order.findById(orderId);

    // Check the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: {
          code: 404,
          details: "Order not found",
          solution: "Please provide a valid order id",
        },
      });
    }

    // Check the same status is not updated
    if (order.orderStatus === orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is already updated",
        data: null,
        error: {
          code: 400,
          details: "Order status is already updated",
          solution: "Please provide a different order status",
        },
      });
    }

    order.orderStatus = orderStatus;
    order.updatedBy = req.user.id;
    order.orderNotes = orderNote;
    order.updatedBy = adminId;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: { order: order },
      error: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Order id is invalid",
        data: null,
        error: {
          code: 400,
          details: "Order id is invalid",
          solution: "Please provide a valid order id",
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

//@desc API to Update Payment Status
//@route PATCH /orders/:orderId/payment
//@access private
// The payment status updated only if the payment status is different
// The payment note is compulsory
// This API is prevent updating the order if the payment status is already updated to success or refunded
const updatePaymentStatus = async (req, res) => {
  try {
    adminId = req.user.id;
    const { orderId } = req.params;
    const { paymentStatus, paymentNote } = req.body || {};

    if (!adminId)
      return res.status(401).json({
        success: false,
        message: "Admin not authorized",
        data: null,
        error: {
          code: 401,
          details: "Admin not authorized",
          solution: "Please login as an admin",
        },
      });

    // Check the payment status is valid
    if (!isValidPaymentStatus(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
        data: null,
        error: {
          code: 400,
          details: "Invalid payment status",
          solution: "Please provide a valid payment status",
        },
      });
    }
    // Payment notes is a compulsory
    if (!paymentNote)
      return res.status(400).json({
        success: false,
        message: "Payment note is empty",
        data: null,
        error: {
          code: 400,
          details: "Payment note is empty",
          solution: "Please provide a valid payment note",
        },
      });
    const order = await Order.findById(orderId);

    // Check the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: {
          code: 404,
          details: "Order not found",
          solution: "Please provide a valid order id",
        },
      });
    }

    if (
      order.paymentStatus === "SUCCESS" ||
      order.paymentStatus === "REFUNDED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment status is already updated to success or refunded",
        data: null,
        error: {
          code: 400,
          details: "Payment status is already updated to success or refunded",
          solution: "Please provide a different payment status",
        },
      });
    }

    // Validate the same status is not updated
    if (order.paymentStatus === paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is already updated",
        data: null,
        error: {
          code: 400,
          details: "Payment status is already updated",
          solution: "Please provide a different payment status",
        },
      });
    }

    order.paymentStatus = paymentStatus;
    order.updatedBy = req.user.id;
    order.paymentNotes = paymentNote;
    order.updatedBy = adminId;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: { order: order },
      error: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Order id is invalid",
        data: null,
        error: {
          code: 400,
          details: "Order id is invalid",
          solution: "Please provide a valid order id",
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
  getAllOrdersByAdmin,
  getAllOrdersByAdminForExport,
  updateOrderStatus,
  updatePaymentStatus,
};
