const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getFeaturedTours
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getTours)
  .post(protect, authorize('admin', 'partner'), createTour);

router.get('/featured', getFeaturedTours);

router.route('/:id')
  .get(getTour)
  .put(protect, authorize('admin', 'partner'), updateTour)
  .delete(protect, authorize('admin'), deleteTour);

module.exports = router;