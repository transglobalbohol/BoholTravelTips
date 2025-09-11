import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tour } from '../types';
import { MapPin, Clock, Users, Star, Check, X, Calendar, Heart, Phone } from 'lucide-react';
import { tourService } from '../services/tourService';

const getTourDisplayName = (tourId: string): string => {
  const idMapping: { [key: string]: string } = {
    '1': 'Tour 1',
    '2': 'Tour 2',
    '3': 'Tour 3',
    '4': 'Tour 4',
    '5': 'Tour 5',
    '6': 'Tour 6',
    '7': 'Tour 7'
  };

  return idMapping[tourId] || `Tour ${tourId}`;
};

const getTourSpecificContent = (tourId: string) => {
  // Direct route-based tour content mapping
  switch(tourId) {
    case '1':
      return {
        tourType: 'Tour 1',
        highlights: 'Dauis Church, Baclayon Church, Floating Restaurant, Tarsier Sanctuary, Man Made Forest, Chocolate Hills, Pasalubong Shopping',
        inclusions: [
          'Professional guide service',
          'Air-conditioned transportation',
          'All entrance fees and tickets',
          'Bottled water',
          'Visit to Dauis Church',
          'Visit to Baclayon Church', 
          'Floating Restaurant dining experience',
          'Tarsier Sanctuary visit',
          'Man Made Forest tour',
          'Chocolate Hills viewing',
          'Pasalubong shopping at Aproniana Gift Shop'
        ],
        duration: 'Full day (10 hours)',
        location: 'Bohol Countryside'
      };

    case '2':
      return {
        tourType: 'Tour 2',
        highlights: 'Whale shark encounter',
        inclusions: [
          'Private transportation',
          'Ferry ticket',
          'All entrance fees',
          'Bottled water',
          'Professional guide service',
          'Whale shark encounter experience',
          'Safety briefing and equipment'
        ],
        duration: 'Full day (7-8 hours)',
        location: 'Oslob, Cebu'
      };

    case '3':
      return {
        tourType: 'Tour 3',
        highlights: 'Dolphin playground, Balicasag Island/Marine Sanctuary',
        inclusions: [
          'Private transportation',
          'Boat transfers',
          'All entrance fees',
          'Marine sanctuary fees',
          'Snorkeling equipment',
          'Professional guide service',
          'Bottled water',
          'Dolphin watching experience'
        ],
        duration: 'Maximum 8 hours',
        location: 'Panglao Island, Bohol'
      };

    case '4':
      return {
        tourType: 'Tour 4',
        highlights: 'Alicia panoramic park',
        inclusions: [
          'Private transportation',
          'All entrance fees',
          'Bottled water',
          'Professional guide service',
          'Panoramic viewing experience',
          'Photo opportunities at scenic viewpoints'
        ],
        duration: 'Maximum 12 hours',
        location: 'Alicia, Bohol'
      };

    case '5':
      return {
        tourType: 'Tour 5',
        highlights: 'Can Umantad Falls, Cadapdapan Rice Terraces, Quinale Beach, Cabugnaw Cave',
        inclusions: [
          'Private transportation',
          'All entrance fees',
          'Lunch included',
          'Bottled water',
          'Professional tour guide',
          'Motorcycle ride to Can Umantad Falls',
          'Cave exploration equipment'
        ],
        duration: 'Maximum 8 hours',
        location: 'Candijay & Surrounding Areas, Bohol'
      };

    case '6':
      return {
        tourType: 'Tour 6',
        highlights: 'Tarsier sanctuary, Loboc river cruise, Loboc church, village tour',
        inclusions: [
          'Private transportation',
          'All entrance fees',
          'Lunch included',
          'Bottled water',
          'Professional tour guide',
          'River cruise experience',
          'Tarsier sanctuary admission'
        ],
        duration: 'Full day experience',
        location: 'Loboc & Corella, Bohol'
      };

    case '7':
      return {
        tourType: 'Tour 7',
        highlights: 'Tarsier sanctuary, Lasang farm cacao talk, forest trail hiking, tree rope climbing',
        inclusions: [
          'Private transportation',
          'All entrance fees',
          'Bottled water',
          'DOT accredited tour guide',
          'Pickup at 08:00 AM',
          'Lasang farm cacao talk experience',
          'Tablea making traditional method',
          'Chocolate drink preparations',
          'Forest trail hiking equipment',
          'Tree rope climbing safety gear'
        ],
        duration: 'Maximum 8 hours',
        location: 'Corella & Bilar, Bohol'
      };

    default:
      return null;
  }
};

