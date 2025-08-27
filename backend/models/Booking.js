const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  bookingType: {
    type: String,
    enum: ['tour', 'hotel', 'package'],
    required: [true, 'Booking type is required']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  travelers: {
    type: Number,
    required: [true, 'Number of travelers is required'],
    min: [1, 'At least 1 traveler is required']
  },
  guestDetails: {
    adults: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 adult is required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants cannot be negative']
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank_transfer', 'cash'],
    default: 'card'
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  cancellationReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);