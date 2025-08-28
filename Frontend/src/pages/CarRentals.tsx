import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInstantFilter } from '../hooks/useFastData';
import { Search, Users, Fuel, Settings, MapPin, Star, Shield, DollarSign, Clock, CheckCircle, Filter } from 'lucide-react';
import { FilterService } from '../services/filterService';

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
  },
  {
    id: 7,
    name: 'Nissan Almera',
    brand: 'Nissan',
    model: 'Almera',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 2200,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'Radio', 'Power Steering'],
    rating: 4.2,
    reviewCount: 18,
    availability: true,
    description: 'Budget-friendly sedan perfect for city driving and short trips.',
    location: 'Tagbilaran City',
    category: 'Economy'
  },
  {
    id: 8,
    name: 'Ford EcoSport',
    brand: 'Ford',
    model: 'EcoSport',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pricePerDay: 3500,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera'],
    rating: 4.4,
    reviewCount: 25,
    availability: true,
    description: 'Compact SUV with good ground clearance for various road conditions.',
    location: 'Panglao Island',
    category: 'Compact'
  }
];

const CarRentals: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL parameters
  const initialFilters = useMemo(() => {
    const urlFilters = FilterService.parseFiltersFromURL(searchParams);
    return FilterService.mergeWithDefaults({
      ...urlFilters,
      priceRange: urlFilters.priceRange || { min: 1000, max: 6000 }
    }, 'tours'); // Using tours as base template
  }, [searchParams]);

  const [filters, setFilters] = useState(initialFilters);

  // Use instant filtering for better performance
  const filteredCars = useInstantFilter(mockCarRentals, (car) => {
    const matchesCategory = !filters.category || filters.category === 'All' || car.category === filters.category;
    
    const matchesPrice = !filters.priceRange || (
      (!filters.priceRange.min || car.pricePerDay >= filters.priceRange.min) &&
      (!filters.priceRange.max || car.pricePerDay <= filters.priceRange.max)
    );
    
    const matchesLocation = !filters.destination || filters.destination === '' || 
      car.location.toLowerCase().includes(filters.destination.toLowerCase());
    
    const matchesSearch = !filters.search || filters.search === '' || (
      car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
      car.location.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    const matchesTransmission = !filters.difficulty || filters.difficulty === '' || car.transmission === filters.difficulty;
    const matchesFuelType = !filters.duration || filters.duration === '' || car.fuelType === filters.duration;
    const matchesAvailability = car.availability; // Only show available cars
    
    return matchesCategory && matchesPrice && matchesLocation && matchesSearch && 
           matchesTransmission && matchesFuelType && matchesAvailability;
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL
    const cleanedFilters = FilterService.clearEmptyFilters(newFilters);
    const params = FilterService.buildQueryParams(cleanedFilters);
    setSearchParams(params);
  };

  const clearFilters = () => {
    const defaultFilters = FilterService.getDefaultFilters('tours');
    defaultFilters.priceRange = { min: 1000, max: 6000 };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  };

  // Filter options
  const categories = useMemo(() => [
    'All',
    'Economy',
    'Compact', 
    'Mid-size',
    'Premium',
    'SUV'
  ], []);

  const locations = useMemo(() => [
    'All Locations',
    'Tagbilaran City',
    'Panglao Island',
    'Bohol-Panglao International Airport'
  ], []);

  const transmissions = ['All Transmissions', 'Automatic', 'Manual'];
  const fuelTypes = ['All Fuel Types', 'Gasoline', 'Diesel', 'Hybrid'];

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-heading-3 text-lg">Filter Cars</h3>
              </div>

              {/* Search */}
              <div className="form-group mb-6">
                <label className="form-label">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Cars
                </label>
                <input
                  type="text"
                  placeholder="Search by brand, model, location..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input"
                />
              </div>

              {/* Location */}
              <div className="form-group mb-6">
                <label className="form-label">Location</label>
                <select
                  value={filters.destination || ''}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="input"
                >
                  {locations.map((location) => (
                    <option key={location} value={location === 'All Locations' ? '' : location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="form-group mb-6">
                <label className="form-label">Vehicle Type</label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => handleFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Types' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="form-group mb-6">
                <label className="form-label">Price Range (₱ per day)</label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Maximum: ₱{filters.priceRange?.max?.toLocaleString() || '6,000'}
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="6000"
                      step="200"
                      value={filters.priceRange?.max || 6000}
                      onChange={(e) => handleFilterChange('priceRange', { 
                        ...filters.priceRange, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-small text-gray-500">
                    <span>₱1,000</span>
                    <span>₱6,000+</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="form-group mb-6">
                <label className="form-label">Transmission</label>
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="input"
                >
                  {transmissions.map((transmission) => (
                    <option key={transmission} value={transmission === 'All Transmissions' ? '' : transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="form-group mb-6">
                <label className="form-label">Fuel Type</label>
                <select
                  value={filters.duration || ''}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="input"
                >
                  {fuelTypes.map((fuelType) => (
                    <option key={fuelType} value={fuelType === 'All Fuel Types' ? '' : fuelType}>
                      {fuelType}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full text-primary hover:text-primary-dark text-sm border border-primary hover:bg-primary hover:text-white transition-colors rounded-lg px-4 py-2"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Car Listings */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="mb-6">
              <h2 className="text-heading-3 text-xl mb-2">Available Cars</h2>
              <p className="text-body">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available for rent
              </p>
            </div>

            {/* Car Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredCars.map((car) => (
                <div key={car.id} className="card-interactive overflow-hidden">
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
                    <button className="w-full btn-primary">
                      Book Now
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
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Why Choose Our Car Rental */}
        <section className="section-padding bg-gray-50 mt-16">
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
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary">
                  Book a Car Now
                </button>
                <a href="/contact" className="btn-secondary">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarRentals;
