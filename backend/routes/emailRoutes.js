const express = require('express');
const router = express.Router();
const {
  sendEmail,
  getEmails,
  updateEmailStatus,
  deleteEmail
} = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');
const { checkActiveStatus } = require('../middleware/adminMiddleware');

// Route công khai
router.post('/', sendEmail);

// Routes yêu cầu quyền admin
router.use(protect);
router.use(checkActiveStatus);

router.get('/', getEmails);
router.put('/:id', updateEmailStatus);
router.delete('/:id', deleteEmail);

module.exports = router;
