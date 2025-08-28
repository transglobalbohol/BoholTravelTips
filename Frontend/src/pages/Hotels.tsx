import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Hotel, SearchFilters } from '../types';
import { Star, MapPin, Filter, Wifi, Car, Coffee, Waves, Dumbbell, Baby, Users } from 'lucide-react';
import { hotelService } from '../services/hotelService';

const Hotels: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [locations, setLocations] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '500'),
      max: parseInt(searchParams.get('maxPrice') || '15000'),
    },
    rating: parseFloat(searchParams.get('rating') || '') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'popularity',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [filters, currentPage]);

  const fetchInitialData = async () => {
    try {
      const [categoriesResponse, locationsResponse] = await Promise.all([
        hotelService.getHotelCategories(),
        hotelService.getHotelLocations()
      ]);
      
      setCategories(categoriesResponse.data);
      setLocations(locationsResponse.data);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.destination && filters.destination !== '') {
        params.destination = filters.destination;
      }

      if (filters.category && filters.category !== '' && filters.category !== 'All Categories') {
        params.category = filters.category;
      }

      if (filters.priceRange?.min && filters.priceRange.min > 0) {
        params.minPrice = filters.priceRange.min;
      }

      if (filters.priceRange?.max && filters.priceRange.max < 50000) {
        params.maxPrice = filters.priceRange.max;
      }

      if (filters.rating && filters.rating > 0) {
        params.rating = filters.rating;
      }

      const response = await hotelService.getHotels(params);
      
      setHotels(response.data);
      setTotalResults(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to fetch hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    const params = new URLSearchParams();
    
    if (newFilters.destination && newFilters.destination !== '') {
      params.set('destination', newFilters.destination);
    }
    
    if (newFilters.category && newFilters.category !== '' && newFilters.category !== 'All Categories') {
      params.set('category', newFilters.category);
    }
    
    if (newFilters.priceRange?.min && newFilters.priceRange.min > 0) {
      params.set('minPrice', newFilters.priceRange.min.toString());
    }
    
    if (newFilters.priceRange?.max && newFilters.priceRange.max < 50000) {
      params.set('maxPrice', newFilters.priceRange.max.toString());
    }
    
    if (newFilters.rating && newFilters.rating > 0) {
      params.set('rating', newFilters.rating.toString());
    }
    
    if (newFilters.sortBy) {
      params.set('sortBy', newFilters.sortBy);
    }
    
    if (newFilters.sortOrder) {
      params.set('sortOrder', newFilters.sortOrder);
    }
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    const newFilters: SearchFilters = { 
      sortBy: 'popularity', 
      sortOrder: 'desc',
      priceRange: {
        min: 500,
        max: 15000
      }
    };
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const categoryOptions = [
    { name: 'All Categories', value: '' },
    ...categories.map(cat => ({ name: cat.name, value: cat.name }))
  ];

  const locationOptions = [
    { name: 'All Locations', value: '' },
    ...locations.map(loc => ({ name: loc.name, value: loc.name }))
  ];

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
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-heading-3 text-lg">Filter Hotels</h3>
              </div>
              
              <div className="form-group mb-6">
                <label className="form-label">Location</label>
                <select
                  value={filters.destination || ''}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="input"
                >
                  {locationOptions.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Hotel Type</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Price Range (₱ per night)</label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Minimum: ₱{filters.priceRange?.min?.toLocaleString() || '500'}</label>
                    <input
                      type="range"
                      min="500"
                      max="15000"
                      step="500"
                      value={filters.priceRange?.min || 500}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        min: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Maximum: ₱{filters.priceRange?.max?.toLocaleString() || '15,000'}</label>
                    <input
                      type="range"
                      min="500"
                      max="15000"
                      step="500"
                      value={filters.priceRange?.max || 15000}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-small text-gray-500">
                    <span>₱500</span>
                    <span>₱15,000+</span>
                  </div>
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Minimum Rating</label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange('rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="input"
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sort By</label>
                <select
                  value={filters.sortBy || 'popularity'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                  <option value="latest">Latest</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full mt-6 text-primary hover:text-primary-dark text-sm border border-primary hover:bg-primary hover:text-white transition-colors rounded-lg px-4 py-2"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-body">
                {loading ? 'Loading hotels...' : `${totalResults} hotel${totalResults !== 1 ? 's' : ''} found`}
              </p>
              {totalResults > 0 && !loading && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {error && (
              <div className="card p-6 mb-6 border-red-200 bg-red-50">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => fetchHotels()}
                  className="btn-primary mt-3"
                >
                  Try Again
                </button>
              </div>
            )}

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

            {!loading && hotels.length > 0 && (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <Link
                    key={hotel._id}
                    to={`/hotels/${hotel._id}`}
                    className="card-interactive overflow-hidden block"
                  >
                    <div className="md:flex">
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
                        
                        <div className="text-small text-gray-500 border-t border-gray-100 pt-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <span>Check-in: {hotel.policies?.checkIn || '14:00'}</span>
                            <span>Check-out: {hotel.policies?.checkOut || '12:00'}</span>
                            <span className="text-green-600 font-medium">
                              {hotel.policies?.cancellation || 'Free cancellation'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && hotels.length === 0 && !error && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-3 text-lg mb-2">No hotels found</h3>
                <p className="text-body mb-6">Try adjusting your filters to see more results.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && !loading && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded ${
                          page === currentPage
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
