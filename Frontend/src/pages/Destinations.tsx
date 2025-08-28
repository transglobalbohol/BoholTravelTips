import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Camera, Users } from 'lucide-react';

const Destinations: React.FC = () => {
  const destinations = [
    {
      id: 'chocolate-hills',
      name: 'Chocolate Hills',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Over 1,268 cone-shaped hills that turn chocolate brown during dry season, one of the Philippines\' most iconic natural wonders.',
      detailedDescription: 'The Chocolate Hills are a geological formation in the Bohol province of the Philippines. They are covered in green grass that turns brown during the dry season, resembling chocolate drops.',
      location: 'Carmen, Bohol',
      bestTime: 'December to May',
      activities: ['Sightseeing', 'Photography', 'ATV Tours'],
      attractions: '1,268 Hills',
      estimatedTime: '4-6 hours',
      difficulty: 'Easy',
      highlights: [
        'Iconic cone-shaped limestone hills',
        'Best views from viewing deck',
        'ATV adventure tours available',
        'Perfect for photography'
      ]
    },
    {
      id: 'panglao',
      name: 'Panglao Island',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Beautiful beaches, luxury resorts, world-class diving spots, and pristine white sand beaches perfect for relaxation.',
      detailedDescription: 'Panglao Island is renowned for its stunning white sand beaches, crystal-clear waters, and vibrant marine life. It\'s a paradise for beach lovers and diving enthusiasts.',
      location: 'Panglao, Bohol',
      bestTime: 'November to April',
      activities: ['Beach Activities', 'Diving', 'Snorkeling', 'Island Hopping'],
      attractions: '15+ Beaches',
      estimatedTime: '1-3 days',
      difficulty: 'Easy',
      highlights: [
        'Alona Beach - most popular beach',
        'World-class diving sites',
        'Luxury beach resorts',
        'Vibrant nightlife scene'
      ]
    },
    {
      id: 'tarsier-sanctuary',
      name: 'Philippine Tarsier Sanctuary',
      image: 'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Home to the world\'s smallest primates in their natural habitat, offering unique wildlife viewing experiences.',
      detailedDescription: 'The Philippine Tarsier Sanctuary is dedicated to protecting and conserving the endangered Philippine Tarsier, one of the world\'s smallest primates.',
      location: 'Corella, Bohol',
      bestTime: 'Early morning or late afternoon',
      activities: ['Wildlife Viewing', 'Photography', 'Educational Tours'],
      attractions: 'Wildlife Conservation',
      estimatedTime: '2-3 hours',
      difficulty: 'Easy',
      highlights: [
        'World\'s smallest primates',
        'Conservation education',
        'Natural forest habitat',
        'Guided wildlife tours'
      ]
    },
    {
      id: 'loboc-river',
      name: 'Loboc River',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Scenic river cruise with traditional Filipino lunch and live cultural entertainment amidst lush tropical scenery.',
      detailedDescription: 'The Loboc River offers a peaceful cruise through lush tropical landscapes with floating restaurants serving delicious local cuisine and live cultural performances.',
      location: 'Loboc, Bohol',
      bestTime: '10 AM to 3 PM',
      activities: ['River Cruise', 'Dining', 'Cultural Shows'],
      attractions: 'River Cruise',
      estimatedTime: '3-4 hours',
      difficulty: 'Easy',
      highlights: [
        'Floating restaurant experience',
        'Live cultural performances',
        'Scenic tropical landscapes',
        'Traditional Filipino cuisine'
      ]
    },
    {
      id: 'anda-beaches',
      name: 'Anda Beaches',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Hidden paradise with pristine white sand beaches, clear turquoise waters, and untouched natural beauty.',
      detailedDescription: 'Anda is Bohol\'s best-kept secret, featuring pristine white sand beaches and crystal-clear waters perfect for those seeking a more secluded beach experience.',
      location: 'Anda, Bohol',
      bestTime: 'December to May',
      activities: ['Beach Activities', 'Swimming', 'Photography', 'Relaxation'],
      attractions: 'Hidden Beaches',
      estimatedTime: '1-2 days',
      difficulty: 'Easy',
      highlights: [
        'Pristine white sand beaches',
        'Crystal clear turquoise waters',
        'Less crowded than Panglao',
        'Perfect for photography'
      ]
    },
    {
      id: 'baclayon-church',
      name: 'Baclayon Church',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'One of the oldest churches in the Philippines, built in 1596, showcasing Spanish colonial religious architecture.',
      detailedDescription: 'Baclayon Church, also known as the Immaculate Conception Church, is a historic Roman Catholic church built by Spanish missionaries and is considered one of the oldest churches in the Philippines.',
      location: 'Baclayon, Bohol',
      bestTime: 'Year-round',
      activities: ['Historical Tour', 'Photography', 'Religious Pilgrimage'],
      attractions: 'Historical Site',
      estimatedTime: '1-2 hours',
      difficulty: 'Easy',
      highlights: [
        'Built in 1596 by Spanish missionaries',
        'Beautiful colonial architecture',
        'Religious artifacts and museum',
        'UNESCO World Heritage Site'
      ]
    },
    {
      id: 'hinagdanan-cave',
      name: 'Hinagdanan Cave',
      image: 'https://images.unsplash.com/photo-1551524164-6cf6ac6e24b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Underground cave with natural swimming pool, stalactites, and unique limestone formations.',
      detailedDescription: 'Hinagdanan Cave is a naturally lighted cave with a lagoon. The cave is lit by sunlight which filters through holes in the ceiling.',
      location: 'Panglao Island, Bohol',
      bestTime: 'Year-round',
      activities: ['Cave Exploration', 'Swimming', 'Photography'],
      attractions: 'Underground Pool',
      estimatedTime: '2-3 hours',
      difficulty: 'Moderate',
      highlights: [
        'Underground natural swimming pool',
        'Spectacular stalactites and stalagmites',
        'Natural lighting from ceiling holes',
        'Cool respite from tropical heat'
      ]
    },
    {
      id: 'blood-compact',
      name: 'Blood Compact Monument',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Historical monument commemorating the first treaty of friendship between Filipinos and Spanish explorers.',
      detailedDescription: 'The Blood Compact Monument marks the site where the first treaty of friendship between the indigenous Filipinos and Spanish explorers was made.',
      location: 'Tagbilaran City, Bohol',
      bestTime: 'Year-round',
      activities: ['Historical Tour', 'Photography', 'Cultural Learning'],
      attractions: 'Historical Monument',
      estimatedTime: '1 hour',
      difficulty: 'Easy',
      highlights: [
        'First Filipino-Spanish treaty site',
        'Bronze sculptures depicting the event',
        'Important historical significance',
        'Waterfront location'
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'badge-success';
      case 'moderate':
        return 'badge-warning';
      case 'hard':
        return 'badge-error';
      default:
        return 'badge';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            Destinations in Bohol
          </h1>
          <p className="text-subheading max-w-3xl">
            Explore the most beautiful and iconic destinations across Bohol Island. From natural wonders 
            to historical sites, discover what makes Bohol a unique travel destination.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">8+</div>
            <div className="text-small text-gray-500">Top Destinations</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,268</div>
            <div className="text-small text-gray-500">Chocolate Hills</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
            <div className="text-small text-gray-500">Beautiful Beaches</div>
          </div>
          <div className="card text-center p-6">
            <div className="text-2xl font-bold text-gray-900 mb-1">400+</div>
            <div className="text-small text-gray-500">Years of History</div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="space-y-8">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id}
              className={`card-interactive overflow-hidden ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } lg:flex`}
            >
              {/* Image Section */}
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className={`badge ${getDifficultyColor(destination.difficulty)} text-xs`}>
                    {destination.difficulty}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-heading-2 text-2xl mb-2">{destination.name}</h2>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-small text-gray-500">{destination.location}</span>
                    </div>
                  </div>
                  <span className="badge text-xs">
                    {destination.attractions}
                  </span>
                </div>

                <p className="text-body mb-6">
                  {destination.detailedDescription}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-small font-medium">Duration</div>
                      <div className="text-small text-gray-500">{destination.estimatedTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-small font-medium">Best Time</div>
                      <div className="text-small text-gray-500">{destination.bestTime}</div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <h4 className="text-small font-medium text-gray-900 mb-2">Popular Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.map((activity, actIndex) => (
                      <span key={actIndex} className="badge text-xs">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-small font-medium text-gray-900 mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    {destination.highlights.slice(0, 3).map((highlight, hlIndex) => (
                      <li key={hlIndex} className="flex items-start space-x-2 text-small text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Link
                    to={`/destinations/${destination.id}`}
                    className="btn-primary flex-1 text-center"
                  >
                    Learn More
                  </Link>
                  <Link
                    to={`/tours?destination=${destination.name}`}
                    className="btn-secondary flex-1 text-center"
                  >
                    Find Tours
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="card p-8 text-center mt-12 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-heading-2 text-2xl mb-4">
            Ready to Explore Bohol?
          </h2>
          <p className="text-body mb-6 max-w-2xl mx-auto">
            Discover all these amazing destinations and more with our expertly crafted tours and travel packages. 
            Let us help you create unforgettable memories in Bohol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tours" className="btn-primary">
              Browse All Tours
            </Link>
            <Link to="/contact" className="btn-secondary">
              Plan My Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;