const moment = require("moment");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const Order = require("../../models/Order");
const InternationalReload = require("../../models/International_Reload");
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const Payment = require("../../models/Payment");
const RedeemableCodeBatch = require("../../models/Redeemable_Code_Batch");
const RedeemableCode = require("../../models/Redeemable_Code");
const {
  isValidEmail,
  isValidPaymentMethod,
} = require("../../utils/validators");

const serviceCharges = {
  visa: parseFloat(process.env.SERVICE_CHARGE_VISA) || 2.5,
  mastercard: parseFloat(process.env.SERVICE_CHARGE_MASTER) || 2.2,
  bcmc: parseFloat(process.env.SERVICE_CHARGE_BANCONTACT) || 1.8,
};

//@desc API to Get All Orders and International Reloads for Customer
//@route GET /customer/orders/:userid
//@access private
const getAllOrdersAndInternationalReloadsForCustomer = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized request, invalid token" });
    }

    // Fetch orders and populate the product details
    const ordersPromise = Order.find({ customer: req.user.id })
      .populate("product")
      .sort({ createdAt: -1 });

    const reloadsPromise = InternationalReload.find({
      customer: req.user.id,
    }).sort({ createdAt: -1 });

    const [orders, internationalReloads] = await Promise.all([
      ordersPromise,
      reloadsPromise,
    ]);

    if (!orders.length && !internationalReloads.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer." });
    }

    const startOfWeek = moment().startOf("isoWeek");
    const startOfLastWeek = moment().subtract(1, "weeks").startOf("isoWeek");
    const endOfLastWeek = moment().subtract(1, "weeks").endOf("isoWeek");

    const thisWeekOrders = [];
    const lastWeekOrders = [];
    const otherOrders = [];

    // Format orders with product details
    const formattedOrders = orders.map((order) => ({
      type: "ORDER",
      id: order._id,
      product: {
        id: order.product._id,
        name: order.product.name,
        dataAmount: order.product.dataAmount,
        validityPeriod: order.product.validityPeriod,
        specifications: order.product.specifications,
        expense: parseFloat(order.product.expense.toString()),
        vat: parseFloat(order.product.vat.toString()),
        price: parseFloat(order.product.price.toString()),
      },
      quantity: order.quantity,
      paymentReferenceNumber: order.paymentReferenceNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      orderedDate: order.createdAt,
      deliveredToEmail: order.deliveredToEmail,
      subtotal: parseFloat(order.subtotal.toString()),
      vat: parseFloat(order.vat.toString()),
      totalAmount: parseFloat(order.totalAmount.toString()),
    }));

    // Format international reloads
    const formattedReloads = internationalReloads.map((reload) => ({
      type: "INTERNATIONAL_RELOAD",
      id: reload._id,
      orderStatus: reload.orderStatus,
      mobileNumber: reload.mobileNumber,
      subtotal: parseFloat(reload.subtotal.toString()),
      vat: parseFloat(reload.vat.toString()),
      totalAmount: parseFloat(reload.totalAmount.toString()),
      paymentMethod: reload.paymentMethod,
      paymentStatus: reload.paymentStatus,
      orderedDate: reload.createdAt,
    }));

    const allOrders = [...formattedOrders, ...formattedReloads];

    allOrders.forEach((order) => {
      const orderDate = moment(order.orderedDate);

      if (orderDate.isSameOrAfter(startOfWeek)) {
        thisWeekOrders.push(order);
      } else if (
        orderDate.isBetween(startOfLastWeek, endOfLastWeek, null, "[]")
      ) {
        lastWeekOrders.push(order);
      } else {
        otherOrders.push(order);
      }
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      data: {
        thisWeekOrders,
        lastWeekOrders,
        otherOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

//@desc API to Customer Place an Order
//@route POST /customer/orders/:userid
//@access private
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.params;
    const {
      productId,
      quantity,
      paymentMethod,
      deliveredToEmail,
      returnUrl,
      cancelUrl,
    } = req.body;

    if (req.user.email !== userId) {
      return res.status(403).json({ message: "Unauthorized request." });
    }

    if (paymentMethod) {
      if (!isValidPaymentMethod(paymentMethod))
        return res.status(400).json({ error: "Invalid payment method" });
    }

    if (deliveredToEmail) {
      if (!isValidEmail(deliveredToEmail))
        return res
          .status(400)
          .json({ error: "Invalid Delivered To Email Address" });
    }

    const customer = await Customer.findOne({ email: userId }).session(session);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const pricePerUnit = parseFloat(product.price);
    const subtotal = pricePerUnit * quantity;

    const serviceFeePercentage =
      serviceCharges[paymentMethod.toLowerCase()] || 0;
    const serviceFee = (subtotal * serviceFeePercentage) / 100;
    const totalAmount = subtotal + serviceFee;

    const merchantOrderReference = uuidv4();

    let batchIds = await RedeemableCodeBatch.find({
      product: product._id,
      status: "ACTIVE",
    }).select("_id");

    let availableCodes = await RedeemableCode.find({
      product: product._id,
      status: "UNSOLD",
      batch: { $in: batchIds.map((batch) => batch._id) },
    });

    if (availableCodes.length < quantity) {
      return res.status(400).json({
        message: "Not enough unsold codes available.",
      });
    }

    await RedeemableCode.updateMany(
      {
        _id: { $in: availableCodes.map((code) => code._id) },
      },
      {
        $set: { status: "RESERVED", updatedAt: new Date() },
      }
    );

    const newOrder = new Order({
      customer: customer._id,
      product: productId,
      quantity,
      subtotal,
      serviceFee,
      totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: "PENDING",
      deliveredToEmail,
      orderStatus: "PENDING",
      merchantOrderReference,
      redeemCodes: availableCodes,
      updatedBy: customer._id,
    });

    await newOrder.save({ session });

    const paymentData = {
      amount: totalAmount,
      brand: paymentMethod,
      returnUrl,
      cancelUrl,
      webhookUrl: `https://${process.env.CUSTOMER_DOMAIN}/api/cvvbereloadwebhook?orderId=${newOrder._id}&userId=${userId}`,
      description: product.name,
      merchantOrderReference,
      billingEmail: deliveredToEmail,
      currency: "EUR",
      method: "card",
      language: "eng",
    };

    const paymentResponse = await axios.post(
      `${process.env.CCV_API_URL}/payment`,
      paymentData,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CCV_API_KEY}:`
          ).toString("base64")}`,
        },
      }
    );

    const newPayment = new Payment({
      order: newOrder._id,
      reference: paymentResponse.data.reference,
      merchantOrderReference,
      status: paymentResponse.data.status,
      amount: paymentResponse.data.amount,
      method: paymentResponse.data.method,
      brand: paymentResponse.data.brand,
      payUrl: paymentResponse.data.payUrl,
      cancelUrl: paymentResponse.data.cancelUrl,
      returnUrl: paymentResponse.data.returnUrl,
    });

    await newPayment.save({ session });

    newOrder.paymentReference = paymentResponse.data.reference;
    await newOrder.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Order placed successfully.",
      order: {
        id: newOrder._id,
        product: {
          id: product._id,
          name: product.name,
        },
        quantity: newOrder.quantity,
        subtotal: newOrder.subtotal.toString(),
        serviceFee: newOrder.serviceFee.toString(),
        totalAmount: newOrder.totalAmount.toString(),
        // paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus,
        merchantOrderReference: newOrder.merchantOrderReference,
      },
      paymentUrl: paymentResponse.data.payUrl,
    });
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message);

    await session.abortTransaction();
    session.endSession();
    // for (let { batch, codesToTake } of tempBatchesToUpdate) {
    //   batch.unsoldCodes.push(...codesToTake);
    //   batch.processedCodes = batch.soldCodes.filter(
    //     (code) => !codesToTake.includes(code)
    //   );
    //   await batch.save();
    // }
    return res.status(400).json({ message: "Failed to initiate payment" });
  }
};

module.exports = {
  getAllOrdersAndInternationalReloadsForCustomer,
  createOrder,
};
