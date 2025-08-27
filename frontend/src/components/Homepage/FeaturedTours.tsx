import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedTours: React.FC = () => {
  const featuredTours = [
    {
      id: '1',
      title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 2500,
      duration: '8 hours',
      rating: 4.8,
      reviews: 324,
      location: 'Carmen, Bohol',
      description: 'Visit the famous Chocolate Hills and meet the adorable tarsiers in this comprehensive day tour.',
    },
    {
      id: '2',
      title: 'Panglao Island Hopping Adventure',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 1800,
      duration: '6 hours',
      rating: 4.9,
      reviews: 256,
      location: 'Panglao, Bohol',
      description: 'Explore pristine beaches and crystal-clear waters around Panglao Island.',
    },
    {
      id: '3',
      title: 'Loboc River Cruise with Lunch',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 1200,
      duration: '4 hours',
      rating: 4.7,
      reviews: 189,
      location: 'Loboc, Bohol',
      description: 'Enjoy a peaceful river cruise with traditional Filipino lunch and local entertainment.',
    },
    {
      id: '4',
      title: 'Anda Hidden Beaches Tour',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      price: 2200,
      duration: '10 hours',
      rating: 4.6,
      reviews: 98,
      location: 'Anda, Bohol',
      description: 'Discover the untouched beaches and pristine coastline of Anda municipality.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Tours & Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best of Bohol with our hand-picked tours and activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden card-hover">
              <div className="relative">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                  Featured
                </div>
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
                  ₱{tour.price.toLocaleString()}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{tour.location}</span>
                  <span className="text-sm text-blue-600 font-medium">{tour.duration}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {tour.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {tour.description}
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
                      {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                </div>
                
                <Link
                  to={`/tours/${tour.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center block"
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
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            View All Tours
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;