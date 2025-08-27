const Tour = require('../models/Tour');

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      difficulty,
      duration,
      rating,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (duration) query.duration = { $regex: duration, $options: 'i' };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const tours = await Tour.find(query)
      .populate('partnerId', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(query);

    res.json({
      success: true,
      count: tours.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: tours
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tours'
    });
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tour'
    });
  }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private (Admin/Partner)
const createTour = async (req, res) => {
  try {
    req.body.partnerId = req.user.id;

    const tour = await Tour.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating tour',
      error: error.message
    });
  }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private (Admin/Partner)
const updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Make sure user is tour owner or admin
    if (tour.partnerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this tour'
      });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating tour',
      error: error.message
    });
  }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private (Admin)
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    await Tour.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting tour'
    });
  }
};

// @desc    Get featured tours
// @route   GET /api/tours/featured
// @access  Public
const getFeaturedTours = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true, isActive: true })
      .populate('partnerId', 'name')
      .limit(6)
      .sort('-rating');

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured tours'
    });
  }
};

module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getFeaturedTours
};