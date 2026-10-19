// const express = require('express');
// const router = express.Router();
// const { register, login, getMe } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);

// module.exports = router;

const express = require('express');
const router = express.Router();

const { register, createUser, login, getMe, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// List users (Admin/Manager only)
router.get('/users', protect, authorize('Admin', 'Manager'), getAllUsers);

// Admin creates a user (User, Manager, Technician)
router.post('/create-user', protect, authorize('Admin'), createUser);

module.exports = router;