import React from 'react';
import { Link } from 'react-router-dom';

const TravelGuides: React.FC = () => {
  const guides = [
    {
      id: 'best-time-to-visit',
      title: 'Best Travel Guide to Bohol: Everything You Need to Know',
      excerpt: 'Find everything you need to know about Bohol. Learn about the best time to visit, where to go, sample itinerary and travel tips.',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '8 min read',
      category: 'Planning'
    },
    {
      id: 'attractions-guide',
      title: 'Read this guide and find out the best attractions to visit in Bohol',
      excerpt: 'Discover the top-rated attractions, hidden gems, and must-see destinations across the beautiful island of Bohol.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '12 min read',
      category: 'Attractions'
    },
    {
      id: 'when-to-visit',
      title: 'Plan the best time to visit Bohol with this guide!',
      excerpt: 'Learn about weather patterns, festival seasons, and the optimal times for different activities in Bohol.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '6 min read',
      category: 'Weather'
    },
    {
      id: 'itinerary-guide',
      title: 'Discover the ultimate guide to planning your travel itinerary in Bohol',
      excerpt: 'Explore the best 3-day, 5-day, 1-week, and 2-week itineraries for an unforgettable Bohol experience.',
      image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '15 min read',
      category: 'Itinerary'
    },
    {
      id: 'beaches-guide',
      title: 'Discover the best beaches in Bohol with this comprehensive guide!',
      excerpt: 'Learn about Panglao\'s Alona Beach, Anda\'s hidden shores, and more pristine coastal destinations.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '10 min read',
      category: 'Beaches'
    },
    {
      id: 'food-guide',
      title: 'Find out what\'s so special about Bohol cuisine and local delicacies',
      excerpt: 'Explore the unique flavors, traditional dishes, and must-try restaurants across the island.',
      image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c2a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '7 min read',
      category: 'Food'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Essential Travel Information
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get all the essential travel information about Bohol to plan your perfect trip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden card-hover"
            >
              <div className="relative">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {guide.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{guide.readTime}</span>
                  <span className="text-sm text-blue-600 font-medium">Travel Guide</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {guide.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {guide.excerpt}
                </p>
                
                <Link
                  to={`/travel-guides/${guide.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                >
                  Read Guide
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/travel-guides"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            View All Travel Guides
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TravelGuides;