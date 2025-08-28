import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tour } from '../types';
import { MapPin, Clock, Users, Star, Check, X, Calendar, Heart, Phone } from 'lucide-react';

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);

  // Mock tour data - replace with API call
  const mockTour: Tour = {
    _id: '1',
    title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
    slug: 'chocolate-hills-tarsier-day-tour',
    description: `Embark on an unforgettable journey to Bohol's most iconic attractions! This comprehensive day tour takes you to the world-famous Chocolate Hills, where over 1,268 cone-shaped hills create a breathtaking landscape that looks like chocolate kisses scattered across the countryside.

    Visit the Philippine Tarsier Sanctuary in Corella, home to the world's smallest primate. These adorable nocturnal creatures are endemic to the Philippines and are best observed in their natural habitat. Our expert guides will ensure you learn about conservation efforts while respecting these fragile animals.

    The tour includes comfortable transportation, professional guide services, entrance fees, and a delicious Filipino lunch at a local restaurant. Perfect for nature lovers, photographers, and families looking to experience the best of Bohol in one day.`,
    shortDescription: 'Famous geological formations and world\'s smallest primates',
    category: { _id: '1', name: 'Nature & Wildlife', slug: 'nature-wildlife', description: '' },
    price: 2500,
    originalPrice: 3000,
    duration: '8 hours',
    location: 'Carmen, Bohol',
    images: [
      'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    inclusions: [
      'Round-trip transportation from Tagbilaran City',
      'Professional English-speaking guide',
      'Entrance fees to Chocolate Hills and Tarsier Sanctuary',
      'Traditional Filipino lunch',
      'Bottled water',
      'Travel insurance'
    ],
    exclusions: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Additional food and drinks',
      'Hotel pick-up outside Tagbilaran City'
    ],
    itinerary: [
      {
        time: '7:00 AM',
        title: 'Hotel Pick-up',
        description: 'Pick-up from your hotel in Tagbilaran City or meeting point at the port',
      },
      {
        time: '8:30 AM',
        title: 'Tarsier Sanctuary Visit',
        description: 'Observe the world\'s smallest primates in their natural habitat and learn about conservation efforts',
        duration: '1.5 hours'
      },
      {
        time: '10:30 AM',
        title: 'Travel to Chocolate Hills',
        description: 'Scenic drive through Bohol countryside to Carmen municipality',
        duration: '1.5 hours'
      },
      {
        time: '12:00 PM',
        title: 'Chocolate Hills Viewing',
        description: 'Climb to the viewing deck and enjoy panoramic views of the iconic hills',
        duration: '1 hour'
      },
      {
        time: '1:00 PM',
        title: 'Lunch Break',
        description: 'Traditional Filipino lunch at a local restaurant with scenic views',
        duration: '1 hour'
      },
      {
        time: '3:00 PM',
        title: 'Return Journey',
        description: 'Comfortable return trip to Tagbilaran City with photo stops',
        duration: '1.5 hours'
      },
      {
        time: '4:30 PM',
        title: 'Tour End',
        description: 'Drop-off at your hotel or preferred location in the city',
      }
    ],
    availability: [new Date()],
    maxGroupSize: 15,
    minGroupSize: 2,
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 324,
    reviews: [],
    partnerId: 'partner1',
    partner: {} as any,
    isActive: true,
    isFeatured: true,
    tags: ['chocolate hills', 'tarsier', 'nature', 'full day'],
    cancellationPolicy: 'Free cancellation up to 24 hours before the tour starts. 50% refund for cancellations within 24 hours. No refund for no-shows.',
    importantNotes: 'Please wear comfortable walking shoes and bring sunscreen. Feeding or touching tarsiers is strictly prohibited. Tour may be cancelled due to weather conditions.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate API call
    const fetchTour = async () => {
      setLoading(true);
      // Instant loading for better UX
      setTimeout(() => {
        setTour(mockTour);
        setLoading(false);
      }, 100);
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              </div>
              <div>
                <div className="bg-gray-200 rounded-xl h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-heading-2 mb-4">Tour Not Found</h2>
          <p className="text-body mb-6">The tour you're looking for doesn't exist.</p>
          <Link to="/tours" className="btn-primary">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    console.log('Booking tour:', tour._id, 'Date:', selectedDate, 'Travelers:', travelers);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-small">
            <Link to="/" className="modern-link">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/tours" className="modern-link">Tours</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3">
            <img
              src={tour.images[activeImageIndex]}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-xl"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            {tour.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-full h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                  activeImageIndex === index ? 'ring-2 ring-gray-900' : 'hover:ring-1 hover:ring-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${tour.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-8 mb-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="badge badge-primary text-sm mb-3">
                    {tour.category.name}
                  </span>
                  <h1 className="text-heading-1 text-3xl mb-4">{tour.title}</h1>
                  <div className="flex items-center space-x-6 text-small text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Max {tour.maxGroupSize} people</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(tour.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-small text-gray-600">
                      {tour.rating} ({tour.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    {tour.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₱{tour.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-gray-900">
                      ₱{tour.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">per person</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                {tour.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-body leading-relaxed mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-heading-3 text-lg mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {tour.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-heading-3 text-lg mb-4">What's Not Included</h3>
                  <ul className="space-y-3">
                    {tour.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h3 className="text-heading-3 text-lg mb-6">Tour Itinerary</h3>
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <span className="text-small font-medium text-gray-900">{item.time}</span>
                          {item.duration && (
                            <span className="text-small text-gray-500">({item.duration})</span>
                          )}
                        </div>
                        <p className="text-body">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              {tour.importantNotes && (
                <div className="card bg-yellow-50 border-yellow-200 p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Important Notes</h4>
                  <p className="text-body text-yellow-800">{tour.importantNotes}</p>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="card bg-gray-50 p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h4>
                <p className="text-body">{tour.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-heading-3 text-lg mb-6">Book This Tour</h3>
              
              {/* Price Display */}
              <div className="text-center mb-6">
                {tour.originalPrice && (
                  <div className="text-small text-gray-500 line-through mb-1">
                    ₱{tour.originalPrice.toLocaleString()}
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-900">
                  ₱{tour.price.toLocaleString()}
                </div>
                <div className="text-small text-gray-600">per person</div>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="input"
                  >
                    {Array.from({ length: tour.maxGroupSize - tour.minGroupSize + 1 }, (_, i) => (
                      <option key={i} value={tour.minGroupSize + i}>
                        {tour.minGroupSize + i} {tour.minGroupSize + i === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Price */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body">Subtotal</span>
                    <span className="font-semibold">₱{(tour.price * travelers).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-gray-900">₱{(tour.price * travelers).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="btn-primary w-full"
                >
                  Book Now
                </button>

                <button className="btn-secondary w-full flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-small text-gray-600 mb-2">Need help with booking?</p>
                <div className="flex items-center justify-center space-x-2 text-gray-900 font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>+63 123 456 7890</span>
                </div>
                <p className="text-small text-gray-500 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;