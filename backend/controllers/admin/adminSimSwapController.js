const SimSwapRequest = require("../../models/Sim_Swap_Request");
const Customer = require("../../models/Customer");
const { isValidSimSwapStatus, isValidDate } = require("../../utils/validators");
const { sendEmail, sendTemplateEmail } = require("../../utils/emailService");

// @desc Get all sim swap requests by admin
// @route GET /api/sim-swap
// @access Private
// @role Admin
// This function is used to get all sim swap requests by admin
// This api support pagination, filtering and searching
// Pagination: page and limit
// Filtering: status, fromDate, toDate
// Status: OPEN, IN_REVIEW, APPROVED, REJECTED
// Date format: YYYY-MM-DD
// Searching: search by oldMobileNumber, newMobileNumber, newSimSerialNumber
// This function returns the sim swap requests, total sim swap requests, current page, total pages
const getAllSimSwapByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body?.pagination || {};
    const { status, fromDate, toDate } = req.body?.filter || {};
    const { search = "" } = req.body || {};
    const filter = {};
    if (status) {
      if (!isValidSimSwapStatus(status)) {
        return res.status(400).json({ error: "Invalid sim swap status" });
      }
      filter.status = status;
    }
    if (fromDate && toDate) {
      if (!isValidDate(fromDate) || !isValidDate(toDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      if (fromDate > toDate) {
        return res
          .status(400)
          .json({ error: "From date cannot be greater than to date" });
      }
      filter.createdAt = { $gte: fromDate, $lte: toDate };
    } else {
      if (fromDate) {
        if (!isValidDate(fromDate)) {
          return res
            .status(400)
            .json({ error: "Invalid date from date format" });
        }
        filter.createdAt = { $gte: fromDate };
      }
      if (toDate) {
        if (!isValidDate(toDate)) {
          return res.status(400).json({ error: "Invalid date to date format" });
        }
        filter.createdAt = { $lte: toDate };
      }
    }
    if (search) {
      filter.$or = [
        { oldMobileNumber: { $regex: search, $options: "i" } },
        { newMobileNumber: { $regex: search, $options: "i" } },
        { newSimSerialNumber: { $regex: search, $options: "i" } },
      ];
    }
    const simSwapRequests = await SimSwapRequest.find(filter)
      .select(
        "_id customer oldMobileNumber newMobileNumber newSimSerialNumber frequentlyDialedMobileNumber reason status createdAt updatedAt"
      )
      .populate("customer", "_id name mobileNumber email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!simSwapRequests || simSwapRequests.length === 0) {
      return res.status(404).json({ error: "No sim swap requests found" });
    }
    const totalSimSwap = await SimSwapRequest.countDocuments(filter);

    return res.status(200).json({
      message: "Sim swap requests found",
      simSwapRequests,
      totalSimSwap,
      currentPage: page,
      totalPages: Math.ceil(totalSimSwap / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Update sim swap status by admin
// @route PATCH /api/sim-swap/update/status
// @access Private
// @role Admin
// This function is used to update sim swap status by admin
// This function requires sim swap id and status
// Status: OPEN, IN_REVIEW, APPROVED, REJECTED
// Sim swap status automatically updated to REJECTED if new mobile number already exists and send email to customer
// Send email to customer for sim swap status update if status is APPROVED or REJECTED
// This function returns the updated sim swap request
const updateSimSwapStatus = async (req, res) => {
  try {
    const { simSwapId, status } = req.body;
    if (!simSwapId || !status) {
      return res.status(400).json({ error: "Sim swap id and status required" });
    }
    if (!isValidSimSwapStatus(status)) {
      return res.status(400).json({ error: "Invalid sim swap status" });
    }
    const simSwapRequest = await SimSwapRequest.findById(simSwapId);
    if (!simSwapRequest) {
      return res.status(404).json({ error: "Sim swap request not found" });
    }
    if (simSwapRequest.status === status) {
      return res.status(400).json({ error: "Sim swap status already updated" });
    }
    // FInd customer of sim swap request
    const customer = await Customer.findById(simSwapRequest.customer);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Check if new mobile number already exists
    const newMobileNumber = simSwapRequest.newMobileNumber;
    const customerExist = await Customer.findOne({
      mobileNumber: newMobileNumber,
    });
    // Add mail functionality
    if (customerExist && simSwapRequest.status !== "REJECTED") {
      simSwapRequest.status = "REJECTED";
      try {
        await sendEmail(
          customer.email,
          "Sim Swap Request Rejected",
          `Sim swap request rejected as new mobile number already exists`
        );
        const updatedSimSwapRequest = await simSwapRequest.save();
        return res.status(200).json({
          message: `Sim swap request rejected as new mobile number ${newMobileNumber} already exists`,
          simSwapRequest: updatedSimSwapRequest,
        });
      } catch (error) {
        if (error.name === "Failed to send email") {
          return res
            .status(500)
            .json({ error: "Failed to send email and update sim swap status" });
        }
        return res
          .status(500)
          .json({ error: `Server error: ${error.message}` });
      }
    }

    if (status === "APPROVED") {
      try {
        await sendEmail(
          customer.email,
          "Sim Swap Request Approved",
          `Sim swap request approved for new mobile number ${newMobileNumber}`
        );
        simSwapRequest.status = "APPROVED";
        const updatedSimSwapRequest = await simSwapRequest.save();
        return res.status(200).json({
          message: "Sim swap request approved",
          simSwapRequest: updatedSimSwapRequest,
        });
      } catch (error) {
        if (error.name === "Failed to send email") {
          return res
            .status(500)
            .json({ error: "Failed to send email and update sim swap status" });
        }
        return res
          .status(500)
          .json({ error: `Server error: ${error.message}` });
      }
    }

    if (status === "REJECTED") {
      try {
        await sendEmail(
          customer.email,
          "Sim Swap Request Rejected",
          `Sim swap request rejected for new mobile number ${newMobileNumber}`
        );
        simSwapRequest.status = "REJECTED";
        const updatedSimSwapRequest = await simSwapRequest.save();
        return res.status(200).json({
          message: "Sim swap request rejected",
          simSwapRequest: updatedSimSwapRequest,
        });
      } catch (error) {
        if (error.name === "Failed to send email") {
          return res
            .status(500)
            .json({ error: "Failed to send email and update sim swap status" });
        }
        return res
          .status(500)
          .json({ error: `Server error: ${error.message}` });
      }
    }

    simSwapRequest.status = status;
    const updatedSimSwapRequest = await simSwapRequest.save();
    return res.status(200).json({
      message: "Sim swap status updated",
      simSwapRequest: updatedSimSwapRequest,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Sim swap request id is invalid" });
    }
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Get all sim swap requests by admin
// @route GET /api/sim-swap
// @access Private
// @role Admin
// This function is used to get all sim swap requests by admin
// This api support filtering and searching
// Filtering: status, fromDate, toDate
// Status: OPEN, IN_REVIEW, APPROVED, REJECTED
// Date format: YYYY-MM-DD
// Searching: search by oldMobileNumber, newMobileNumber, newSimSerialNumber
// This function returns the sim swap requests, total sim swap requests
// This function only send the data not a csv file
const exportAllSimSwap = async (req, res) => {
  try {
    const { status, fromDate, toDate } = req.body?.filter || {};
    const { search = "" } = req.body || {};
    const filter = {};
    if (status) {
      if (!isValidSimSwapStatus(status)) {
        return res.status(400).json({ error: "Invalid sim swap status" });
      }
      filter.status = status;
    }
    if (fromDate && toDate) {
      if (!isValidDate(fromDate) || !isValidDate(toDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      if (fromDate > toDate) {
        return res
          .status(400)
          .json({ error: "From date cannot be greater than to date" });
      }
      filter.createdAt = { $gte: fromDate, $lte: toDate };
    } else {
      if (fromDate) {
        if (!isValidDate(fromDate)) {
          return res
            .status(400)
            .json({ error: "Invalid date from date format" });
        }
        filter.createdAt = { $gte: fromDate };
      }
      if (toDate) {
        if (!isValidDate(toDate)) {
          return res.status(400).json({ error: "Invalid date to date format" });
        }
        filter.createdAt = { $lte: toDate };
      }
    }
    if (search) {
      filter.$or = [
        { oldMobileNumber: { $regex: search, $options: "i" } },
        { newMobileNumber: { $regex: search, $options: "i" } },
        { newSimSerialNumber: { $regex: search, $options: "i" } },
      ];
    }
    const simSwapRequests = await SimSwapRequest.find(filter)
      .select(
        "_id customer oldMobileNumber newMobileNumber newSimSerialNumber frequentlyDialedMobileNumber reason status createdAt updatedAt"
      )
      .populate("customer", "_id name mobileNumber email")
      .sort({ createdAt: -1 });

    if (!simSwapRequests || simSwapRequests.length === 0) {
      return res.status(404).json({ error: "No sim swap requests found" });
    }
    const totalSimSwap = await SimSwapRequest.countDocuments(filter);

    return res.status(200).json({
      message: "Sim swap requests found",
      simSwapRequests,
      totalSimSwap,
    });
  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

module.exports = {
  getAllSimSwapByAdmin,
  updateSimSwapStatus,
  exportAllSimSwap,
};
