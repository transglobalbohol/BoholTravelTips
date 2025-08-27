const express = require('express');
const {
  createReview,
  getReviews,
  getTourReviews,
  getHotelReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.get('/tour/:tourId', getTourReviews);
router.get('/hotel/:hotelId', getHotelReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;