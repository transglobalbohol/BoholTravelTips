import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Guide to Bohol and Beyond: Everything You Need to Know
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Find everything you need to know about Bohol. Learn about the best time to visit, where to go, sample itinerary and travel tips.
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination Select */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2 text-left">
                  Select destination
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
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
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 text-left">
                  Select dates
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              
              {/* Travelers */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2 text-left">
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
                <Link 
                  to="/tours"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
                >
                  Search Tours
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/tours" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition duration-200">
              Popular Tours
            </Link>
            <Link to="/hotels" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition duration-200">
              Best Hotels
            </Link>
            <Link to="/destinations" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition duration-200">
              Top Destinations
            </Link>
            <Link to="/travel-guides" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full transition duration-200">
              Travel Guides
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;