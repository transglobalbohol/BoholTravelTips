const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

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

    // Make sure user can only access their own bookings
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these bookings'
      });
    }

    const bookings = await Booking.find({ userId })
      .populate('tourId', 'title price images location')
      .populate('hotelId', 'name pricePerNight images location')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
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

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking
};