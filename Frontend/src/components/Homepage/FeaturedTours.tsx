import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Users } from 'lucide-react';

const FeaturedTours: React.FC = () => {
  const featuredTours = [
    {
      id: '1',
      title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 2500,
      originalPrice: 3000,
      duration: '8 hours',
      rating: 4.8,
      reviews: 324,
      location: 'Carmen, Bohol',
      description: 'Visit the famous Chocolate Hills and meet the adorable tarsiers in this comprehensive day tour.',
      maxGroup: 15,
      category: 'Nature & Wildlife'
    },
    {
      id: '2',
      title: 'Panglao Island Hopping Adventure',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 1800,
      duration: '6 hours',
      rating: 4.9,
      reviews: 256,
      location: 'Panglao, Bohol',
      description: 'Explore pristine beaches and crystal-clear waters around Panglao Island.',
      maxGroup: 20,
      category: 'Beach & Water Sports'
    },
    {
      id: '3',
      title: 'Loboc River Cruise with Lunch',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 1200,
      duration: '4 hours',
      rating: 4.7,
      reviews: 189,
      location: 'Loboc, Bohol',
      description: 'Enjoy a peaceful river cruise with traditional Filipino lunch and local entertainment.',
      maxGroup: 50,
      category: 'Cultural & Heritage'
    },
    {
      id: '4',
      title: 'Anda Hidden Beaches Tour',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      price: 2200,
      duration: '10 hours',
      rating: 4.6,
      reviews: 98,
      location: 'Anda, Bohol',
      description: 'Discover the untouched beaches and pristine coastline of Anda municipality.',
      maxGroup: 12,
      category: 'Beach & Water Sports'
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.map((tour) => (
            <div key={tour.id} className="card-interactive overflow-hidden">
              <div className="relative">
                <img
                  src={tour.image}
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
                  <span className="badge text-xs">{tour.category}</span>
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
                  {tour.description}
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
                      {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-small text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>Max {tour.maxGroup}</span>
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
                  to={`/tours/${tour.id}`}
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