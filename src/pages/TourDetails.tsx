import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tour } from '../types';

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
      // Replace with actual API call
      setTimeout(() => {
        setTour(mockTour);
        setLoading(false);
      }, 1000);
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              </div>
              <div>
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist.</p>
          <Link to="/tours" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    // Handle booking logic
    console.log('Booking tour:', tour._id, 'Date:', selectedDate, 'Travelers:', travelers);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/tours" className="text-blue-600 hover:text-blue-700">Tours</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-3">
            <img
              src={tour.images[activeImageIndex]}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            {tour.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-full h-20 rounded-lg overflow-hidden ${
                  activeImageIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${tour.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {tour.category.name}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Max {tour.maxGroupSize} people</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tour.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {tour.rating} ({tour.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tour.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₱{tour.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-blue-600">
                      ₱{tour.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">per person</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                {tour.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Not Included</h3>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Itinerary</h3>
                <div className="space-y-4">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <span className="text-sm font-medium text-blue-600">{item.time}</span>
                          {item.duration && (
                            <span className="text-sm text-gray-500">({item.duration})</span>
                          )}
                        </div>
                        <p className="text-gray-700">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              {tour.importantNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Important Notes</h4>
                  <p className="text-gray-700 text-sm">{tour.importantNotes}</p>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h4>
                <p className="text-gray-700 text-sm">{tour.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Tour</h3>
              
              {/* Price Display */}
              <div className="text-center mb-6">
                {tour.originalPrice && (
                  <div className="text-sm text-gray-500 line-through mb-1">
                    ₱{tour.originalPrice.toLocaleString()}
                  </div>
                )}
                <div className="text-3xl font-bold text-blue-600">
                  ₱{tour.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per person</div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: tour.maxGroupSize - tour.minGroupSize + 1 }, (_, i) => (
                      <option key={i} value={tour.minGroupSize + i}>
                        {tour.minGroupSize + i} {tour.minGroupSize + i === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Price */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold">₱{(tour.price * travelers).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₱{(tour.price * travelers).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Book Now
                </button>

                <button className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200">
                  Add to Wishlist
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600 mb-2">Need help with booking?</p>
                <p className="text-blue-600 font-semibold">+63 123 456 7890</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;