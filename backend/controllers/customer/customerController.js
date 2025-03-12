const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Customer = require("../../models/Customer");
const Banner = require("../../models/Banner");
const Order = require("../../models/Order");
const RedeemableCode = require("../../models/Redeemable_Code");
const RedeemableCodeBatch = require("../../models/Redeemable_Code_Batch");
const { isValidEmail, isValidDate } = require("../../utils/validators");

//@desc API to Update Customer Details
//@route PATCH /:userId
//@access private
const updateCustomer = async (req, res) => {
  try {
    const { userId, dateOfBirth } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    if (!isValidEmail(userId)) {
      return res.status(400).json({ message: "Invalid userId Format" });
    }

    if (!dateOfBirth) {
      return res
        .status(400)
        .json({ message: "Only dateOfBirth can be updated and is required" });
    }

    if (!isValidDate(dateOfBirth)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { email: userId },
      { dateOfBirth },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Update Customer Profile Success",
      user: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Update Customer Profile Failed" });
  }
};

//@desc API to Get Customer Details And App Banner Images
//@route GET /home
//@access private
const getCustomerAndBannerImages = async (req, res) => {
  try {
    const { userId } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    if (!isValidEmail(userId)) {
      return res.status(400).json({ message: "Invalid userId Format" });
    }

    const customer = await Customer.findOne({
      email: userId,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const banners = await Banner.find({ status: "ACTIVE" });

    const bannerData = banners.map((banner) => ({
      productId: banner.product,
      image: banner.image ? banner.image.toString("base64") : null,
    }));

    res.json({
      message: "Get Customer And Banner Details Success",
      data: {
        username: customer.name || null,
        banners: bannerData,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get Customer And Banner Details Success" });
  }
};

const getCustomerData = async (req, res) => {
  try {
    const { userId } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    if (!isValidEmail(userId)) {
      return res.status(400).json({ message: "Invalid userId Format" });
    }

    const customer = await Customer.findOne({
      email: userId,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      message: "Get Customer And Banner Details Success",
      data: {
        username: customer.name || null,
        email: customer.email || null,
        mobileNumber: customer.mobileNumber || null,
        dateOfBirth: customer.dateOfBirth || null,
        paymentCards: customer.paymentCards || null,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Get Customer And Banner Details Success" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { email } = req.params;

    if (req.user.email !== email) {
      return res
        .status(403)
        .json({ message: "User is not authorized, invalid token" });
    }

    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (["DELETED", "SUSPENDED"].includes(customer.status)) {
      return res.status(400).json({
        message: `Customer is already ${customer.status.toLowerCase()}`,
      });
    }

    const pendingOrders = await Order.find({
      customer: customer._id,
      orderStatus: "PENDING",
    }).select("redeemCodes");

    const redeemableCodeIds = pendingOrders.flatMap(
      (order) => order.redeemCodes?.map((rc) => rc.code) || []
    );

    console.log(redeemableCodeIds);

    await Promise.all([
      customer.updateOne({ status: "DELETED" }),

      redeemableCodeIds.length > 0
        ? RedeemableCode.updateMany(
            { code: { $in: redeemableCodeIds } },
            { status: "UNSOLD" }
          )
        : Promise.resolve(),

      Order.updateMany(
        { customer: customer._id, orderStatus: "PENDING" },
        { orderStatus: "DELETED" }
      ),
    ]);

    res.json({ message: "Customer deleted successfully", customer });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateCustomer,
  getCustomerAndBannerImages,
  getCustomerData,
  deleteCustomer,
  // addPaymentCard,
  // updatePaymentCard,
  // getAllPaymentCards,
  // deletePaymentCard,
};