const getLocalTourImages = (tourId: string): string[] => {
  // Direct route-based image mapping
  switch(tourId) {
    case '1':
      return [
        '/images/TravelAndTours/Dauis_Church.jpg',
        '/images/TravelAndTours/Baclayon.jpg', 
        '/images/TravelAndTours/Loboc_River.png',
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Man_Made_Forest.jpg',
        '/images/TravelAndTours/Chocolate_Hills.png',
        '/images/TravelAndTours/Pasalubong_Shopping_at_Aproniana_Gift_Shop.jpg'
      ];

    case '2':
      return ['/images/TravelAndTours/Whale_Shark_Encounter.jpg'];

    case '3':
      return [
        '/images/TravelAndTours/Dolphin_Playground.jpg',
        '/images/TravelAndTours/Balicasag.jpg'
      ];

    case '4':
      return ['/images/TravelAndTours/Alicia_Panoramic_Park.jpg'];

    case '5':
      return [
        '/images/TravelAndTours/Can_Umantad_Falls.jpg',
        '/images/TravelAndTours/Cadapdapan_Rice_Terraces.jpg',
        '/images/TravelAndTours/Quinale_Beach.jpg'
      ];

    case '6':
      return [
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Loboc_River.png'
      ];

    case '7':
      return [
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Lasang_Farm_Cacao_Talk.jpg',
        '/images/TravelAndTours/Forest_Trail_Hiking.jpg',
        '/images/TravelAndTours/Tree_Rope_Climbing.jpg'
      ];

    default:
      return [
        '/images/TravelAndTours/Chocolate_Hills.png',
        '/images/TravelAndTours/Whale_Shark_Encounter.jpg',
        '/images/TravelAndTours/Dolphin_Playground.jpg'
      ];
  }
};

