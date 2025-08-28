import React, { useState, useMemo } from 'react';
import { useInstantFilter, useInstantSort } from '../hooks/useFastData';
import { Search, Users, Fuel, Settings, MapPin, Star, Shield, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface CarRental {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  pricePerDay: number;
  originalPrice?: number;
  transmission: 'Manual' | 'Automatic';
  fuelType: 'Gasoline' | 'Diesel' | 'Hybrid';
  seats: number;
  features: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  description: string;
  location: string;
  category: 'Economy' | 'Compact' | 'Mid-size' | 'Premium' | 'SUV';
}

const mockCarRentals: CarRental[] = [
  {
    id: 1,
    name: 'Toyota Vios',
    brand: 'Toyota',
    model: 'Vios',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 2500,
    originalPrice: 2800,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging'],
    rating: 4.5,
    reviewCount: 28,
    availability: true,
    description: 'Perfect sedan for comfortable city and highway driving around Bohol.',
    location: 'Tagbilaran City',
    category: 'Compact'
  },
  {
    id: 2,
    name: 'Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 2300,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'Radio', 'Power Steering', 'Electric Windows'],
    rating: 4.3,
    reviewCount: 15,
    availability: true,
    description: 'Reliable and fuel-efficient sedan ideal for touring Bohol attractions.',
    location: 'Panglao Island',
    category: 'Compact'
  },
  {
    id: 3,
    name: 'Toyota Avanza',
    brand: 'Toyota',
    model: 'Avanza',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1570733117311-d990c3816c47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 3200,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    seats: 7,
    features: ['Air Conditioning', 'Radio', '3 Rows of Seats', 'Large Luggage Space'],
    rating: 4.6,
    reviewCount: 42,
    availability: true,
    description: 'Spacious MPV perfect for family trips and group tours around Bohol.',
    location: 'Bohol-Panglao International Airport',
    category: 'Mid-size'
  },
  {
    id: 4,
    name: 'Mitsubishi Montero Sport',
    brand: 'Mitsubishi',
    model: 'Montero Sport',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 4500,
    originalPrice: 5000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 7,
    features: ['4WD', 'Air Conditioning', 'GPS Navigation', 'Leather Seats', 'Sunroof'],
    rating: 4.8,
    reviewCount: 23,
    availability: true,
    description: 'Premium SUV with 4WD capability, perfect for off-road adventures and countryside tours.',
    location: 'Tagbilaran City',
    category: 'SUV'
  },
  {
    id: 5,
    name: 'Suzuki Ertiga',
    brand: 'Suzuki',
    model: 'Ertiga',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1494976688531-6d909b10e4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 2800,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 7,
    features: ['Air Conditioning', 'Radio', 'Flexible Seating', 'Good Ground Clearance'],
    rating: 4.4,
    reviewCount: 31,
    availability: false,
    description: 'Compact MPV with excellent fuel economy, great for both city and rural driving.',
    location: 'Panglao Island',
    category: 'Mid-size'
  },
  {
    id: 6,
    name: 'Toyota Innova',
    brand: 'Toyota',
    model: 'Innova',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1600713693816-6d93b6afecee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 3800,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 8,
    features: ['Air Conditioning', 'GPS Navigation', 'Captain Chairs', 'Premium Audio System'],
    rating: 4.7,
    reviewCount: 37,
    availability: true,
    description: 'Premium MPV with captain chairs, perfect for comfortable long-distance travel.',
    location: 'Bohol-Panglao International Airport',
    category: 'Premium'
  }
];

const CarRentals: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');



  // Use instant filtering for better performance
  const filteredCars = useInstantFilter(mockCarRentals, (car) => {
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesPrice = 
      priceFilter === 'All' ||
      (priceFilter.includes('Budget') && car.pricePerDay <= 3000) ||
      (priceFilter.includes('Premium') && car.pricePerDay > 3000);
    const matchesSearch = 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Memoize categories and price ranges for better performance
  const categories = useMemo(() => ['All', 'Economy', 'Compact', 'Mid-size', 'Premium', 'SUV'], []);
  const priceRanges = useMemo(() => ['All', 'Budget (≤₱3,000)', 'Premium (>₱3,000)'], []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            Car Rentals in Bohol
          </h1>
          <p className="text-subheading max-w-3xl">
            Explore Bohol at your own pace with our reliable and affordable car rental service. 
            From compact sedans to spacious SUVs, we have the perfect vehicle for your adventure.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Types' : category}
                  </option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="input min-w-[180px]"
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range === 'All' ? 'All Prices' : range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <h2 className="text-heading-3 text-xl mb-2">Available Cars</h2>
          <p className="text-body">
            {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available for rent
          </p>
        </div>

        {/* Car Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCars.map((car) => (
            <div key={car.id} className="card-interactive overflow-hidden relative">
              {/* Availability Overlay */}
              {!car.availability && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
                  <span className="text-white font-semibold text-lg">Not Available</span>
                </div>
              )}

              {/* Car Image */}
              <div className="relative h-48">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 badge badge-primary text-xs">
                  {car.category}
                </div>
                {car.originalPrice && (
                  <div className="absolute top-3 right-3 badge badge-error text-xs">
                    -{Math.round(((car.originalPrice - car.pricePerDay) / car.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-heading-3 text-lg font-bold text-gray-900">{car.name}</h3>
                    <p className="text-small text-gray-500">{car.year} {car.brand} {car.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      {car.originalPrice && (
                        <span className="text-small text-gray-500 line-through">
                          ₱{car.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-xl font-bold text-gray-900">
                        ₱{car.pricePerDay.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-small text-gray-500">per day</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-small text-gray-500">{car.location}</span>
                </div>

                <p className="text-body text-sm mb-4 line-clamp-2">{car.description}</p>

                {/* Car Specs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-small text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{car.seats} seats</span>
                  </div>
                  <div className="flex items-center space-x-2 text-small text-gray-600">
                    <Fuel className="w-3 h-3" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-small text-gray-600">
                    <Settings className="w-3 h-3" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(car.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-small text-gray-600">
                      {car.rating} ({car.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="badge text-xs">
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className="badge text-xs">
                        +{car.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={!car.availability}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    car.availability
                      ? 'btn-primary'
                      : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                >
                  {car.availability ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCars.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-heading-3 text-lg mb-2">No cars found</h3>
            <p className="text-body mb-6">Try adjusting your search criteria or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setPriceFilter('All');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Our Car Rental */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-heading-2 mb-4">Why Choose Our Car Rental Service?</h2>
            <p className="text-subheading max-w-2xl mx-auto">
              We provide the best car rental experience in Bohol with competitive prices and excellent service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Well-Maintained Vehicles',
                description: 'All our cars are regularly serviced and inspected for your safety and comfort.',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'Competitive Pricing',
                description: 'Best rates in Bohol with no hidden fees. What you see is what you pay.',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Support',
                description: 'Round-the-clock customer support and emergency roadside assistance.',
                color: 'text-yellow-600 bg-yellow-50'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Convenient Locations',
                description: 'Pick up and drop off at the airport, hotels, or other convenient locations.',
                color: 'text-purple-600 bg-purple-50'
              }
            ].map((feature, index) => (
              <div key={index} className="card text-center p-6">
                <div className={`${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-heading-3 text-lg mb-4">{feature.title}</h3>
                <p className="text-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-gray-50 to-white">
            <h2 className="text-heading-2 mb-4">Ready to Explore Bohol?</h2>
            <p className="text-body-large max-w-2xl mx-auto mb-8">
              Book your perfect rental car today and start your Bohol adventure. 
              We're here to make your journey comfortable and memorable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#top" className="btn-primary">
                Book a Car Now
              </a>
              <a href="/contact" className="btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRentals;