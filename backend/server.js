const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
// const userRoutes = require("./routes/userRoutes");
// const emailRoutes = require("./routes/emailRoutes");
const newsRoutes = require("./routes/newsRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
// const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS
app.use(cors());

// Routes
// app.use("/api/users", userRoutes);
// app.use("/api/emails", emailRoutes);
app.use("/api/news", newsRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);

// Admin routes
// app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
