import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface CarRental {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  pricePerDay: number;
  transmission: 'Manual' | 'Automatic';
  fuelType: 'Gasoline' | 'Diesel' | 'Hybrid';
  seats: number;
  features: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  description: string;
  location: string;
}

const mockCarRentals: CarRental[] = [
  {
    id: 1,
    name: 'Toyota Vios',
    brand: 'Toyota',
    model: 'Vios',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 2500,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging'],
    rating: 4.5,
    reviewCount: 28,
    availability: true,
    description: 'Perfect sedan for comfortable city and highway driving around Bohol.',
    location: 'Tagbilaran City'
  },
  {
    id: 2,
    name: 'Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 2300,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    features: ['Air Conditioning', 'Radio', 'Power Steering', 'Electric Windows'],
    rating: 4.3,
    reviewCount: 15,
    availability: true,
    description: 'Reliable and fuel-efficient sedan ideal for touring Bohol attractions.',
    location: 'Panglao Island'
  },
  {
    id: 3,
    name: 'Toyota Avanza',
    brand: 'Toyota',
    model: 'Avanza',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1570733117311-d990c3816c47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 3200,
    transmission: 'Manual',
    fuelType: 'Gasoline',
    seats: 7,
    features: ['Air Conditioning', 'Radio', '3 Rows of Seats', 'Large Luggage Space'],
    rating: 4.6,
    reviewCount: 42,
    availability: true,
    description: 'Spacious MPV perfect for family trips and group tours around Bohol.',
    location: 'Bohol-Panglao International Airport'
  },
  {
    id: 4,
    name: 'Mitsubishi Montero Sport',
    brand: 'Mitsubishi',
    model: 'Montero Sport',
    year: 2021,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 4500,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 7,
    features: ['4WD', 'Air Conditioning', 'GPS Navigation', 'Leather Seats', 'Sunroof'],
    rating: 4.8,
    reviewCount: 23,
    availability: true,
    description: 'Premium SUV with 4WD capability, perfect for off-road adventures and countryside tours.',
    location: 'Tagbilaran City'
  },
  {
    id: 5,
    name: 'Suzuki Ertiga',
    brand: 'Suzuki',
    model: 'Ertiga',
    year: 2022,
    image: 'https://images.unsplash.com/photo-1494976688531-6d909b10e4ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 2800,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 7,
    features: ['Air Conditioning', 'Radio', 'Flexible Seating', 'Good Ground Clearance'],
    rating: 4.4,
    reviewCount: 31,
    availability: false,
    description: 'Compact MPV with excellent fuel economy, great for both city and rural driving.',
    location: 'Panglao Island'
  },
  {
    id: 6,
    name: 'Toyota Innova',
    brand: 'Toyota',
    model: 'Innova',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1600713693816-6d93b6afecee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    pricePerDay: 3800,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 8,
    features: ['Air Conditioning', 'GPS Navigation', 'Captain Chairs', 'Premium Audio System'],
    rating: 4.7,
    reviewCount: 37,
    availability: true,
    description: 'Premium MPV with captain chairs, perfect for comfortable long-distance travel.',
    location: 'Bohol-Panglao International Airport'
  }
];

const CarRentals: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sedan' | 'mpv' | 'suv'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'budget' | 'premium'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getCarType = (car: CarRental): 'sedan' | 'mpv' | 'suv' => {
    if (car.seats <= 5 && !car.features.includes('4WD')) return 'sedan';
    if (car.features.includes('4WD') || car.model.toLowerCase().includes('montero')) return 'suv';
    return 'mpv';
  };

  const filteredCars = mockCarRentals.filter(car => {
    const matchesType = selectedFilter === 'all' || getCarType(car) === selectedFilter;
    const matchesPrice = 
      priceFilter === 'all' ||
      (priceFilter === 'budget' && car.pricePerDay <= 3000) ||
      (priceFilter === 'premium' && car.pricePerDay > 3000);
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesPrice && matchesSearch;
  });

  return (
    <div className="car-rentals-page min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Car Rentals in Bohol
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore Bohol at your own pace with our reliable and affordable car rental service. 
              From compact sedans to spacious SUVs, we have the perfect vehicle for your adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by car brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="mpv">MPV</option>
                <option value="suv">SUV</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (≤₱3,000/day)</option>
                <option value="premium">Premium (&gt;₱3,000/day)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Car Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Cars</h2>
            <p className="text-gray-600">
              {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available for rent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Car Image */}
                <div className="relative h-48">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  {!car.availability && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Not Available</span>
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
                      <p className="text-gray-600">{car.year} {car.brand} {car.model}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">₱{car.pricePerDay.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">per day</div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{car.description}</p>

                  {/* Car Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {car.seats} seats
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {car.fuelType}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {car.transmission}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {car.location}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(car.rating) ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {car.rating} ({car.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                      {car.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
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
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {car.availability ? 'Book Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Car Rental */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Car Rental Service?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best car rental experience in Bohol with competitive prices and excellent service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Well-Maintained Vehicles</h3>
              <p className="text-gray-600">All our cars are regularly serviced and inspected for your safety and comfort.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Best rates in Bohol with no hidden fees. What you see is what you pay.</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support and emergency roadside assistance.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Locations</h3>
              <p className="text-gray-600">Pick up and drop off at the airport, hotels, or other convenient locations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRentals;