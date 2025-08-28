import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Hotel, SearchFilters } from '../types';
import { Star, MapPin, Filter, Wifi, Car, Coffee, Waves, Dumbbell, Baby, Users } from 'lucide-react';

const Hotels: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || '',
    category: searchParams.get('category') || '',
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '15000'),
    },
    sortBy: 'popularity',
  });

  // Enhanced mock hotel data
  const mockHotels: Hotel[] = [
    {
      _id: '1',
      name: 'Amorita Resort',
      slug: 'amorita-resort-panglao',
      description: 'Luxury clifftop resort with stunning ocean views, world-class amenities, and exceptional service. Perfect for romantic getaways and special occasions.',
      shortDescription: 'Luxury clifftop resort with stunning ocean views',
      location: 'Panglao Island',
      address: 'Bingag, Daorong, Panglao, Bohol',
      coordinates: { latitude: 9.5847, longitude: 123.7618 },
      pricePerNight: 8500,
      originalPrice: 10000,
      amenities: ['Ocean View', 'Infinity Pool', 'Spa', 'Fine Dining', 'WiFi', 'Gym', 'Beach Bar'],
      rooms: [
        {
          type: 'Deluxe Room',
          description: 'Spacious room with ocean view',
          capacity: 2,
          price: 8500,
          amenities: ['Ocean View', 'Air Conditioning', 'Mini Bar'],
          images: [],
          availability: [new Date()],
          maxOccupancy: 3
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.8,
      reviewCount: 1245,
      reviews: [],
      policies: {
        checkIn: '3:00 PM',
        checkOut: '11:00 AM',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children welcome',
        pets: 'Pets not allowed',
        smoking: 'Non-smoking property'
      },
      isActive: true,
      isFeatured: true,
      category: 'Luxury',
      tags: ['beachfront', 'romantic', 'spa'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      name: 'Bellevue Resort Bohol',
      slug: 'bellevue-resort-bohol',
      description: 'Premium beachfront resort on Panglao Island featuring elegant accommodations, multiple dining options, and extensive recreational facilities.',
      shortDescription: 'Premium beachfront resort with multiple facilities',
      location: 'Panglao Island',
      address: 'Doljo Beach, Panglao, Bohol',
      coordinates: { latitude: 9.5681, longitude: 123.7644 },
      pricePerNight: 6800,
      amenities: ['Beach Access', 'Multiple Pools', 'Spa', 'Multiple Restaurants', 'WiFi', 'Kids Club'],
      rooms: [],
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.6,
      reviewCount: 892,
      reviews: [],
      policies: {
        checkIn: '3:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Free cancellation up to 48 hours before check-in',
        children: 'Children welcome with special rates',
        pets: 'Pets not allowed',
        smoking: 'Designated smoking areas only'
      },
      isActive: true,
      isFeatured: true,
      category: 'Resort',
      tags: ['family-friendly', 'beach', 'pools'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      name: 'Henann Resort Alona Beach',
      slug: 'henann-resort-alona-beach',
      description: 'Beachfront resort located on the famous Alona Beach with modern amenities and excellent service. Perfect for beach lovers.',
      shortDescription: 'Prime Alona Beach location with modern amenities',
      location: 'Panglao Island',
      address: 'Alona Beach, Panglao, Bohol',
      coordinates: { latitude: 9.5681, longitude: 123.7644 },
      pricePerNight: 5200,
      originalPrice: 6000,
      amenities: ['Beach Front', 'Swimming Pool', 'Restaurant', 'WiFi', 'Bar', 'Room Service'],
      rooms: [],
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.4,
      reviewCount: 673,
      reviews: [],
      policies: {
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children welcome',
        pets: 'Pets not allowed',
        smoking: 'Non-smoking rooms available'
      },
      isActive: true,
      isFeatured: false,
      category: 'Mid-range',
      tags: ['beach', 'central', 'popular'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '4',
      name: 'Bohol Beach Club',
      slug: 'bohol-beach-club',
      description: 'Historic beachfront resort with traditional Filipino architecture and modern comfort. Offers authentic island experience.',
      shortDescription: 'Historic resort with traditional Filipino charm',
      location: 'Panglao Island',
      address: 'Bolod Beach, Panglao, Bohol',
      coordinates: { latitude: 9.5681, longitude: 123.7644 },
      pricePerNight: 4500,
      amenities: ['Beach Access', 'Pool', 'Restaurant', 'WiFi', 'Spa Services', 'Cultural Shows'],
      rooms: [],
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.2,
      reviewCount: 445,
      reviews: [],
      policies: {
        checkIn: '2:00 PM',
        checkOut: '11:00 AM',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children welcome',
        pets: 'Pets not allowed',
        smoking: 'Smoking allowed in designated areas'
      },
      isActive: true,
      isFeatured: false,
      category: 'Mid-range',
      tags: ['traditional', 'cultural', 'historic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '5',
      name: 'The Peacock Garden',
      slug: 'peacock-garden-baclayon',
      description: 'Boutique resort set in lush tropical gardens with unique architecture and personalized service. A hidden gem for discerning travelers.',
      shortDescription: 'Boutique resort in tropical gardens',
      location: 'Baclayon',
      address: 'Baclayon, Bohol',
      coordinates: { latitude: 9.6236, longitude: 123.9058 },
      pricePerNight: 3800,
      amenities: ['Garden Setting', 'Pool', 'Restaurant', 'WiFi', 'Library', 'Spa'],
      rooms: [],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.7,
      reviewCount: 234,
      reviews: [],
      policies: {
        checkIn: '3:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Free cancellation up to 48 hours before check-in',
        children: 'Children 12+ welcome',
        pets: 'Pets allowed with fee',
        smoking: 'Non-smoking property'
      },
      isActive: true,
      isFeatured: false,
      category: 'Boutique',
      tags: ['garden', 'quiet', 'unique'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '6',
      name: 'GV Tower Hotel',
      slug: 'gv-tower-hotel-tagbilaran',
      description: 'Modern business hotel in the heart of Tagbilaran City. Perfect for business travelers and city exploration.',
      shortDescription: 'Modern city hotel with business facilities',
      location: 'Tagbilaran City',
      address: 'Carlos P. Garcia Ave, Tagbilaran, Bohol',
      coordinates: { latitude: 9.6496, longitude: 123.8536 },
      pricePerNight: 2200,
      amenities: ['City Center', 'Business Center', 'Restaurant', 'WiFi', 'Meeting Rooms', 'Airport Shuttle'],
      rooms: [],
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ],
      rating: 4.1,
      reviewCount: 334,
      reviews: [],
      policies: {
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children welcome',
        pets: 'Pets not allowed',
        smoking: 'Non-smoking floors available'
      },
      isActive: true,
      isFeatured: false,
      category: 'Mid-range',
      tags: ['city', 'business', 'convenient'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      // Optimized filtering with reduced delay
      let filteredHotels = [...mockHotels];
        
        // Apply filters
        if (filters.destination && filters.destination !== 'All Destinations') {
          filteredHotels = filteredHotels.filter(hotel => 
            hotel.location.includes(filters.destination!) ||
            hotel.tags.some(tag => tag.toLowerCase().includes(filters.destination!.toLowerCase()))
          );
        }
        
        if (filters.category && filters.category !== 'All Categories') {
          filteredHotels = filteredHotels.filter(hotel => 
            hotel.category === filters.category
          );
        }
        
        if (filters.priceRange?.max) {
          filteredHotels = filteredHotels.filter(hotel => 
            hotel.pricePerNight <= filters.priceRange!.max!
          );
        }
        
        // Apply sorting
        if (filters.sortBy === 'price') {
          filteredHotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (filters.sortBy === 'rating') {
          filteredHotels.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'latest') {
          filteredHotels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
      // Fast loading - minimal delay for smooth UX
      setTimeout(() => {
        setHotels(filteredHotels);
        setLoading(false);
      }, 150);
    };

    fetchHotels();
  }, [filters]);

  const categories = [
    'All Categories',
    'Luxury',
    'Resort',
    'Mid-range',
    'Budget',
    'Boutique'
  ];

  const destinations = [
    'All Destinations',
    'Panglao Island',
    'Tagbilaran City',
    'Chocolate Hills Area',
    'Anda',
    'Loboc',
    'Baclayon'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All Categories' && value !== 'All Destinations') {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'pool':
      case 'swimming pool':
      case 'infinity pool':
      case 'multiple pools':
        return <Waves className="w-4 h-4" />;
      case 'gym':
        return <Dumbbell className="w-4 h-4" />;
      case 'kids club':
        return <Baby className="w-4 h-4" />;
      case 'airport shuttle':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
      case 'fine dining':
      case 'multiple restaurants':
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            Hotels & Resorts in Bohol
          </h1>
          <p className="text-subheading max-w-3xl">
            Find the perfect accommodation for your Bohol adventure. From luxury beachfront resorts 
            to budget-friendly hotels, we have options for every traveler.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-heading-3 text-lg">Filter Hotels</h3>
              </div>
              
              {/* Location Filter */}
              <div className="form-group mb-6">
                <label className="form-label">
                  Location
                </label>
                <select
                  value={filters.destination || ''}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="input"
                >
                  {destinations.map((dest) => (
                    <option key={dest} value={dest === 'All Destinations' ? '' : dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hotel Type Filter */}
              <div className="form-group mb-6">
                <label className="form-label">
                  Hotel Type
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="form-group mb-6">
                <label className="form-label">
                  Price Range (₱ per night)
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    value={filters.priceRange?.max || 15000}
                    onChange={(e) => handleFilterChange('priceRange', { 
                      ...filters.priceRange, 
                      max: parseInt(e.target.value) 
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-small">
                    <span>₱500</span>
                    <span className="font-medium">₱{filters.priceRange?.max?.toLocaleString() || '15,000'}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="form-group">
                <label className="form-label">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'popularity'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hotels List */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-body">
                {loading ? 'Loading hotels...' : `${hotels.length} hotel${hotels.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Hotels Loading */}
            {loading && (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="md:flex">
                      <div className="h-48 md:h-32 md:w-72 bg-gray-200"></div>
                      <div className="p-6 flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hotels List */}
            {!loading && (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <Link
                    key={hotel._id}
                    to={`/hotels/${hotel._id}`}
                    className="card-interactive overflow-hidden block"
                  >
                    <div className="md:flex">
                      {/* Hotel Image */}
                      <div className="relative md:w-72 h-48 md:h-auto">
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {hotel.isFeatured && (
                          <div className="absolute top-3 left-3 badge badge-primary">
                            Featured
                          </div>
                        )}
                        {hotel.originalPrice && (
                          <div className="absolute top-3 right-3 badge badge-error">
                            -{Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      {/* Hotel Info */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="badge text-xs">
                                  {hotel.category}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-small text-gray-500">{hotel.location}</span>
                                </div>
                              </div>
                              <h3 className="text-heading-3 text-xl mb-2">
                                {hotel.name}
                              </h3>
                            </div>
                            <div className="text-right ml-4">
                              <div className="flex items-center space-x-1 mb-2">
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-small text-gray-600">
                                  {hotel.rating} ({hotel.reviewCount})
                                </span>
                              </div>
                              <div className="flex items-baseline space-x-2">
                                {hotel.originalPrice && (
                                  <span className="text-small text-gray-500 line-through">
                                    ₱{hotel.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-xl font-bold text-gray-900">
                                  ₱{hotel.pricePerNight.toLocaleString()}
                                </span>
                              </div>
                              <span className="text-small text-gray-500">per night</span>
                            </div>
                          </div>
                          
                          <p className="text-body mb-4 line-clamp-2">
                            {hotel.shortDescription}
                          </p>
                          
                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel.amenities.slice(0, 6).map((amenity, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                              >
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </span>
                            ))}
                            {hotel.amenities.length > 6 && (
                              <span className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{hotel.amenities.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Policies */}
                        <div className="text-small text-gray-500 border-t border-gray-100 pt-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <span>Check-in: {hotel.policies.checkIn}</span>
                            <span>Check-out: {hotel.policies.checkOut}</span>
                            <span className="text-green-600 font-medium">Free cancellation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && hotels.length === 0 && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-3 text-lg mb-2">No hotels found</h3>
                <p className="text-body mb-6">Try adjusting your filters to see more results.</p>
                <button
                  onClick={() => {
                    setFilters({ sortBy: 'popularity' });
                    setSearchParams(new URLSearchParams());
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;