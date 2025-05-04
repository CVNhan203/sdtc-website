const express = require('express');
const router = express.Router();
const sendMail = require('../controllers/emailController');

router.post('/send', async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await sendMail(to, subject, html);
    res.json({ success: true, message: 'Đã gửi email!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
