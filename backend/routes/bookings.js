const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All booking routes are protected

router.route('/')
  .post(createBooking);

router.get('/user/:userId', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(cancelBooking);

module.exports = router;