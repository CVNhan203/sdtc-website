const nodemailer = require("nodemailer");
const Email = require("../models/emailModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL || "hotansanh0304@gmail.com",

    pass: process.env.EMAIL_PASS || "rlop szhs itxb mvmm",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: "Admin SDTC <hotansanh0304@gmail.com>",
    to,
    subject,
    html,
  });
  await Email.create({ to, subject, html });
};

module.exports = sendMail;
