import React from 'react';

const SearchWidget: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select destination
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                  <option value="">All destinations</option>
                  <option value="chocolate-hills">Chocolate Hills</option>
                  <option value="panglao">Panglao Island</option>
                  <option value="loboc-river">Loboc River</option>
                  <option value="anda">Anda Beaches</option>
                  <option value="tagbilaran">Tagbilaran City</option>
                  <option value="baclayon">Baclayon Church</option>
                  <option value="tarsier">Tarsier Sanctuary</option>
                </select>
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select dates
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              
              {/* Travelers */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Add travelers
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers</option>
                  <option value="5">5+ Travelers</option>
                </select>
              </div>
              
              {/* Search Button */}
              <div className="flex items-end">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchWidget;