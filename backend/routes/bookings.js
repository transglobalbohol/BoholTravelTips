const express = require('express');
const {
  getBookings,
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All booking routes are protected

router.route('/')
  .get(authorize('admin'), getBookings)
  .post(createBooking);

router.get('/stats', authorize('admin'), getBookingStats);
router.get('/user/:userId', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(cancelBooking);

module.exports = router;
