const mongoose = require('mongoose');
const slugify = require('slugify');

const itinerarySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a tour title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a tour description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a tour category'],
    enum: [
      'Adventure',
      'Cultural',
      'Nature',
      'Beach',
      'Historical',
      'Food & Dining',
      'Wildlife',
      'Island Hopping',
      'Water Sports',
      'Photography',
      'Nature & Wildlife',
      'Beach & Water Sports',
      'Cultural & Heritage',
      'Day Trips'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please provide a tour price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Please provide tour duration'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide tour location'],
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  inclusions: [{
    type: String,
    required: true
  }],
  exclusions: [{
    type: String
  }],
  itinerary: [itinerarySchema],
  availability: [{
    type: Date
  }],
  maxGroupSize: {
    type: Number,
    required: [true, 'Please provide maximum group size'],
    min: [1, 'Group size must be at least 1']
  },
  minGroupSize: {
    type: Number,
    default: 1,
    min: [1, 'Group size must be at least 1']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
    default: 'Easy'
  },
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
  tags: [{
    type: String,
    trim: true
  }],
  cancellationPolicy: {
    type: String,
    default: 'Free cancellation up to 24 hours before the tour'
  },
  importantNotes: {
    type: String
  }
}, {
  timestamps: true
});

tourSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  if (this.shortDescription === undefined && this.description) {
    this.shortDescription = this.description.substring(0, 200);
  }
  
  if (this.featured && !this.isFeatured) {
    this.isFeatured = this.featured;
  }
  
  next();
});

tourSchema.index({ title: 'text', description: 'text', location: 'text' });
tourSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model('Tour', tourSchema);
