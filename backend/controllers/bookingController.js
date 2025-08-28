const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Get all bookings with filters
// @route   GET /api/bookings
// @access  Private (Admin only)
const getBookings = async (req, res) => {
  try {
    const {
      status,
      bookingType,
      userId,
      dateFrom,
      dateTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Only admin can access all bookings
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    let query = {};
    let sortObj = {};

    if (status && status !== '') {
      query.status = status;
    }

    if (bookingType && bookingType !== '') {
      query.bookingType = bookingType;
    }

    if (userId && userId !== '') {
      query.userId = userId;
    }

    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) query.bookingDate.$gte = new Date(dateFrom);
      if (dateTo) query.bookingDate.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { confirmationCode: { $regex: search, $options: 'i' } },
        { 'contactInfo.firstName': { $regex: search, $options: 'i' } },
        { 'contactInfo.lastName': { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    switch (sortBy) {
      case 'date':
        sortObj.bookingDate = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'price':
        sortObj.totalPrice = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'status':
        sortObj.status = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('tourId', 'title price images location')
      .populate('hotelId', 'name pricePerNight images location')
      .populate('userId', 'name email')
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      tourId,
      hotelId,
      bookingType,
      bookingDate,
      checkInDate,
      checkOutDate,
      travelers,
      guestDetails,
      contactInfo,
      specialRequests
    } = req.body;

    // Validate booking type and required fields
    if (!['tour', 'hotel', 'package'].includes(bookingType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking type'
      });
    }

    let totalPrice = 0;
    let bookingData = {
      userId: req.user.id,
      bookingType,
      bookingDate,
      travelers,
      guestDetails,
      contactInfo,
      specialRequests
    };

    // Handle tour booking
    if (bookingType === 'tour' && tourId) {
      const tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      totalPrice = tour.price * travelers;
      bookingData.tourId = tourId;
    }

    // Handle hotel booking
    if (bookingType === 'hotel' && hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'Check-in and check-out dates are required for hotel bookings'
        });
      }

      const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      totalPrice = hotel.pricePerNight * nights;
      bookingData.hotelId = hotelId;
      bookingData.checkInDate = checkInDate;
      bookingData.checkOutDate = checkOutDate;
    }

    bookingData.totalPrice = totalPrice;

    const booking = await Booking.create(bookingData);

    // Add booking to user's bookings array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookings: booking._id }
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('tourId', 'title price images')
      .populate('hotelId', 'name pricePerNight images')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      status,
      bookingType,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Make sure user can only access their own bookings
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these bookings'
      });
    }

    let query = { userId };
    let sortObj = {};

    if (status && status !== '') {
      query.status = status;
    }

    if (bookingType && bookingType !== '') {
      query.bookingType = bookingType;
    }

    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) query.bookingDate.$gte = new Date(dateFrom);
      if (dateTo) query.bookingDate.$lte = new Date(dateTo);
    }

    switch (sortBy) {
      case 'date':
        sortObj.bookingDate = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'price':
        sortObj.totalPrice = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'status':
        sortObj.status = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('tourId', 'title price images location')
      .populate('hotelId', 'name pricePerNight images location')
      .sort(sortObj)
      .limit(limitNum)
      .skip(skip);

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tourId', 'title description price images location partnerId')
      .populate('hotelId', 'name description pricePerNight images location partnerId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user can only access their own bookings
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user can only update their own bookings
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('tourId', 'title price images')
      .populate('hotelId', 'name pricePerNight images');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user can only cancel their own bookings
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin only)
const getBookingStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { startDate, endDate } = req.query;
    let matchStage = {};

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const stats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averageBookingValue: { $avg: '$totalPrice' },
          tourBookings: {
            $sum: { $cond: [{ $eq: ['$bookingType', 'tour'] }, 1, 0] }
          },
          hotelBookings: {
            $sum: { $cond: [{ $eq: ['$bookingType', 'hotel'] }, 1, 0] }
          },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const monthlyStats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalBookings: 0,
          totalRevenue: 0,
          averageBookingValue: 0,
          tourBookings: 0,
          hotelBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0
        },
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking statistics'
    });
  }
};

module.exports = {
  getBookings,
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getBookingStats
};
