const mongoose = require('mongoose');
const slugify = require('slugify');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please provide room type'],
    trim: true
  },
  description: {
    type: String,
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
  images: [{
    type: String
  }],
  availability: [{
    type: Date
  }],
  maxOccupancy: {
    type: Number,
    required: [true, 'Please provide maximum occupancy'],
    min: [1, 'Max occupancy must be at least 1']
  },
  available: {
    type: Number,
    required: [true, 'Please provide number of available rooms'],
    min: [0, 'Available rooms cannot be negative']
  }
});

const coordinatesSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
}, { _id: false });

const policiesSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    default: '14:00'
  },
  checkOut: {
    type: String,
    default: '12:00'
  },
  cancellation: {
    type: String,
    default: 'Free cancellation up to 24 hours before check-in'
  },
  children: {
    type: String,
    default: 'Children welcome'
  },
  pets: {
    type: String,
    default: 'Pets not allowed'
  },
  smoking: {
    type: String,
    default: 'Non-smoking property'
  }
}, { _id: false });

const nearbyAttractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide hotel description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
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
  coordinates: coordinatesSchema,
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide price per night'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
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
  policies: policiesSchema,
  nearbyAttractions: [nearbyAttractionSchema],
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
  isFeatured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Budget', 'Mid-range', 'Luxury', 'Resort', 'Boutique'],
    default: 'Mid-range'
  },
  tags: [{
    type: String,
    trim: true
  }],
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

hotelSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  if (this.shortDescription === undefined && this.description) {
    this.shortDescription = this.description.substring(0, 200);
  }
  
  if (this.featured && !this.isFeatured) {
    this.isFeatured = this.featured;
  }
  
  if (!this.policies) {
    this.policies = {
      checkIn: this.checkInTime || '14:00',
      checkOut: this.checkOutTime || '12:00'
    };
  }
  
  next();
});

hotelSchema.index({ name: 'text', description: 'text', location: 'text' });
hotelSchema.index({ location: 1, pricePerNight: 1, rating: -1 });

module.exports = mongoose.model('Hotel', hotelSchema);
