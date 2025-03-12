const moment = require("moment");
const SimSwapRequest = require("../../models/Sim_Swap_Request");
const {
  isValidPhoneNumber,
  isValidBelgiumPhoneNumber,
} = require("../../utils/validators");

//@desc API to Create Sim Swap Request By Customer
//@route POST /sim-swap-requests
//@access private
const createSimSwapRequest = async (req, res) => {
  try {
    const {
      userId,
      oldMobileNumber,
      newMobileNumber,
      newSimSerialNumber,
      frequentlyDialedMobileNumber,
      reason,
    } = req.body;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized request, invalid token" });
    }

    if (!oldMobileNumber || !newMobileNumber || !frequentlyDialedMobileNumber) {
      return res
        .status(400)
        .json({ message: "All mobile numbers are required" });
    }

    if (!reason) {
      return res
        .status(400)
        .json({ message: "Reason for Sim Swap is required" });
    }

    if (!isValidBelgiumPhoneNumber(oldMobileNumber)) {
      return res.status(400).json({
        message: "Invalid Belgium Old Mobile Number (Must start with +32)",
      });
    }

    if (!isValidBelgiumPhoneNumber(newMobileNumber)) {
      return res.status(400).json({
        message: "Invalid Belgium New Mobile Number (Must start with +32)",
      });
    }

    if (!isValidPhoneNumber(frequentlyDialedMobileNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid Frequently Dialed Mobile Number" });
    }

    const existingRequest = await SimSwapRequest.findOne({
      customer: req.user.id,
      status: { $in: ["OPEN", "IN_REVIEW"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A pending SIM swap request already exists for this customer",
      });
    }

    const newRequest = await SimSwapRequest.create({
      customer: req.user.id,
      oldMobileNumber,
      newMobileNumber,
      newSimSerialNumber,
      frequentlyDialedMobileNumber,
      reason,
      status: "OPEN",
    });

    res.status(201).json({
      message: "SIM Swap Request Created Successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating SIM Swap Request:", error);
    res.status(500).json({ message: "Failed to create SIM swap request" });
  }
};

//@desc API to Get All Sim Swap Requests By Customer
//@route GET /sim-swap-requests/:userId
//@access private
const getSimSwapRequestsByCustomer = async (req, res) => {
  try {
    const { userId } = req.query;

    if (req.user.email !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized request, invalid token" });
    }
    const simSwapRequests = await SimSwapRequest.find({
      customer: req.user.id,
    }).sort({ createdAt: -1 });

    const startOfWeek = moment().startOf("isoWeek");
    const startOfLastMonth = moment().subtract(1, "months").startOf("month");
    const endOfLastMonth = moment().subtract(1, "months").endOf("month");

    const thisWeekRequests = [];
    const lastMonthRequests = [];
    const previousRequests = [];

    simSwapRequests.forEach((request) => {
      const requestDate = moment(request.createdAt);

      const requestData = {
        id: request._id,
        oldMobileNumber: request.oldMobileNumber,
        newMobileNumber: request.newMobileNumber,
        newSimSerialNumber: request.newSimSerialNumber,
        frequentlyDialedMobileNumber: request.frequentlyDialedMobileNumber,
        reason: request.reason,
        status: request.status,
        createdAt: request.createdAt,
      };

      if (requestDate.isSameOrAfter(startOfWeek)) {
        thisWeekRequests.push(requestData);
      } else if (
        requestDate.isBetween(startOfLastMonth, endOfLastMonth, null, "[]")
      ) {
        lastMonthRequests.push(requestData);
      } else {
        previousRequests.push(requestData);
      }
    });

    return res.status(200).json({
      message: "SIM Swap Requests Retrieved Successfully",
      data: {
        thisWeekRequests,
        lastMonthRequests,
        previousRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching SIM Swap Requests:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve SIM swap requests" });
  }
};

module.exports = {
  createSimSwapRequest,
  getSimSwapRequestsByCustomer,
};
