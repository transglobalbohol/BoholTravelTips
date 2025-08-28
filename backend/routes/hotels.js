const express = require('express');
const {
  getHotels,
  getHotel,
  getHotelBySlug,
  searchHotels,
  getHotelsByLocation,
  getHotelsByCategory,
  getHotelLocations,
  getHotelCategories,
  getPopularAmenities,
  getFeaturedHotels,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getHotels)
  .post(protect, authorize('admin', 'partner'), createHotel);

router.get('/search', searchHotels);
router.get('/featured', getFeaturedHotels);
router.get('/locations', getHotelLocations);
router.get('/categories', getHotelCategories);
router.get('/amenities', getPopularAmenities);
router.get('/location/:location', getHotelsByLocation);
router.get('/category/:category', getHotelsByCategory);
router.get('/slug/:slug', getHotelBySlug);

router.route('/:id')
  .get(getHotel)
  .put(protect, authorize('admin', 'partner'), updateHotel)
  .delete(protect, authorize('admin'), deleteHotel);

module.exports = router;
