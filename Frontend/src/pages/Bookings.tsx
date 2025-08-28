import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Filter, Search, Star, FileText, Download, MoreVertical, Eye } from 'lucide-react';

interface Booking {
  id: string;
  confirmationCode: string;
  type: 'tour' | 'hotel' | 'car_rental';
  title: string;
  image: string;
  location: string;
  date: string;
  endDate?: string;
  travelers: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  rating?: number;
  hasReview: boolean;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    confirmationCode: 'GTB-ABC123',
    type: 'tour',
    title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Carmen, Bohol',
    date: '2024-12-25',
    travelers: 2,
    totalPrice: 5000,
    status: 'upcoming',
    paymentStatus: 'paid',
    createdAt: '2024-12-10T10:00:00Z',
    hasReview: false
  },
  {
    id: '2',
    confirmationCode: 'GTB-DEF456',
    type: 'hotel',
    title: 'Amorita Resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Panglao Island',
    date: '2024-12-22',
    endDate: '2024-12-24',
    travelers: 2,
    totalPrice: 17000,
    status: 'upcoming',
    paymentStatus: 'paid',
    createdAt: '2024-12-08T14:30:00Z',
    hasReview: false
  },
  {
    id: '3',
    confirmationCode: 'GTB-GHI789',
    type: 'tour',
    title: 'Panglao Island Hopping Adventure',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Panglao Island',
    date: '2024-11-15',
    travelers: 4,
    totalPrice: 7200,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-11-01T09:15:00Z',
    rating: 5,
    hasReview: true
  },
  {
    id: '4',
    confirmationCode: 'GTB-JKL012',
    type: 'car_rental',
    title: 'Toyota Avanza',
    image: 'https://images.unsplash.com/photo-1570733117311-d990c3816c47?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Tagbilaran City',
    date: '2024-10-20',
    endDate: '2024-10-22',
    travelers: 1,
    totalPrice: 6400,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-10-10T16:45:00Z',
    rating: 4,
    hasReview: true
  },
  {
    id: '5',
    confirmationCode: 'GTB-MNO345',
    type: 'tour',
    title: 'Loboc River Cruise with Lunch',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Loboc, Bohol',
    date: '2024-09-10',
    travelers: 3,
    totalPrice: 3600,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-08-25T11:20:00Z',
    rating: 4,
    hasReview: true
  },
  {
    id: '6',
    confirmationCode: 'GTB-PQR678',
    type: 'hotel',
    title: 'Bellevue Resort Bohol',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    location: 'Panglao Island',
    date: '2024-08-15',
    endDate: '2024-08-18',
    travelers: 2,
    totalPrice: 20400,
    status: 'cancelled',
    paymentStatus: 'refunded',
    createdAt: '2024-07-30T13:10:00Z',
    hasReview: false
  }
];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Simulate API call
    const fetchBookings = () => {
      setLoading(true);
      // Instant loading for better UX
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 100);
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
      const matchesSearch = booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'price') {
        return b.totalPrice - a.totalPrice;
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const filterOptions = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'upcoming').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length }
  ];

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const formattedStart = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (endDate) {
      const end = new Date(endDate);
      const formattedEnd = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-border">
          <div className="container py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="p-6 flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">My Bookings</h1>
          <p className="text-subheading">
            Track and manage all your travel bookings in one place
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="card p-6 sticky top-24">
              {/* Search */}
              <div className="form-group mb-6">
                <label className="form-label">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Bookings
                </label>
                <input
                  type="text"
                  placeholder="Search by title, code, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                />
              </div>

              {/* Filter Buttons */}
              <div className="form-group mb-6">
                <label className="form-label flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter by Status</span>
                </label>
                <div className="space-y-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setActiveFilter(option.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                        activeFilter === option.value
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm">{option.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === option.value 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {option.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="form-group">
                <label className="form-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="date">Booking Date</option>
                  <option value="price">Total Price</option>
                  <option value="created">Date Created</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-body">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </p>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            {/* Bookings Cards */}
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="card">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image */}
                      <div className="md:w-24 md:h-24 h-48 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={booking.image}
                          alt={booking.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                  <span className="text-small text-gray-500">
                                    {booking.type.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                                <h3 className="text-heading-3 text-lg font-semibold text-gray-900 mb-1">
                                  {booking.title}
                                </h3>
                                <p className="text-small text-gray-500 mb-2">
                                  Confirmation: {booking.confirmationCode}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-gray-100 rounded-full">
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                              <div className="flex items-center space-x-2 text-small text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-small text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDateRange(booking.date, booking.endDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-small text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
                              </div>
                            </div>

                            {/* Price and Payment Status */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-xl font-bold text-gray-900">
                                  ₱{booking.totalPrice.toLocaleString()}
                                </span>
                                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                </span>
                              </div>

                              {/* Rating (if completed and reviewed) */}
                              {booking.rating && booking.hasReview && (
                                <div className="flex items-center space-x-1">
                                  <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-small text-gray-600">Your rating</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                              <Link
                                to={`/bookings/${booking.id}`}
                                className="btn-secondary flex items-center space-x-2 text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </Link>

                              {booking.status === 'upcoming' && (
                                <>
                                  <button className="btn-secondary text-sm">
                                    Modify Booking
                                  </button>
                                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                    Cancel
                                  </button>
                                </>
                              )}

                              {booking.status === 'completed' && !booking.hasReview && (
                                <button className="btn-primary text-sm flex items-center space-x-2">
                                  <Star className="w-4 h-4" />
                                  <span>Write Review</span>
                                </button>
                              )}

                              <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                                <Download className="w-4 h-4" />
                                <span>Download Receipt</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredBookings.length === 0 && (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-heading-3 text-lg mb-2">No bookings found</h3>
                <p className="text-body mb-6">
                  {searchTerm || activeFilter !== 'all'
                    ? 'Try adjusting your search or filters to see more results.'
                    : 'You haven\'t made any bookings yet. Start planning your Bohol adventure!'}
                </p>
                {searchTerm || activeFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link to="/tours" className="btn-primary">
                    Browse Tours
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;