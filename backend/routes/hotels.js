const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getFeaturedHotels
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getHotels)
  .post(protect, authorize('admin', 'partner'), createHotel);

router.get('/featured', getFeaturedHotels);

router.route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'partner'), updateHotel)
  .delete(protect, authorize('admin'), deleteHotel);

module.exports = router;