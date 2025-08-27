import React from 'react';

const TravelGuides: React.FC = () => {
  const guides = [
    {
      id: 'best-time-to-visit',
      title: 'Best Time to Visit Bohol',
      excerpt: 'Learn about the weather patterns and optimal times to visit Bohol',
      category: 'Planning'
    },
    {
      id: 'attractions-guide',
      title: 'Top Attractions in Bohol',
      excerpt: 'Discover the must-see destinations across the island',
      category: 'Attractions'
    },
    {
      id: 'food-guide',
      title: 'Bohol Food Guide',
      excerpt: 'Explore the local cuisine and best restaurants',
      category: 'Food'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Travel Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Essential travel information and guides for your Bohol adventure.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-lg shadow-sm border p-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mb-2">
                {guide.category}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {guide.title}
              </h3>
              <p className="text-gray-600 mb-4">{guide.excerpt}</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Read Guide →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelGuides;