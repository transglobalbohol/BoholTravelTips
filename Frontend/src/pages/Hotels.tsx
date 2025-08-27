import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Hotel, SearchFilters } from '../types';

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

  // Mock hotel data - replace with API call
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
      amenities: ['Ocean View', 'Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar'],
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
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchHotels = async () => {
      setLoading(true);
      setTimeout(() => {
        setHotels(mockHotels);
        setLoading(false);
      }, 1000);
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
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hotels & Resorts in Bohol
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Find the perfect accommodation for your Bohol adventure. From luxury beachfront resorts 
            to budget-friendly hotels, we have options for every traveler.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Filter Hotels</h3>
              
              {/* Destination Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.destination || ''}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {destinations.map((dest) => (
                    <option key={dest} value={dest === 'All Destinations' ? '' : dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Type
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₱ per night)
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="500"
                      max="15000"
                      value={filters.priceRange?.max || 15000}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₱500</span>
                      <span>₱{filters.priceRange?.max?.toLocaleString() || '15,000'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {['Pool', 'Beach Access', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Kids Club'].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'popularity'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${hotels.length} hotels found`}
              </p>
            </div>

            {/* Hotels Loading */}
            {loading && (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                    <div className="md:flex">
                      <div className="h-48 md:h-32 md:w-48 bg-gray-200"></div>
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
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 border overflow-hidden block"
                  >
                    <div className="md:flex">
                      {/* Hotel Image */}
                      <div className="relative md:w-72 h-48 md:h-auto">
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        {hotel.isFeatured && (
                          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                            Featured
                          </div>
                        )}
                        {hotel.originalPrice && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                            -{Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      {/* Hotel Info */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  {hotel.category}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-sm text-gray-500">{hotel.location}</span>
                                </div>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {hotel.name}
                              </h3>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {hotel.rating} ({hotel.reviewCount})
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {hotel.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₱{hotel.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-xl font-bold text-blue-600">
                                  ₱{hotel.pricePerNight.toLocaleString()}
                                </span>
                                <span className="text-gray-600 text-sm">per night</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {hotel.shortDescription}
                          </p>
                          
                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {hotel.amenities.slice(0, 6).map((amenity, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 6 && (
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{hotel.amenities.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Policies */}
                        <div className="text-xs text-gray-500 border-t pt-3">
                          <div className="flex items-center space-x-4">
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
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No hotels found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters to see more results.</p>
                <button
                  onClick={() => {
                    setFilters({ sortBy: 'popularity' });
                    setSearchParams(new URLSearchParams());
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
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