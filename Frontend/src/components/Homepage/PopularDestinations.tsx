import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const PopularDestinations: React.FC = () => {
  const destinations = [
    {
      id: 'chocolate-hills',
      name: 'Chocolate Hills',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Over 1,268 cone-shaped hills that turn chocolate brown during dry season',
      attractions: '1,268 Hills',
      location: 'Carmen, Bohol',
      category: 'Natural Wonder'
    },
    {
      id: 'panglao',
      name: 'Panglao Island',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Beautiful beaches, luxury resorts, and world-class diving spots',
      attractions: '15+ Beaches',
      location: 'Panglao, Bohol',
      category: 'Beach Paradise'
    },
    {
      id: 'tarsier-sanctuary',
      name: 'Tarsier Sanctuary',
      image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Home to the world\'s smallest primates in their natural habitat',
      attractions: 'Wildlife Conservation',
      location: 'Corella, Bohol',
      category: 'Wildlife'
    },
    {
      id: 'loboc-river',
      name: 'Loboc River',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Scenic river cruise with traditional Filipino lunch and entertainment',
      attractions: 'River Cruise',
      location: 'Loboc, Bohol',
      category: 'Cultural Experience'
    },
    {
      id: 'anda-beaches',
      name: 'Anda Beaches',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Hidden paradise with pristine white sand beaches and clear waters',
      attractions: 'Hidden Beaches',
      location: 'Anda, Bohol',
      category: 'Hidden Gem'
    },
    {
      id: 'baclayon-church',
      name: 'Baclayon Church',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'One of the oldest churches in the Philippines, built in 1596',
      attractions: 'Historical Site',
      location: 'Baclayon, Bohol',
      category: 'Heritage'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 mb-4">
            Popular Destinations in Bohol
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Explore the most visited and breathtaking destinations that make Bohol a tropical paradise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="card-interactive overflow-hidden relative group"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge bg-white/20 backdrop-blur-sm text-white border-white/20 text-xs">
                    {destination.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-200">
                    <MapPin className="w-3 h-3" />
                    <span>{destination.location}</span>
                  </div>
                </div>
                
                <h3 className="text-heading-3 text-xl mb-2 group-hover:text-blue-300 transition-colors duration-200">
                  {destination.name}
                </h3>
                
                <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                  {destination.description}
                </p>
                
                <div className="flex items-center text-blue-300 text-sm font-medium">
                  <span>Explore destination</span>
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/destinations"
            className="btn-primary inline-flex items-center"
          >
            View All Destinations
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;