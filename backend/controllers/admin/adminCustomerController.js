const Customer = require("../../models/Customer");
const {
  isValidEmail,
  isValidBelgiumPhoneNumber,
  isValidPhoneNumber,
  isValidCustomerStatus,
} = require("../../utils/validators");

// @desc Get all customers by admin
// @route GET /customers
// @access Private
// Get the all customers by admin using the pagination and search query
// This will support the search by name, email and mobile number
// This will return the customers with the total count of customers
// This will return the total pages and current page
// This will return the customers sorted by createdAt in descending order
// TODO: Handle the invalid page and limit
const getAllCustomersByAdmin = async (req, res) => {
  try {
    const {
      search = "",
      pagination: { page = 1, limit = 10 },
    } = req.body || {};
    if (page < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }
    if (limit < 1) {
      return res.status(400).json({ error: "Invalid limit number" });
    }
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }
    const customers = await Customer.find(filter)
      .select("_id createdAt name email mobileNumber status updatedAt ")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }

    // Get the total count of customers
    const totalCustomers = await Customer.countDocuments(filter);

    return res.status(200).json({
      customers,
      totalCustomers,
      totalPages: Math.ceil(totalCustomers / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Get customers by admin for export
// @route GET /customers/export
// @access Private
// Get the all customers by admin for export
// This will support the search by name, email and mobile number
// This will return the customers with the total count of customers
const getCustomersByAdminForExport = async (req, res) => {
  try {
    const { search = "" } = req.body || {};
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }
    const customers = await Customer.find(filter)
      .select("_id createdAt name email mobileNumber status updatedAt ")
      .sort({ createdAt: -1 });

    if (customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }

    // Get the total count of customers
    const totalCustomers = await Customer.countDocuments(filter);

    return res.status(200).json({
      customers,
      totalCustomers,
    });
  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Update customer by admin
// @route PUT /customers/update
// @access Private
// Customer id  and at least one field is required to update
// This will update the customer name, email, mobile number and status
// This will validate the email and mobile number. mobile number should be valid belgium phone number or international phone number
// This will validate the customer status as ACTIVE or SUSPENDED
// Admin cannot update the detail of deleted customers
const updateCustomerByAdmin = async (req, res) => {
  try {
    adminId = req.user.id;
    const {
      customerId = "",
      name = "",
      email = "",
      mobileNumber = "",
      status = "",
    } = req.body || {};

    if (!adminId)
      return res.status(400).json({ error: "Admin not authorized" });
    if (!customerId)
      return res.status(400).json({ error: "Customer ID is required" });
    if (!name && !email && !mobileNumber && !status)
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });

    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (customer.status === "DELETED")
      return res
        .status(400)
        .json({ error: "Customer is deleted! Cannot update" });
    if (name) {
      if (customer.name === name)
        return res.status(400).json({ error: "Name is already updated" });
      customer.name = name;
    }
    if (email) {
      if (!isValidEmail(email))
        return res.status(400).json({ error: "Invalid email address" });
      if (customer.email === email)
        return res.status(400).json({ error: "Email is already updated" });
      customer.email = email;
    }
    if (mobileNumber) {
      if (
        !isValidBelgiumPhoneNumber(mobileNumber) ||
        !isValidPhoneNumber(mobileNumber)
      )
        return res.status(400).json({ error: "Invalid mobile number" });
      if (customer.mobileNumber === mobileNumber)
        return res
          .status(400)
          .json({ error: "Mobile number is already updated" });
      customer.mobileNumber = mobile;
    }

    if (status) {
      if (!isValidCustomerStatus(status))
        return res.status(400).json({ error: "Invalid customer status" });
      if (customer.status === status)
        return res.status(400).json({ error: "Status is already updated" });
      customer.status = status;
    }
    customer.updatedBy = adminId;
    await customer.save();
    return res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Customer id is invalid" });
    }
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Update customer status by admin
// @route PATCH /customers/update/status
// @access Private
// Customer id and status is required to update the customer status
// This will validate the customer status as ACTIVE or SUSPENDED
// Status should be different from the current status
// Admin cannot update the status of the deleted customer
const updateCustomerStatusByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { customerId = "", status = "" } = req.body || {};
    if (!adminId)
      return res.status(400).json({ error: "Admin not authorized" });
    if (!customerId)
      return res.status(400).json({ error: "Customer ID is required" });
    if (!status) return res.status(400).json({ error: "Status is required" });
    if (!isValidCustomerStatus(status))
      return res.status(400).json({ error: "Invalid customer status" });
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (customer.status === "DELETED")
      return res
        .status(400)
        .json({ error: "Customer is deleted! Cannot update" });
    // It will avoid the update continuously with the same status
    if (customer.status === status)
      return res.status(400).json({ error: "Status is already updated" });
    customer.status = status;
    customer.updatedBy = adminId;
    await customer.save();
    return res
      .status(200)
      .json({ message: "Customer status updated successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Customer id is invalid" });
    }
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

// @desc Delete customer by admin
// @route DELETE /customers/delete
// @access Private
// Customer id is required to delete the customer
// Admin cannot delete the already deleted customer
// Admin cannot delete the customer without the customer id
// Admin cannot delete the customer without the authorization
const deleteCustomerByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { customerId = "" } = req.body || {};
    if (!adminId)
      return res.status(400).json({ error: "Admin not authorized" });
    if (!customerId)
      return res.status(400).json({ error: "Customer ID is required" });
    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (customer.status === "DELETED")
      return res.status(400).json({ error: "Customer is already deleted" });
    customer.status = "DELETED";
    customer.deletedBy = adminId;
    await customer.save();
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Customer id is invalid" });
    }
    return res.status(500).json({ error: `Server error: ${error}` });
  }
};

module.exports = {
  getAllCustomersByAdmin,
  getCustomersByAdminForExport,
  updateCustomerByAdmin,
  updateCustomerStatusByAdmin,
  deleteCustomerByAdmin,
};
