const Review = require('../models/Review');
const Tour = require('../models/Tour');
const Hotel = require('../models/Hotel');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { tourId, hotelId, rating, title, comment } = req.body;

    if (!tourId && !hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify either tourId or hotelId'
      });
    }

    // Check if tour or hotel exists
    if (tourId) {
      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }
    }

    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }
    }

    const reviewData = {
      userId: req.user.id,
      rating,
      title,
      comment
    };

    if (tourId) reviewData.tourId = tourId;
    if (hotelId) reviewData.hotelId = hotelId;

    const review = await Review.create(reviewData);

    // Update tour/hotel rating
    if (tourId) {
      await updateTourRating(tourId);
    }
    if (hotelId) {
      await updateHotelRating(hotelId);
    }

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name profileImage')
      .populate('tourId', 'title')
      .populate('hotelId', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};

// @desc    Get tour reviews
// @route   GET /api/reviews/tour/:tourId
// @access  Public
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate('userId', 'name profileImage')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get tour reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tour reviews'
    });
  }
};

// @desc    Get hotel reviews
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
const getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId })
      .populate('userId', 'name profileImage')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get hotel reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel reviews'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('userId', 'name profileImage');

    // Update tour/hotel rating
    if (review.tourId) {
      await updateTourRating(review.tourId);
    }
    if (review.hotelId) {
      await updateHotelRating(review.hotelId);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner or admin
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update tour/hotel rating
    if (review.tourId) {
      await updateTourRating(review.tourId);
    }
    if (review.hotelId) {
      await updateHotelRating(review.hotelId);
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review'
    });
  }
};

// Helper function to update tour rating
const updateTourRating = async (tourId) => {
  const reviews = await Review.find({ tourId });
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Tour.findByIdAndUpdate(tourId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

// Helper function to update hotel rating
const updateHotelRating = async (hotelId) => {
  const reviews = await Review.find({ hotelId });
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getTourReviews,
  getHotelReviews,
  updateReview,
  deleteReview
};