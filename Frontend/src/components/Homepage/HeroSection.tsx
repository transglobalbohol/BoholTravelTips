import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
      }}
    >
      <div className="container px-4">
        <div className="hero-content text-white">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Bohol Travel Tips: Your Ultimate Guide
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Find everything you need to know about Bohol. Learn about the best time to visit, where to go, sample itinerary and travel tips.
          </p>
          
          {/* Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
              {/* Destination Select */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select destination
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-700 bg-white">
                  <option value="">Choose destination</option>
                  <option value="chocolate-hills">Chocolate Hills</option>
                  <option value="panglao">Panglao Island</option>
                  <option value="loboc-river">Loboc River</option>
                  <option value="anda">Anda Beaches</option>
                  <option value="tagbilaran">Tagbilaran City</option>
                  <option value="baclayon">Baclayon Church</option>
                  <option value="tarsier">Tarsier Sanctuary</option>
                </select>
              </div>
              
              {/* Check-in Date */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select dates
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-700 bg-white"
                />
              </div>
              
              {/* Travelers */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add travelers
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-gray-700 bg-white">
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers</option>
                  <option value="5">5+ Travelers</option>
                </select>
              </div>
              
              {/* Search Button */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <Link 
                  to="/tours"
                  className="btn-primary w-full h-12 flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Tours</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tours" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
              Popular Tours
            </Link>
            <Link to="/hotels" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
              Best Hotels
            </Link>
            <Link to="/destinations" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
              Top Destinations
            </Link>
            <Link to="/travel-guides" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20">
              Travel Guides
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/70" />
      </div>
    </section>
  );
};

export default HeroSection;