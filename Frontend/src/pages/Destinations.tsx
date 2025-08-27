import React from 'react';
import { Link } from 'react-router-dom';

const Destinations: React.FC = () => {
  const destinations = [
    {
      id: 'chocolate-hills',
      name: 'Chocolate Hills',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Over 1,268 cone-shaped hills that turn chocolate brown during dry season',
    },
    {
      id: 'panglao',
      name: 'Panglao Island',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Beautiful beaches, luxury resorts, and world-class diving spots',
    },
    {
      id: 'tarsier-sanctuary',
      name: 'Tarsier Sanctuary',
      image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Home to the world\'s smallest primates in their natural habitat',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Destinations in Bohol
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Explore the most beautiful and iconic destinations across Bohol Island.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {destination.name}
                </h3>
                <p className="text-gray-600 mb-4">{destination.description}</p>
                <Link
                  to={`/destinations/${destination.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;