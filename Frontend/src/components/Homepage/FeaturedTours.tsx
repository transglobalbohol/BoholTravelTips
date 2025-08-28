import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Users } from 'lucide-react';
import { tourService } from '../../services/tourService';
import { Tour } from '../../types';

const FeaturedTours: React.FC = () => {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedTours();
  }, []);

  const fetchFeaturedTours = async () => {
    try {
      setLoading(true);
      const response = await tourService.getFeaturedTours(8);
      setFeaturedTours(response.data);
    } catch (err) {
      console.error('Error fetching featured tours:', err);
      setError('Failed to load featured tours');
      
      setFeaturedTours([
        {
          _id: '1',
          title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
          slug: 'chocolate-hills-tarsier-day-tour',
          description: 'Visit the famous Chocolate Hills and meet the adorable tarsiers in this comprehensive day tour.',
          shortDescription: 'Visit the famous Chocolate Hills and meet the adorable tarsiers in this comprehensive day tour.',
          category: { _id: '1', name: 'Nature & Wildlife', slug: 'nature-wildlife', description: '' },
          price: 2500,
          originalPrice: 3000,
          duration: '8 hours',
          location: 'Carmen, Bohol',
          images: ['https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 mb-4">Featured Tours & Experiences</h2>
            <p className="text-subheading max-w-2xl mx-auto">
              Discover the best of Bohol with our hand-picked tours and activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 mb-4">
            Featured Tours & Experiences
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Discover the best of Bohol with our hand-picked tours and activities
          </p>
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFeaturedTours}
              className="mt-2 btn-primary"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.slice(0, 4).map((tour) => (
            <div key={tour._id} className="card-interactive overflow-hidden">
              <div className="relative">
                <img
                  src={tour.images[0]}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 badge badge-primary text-xs">
                  Featured
                </div>
                {tour.originalPrice && (
                  <div className="absolute top-3 right-3 badge badge-error text-xs">
                    -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge text-xs">
                    {typeof tour.category === 'string' ? tour.category : tour.category.name}
                  </span>
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
                
                <div className="flex items-center justify-between mb-4">
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
                
                <Link
                  to={`/tours/${tour._id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="btn-secondary inline-flex items-center"
          >
            View All Tours
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;
