import React from 'react';
import { Link } from 'react-router-dom';

const PopularDestinations: React.FC = () => {
  const destinations = [
    {
      id: 'chocolate-hills',
      name: 'Chocolate Hills',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Over 1,268 cone-shaped hills that turn chocolate brown during dry season',
      attractions: '1,268 Hills',
      location: 'Carmen, Bohol'
    },
    {
      id: 'panglao',
      name: 'Panglao Island',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Beautiful beaches, luxury resorts, and world-class diving spots',
      attractions: '15+ Beaches',
      location: 'Panglao, Bohol'
    },
    {
      id: 'tarsier-sanctuary',
      name: 'Tarsier Sanctuary',
      image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Home to the world\'s smallest primates in their natural habitat',
      attractions: 'Wildlife Conservation',
      location: 'Corella, Bohol'
    },
    {
      id: 'loboc-river',
      name: 'Loboc River',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Scenic river cruise with traditional Filipino lunch and entertainment',
      attractions: 'River Cruise',
      location: 'Loboc, Bohol'
    },
    {
      id: 'anda-beaches',
      name: 'Anda Beaches',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'Hidden paradise with pristine white sand beaches and clear waters',
      attractions: 'Hidden Beaches',
      location: 'Anda, Bohol'
    },
    {
      id: 'baclayon-church',
      name: 'Baclayon Church',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c2a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      description: 'One of the oldest churches in the Philippines, built in 1596',
      attractions: 'Historical Site',
      location: 'Baclayon, Bohol'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations in Bohol
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the most visited and breathtaking destinations that make Bohol a tropical paradise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition duration-300 card-hover"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {destination.attractions}
                  </span>
                  <span className="text-sm text-gray-200">
                    {destination.location}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition duration-200">
                  {destination.name}
                </h3>
                
                <p className="text-gray-200 text-sm line-clamp-2">
                  {destination.description}
                </p>
                
                <div className="flex items-center mt-3 text-blue-300 text-sm font-medium">
                  <span>Explore destination</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/destinations"
            className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            View All Destinations
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;