const getImagePositioning = (imageSrc: string): string => {
  const positionMap: { [key: string]: string } = {
    '/images/TravelAndTours/Dauis_Church.jpg': 'object-center',
    '/images/TravelAndTours/Baclayon.jpg': 'object-center',
    '/images/TravelAndTours/Loboc_River.png': 'object-center',
    '/images/TravelAndTours/Tarsier.png': 'object-center',
    '/images/TravelAndTours/Man_Made_Forest.jpg': 'object-bottom',
    '/images/TravelAndTours/Chocolate_Hills.png': 'object-center',
    '/images/TravelAndTours/Pasalubong_Shopping_at_Aproniana_Gift_Shop.jpg': 'object-center',
    '/images/TravelAndTours/Whale_Shark_Encounter.jpg': 'object-center',
    '/images/TravelAndTours/Dolphin_Playground.jpg': 'object-center',
    '/images/TravelAndTours/Balicasag.jpg': 'object-center',
    '/images/TravelAndTours/Alicia_Panoramic_Park.jpg': 'object-center',
    '/images/TravelAndTours/Can_Umantad_Falls.jpg': 'object-center',
    '/images/TravelAndTours/Cadapdapan_Rice_Terraces.jpg': 'object-center',
    '/images/TravelAndTours/Quinale_Beach.jpg': 'object-center',
    '/images/TravelAndTours/Loboc_River.png': 'object-center',
  };
  
  return positionMap[imageSrc] || 'object-center';
};

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [isAutoChangeActive, setIsAutoChangeActive] = useState(true);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!id) {
        setError('Tour ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await tourService.getTour(id);
        
        if (response && response.data) {
          const tourSpecificContent = getTourSpecificContent(id);
          
          // Transform backend data to match expected structure
          const tourData: Tour = {
            _id: response.data._id || id,
            title: response.data.title || response.data.name || 'Tour',
            slug: response.data.slug || '',
            description: tourSpecificContent ? `${tourSpecificContent.highlights}. ${response.data.description || 'Experience the adventure of a lifetime.'}` : response.data.description || 'No description available.',
            shortDescription: response.data.shortDescription || response.data.description || '',
            category: typeof response.data.category === 'string' 
              ? { _id: response.data.category, name: response.data.category, slug: response.data.category, description: '' }
              : response.data.category || { _id: 'general', name: 'General', slug: 'general', description: '' },
            price: response.data.price || 0,
            originalPrice: response.data.originalPrice || null,
            duration: tourSpecificContent?.duration || response.data.duration || 'Duration not specified',
            location: tourSpecificContent?.location || response.data.location || 'Location not specified',
            images: response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0
              ? response.data.images
              : getLocalTourImages(id),
            rating: response.data.rating || 0,
            reviewCount: response.data.reviewCount || 0,
            maxGroupSize: response.data.maxGroupSize || 15,
            minGroupSize: response.data.minGroupSize || 1,
            difficulty: response.data.difficulty || 'Easy',
            isActive: response.data.isActive !== false,
            isFeatured: response.data.isFeatured || false,
            // Default structured data for fields that might not exist in backend
            inclusions: tourSpecificContent?.inclusions || response.data.inclusions || [
              'Professional guide service',
              'Air-conditioned transportation',
              'All entrance fees and tickets',
              'Bottled water',
              'Visit to Dauis Church',
              'Visit to Baclayon Church', 
              'Floating Restaurant dining experience',
              'Tarsier Sanctuary visit',
              'Man Made Forest tour',
              'Chocolate Hills viewing',
              'Pasalubong shopping at Aproniana Gift Shop'
            ],
            exclusions: response.data.exclusions || [
              'Personal expenses',
              'Tips and gratuities',
              'Meals (unless specified)'
            ],
            itinerary: response.data.itinerary || [
              {
                time: '8:00 AM',
                title: 'Tour Start & Dauis Church',
                description: 'Begin your comprehensive Bohol adventure with pickup from your hotel and visit the historic Dauis Church'
              },
              {
                time: '9:30 AM',
                title: 'Baclayon Church Heritage Site',
                description: 'Explore one of the Philippines oldest stone churches, built by the Jesuits in the 16th century'
              },
              {
                time: '11:00 AM',
                title: 'Tarsier Sanctuary & Conservation Area',
                description: 'Meet the worlds smallest primate in their natural habitat at the Tarsier Sanctuary'
              },
              {
                time: '12:30 PM',
                title: 'Floating Restaurant Lunch in Loboc',
                description: 'Enjoy a scenic river cruise with traditional Filipino buffet lunch aboard a floating restaurant'
              },
              {
                time: '2:30 PM',
                title: 'Man Made Forest Experience',
                description: 'Walk through the famous mahogany forest plantation with its towering green canopy'
              },
              {
                time: '3:30 PM',
                title: 'Chocolate Hills Complex',
                description: 'Marvel at over 1,200 perfectly cone-shaped hills, a UNESCO World Heritage site candidate'
              },
              {
                time: '5:00 PM',
                title: 'Pasalubong Shopping at Aproniana Gift Shop',
                description: 'Browse and shop for authentic Bohol souvenirs, local delicacies, and handcrafted items'
              },
              {
                time: '6:00 PM',
                title: 'Return to Hotel',
                description: 'End your full-day Bohol countryside tour with return transfer to your accommodation'
              }
            ],
            availability: [new Date()],
            reviews: response.data.reviews || [],
            partnerId: response.data.partnerId || '',
            partner: response.data.partner || {} as any,
            tags: response.data.tags || [],
            cancellationPolicy: response.data.cancellationPolicy || 
              'Standard cancellation policy applies. Please contact us for details.',
            importantNotes: response.data.importantNotes || 
              'Please arrive on time and bring comfortable clothing and footwear.',
            createdAt: response.data.createdAt || new Date().toISOString(),
            updatedAt: response.data.updatedAt || new Date().toISOString()
          };
          
          setTour(tourData);
        } else {
          setError('Tour data not found');
        }
      } catch (err) {
        console.error('Error fetching tour details:', err);
        setError('Failed to load tour details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [id]);

  // Auto image change functionality
  useEffect(() => {
    if (!tour || !tour.images.length || !isAutoChangeActive) return;

    const autoChangeInterval = setInterval(() => {
      setActiveImageIndex(prevIndex => 
        prevIndex >= tour.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(autoChangeInterval);
  }, [tour, isAutoChangeActive]);

  const handleImageSelection = (index: number) => {
    setActiveImageIndex(index);
    setIsAutoChangeActive(false);
    
    // Resume auto-change after 5 seconds of inactivity
    setTimeout(() => setIsAutoChangeActive(true), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-4">
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-heading-2 mb-4">Error Loading Tour</h2>
          <p className="text-body mb-6">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
            <Link to="/tours" className="btn-secondary">
              Back to Tours
            </Link>
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
            <span className="text-gray-600">{getTourDisplayName(id || '')}</span>
          </nav>
        </div>
      </div>

      <div className="container pt-4 pb-8">
        {/* Image Gallery */}
        {tour.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-3">
              <img
                src={tour.images[activeImageIndex]}
                alt={getTourDisplayName(id || '')}
                className={`w-full h-96 object-cover ${getImagePositioning(tour.images[activeImageIndex])} rounded-xl`}
                loading="lazy"
                onError={(e) => {
                  console.warn('Image failed to load:', tour.images[activeImageIndex]);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              {tour.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelection(index)}
                  className={`w-full h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                    activeImageIndex === index ? 'ring-2 ring-gray-900' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${getTourDisplayName(id || '')} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl h-96 mb-8 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No images available</p>
              <p className="text-sm">Images for this tour will be added soon</p>
            </div>
          </div>
        )}

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
                  <h1 className="text-heading-1 text-3xl mb-4">{getTourDisplayName(id || '')}</h1>
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