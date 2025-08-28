import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { hotelService } from '../../services/hotelService';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchFormData {
  destination: string;
  date: string;
  travelers: number;
  type: 'tours' | 'hotels';
}

const SearchWidget: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Array<{ name: string; slug: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    destination: '',
    date: '',
    travelers: 2,
    type: 'tours'
  });

  useEffect(() => {
    fetchDestinations();
  }, [formData.type]);

  const fetchDestinations = async () => {
    try {
      if (formData.type === 'tours') {
        const response = await tourService.getDestinations();
        setDestinations(response.data);
      } else {
        const response = await hotelService.getHotelLocations();
        setDestinations(response.data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    }
  };

  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const searchParams = new URLSearchParams();
    
    if (formData.destination && formData.destination !== '') {
      searchParams.set('destination', formData.destination);
    }
    
    if (formData.date && formData.date !== '') {
      searchParams.set('date', formData.date);
    }
    
    if (formData.travelers > 0) {
      searchParams.set('travelers', formData.travelers.toString());
    }

    const path = formData.type === 'tours' ? '/tours' : '/hotels';
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    
    navigate(fullPath);
    setLoading(false);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search Type */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search for</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white transition-colors"
                  >
                    <option value="tours">Tours & Activities</option>
                    <option value="hotels">Hotels & Stays</option>
                  </select>
                </div>
                
                {/* Destination */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Destination</span>
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white transition-colors"
                  >
                    <option value="">All destinations</option>
                    {destinations.map((dest) => (
                      <option key={dest.slug || dest.name} value={dest.name}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Select date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={getTomorrowDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white transition-colors"
                  />
                </div>
                
                {/* Travelers */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Travelers</span>
                  </label>
                  <select
                    value={formData.travelers}
                    onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white transition-colors"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                    <option value={15}>10+ Travelers</option>
                  </select>
                </div>
                
                {/* Search Button */}
                <div className="flex items-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Search Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: 'tours', destination: 'Chocolate Hills', label: 'Chocolate Hills Tours' },
                  { type: 'hotels', destination: 'Panglao Island', label: 'Panglao Hotels' },
                  { type: 'tours', destination: 'Loboc', label: 'River Cruise' },
                  { type: 'hotels', destination: 'Tagbilaran City', label: 'City Hotels' },
                  { type: 'tours', destination: 'Anda', label: 'Beach Tours' }
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        type: suggestion.type as 'tours' | 'hotels',
                        destination: suggestion.destination
                      }));
                      
                      const searchParams = new URLSearchParams();
                      searchParams.set('destination', suggestion.destination);
                      const path = suggestion.type === 'tours' ? '/tours' : '/hotels';
                      navigate(`${path}?${searchParams.toString()}`);
                    }}
                    className="px-3 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors duration-200"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchWidget;
