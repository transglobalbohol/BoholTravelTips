import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings and account from your dashboard.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your tour and hotel bookings</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Bookings →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wishlist</h3>
            <p className="text-gray-600 mb-4">Keep track of tours and hotels you want to book</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Wishlist →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
            <p className="text-gray-600 mb-4">Update your personal information and preferences</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Edit Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;