const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const port = process.env.port || 5000;

connectDb();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Customer routes
app.use("/authentication", require("./routes/authRoutes"));
app.use("/customer", require("./routes/customerRoutes"));
app.use("/customer", require("./routes/simSwapRequestRoutes"));
app.use("/customer", require("./routes/productRoutes"));
app.use("/customer/orders", require("./routes/orderRoutes"));
// app.use("/api/payment/webhook", require("./routes/webHookRoutes"));

// Admin routes
app.use("/api/", require("./routes/admin/adminAuthRoutes"));
app.use("/api/dashboard", require("./routes/admin/adminDashboardRoutes"));
app.use("/api/orders", require("./routes/admin/adminOrderRoutes"));
app.use("/api/brands", require("./routes/admin/adminBrandRoutes"));
app.use("/api/customers", require("./routes/admin/adminCustomerRoutes"));
app.use("/api/products", require("./routes/admin/adminProductRoutes"));
app.use("/api/banners", require("./routes/admin/adminBannerRoutes"));
app.use("/api/simSwap", require("./routes/admin/adminSimSwapRoutes"));
app.use("/api/inventory", require("./routes/admin/adminInventoryRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
