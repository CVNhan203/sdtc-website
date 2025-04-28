// const nodemailer = require("nodemailer");
// const asyncHandler = require("express-async-handler");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER || "hotansanh0304@gmail.com",
//     pass: process.env.EMAIL_PASS || "rlop szhs itxb mvmm",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // Thêm hàm kiểm tra kết nối
// const verifyConnection = async () => {
//   try {
//     await transporter.verify();
//     console.log("Email service is ready");
//     return true;
//   } catch (error) {
//     console.error("Email service error:", error);
//     return false;
//   }
// };
