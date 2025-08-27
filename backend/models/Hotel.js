const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please provide room type'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide room capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Please provide room price'],
    min: [0, 'Price cannot be negative']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  available: {
    type: Number,
    required: [true, 'Please provide number of available rooms'],
    min: [0, 'Available rooms cannot be negative']
  }
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide hotel description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide hotel location'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide hotel address'],
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide price per night'],
    min: [0, 'Price cannot be negative']
  },
  amenities: [{
    type: String,
    required: true,
    trim: true
  }],
  rooms: [roomSchema],
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  availability: [{
    date: {
      type: Date,
      required: true
    },
    availableRooms: {
      type: Number,
      required: true,
      min: [0, 'Available rooms cannot be negative']
    }
  }],
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '12:00'
  }
}, {
  timestamps: true
});

// Index for search functionality
hotelSchema.index({ name: 'text', description: 'text', location: 'text' });
hotelSchema.index({ location: 1, pricePerNight: 1, rating: -1 });

module.exports = mongoose.model('Hotel', hotelSchema);