import React from 'react';
import { Link } from 'react-router-dom';

const HotelDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hotel Details</h1>
          <p className="text-gray-600 mb-6">
            This page is under construction. Hotel details will be displayed here.
          </p>
          <Link 
            to="/hotels" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Hotels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;