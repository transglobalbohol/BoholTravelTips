import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Tour, SearchFilters } from '../types';
import { Star, Clock, Users, MapPin, Filter } from 'lucide-react';

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

  // Enhanced mock tour data
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
    {
      _id: '3',
      title: 'Loboc River Cruise with Lunch',
      slug: 'loboc-river-cruise',
      description: 'Enjoy a peaceful river cruise with traditional Filipino lunch and live entertainment. Experience the lush tropical scenery of Loboc River.',
      shortDescription: 'Scenic river cruise with cultural entertainment',
      category: { _id: '3', name: 'Cultural & Heritage', slug: 'cultural-heritage', description: '' },
      price: 1200,
      duration: '4 hours',
      location: 'Loboc, Bohol',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['River cruise', 'Buffet lunch', 'Live entertainment', 'Round-trip transport'],
      exclusions: ['Beverages', 'Tips for performers'],
      itinerary: [],
      availability: [new Date()],
      maxGroupSize: 50,
      minGroupSize: 2,
      difficulty: 'Easy',
      rating: 4.7,
      reviewCount: 189,
      reviews: [],
      partnerId: 'partner3',
      partner: {} as any,
      isActive: true,
      isFeatured: false,
      tags: ['river cruise', 'cultural', 'dining'],
      cancellationPolicy: '24 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '4',
      title: 'Anda Hidden Beaches Tour',
      slug: 'anda-hidden-beaches',
      description: 'Discover the untouched beaches and pristine coastline of Anda municipality. Perfect for those seeking secluded paradise.',
      shortDescription: 'Untouched white sand beaches and clear waters',
      category: { _id: '2', name: 'Beach & Water Sports', slug: 'beach-water-sports', description: '' },
      price: 2200,
      duration: '10 hours',
      location: 'Anda, Bohol',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['Transportation', 'Beach access', 'Lunch', 'Local guide'],
      exclusions: ['Water activities equipment', 'Personal expenses'],
      itinerary: [],
      availability: [new Date()],
      maxGroupSize: 12,
      minGroupSize: 2,
      difficulty: 'Moderate',
      rating: 4.6,
      reviewCount: 98,
      reviews: [],
      partnerId: 'partner4',
      partner: {} as any,
      isActive: true,
      isFeatured: false,
      tags: ['hidden beaches', 'pristine', 'secluded'],
      cancellationPolicy: '48 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '5',
      title: 'Bohol Countryside Adventure',
      slug: 'bohol-countryside-adventure',
      description: 'Complete Bohol experience visiting Chocolate Hills, Blood Compact, Baclayon Church, and more in one comprehensive day tour.',
      shortDescription: 'Complete Bohol highlights in one day',
      category: { _id: '4', name: 'Day Trips', slug: 'day-trips', description: '' },
      price: 2800,
      originalPrice: 3200,
      duration: '9 hours',
      location: 'Various Locations',
      images: [
        'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['Air-conditioned van', 'Licensed tour guide', 'All entrance fees', 'Buffet lunch'],
      exclusions: ['Personal expenses', 'Travel insurance'],
      itinerary: [],
      availability: [new Date()],
      maxGroupSize: 20,
      minGroupSize: 2,
      difficulty: 'Easy',
      rating: 4.8,
      reviewCount: 445,
      reviews: [],
      partnerId: 'partner5',
      partner: {} as any,
      isActive: true,
      isFeatured: true,
      tags: ['countryside', 'cultural', 'comprehensive'],
      cancellationPolicy: '24 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '6',
      title: 'Firefly Watching & Dinner Tour',
      slug: 'firefly-watching-dinner',
      description: 'Magical evening tour watching thousands of fireflies along Abatan River followed by traditional Filipino dinner.',
      shortDescription: 'Enchanting firefly experience with dinner',
      category: { _id: '1', name: 'Nature & Wildlife', slug: 'nature-wildlife', description: '' },
      price: 1500,
      duration: '4 hours',
      location: 'Cortes, Bohol',
      images: [
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      ],
      inclusions: ['Boat ride', 'Dinner', 'Local guide', 'Transportation'],
      exclusions: ['Drinks', 'Camera rental'],
      itinerary: [],
      availability: [new Date()],
      maxGroupSize: 15,
      minGroupSize: 2,
      difficulty: 'Easy',
      rating: 4.5,
      reviewCount: 167,
      reviews: [],
      partnerId: 'partner6',
      partner: {} as any,
      isActive: true,
      isFeatured: false,
      tags: ['firefly', 'evening tour', 'nature'],
      cancellationPolicy: '24 hours before',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      // Optimized filtering with reduced delay
      let filteredTours = [...mockTours];
        
        // Apply filters
        if (filters.destination && filters.destination !== 'All Destinations') {
          filteredTours = filteredTours.filter(tour => 
            tour.location.includes(filters.destination!) || 
            tour.tags.some(tag => tag.toLowerCase().includes(filters.destination!.toLowerCase()))
          );
        }
        
        if (filters.category && filters.category !== 'All Categories') {
          filteredTours = filteredTours.filter(tour => 
            tour.category.name === filters.category
          );
        }
        
        if (filters.priceRange?.max) {
          filteredTours = filteredTours.filter(tour => 
            tour.price <= filters.priceRange!.max!
          );
        }
        
        // Apply sorting
        if (filters.sortBy === 'price') {
          filteredTours.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'rating') {
          filteredTours.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'latest') {
          filteredTours.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
      // Fast loading - minimal delay for smooth UX
      setTimeout(() => {
        setTours(filteredTours);
        setLoading(false);
      }, 150);
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
    
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All Categories' && value !== 'All Destinations') {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-heading-3 text-lg">Filter Tours</h3>
              </div>
              
              {/* Destination Filter */}
              <div className="form-group mb-6">
                <label className="form-label">
                  Destination
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

              {/* Category Filter */}
              <div className="form-group mb-6">
                <label className="form-label">
                  Category
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
                  Price Range (₱)
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceRange?.max || 10000}
                    onChange={(e) => handleFilterChange('priceRange', { 
                      ...filters.priceRange, 
                      max: parseInt(e.target.value) 
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-small">
                    <span>₱0</span>
                    <span className="font-medium">₱{filters.priceRange?.max?.toLocaleString() || '10,000'}</span>
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

          {/* Tours Grid */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-body">
                {loading ? 'Loading tours...' : `${tours.length} tour${tours.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Tours Loading */}
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

            {/* Tours Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Link
                    key={tour._id}
                    to={`/tours/${tour._id}`}
                    className="card-interactive overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={tour.images[0]}
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      {tour.isFeatured && (
                        <div className="absolute top-3 left-3 badge badge-primary">
                          Featured
                        </div>
                      )}
                      {tour.originalPrice && (
                        <div className="absolute top-3 right-3 badge badge-error">
                          -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="badge text-xs">{tour.category.name}</span>
                        <div className="flex items-center space-x-1 text-small text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{tour.duration}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-heading-3 text-lg mb-2 line-clamp-2">
                        {tour.title}
                      </h3>
                      
                      <div className="flex items-center space-x-1 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-small text-gray-500">{tour.location}</span>
                      </div>
                      
                      <p className="text-body text-sm mb-4 line-clamp-2">
                        {tour.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
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
                            {tour.rating} ({tour.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-small text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>Max {tour.maxGroupSize}</span>
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
                            ₱{tour.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-small text-gray-500">per person</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && tours.length === 0 && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-3 text-lg mb-2">No tours found</h3>
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

export default Tours;