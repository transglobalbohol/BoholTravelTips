import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tour, SearchFilters } from '../types';

const Tours: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || '',
    category: searchParams.get('category') || '',
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '10000'),
    },
    sortBy: 'popularity',
  });

  // Mock tour data - replace with API call
  const mockTours: Tour[] = [
    {
      _id: '1',
      title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
      slug: 'chocolate-hills-tarsier-day-tour',
      description: 'Visit the famous Chocolate Hills and meet the adorable tarsiers in this comprehensive day tour. Experience the natural wonders of Bohol with expert guides.',
      shortDescription: 'Famous geological formations and world\'s smallest primates',
      category: { _id: '1', name: 'Nature & Wildlife', slug: 'nature-wildlife', description: '' },
      price: 2500,
      originalPrice: 3000,
      duration: '8 hours',
      location: 'Carmen, Bohol',
      images: [
        'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['Transportation', 'Tour guide', 'Entrance fees', 'Lunch'],
      exclusions: ['Personal expenses', 'Tips'],
      itinerary: [],
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
      tags: ['chocolate hills', 'tarsier', 'nature'],
      cancellationPolicy: '24 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Panglao Island Hopping Adventure',
      slug: 'panglao-island-hopping',
      description: 'Explore pristine beaches and crystal-clear waters around Panglao Island. Snorkel in vibrant coral reefs and discover hidden lagoons.',
      shortDescription: 'Beach paradise with crystal-clear waters',
      category: { _id: '2', name: 'Beach & Water Sports', slug: 'beach-water-sports', description: '' },
      price: 1800,
      duration: '6 hours',
      location: 'Panglao, Bohol',
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['Boat transfer', 'Snorkeling gear', 'Lunch', 'Island fees'],
      exclusions: ['Drinks', 'Personal expenses'],
      itinerary: [],
      availability: [new Date()],
      maxGroupSize: 20,
      minGroupSize: 4,
      difficulty: 'Easy',
      rating: 4.9,
      reviewCount: 256,
      reviews: [],
      partnerId: 'partner2',
      partner: {} as any,
      isActive: true,
      isFeatured: true,
      tags: ['island hopping', 'beach', 'snorkeling'],
      cancellationPolicy: '24 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Add more mock tours as needed...
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTours = async () => {
      setLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setTours(mockTours);
        setLoading(false);
      }, 1000);
    };

    fetchTours();
  }, [filters]);

  const categories = [
    'All Categories',
    'Nature & Wildlife',
    'Beach & Water Sports',
    'Cultural & Heritage',
    'Adventure',
    'Food Tours',
    'Day Trips'
  ];

  const destinations = [
    'All Destinations',
    'Chocolate Hills',
    'Panglao Island',
    'Loboc River',
    'Anda',
    'Tagbilaran City',
    'Baclayon',
    'Tarsier Sanctuary'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
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
            Tours & Activities in Bohol
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Discover amazing tours and activities across the beautiful island of Bohol. 
            From the iconic Chocolate Hills to pristine beaches, find your perfect adventure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Filter Tours</h3>
              
              {/* Destination Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
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
                  Category
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
                  Price Range (₱)
                </label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.priceRange?.max || 10000}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>₱0</span>
                      <span>₱{filters.priceRange?.max?.toLocaleString() || '10,000'}</span>
                    </div>
                  </div>
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

          {/* Tours Grid */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${tours.length} tours found`}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">View:</span>
                <button className="p-2 bg-blue-100 text-blue-600 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tours Loading */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tours Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Link
                    key={tour._id}
                    to={`/tours/${tour._id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 border overflow-hidden card-hover"
                  >
                    <div className="relative">
                      <img
                        src={tour.images[0]}
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                      />
                      {tour.isFeatured && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                          Featured
                        </div>
                      )}
                      {tour.originalPrice && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                          -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600 font-medium">{tour.category.name}</span>
                        <span className="text-sm text-gray-500">{tour.duration}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {tour.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {tour.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
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
                            {tour.rating} ({tour.reviewCount})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {tour.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₱{tour.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xl font-bold text-gray-900">
                            ₱{tour.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">per person</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && tours.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tours found</h3>
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

export default Tours;