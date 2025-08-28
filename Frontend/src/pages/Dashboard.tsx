import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useFastData } from '../hooks/useFastData';
import { 
  Calendar, BookOpen, Heart, User, TrendingUp, MapPin, 
  Star, Clock, CreditCard, Bell, Settings, ChevronRight 
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalBookings: number;
    upcomingTrips: number;
    wishlistItems: number;
    totalSpent: number;
  };
  recentBookings: Array<{
    id: string;
    title: string;
    type: 'tour' | 'hotel';
    date: string;
    status: string;
    image: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    type: 'tour' | 'hotel';
    price: number;
    rating: number;
    image: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    time: string;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  // Mock dashboard data
  const mockDashboardData: DashboardData = {
    stats: {
      totalBookings: 8,
      upcomingTrips: 3,
      wishlistItems: 15,
      totalSpent: 125000
    },
    recentBookings: [
      {
        id: '1',
        title: 'Chocolate Hills Day Tour',
        type: 'tour',
        date: '2024-12-25',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: '2',
        title: 'Amorita Resort',
        type: 'hotel',
        date: '2024-12-22',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: '3',
        title: 'Island Hopping Tour',
        type: 'tour',
        date: '2024-11-15',
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      }
    ],
    recommendations: [
      {
        id: '1',
        title: 'Anda Beach Resort',
        type: 'hotel',
        price: 6500,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: '2',
        title: 'Firefly Watching Tour',
        type: 'tour',
        price: 1500,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      }
    ],
    notifications: [
      {
        id: '1',
        title: 'Booking Confirmed',
        message: 'Your Chocolate Hills tour is confirmed for Dec 25',
        type: 'success',
        time: '2 hours ago'
      },
      {
        id: '2',
        title: 'Special Offer',
        message: 'Save 20% on Panglao beach resorts this month',
        type: 'info',
        time: '1 day ago'
      }
    ]
  };

  // Use fast data loading with caching
  const { data: dashboardData, loading } = useFastData({
    data: mockDashboardData,
    delay: 50, // Ultra-fast loading
    cache: true,
    cacheKey: `dashboard-${user?.email || 'anonymous'}`
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'Traveler'}!
              </h1>
              <p className="text-gray-600">
                Your travel dashboard - manage bookings and discover new adventures
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalBookings}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Total Bookings</h3>
              <p className="text-sm text-gray-500">All time bookings</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardData.stats.upcomingTrips}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Upcoming Trips</h3>
              <p className="text-sm text-gray-500">Ready for adventure</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{dashboardData.stats.wishlistItems}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Wishlist Items</h3>
              <p className="text-sm text-gray-500">Saved for later</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">₱{dashboardData.stats.totalSpent.toLocaleString()}</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Total Spent</h3>
              <p className="text-sm text-gray-500">Travel investments</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link to="/bookings" className="text-blue-600 hover:text-blue-500 font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={booking.image}
                      alt={booking.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{booking.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span className="capitalize">{booking.type}</span>
                        <span>•</span>
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/tours" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <MapPin className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Browse Tours</span>
                </Link>
                <Link to="/hotels" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Book Hotels</span>
                </Link>
                <Link to="/car-rentals" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CreditCard className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Rent Cars</span>
                </Link>
                <Link to="/travel-guides" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <BookOpen className="w-8 h-8 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Travel Guides</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                {dashboardData.recommendations.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{item.rating}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          ₱{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{notification.title}</h4>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
