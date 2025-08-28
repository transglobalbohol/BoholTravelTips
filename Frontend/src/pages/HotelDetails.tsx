import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Hotel } from '../types';
import { 
  MapPin, Star, Wifi, Car, Coffee, Waves, Dumbbell, Baby, Users, 
  Calendar, Heart, Phone, Clock, Check, X, ChevronLeft, ChevronRight,
  Shield, CreditCard, Camera
} from 'lucide-react';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  // Mock hotel data
  const mockHotel: Hotel = {
    _id: id || '1',
    name: 'Amorita Resort',
    slug: 'amorita-resort-panglao',
    description: `Perched dramatically on a cliff overlooking the azure waters of the Bohol Sea, Amorita Resort is a luxury destination that epitomizes tropical elegance and world-class hospitality. This award-winning resort offers an unparalleled experience with its infinity pool that seems to merge seamlessly with the ocean horizon, creating a breathtaking visual spectacle.

    Each suite and villa at Amorita is thoughtfully designed with contemporary Filipino architecture, featuring natural materials and earth tones that complement the stunning natural surroundings. From your private balcony, wake up to spectacular sunrises over the sea and enjoy romantic sunsets that paint the sky in brilliant hues.

    The resort's commitment to luxury extends to every detail, from the meticulously maintained tropical gardens to the exceptional culinary experiences at Sands Restaurant and Tapis Bar. Whether you're seeking adventure with world-class diving and snorkeling opportunities or relaxation with rejuvenating spa treatments, Amorita Resort provides the perfect setting for an unforgettable Bohol getaway.`,
    shortDescription: 'Luxury clifftop resort with stunning ocean views and world-class amenities',
    location: 'Panglao Island',
    address: 'Bingag, Daorong, Panglao, Bohol, Philippines',
    coordinates: { latitude: 9.5847, longitude: 123.7618 },
    pricePerNight: 8500,
    originalPrice: 10000,
    amenities: [
      'Infinity Pool', 'Private Beach', 'Spa & Wellness Center', 'Fine Dining Restaurant', 
      'Beach Bar', 'WiFi', 'Gym & Fitness Center', '24-hour Room Service', 
      'Concierge Service', 'Airport Shuttle', 'Laundry Service', 'Tour Desk'
    ],
    rooms: [
      {
        type: 'Ocean Suite',
        description: 'Spacious suite with panoramic ocean views, private balcony, and luxury amenities',
        capacity: 2,
        price: 8500,
        amenities: ['Ocean View', 'Private Balcony', 'Air Conditioning', 'Mini Bar', 'Safe', 'Bathtub'],
        images: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        availability: [new Date()],
        maxOccupancy: 3
      },
      {
        type: 'Garden Villa',
        description: 'Private villa surrounded by tropical gardens with pool access',
        capacity: 2,
        price: 12000,
        amenities: ['Garden View', 'Private Terrace', 'Pool Access', 'Air Conditioning', 'Mini Bar', 'Safe'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        availability: [new Date()],
        maxOccupancy: 4
      },
      {
        type: 'Presidential Villa',
        description: 'Ultimate luxury villa with private infinity pool and dedicated butler service',
        capacity: 4,
        price: 25000,
        amenities: ['Ocean View', 'Private Pool', 'Butler Service', 'Jacuzzi', 'Kitchen', 'Living Room'],
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        availability: [new Date()],
        maxOccupancy: 6
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 1245,
    reviews: [
      {
        _id: '1',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment: 'Absolutely stunning resort! The infinity pool with ocean views is breathtaking. Staff service was exceptional throughout our stay.',
        date: '2024-11-15',
        helpful: 24
      },
      {
        _id: '2',
        userId: 'user2',
        userName: 'Michael Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment: 'Perfect for our honeymoon! The cliff-top location is magical, especially at sunset. Highly recommend the spa treatments.',
        date: '2024-11-10',
        helpful: 18
      },
      {
        _id: '3',
        userId: 'user3',
        userName: 'Emma Rodriguez',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        rating: 4,
        comment: 'Beautiful resort with amazing views. The only minor issue was the limited dining options, but the quality was excellent.',
        date: '2024-10-28',
        helpful: 12
      }
    ],
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in. Cancellations within 24 hours are subject to a one-night penalty.',
      children: 'Children of all ages are welcome. Children 12 and under stay free when using existing bedding.',
      pets: 'Pets are not allowed at this property.',
      smoking: 'This is a non-smoking property. Smoking is permitted only in designated outdoor areas.'
    },
    nearbyAttractions: [
      { name: 'Alona Beach', distance: '2.5 km', type: 'Beach' },
      { name: 'Hinagdanan Cave', distance: '8 km', type: 'Cave' },
      { name: 'Bohol Bee Farm', distance: '5 km', type: 'Farm/Restaurant' },
      { name: 'Panglao Church', distance: '6 km', type: 'Historical Site' }
    ],
    isActive: true,
    isFeatured: true,
    category: 'Luxury',
    tags: ['beachfront', 'romantic', 'spa', 'infinity pool', 'luxury'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      // Instant loading for better UX
      setTimeout(() => {
        setHotel(mockHotel);
        setSelectedRoom(mockHotel.rooms[0]?.type || '');
        setLoading(false);
      }, 100);
    };

    fetchHotel();
  }, [id]);

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes('pool')) return <Waves className="w-4 h-4" />;
    if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) return <Dumbbell className="w-4 h-4" />;
    if (lowerAmenity.includes('kids') || lowerAmenity.includes('children')) return <Baby className="w-4 h-4" />;
    if (lowerAmenity.includes('shuttle') || lowerAmenity.includes('parking')) return <Car className="w-4 h-4" />;
    if (lowerAmenity.includes('restaurant') || lowerAmenity.includes('dining') || lowerAmenity.includes('bar')) return <Coffee className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getSelectedRoomPrice = () => {
    const room = hotel?.rooms.find(r => r.type === selectedRoom);
    return room?.price || hotel?.pricePerNight || 0;
  };

  const getTotalPrice = () => {
    const nights = calculateNights();
    const roomPrice = getSelectedRoomPrice();
    return nights * roomPrice;
  };

  const nextImage = () => {
    if (hotel?.images) {
      setActiveImageIndex((prev) => (prev + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel?.images) {
      setActiveImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div>
                <div className="bg-gray-200 rounded-xl h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-heading-2 mb-4">Hotel Not Found</h2>
          <p className="text-body mb-6">The hotel you're looking for doesn't exist.</p>
          <Link to="/hotels" className="btn-primary">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-small">
            <Link to="/" className="modern-link">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/hotels" className="modern-link">Hotels</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{hotel.name}</span>
          </nav>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="h-96 md:h-[500px] relative overflow-hidden">
          <img
            src={hotel.images[activeImageIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Image Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {hotel.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Photo Count */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-small flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>{activeImageIndex + 1} / {hotel.images.length}</span>
          </div>
        </div>

        {/* Featured Badges */}
        <div className="absolute top-6 left-6 flex flex-col space-y-2">
          {hotel.isFeatured && (
            <div className="badge badge-primary">Featured</div>
          )}
          {hotel.originalPrice && (
            <div className="badge badge-error">
              -{Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-8 mb-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="badge badge-primary text-sm">{hotel.category}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-small text-gray-500">{hotel.location}</span>
                    </div>
                  </div>
                  <h1 className="text-heading-1 text-3xl mb-4">{hotel.name}</h1>
                  <p className="text-body-large text-gray-600 mb-4">{hotel.shortDescription}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-body font-medium">{hotel.rating}</span>
                      <span className="text-small text-gray-500">
                        ({hotel.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                {hotel.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-body leading-relaxed mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-heading-3 text-xl mb-6">Hotel Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {getAmenityIcon(amenity)}
                      <span className="text-body">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Attractions */}
              {hotel.nearbyAttractions && (
                <div className="mb-8">
                  <h3 className="text-heading-3 text-xl mb-6">Nearby Attractions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.nearbyAttractions.map((attraction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{attraction.name}</h4>
                          <p className="text-small text-gray-500">{attraction.type}</p>
                        </div>
                        <span className="text-small font-medium text-gray-700">
                          {attraction.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel Policies */}
              <div className="mb-8">
                <h3 className="text-heading-3 text-xl mb-6">Hotel Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Check-in / Check-out</h4>
                    <div className="text-small text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Check-in: {hotel.policies.checkIn}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Check-out: {hotel.policies.checkOut}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
                    <p className="text-small text-gray-600">{hotel.policies.cancellation}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Children & Pets</h4>
                    <div className="text-small text-gray-600 space-y-1">
                      <p>{hotel.policies.children}</p>
                      <p>{hotel.policies.pets}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Smoking Policy</h4>
                    <p className="text-small text-gray-600">{hotel.policies.smoking}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-heading-3 text-xl">Guest Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold">{hotel.rating}</span>
                  <span className="text-small text-gray-500">({hotel.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {hotel.reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-small text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-body mb-3">{review.comment}</p>
                        <div className="flex items-center justify-between">
                          <button className="text-small text-gray-500 hover:text-gray-700">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="btn-secondary">View All Reviews</button>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-heading-3 text-lg mb-6">Reserve Your Stay</h3>

              {/* Price Display */}
              <div className="text-center mb-6">
                {hotel.originalPrice && (
                  <div className="text-small text-gray-500 line-through mb-1">
                    ₱{hotel.originalPrice.toLocaleString()}
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-900">
                  ₱{hotel.pricePerNight.toLocaleString()}
                </div>
                <div className="text-small text-gray-600">per night</div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Users className="w-4 h-4 inline mr-2" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="input"
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Room Type</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="input"
                  >
                    {hotel.rooms.map((room) => (
                      <option key={room.type} value={room.type}>
                        {room.type} - ₱{room.price.toLocaleString()}/night
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Room Details */}
                {selectedRoom && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const room = hotel.rooms.find(r => r.type === selectedRoom);
                      return room ? (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{room.type}</h4>
                          <p className="text-small text-gray-600 mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="badge text-xs">
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="badge text-xs">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Price Summary */}
                {checkInDate && checkOutDate && calculateNights() > 0 && (
                  <div className="border-t pt-4">
                    <div className="space-y-2 text-small">
                      <div className="flex justify-between">
                        <span>₱{getSelectedRoomPrice().toLocaleString()} x {calculateNights()} nights</span>
                        <span>₱{getTotalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & fees</span>
                        <span>₱{Math.round(getTotalPrice() * 0.12).toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₱{(getTotalPrice() + Math.round(getTotalPrice() * 0.12)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="btn-primary w-full"
                  disabled={!checkInDate || !checkOutDate || calculateNights() <= 0}
                >
                  Reserve Now
                </button>

                <button className="btn-secondary w-full flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="flex items-center justify-center space-x-2 text-small text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Booking</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-small text-gray-600 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-small text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>24/7 Customer support</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-small text-gray-600 mb-2">Questions? We're here to help</p>
                <div className="flex items-center justify-center space-x-2 text-gray-900 font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>+63 123 456 7890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;