const express = require('express');
const {
  getTours,
  getTour,
  getTourBySlug,
  searchTours,
  getToursByCategory,
  getToursByDestination,
  getCategories,
  getDestinations,
  getFeaturedTours,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getTours)
  .post(protect, authorize('admin', 'partner'), createTour);

router.get('/search', searchTours);
router.get('/featured', getFeaturedTours);
router.get('/categories', getCategories);
router.get('/destinations', getDestinations);
router.get('/category/:category', getToursByCategory);
router.get('/destination/:destination', getToursByDestination);
router.get('/slug/:slug', getTourBySlug);

router.route('/:id')
  .get(getTour)
  .put(protect, authorize('admin', 'partner'), updateTour)
  .delete(protect, authorize('admin'), deleteTour);

module.exports = router;
