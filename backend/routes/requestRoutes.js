const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  updateStatus,
  getCalendarRequests,
} = require('../controllers/requestController');

// Calendar route (before /:id to avoid conflict)
router.get('/calendar', protect, getCalendarRequests);

// Single correct main route (multer attached)
router.route('/')
  .get(protect, getAllRequests)
  .post(protect, upload.single('image'), createRequest);
  
// Single ID route
router.route('/:id')
  .get(protect, getRequestById)
  .put(protect, upload.single('image'), updateRequest)
  // .put(protect, updateRequest)          // (no image on update unless you add upload.single here)
  .delete(protect, deleteRequest);

// Status update
router.patch('/:id/status', protect, updateStatus);

module.exports = router;