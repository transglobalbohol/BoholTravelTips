import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tour, SearchFilters } from '../types';
import { Star, Clock, Users, MapPin, Filter } from 'lucide-react';
import { tourService } from '../services/tourService';

const getLocalTourImages = (tourId: string): string[] => {
  switch(tourId) {
    case '1':
      return [
        '/images/TravelAndTours/Dauis_Church.jpg',
        '/images/TravelAndTours/Baclayon.jpg', 
        '/images/TravelAndTours/Loboc_River.png',
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Man_Made_Forest.jpg',
        '/images/TravelAndTours/Chocolate_Hills.png'
      ];

    case '2':
      return [
        '/images/TravelAndTours/Whale_Shark_Encounter.jpg',
        '/images/TravelAndTours/Chocolate_Hills.png'
      ];

    case '3':
      return [
        '/images/TravelAndTours/Dolphin_Playground.jpg',
        '/images/TravelAndTours/Balicasag.jpg'
      ];

    case '4':
      return [
        '/images/TravelAndTours/Alicia_Panoramic_Park.jpg',
        '/images/TravelAndTours/Chocolate_Hills.png'
      ];

    case '5':
      return [
        '/images/TravelAndTours/Can_Umantad_Falls.jpg',
        '/images/TravelAndTours/Cadapdapan_Rice_Terraces.jpg',
        '/images/TravelAndTours/Quinale_Beach.jpg'
      ];

    case '6':
      return [
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Loboc_River.png',
        '/images/TravelAndTours/Loboc_Church.jpg'
      ];

    case '7':
      return [
        '/images/TravelAndTours/Tarsier.png',
        '/images/TravelAndTours/Lasang_Farm_Cacao_Talk.jpg',
        '/images/TravelAndTours/Forest_Trail_Hiking.jpg',
        '/images/TravelAndTours/Tree_Rope_Climbing.jpg'
      ];

    default:
      return ['/images/boholLandingPage.webp'];
  }
};

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

const sortToursByNumber = (tours: Tour[]): Tour[] => {
  return [...tours].sort((a, b) => {
    const displayNameA = getTourDisplayName(a._id || '');
    const displayNameB = getTourDisplayName(b._id || '');
    
    const numberA = parseInt(displayNameA.replace('Tour ', '')) || 999;
    const numberB = parseInt(displayNameB.replace('Tour ', '')) || 999;
    
    return numberA - numberB;
  });
};

