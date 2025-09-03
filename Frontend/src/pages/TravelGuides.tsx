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
          Bohol enjoys a tropical climate with two distinct seasons that will greatly influence your travel experience. 
          Here's everything you need to know to plan the perfect trip to this stunning Philippine island.
        </p>
        
        <h3 className="text-heading-3 text-lg mb-4">Dry Season (December to May) - Best Time to Visit</h3>
        <p className="text-body mb-4">
          The dry season is the ideal time for beach and island activities, offering:
        </p>
        <ul className="list-disc pl-6 text-body mb-6">
          <li>Perfect weather conditions with minimal rainfall</li>
          <li>Ideal for island hopping, beach activities, and outdoor adventures</li>
          <li>Best time to see the Chocolate Hills turn their iconic brown color</li>
          <li>Excellent visibility for diving and snorkeling</li>
          <li>Peak tourist season with vibrant atmosphere</li>
        </ul>
        
        <h3 className="text-heading-3 text-lg mb-4">Rainy Season (June to November) - Still Worth Visiting</h3>
        <p className="text-body mb-4">
          Don't let the rainy season deter you - Bohol is still enjoyable with proper preparation:
        </p>
        <ul className="list-disc pl-6 text-body mb-6">
          <li>Expect sudden showers, but they're usually brief</li>
          <li>Lush green landscapes create stunning photography opportunities</li>
          <li>Lower accommodation rates and fewer crowds</li>
          <li>Great for cultural activities and covered attractions</li>
          <li>Always pack a light rain jacket or umbrella</li>
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
        
        <hr className="border-gray-200 my-8" />
        
        <h2 className="text-heading-3 text-xl mb-6">Essential Travel Hacks</h2>
        <div className="mb-8">
          <h4 className="font-medium text-gray-700 mb-6">Pro Tips for Your Bohol Adventure</h4>
          <div className="space-y-5">
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">1.</span>
              <p className="text-body"><strong>Start early:</strong> Begin your tours early to avoid crowds at Chocolate Hills, Loboc River, and Panglao attractions.</p>
            </div>
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">2.</span>
              <p className="text-body"><strong>Book island hopping in advance:</strong> Permits for Balicasag & Virgin Island are limited, so secure your spots early.</p>
            </div>
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">3.</span>
              <p className="text-body"><strong>Bring cash:</strong> Many attractions and local shops don't accept cards, so come prepared with Philippine pesos.</p>
            </div>
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">4.</span>
              <p className="text-body"><strong>Plan Anda separately:</strong> It's 2-3 hours from Panglao, so consider staying overnight there for the full experience.</p>
            </div>
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">5.</span>
              <p className="text-body"><strong>Try local delicacies:</strong> Don't miss peanut kisses, kalamay from Jagna, and fresh seafood specialties.</p>
            </div>
            <div className="flex items-start space-x-4 pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium min-w-[20px]">6.</span>
              <p className="text-body"><strong>Negotiate tricycle fares:</strong> Always agree on the price before riding to avoid overcharging.</p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-gray-600 font-medium min-w-[20px]">7.</span>
              <p className="text-body"><strong>Evening vibes:</strong> Panglao evenings are quiet compared to Boracay - perfect for relaxation and peaceful sunset watching.</p>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-200 my-8" />
        
        <h2 className="text-heading-3 text-xl mb-6">Our Recommendation</h2>
        <div className="mb-6">
          <p className="text-body mb-4">
            <strong>Best overall time:</strong> Visit during the dry season (December to May) for optimal weather conditions. 
            For the Chocolate Hills' iconic brown appearance, plan your visit during the dry months when the grass turns golden brown.
          </p>
          <p className="text-body">
            <strong>Budget-friendly alternative:</strong> The shoulder months of November-December or April-May offer 
            a great balance of good weather, reasonable prices, and fewer crowds.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const AttractionsGuide: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (attraction: any) => {
    setSelectedAttraction(attraction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setIsModalOpen(false);
  };

  return (
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
              id: 'chocolate-hills',
              name: 'Chocolate Hills',
              description: 'Over 1,268 cone-shaped hills that turn chocolate brown during the dry season. This geological wonder is Bohol\'s most iconic attraction.',
              highlights: ['Best viewing at Carmen viewpoint', 'Early morning or late afternoon for best photos', 'ATV tours available'],
              image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              modalImage: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              location: 'Carmen, Bohol, Philippines',
              coordinates: '9.9167° N, 124.1667° E',
              entryFee: '₱50 for adults, ₱30 for students/seniors',
              bestTime: 'Early morning (6-8 AM) or late afternoon (4-6 PM)',
              facilities: ['Visitor center', 'Viewing deck', 'Souvenir shops', 'Parking area', 'Restrooms'],
              funFacts: [
                'Legend says they were formed from the tears of a giant',
                'The hills are made of marine limestone',
                'They turn brown during the dry season (February to May)',
                'UNESCO World Heritage Site candidate'
              ],
              clickable: true
            },
            {
              id: 'tarsier-sanctuary',
              name: 'Philippine Tarsier Sanctuary',
              description: 'Home to the world\'s smallest primates. This conservation center protects the endangered Philippine Tarsier in their natural habitat.',
              highlights: ['Silent observation required', 'Best visited in early morning', 'Educational guided tours available'],
              image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              modalImage: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              location: 'Corella, Bohol, Philippines',
              coordinates: '9.7167° N, 123.9167° E',
              entryFee: '₱60 for adults, ₱40 for students/children',
              bestTime: 'Early morning (7-9 AM) when tarsiers are most active',
              facilities: ['Guided tours', 'Information center', 'Gift shop', 'Walking trails', 'Research facility', 'Parking area'],
              funFacts: [
                'Tarsiers are one of the smallest primates in the world',
                'Their eyes are larger than their brains',
                'They can rotate their heads 180 degrees',
                'They are nocturnal creatures that sleep during the day',
                'Each tarsier weighs only about 120-140 grams'
              ],
              clickable: true
            },
            {
              id: 'panglao-beaches',
              name: 'Panglao Island Beaches',
              description: 'World-class beaches with pristine white sand and crystal-clear waters. Perfect for swimming, diving, and relaxation.',
              highlights: ['Alona Beach - most popular', 'Dumaluan Beach - quieter option', 'Excellent diving and snorkeling sites'],
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              modalImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              location: 'Panglao Island, Bohol, Philippines',
              coordinates: '9.5833° N, 123.7500° E',
              entryFee: 'Free access to beaches (resort facilities may have fees)',
              bestTime: 'Early morning (6-8 AM) or late afternoon (4-6 PM) for best lighting',
              facilities: ['Beach resorts', 'Dive shops', 'Restaurants', 'Water sports rentals', 'Beach bars', 'Souvenir shops'],
              funFacts: [
                'Panglao has over 50 diving sites with diverse marine life',
                'The island is connected to mainland Bohol by two bridges',
                'Alona Beach is just 1.5 kilometers long but world-famous',
                'The waters around Panglao are home to dolphins and whales',
                'The island has some of the finest white sand beaches in the Philippines'
              ],
              clickable: true
            }
          ].map((attraction, index) => (
            <div key={index}>
              <div className={`py-6 ${attraction.clickable ? 'cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 -mx-4' : 'px-4 -mx-4'}`}
                   onClick={() => attraction.clickable ? openModal(attraction) : null}>
                <div className="md:flex gap-6">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-heading-3 text-xl line-clamp-2 leading-tight">
                        {attraction.name}
                      </h3>
                      {attraction.clickable && (
                        <span className="text-blue-500 text-sm font-medium bg-blue-50 px-2 py-1 rounded">
                          Click for details
                        </span>
                      )}
                    </div>
                    
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
              {index < 2 && <hr className="border-gray-200 my-6" />}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && selectedAttraction && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <img
              src={selectedAttraction.modalImage}
              alt={selectedAttraction.name}
              className="w-full h-64 md:h-96 object-cover rounded-t-xl"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-heading-2 text-2xl mb-4">{selectedAttraction.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Map className="w-4 h-4 mr-2" />
                  Location
                </h3>
                <p className="text-body mb-2">{selectedAttraction.location}</p>
                <p className="text-small text-gray-600">{selectedAttraction.coordinates}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Best Time to Visit
                </h3>
                <p className="text-body">{selectedAttraction.bestTime}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Entry Fee</h3>
              <p className="text-body">{selectedAttraction.entryFee}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Available Facilities</h3>
              <ul className="grid grid-cols-2 gap-2 text-body">
                {selectedAttraction.facilities.map((facility, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {facility}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Fun Facts</h3>
              <ul className="space-y-2 text-body">
                {selectedAttraction.funFacts.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 font-bold mr-2 mt-1">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-body mb-4">{selectedAttraction.description}</p>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                <ul className="list-disc list-inside text-body text-gray-600">
                  {selectedAttraction.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

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