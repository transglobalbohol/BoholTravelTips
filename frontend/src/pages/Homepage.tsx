import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import HeroSection from '../components/Homepage/HeroSection';
import FeaturedTours from '../components/Homepage/FeaturedTours';
import PopularDestinations from '../components/Homepage/PopularDestinations';
import TravelGuides from '../components/Homepage/TravelGuides';
import WhyChooseUs from '../components/Homepage/WhyChooseUs';
import CustomerTestimonials from '../components/Homepage/CustomerTestimonials';
import Newsletter from '../components/Homepage/Newsletter';

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M6 20.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover all the adventures</h3>
              <p className="text-gray-600">you can experience in Bohol</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book an optimized itinerary</h3>
              <p className="text-gray-600">for a perfect vacation in Bohol</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find all the best tours</h3>
              <p className="text-gray-600">tickets & experiences in Bohol</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover all the best places</h3>
              <p className="text-gray-600">you can visit in Bohol</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <FeaturedTours />
      
      {/* Popular Destinations */}
      <PopularDestinations />
      
      {/* Travel Guides Preview */}
      <TravelGuides />
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Customer Testimonials */}
      <CustomerTestimonials />
      
      {/* Newsletter Signup */}
      <Newsletter />
    </div>
  );
};

export default Homepage;