const Tours: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [destinations, setDestinations] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hoveredTour, setHoveredTour] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || '',
    category: searchParams.get('category') || '',
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '10000'),
    },
    rating: parseFloat(searchParams.get('rating') || '') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'popularity',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (hoveredTour) {
      const tourImages = getLocalTourImages(hoveredTour);
      if (tourImages.length > 1) {
        interval = setInterval(() => {
          setCurrentImageIndex(prev => ({
            ...prev,
            [hoveredTour]: ((prev[hoveredTour] || 0) + 1) % tourImages.length
          }));
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hoveredTour]);

  const handleTourHover = (tourId: string) => {
    setHoveredTour(tourId);
    setCurrentImageIndex(prev => ({ ...prev, [tourId]: 0 }));
  };

  const handleTourLeave = (tourId: string) => {
    setHoveredTour(null);
    setCurrentImageIndex(prev => ({ ...prev, [tourId]: 0 }));
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTours();
  }, [filters, currentPage]);

  const fetchInitialData = async () => {
    try {
      const [categoriesResponse, destinationsResponse] = await Promise.all([
        tourService.getCategories().catch(() => ({ data: [] })),
        tourService.getDestinations().catch(() => ({ data: [] }))
      ]);
      
      setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      setDestinations(Array.isArray(destinationsResponse.data) ? destinationsResponse.data : []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setCategories([]);
      setDestinations([]);
    }
  };

  const fetchTours = async () => {
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

      const response = await tourService.getTours(params);
      
      setTours(response.data);
      setTotalResults(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to fetch tours. Please try again.');
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
        min: 0,
        max: 10000
      }
    };
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const categoryOptions = [
    { name: 'All Categories', value: '' },
    ...(Array.isArray(categories) ? categories.map(cat => ({ name: cat.name, value: cat.name })) : [])
  ];

  const destinationOptions = [
    { name: 'All Destinations', value: '' },
    ...(Array.isArray(destinations) ? destinations.map(dest => ({ name: dest.name, value: dest.name })) : [])
  ];

  const getTourImage = (tourId: string): string => {
    const tourImages = getLocalTourImages(tourId);
    const imageIndex = currentImageIndex[tourId] || 0;
    return tourImages[imageIndex] || tourImages[0];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            Tours & Activities in Bohol
          </h1>
          <p className="text-subheading max-w-3xl">
            Discover amazing tours and activities across the beautiful island of Bohol. 
            From the iconic Chocolate Hills to pristine beaches, find your perfect adventure.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-heading-3 text-lg">Filter Tours</h3>
              </div>
              
              <div className="form-group mb-6">
                <label className="form-label">Destination</label>
                <select
                  value={filters.destination || ''}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="input"
                >
                  {destinationOptions.map((dest) => (
                    <option key={dest.value} value={dest.value}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Category</label>
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
                <label className="form-label">Price Range (₱)</label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Minimum: ₱{filters.priceRange?.min?.toLocaleString() || '0'}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={filters.priceRange?.min || 0}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        min: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Maximum: ₱{filters.priceRange?.max?.toLocaleString() || '10,000'}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={filters.priceRange?.max || 10000}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-small text-gray-500">
                    <span>₱0</span>
                    <span>₱10,000+</span>
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
                  <option value="title">Title A-Z</option>
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
                {loading ? 'Loading tours...' : `${totalResults} tour${totalResults !== 1 ? 's' : ''} found`}
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
                  onClick={() => fetchTours()}
                  className="btn-primary mt-3"
                >
                  Try Again
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && tours.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortToursByNumber(tours).map((tour) => {
                  if (!tour || !tour._id) return null;
                  
                  const categoryDisplay = typeof tour.category === 'string' 
                    ? tour.category 
                    : (tour.category && tour.category.name ? tour.category.name : 'Tour');
                    
                  return (
                    <Link
                      key={tour._id}
                      to={`/tours/${tour._id}`}
                      className="card-interactive overflow-hidden"
                      onMouseEnter={() => handleTourHover(tour._id)}
                      onMouseLeave={() => handleTourLeave(tour._id)}
                    >
                      <div className="relative">
                        <img
                          src={getTourImage(tour._id)}
                          alt={`${getTourDisplayName(tour._id)} image`}
                          className="w-full h-48 object-cover transition-all duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const fallbackImage = '/images/boholLandingPage.webp';
                            if (e.currentTarget.src !== window.location.origin + fallbackImage) {
                              e.currentTarget.src = fallbackImage;
                            }
                          }}
                        />
                        {tour.isFeatured && (
                          <div className="absolute top-3 left-3 badge badge-primary">
                            Featured
                          </div>
                        )}
                        {tour.originalPrice && tour.price && (
                          <div className="absolute top-3 right-3 badge badge-error">
                            -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="badge text-xs">{categoryDisplay}</span>
                          <div className="flex items-center space-x-1 text-small text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{tour.duration || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-heading-3 text-lg mb-2 line-clamp-2">
                          {getTourDisplayName(tour._id)}
                        </h3>
                        
                        <div className="flex items-center space-x-1 mb-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-small text-gray-500">{tour.location || 'Location TBA'}</span>
                        </div>
                        
                        <p className="text-body text-sm mb-4 line-clamp-2">
                          {tour.shortDescription || tour.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(tour.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-small text-gray-600">
                              {tour.rating || 0} ({tour.reviewCount || 0})
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-small text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>Max {tour.maxGroupSize || 'TBA'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline space-x-2">
                            {tour.originalPrice && (
                              <span className="text-small text-gray-500 line-through">
                                ₱{tour.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-xl font-bold text-gray-900">
                              ₱{(tour.price || 0).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-small text-gray-500">per person</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && tours.length === 0 && !error && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-3 text-lg mb-2">No tours found</h3>
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

export default Tours;
