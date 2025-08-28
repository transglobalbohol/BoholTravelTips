import React, { useState, useMemo } from 'react';
import { useInstantFilter } from '../hooks/useFastData';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight, Search, Filter, Calendar, Map, Utensils, Camera, Navigation } from 'lucide-react';

// Individual Guide Components
const BestTimeGuide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="card p-8 mb-8">
      <div className="mb-6">
        <span className="badge badge-primary text-sm">Planning Guide</span>
        <h1 className="text-heading-1 mt-4 mb-4">Best Time to Visit Bohol</h1>
        <div className="flex items-center space-x-4 text-small text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>15 min read</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Updated Dec 2024</span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Bohol landscape"
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      </div>
      
      <div className="prose max-w-none">
        <h2 className="text-heading-3 text-xl mb-4">Weather Overview</h2>
        <p className="text-body mb-6">
          Bohol enjoys a tropical climate with two distinct seasons: the dry season and the wet season. 
          Understanding these patterns will help you plan the perfect trip to this beautiful Philippine island.
        </p>
        
        <h3 className="text-heading-3 text-lg mb-4">Dry Season (December to May)</h3>
        <p className="text-body mb-4">
          The dry season is considered the best time to visit Bohol, characterized by:
        </p>
        <ul className="list-disc pl-6 text-body mb-6">
          <li>Less rainfall and lower humidity</li>
          <li>Perfect weather for outdoor activities and sightseeing</li>
          <li>Ideal conditions for island hopping and beach activities</li>
          <li>Peak tourist season with higher accommodation rates</li>
        </ul>
        
        <h3 className="text-heading-3 text-lg mb-4">Wet Season (June to November)</h3>
        <p className="text-body mb-4">
          While it's the rainy season, Bohol can still be enjoyable with:
        </p>
        <ul className="list-disc pl-6 text-body mb-6">
          <li>Lower accommodation rates and fewer crowds</li>
          <li>Lush green landscapes, especially the Chocolate Hills</li>
          <li>Short, intense rain showers rather than all-day rain</li>
          <li>Great for cultural activities and indoor attractions</li>
        </ul>
        
        <h2 className="text-heading-3 text-xl mb-4">Monthly Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { month: 'December - February', weather: 'Cool & Dry', description: 'Peak season, perfect weather, higher prices' },
            { month: 'March - May', weather: 'Hot & Dry', description: 'Hot but dry, great for beaches, summer crowds' },
            { month: 'June - August', weather: 'Wet Season', description: 'Regular rainfall, lush landscapes, fewer tourists' },
            { month: 'September - November', weather: 'Typhoon Season', description: 'Possible storms, lowest prices, green scenery' }
          ].map((period, index) => (
            <div key={index} className="card p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{period.month}</h4>
              <p className="text-small text-blue-600 font-medium mb-2">{period.weather}</p>
              <p className="text-small text-gray-600">{period.description}</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-heading-3 text-xl mb-4">Our Recommendation</h2>
        <p className="text-body mb-6">
          For the best balance of good weather, reasonable prices, and fewer crowds, we recommend visiting 
          Bohol during the shoulder months of November-December or April-May. These periods offer 
          pleasant weather conditions while avoiding the peak season rush.
        </p>
      </div>
    </div>
  </div>
);

const AttractionsGuide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="card p-8 mb-8">
      <div className="mb-6">
        <span className="badge badge-primary text-sm">Attractions Guide</span>
        <h1 className="text-heading-1 mt-4 mb-4">Top Attractions in Bohol</h1>
        <div className="flex items-center space-x-4 text-small text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>20 min read</span>
          </div>
          <div className="flex items-center space-x-1">
            <Map className="w-4 h-4" />
            <span>12 Top Attractions</span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Bohol attractions"
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      </div>
      
      <div className="prose max-w-none">
        <p className="text-body-large mb-8">
          Discover Bohol's most spectacular attractions, from the world-famous Chocolate Hills to pristine beaches 
          and unique wildlife encounters. Here's your complete guide to the must-see destinations.
        </p>
        
        <div className="space-y-8">
          {[
            {
              name: 'Chocolate Hills',
              description: 'Over 1,268 cone-shaped hills that turn chocolate brown during the dry season. This geological wonder is Bohol\'s most iconic attraction.',
              highlights: ['Best viewing at Carmen viewpoint', 'Early morning or late afternoon for best photos', 'ATV tours available'],
              image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            },
            {
              name: 'Philippine Tarsier Sanctuary',
              description: 'Home to the world\'s smallest primates. This conservation center protects the endangered Philippine Tarsier in their natural habitat.',
              highlights: ['Silent observation required', 'Best visited in early morning', 'Educational guided tours available'],
              image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            },
            {
              name: 'Panglao Island Beaches',
              description: 'World-class beaches with pristine white sand and crystal-clear waters. Perfect for swimming, diving, and relaxation.',
              highlights: ['Alona Beach - most popular', 'Dumaluan Beach - quieter option', 'Excellent diving and snorkeling sites'],
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            }
          ].map((attraction, index) => (
            <div key={index} className="card p-6">
              <div className="md:flex gap-6">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0"
                />
                <div className="flex-1">
                  <h3 className="text-heading-3 text-xl mb-3">{attraction.name}</h3>
                  <p className="text-body mb-4">{attraction.description}</p>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                    <ul className="list-disc list-inside text-small text-gray-600">
                      {attraction.highlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FoodGuide: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="card p-8 mb-8">
      <div className="mb-6">
        <span className="badge badge-primary text-sm">Food Guide</span>
        <h1 className="text-heading-1 mt-4 mb-4">Bohol Food & Dining Guide</h1>
        <div className="flex items-center space-x-4 text-small text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>12 min read</span>
          </div>
          <div className="flex items-center space-x-1">
            <Utensils className="w-4 h-4" />
            <span>Local Cuisine</span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1520637736862-4d197d17c2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Bohol local food"
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      </div>
      
      <div className="prose max-w-none">
        <p className="text-body-large mb-8">
          Discover the unique flavors of Bohol with our comprehensive food guide. From traditional Filipino dishes 
          with a local twist to fresh seafood specialties, Bohol offers a culinary adventure for every taste.
        </p>
        
        <h2 className="text-heading-3 text-xl mb-6">Must-Try Local Specialties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { dish: 'Kalamay', description: 'Sticky rice cake made with coconut milk, brown sugar, and glutinous rice. A perfect sweet souvenir.' },
            { dish: 'Peanut Kisses', description: 'Bohol\'s famous cookie made with roasted peanuts, shaped like Chocolate Hills.' },
            { dish: 'Bohol Bee Farm Ice Cream', description: 'Organic ice cream made with local ingredients in unique flavors.' },
            { dish: 'Fresh Seafood', description: 'Grilled fish, prawns, and crabs caught fresh from Bohol\'s pristine waters.' }
          ].map((item, index) => (
            <div key={index} className="card p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{item.dish}</h4>
              <p className="text-small text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-heading-3 text-xl mb-4">Where to Eat</h2>
        <p className="text-body mb-6">
          From roadside eateries to fine dining restaurants, Bohol offers diverse dining experiences. 
          Don't miss the floating restaurants on Loboc River for a unique dining experience, 
          or visit the Bohol Bee Farm for organic, farm-to-table meals with stunning ocean views.
        </p>
      </div>
    </div>
  </div>
);

const TravelGuides: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const guides = [
    {
      id: 'best-time-to-visit',
      title: 'Best Time to Visit Bohol: Complete Weather Guide',
      excerpt: 'Learn about weather patterns, seasonal highlights, and the optimal times to visit Bohol for different activities.',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '15 min read',
      category: 'Planning',
      featured: true
    },
    {
      id: 'attractions',
      title: 'Top 15 Must-See Attractions in Bohol',
      excerpt: 'Discover the most spectacular destinations across Bohol, from the famous Chocolate Hills to hidden gems.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '20 min read',
      category: 'Attractions',
      featured: true
    },
    {
      id: 'itinerary',
      title: 'Perfect 3-Day Bohol Itinerary',
      excerpt: 'A carefully planned 3-day itinerary covering all the highlights of Bohol, perfect for first-time visitors.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '18 min read',
      category: 'Itinerary',
      featured: true
    },
    {
      id: 'food',
      title: 'Bohol Food Guide: Local Cuisine & Best Restaurants',
      excerpt: 'Explore Bohol\'s unique culinary scene, from traditional specialties to must-visit restaurants.',
      image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '12 min read',
      category: 'Food',
      featured: false
    },
    {
      id: 'beaches',
      title: 'Ultimate Guide to Bohol\'s Best Beaches',
      excerpt: 'From popular Alona Beach to hidden coves, discover the most beautiful beaches in Bohol.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '14 min read',
      category: 'Beaches',
      featured: false
    },
    {
      id: 'transportation',
      title: 'Getting Around Bohol: Transportation Guide',
      excerpt: 'Complete guide to transportation options in Bohol, from airports to local transport.',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      readTime: '10 min read',
      category: 'Transportation',
      featured: false
    }
  ];

  // Memoized categories for better performance
  const categories = useMemo(() => ['All', 'Planning', 'Attractions', 'Itinerary', 'Food', 'Beaches', 'Transportation'], []);

  // Use instant filtering for better performance
  const filteredGuides = useInstantFilter(guides, (guide) => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Memoized categories for better performance
  const categories = useMemo(() => ['All', 'Planning', 'Attractions', 'Itinerary', 'Food', 'Beaches', 'Transportation'], []);

  // Check if we're viewing a specific guide
  if (location.pathname !== '/travel-guides') {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container py-8">
          <Routes>
            <Route path="best-time-to-visit" element={<BestTimeGuide />} />
            <Route path="attractions" element={<AttractionsGuide />} />
            <Route path="food" element={<FoodGuide />} />
            <Route path="*" element={
              <div className="text-center py-16">
                <h2 className="text-heading-2 mb-4">Guide Not Found</h2>
                <p className="text-body mb-6">The travel guide you're looking for doesn't exist.</p>
                <Link to="/travel-guides" className="btn-primary">
                  View All Guides
                </Link>
              </div>
            } />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            Bohol Travel Guides
          </h1>
          <p className="text-subheading max-w-3xl">
            Essential travel information, insider tips, and comprehensive guides to help you make the most of your Bohol adventure.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search travel guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Guides */}
        <div className="mb-12">
          <h2 className="text-heading-2 mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredGuides.filter(guide => guide.featured).map((guide) => (
              <Link
                key={guide.id}
                to={`/travel-guides/${guide.id}`}
                className="card-interactive overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 badge badge-primary text-xs">
                    Featured
                  </div>
                  <div className="absolute top-3 right-3 badge bg-white/90 text-gray-800 text-xs">
                    {guide.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-small text-gray-500">{guide.readTime}</span>
                  </div>
                  
                  <h3 className="text-heading-3 text-lg mb-3 line-clamp-2 leading-tight">
                    {guide.title}
                  </h3>
                  
                  <p className="text-body text-sm mb-4 line-clamp-3">
                    {guide.excerpt}
                  </p>
                  
                  <div className="flex items-center text-gray-900 font-medium">
                    <span>Read Guide</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Guides */}
        <div>
          <h2 className="text-heading-2 mb-6">All Travel Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <Link
                key={guide.id}
                to={`/travel-guides/${guide.id}`}
                className="card-interactive overflow-hidden"
              >
                <div className="md:flex">
                  <div className="relative md:w-48 h-32">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {guide.featured && (
                      <div className="absolute top-2 left-2 badge badge-primary text-xs">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge text-xs">{guide.category}</span>
                      <div className="flex items-center space-x-1 text-small text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{guide.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-heading-3 text-lg mb-3 line-clamp-2">
                      {guide.title}
                    </h3>
                    
                    <p className="text-body text-sm mb-4 line-clamp-2">
                      {guide.excerpt}
                    </p>
                    
                    <div className="flex items-center text-gray-900 font-medium">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>Read Guide</span>
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-heading-3 text-lg mb-2">No guides found</h3>
            <p className="text-body mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelGuides;