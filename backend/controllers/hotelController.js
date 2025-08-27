const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      rating,
      amenities,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (location) query.location = { $regex: location, $options: 'i' };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenityArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const hotels = await Hotel.find(query)
      .populate('partnerId', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Hotel.countDocuments(query);

    res.json({
      success: true,
      count: hotels.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotels'
    });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('partnerId', 'name email phone')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name profileImage'
        }
      });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching hotel'
    });
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Admin/Partner)
const createHotel = async (req, res) => {
  try {
    req.body.partnerId = req.user.id;

    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating hotel',
      error: error.message
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Admin/Partner)
const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Make sure user is hotel owner or admin
    if (hotel.partnerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating hotel',
      error: error.message
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Admin)
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting hotel'
    });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
const getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ featured: true, isActive: true })
      .populate('partnerId', 'name')
      .limit(6)
      .sort('-rating');

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get featured hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured hotels'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getFeaturedHotels
};