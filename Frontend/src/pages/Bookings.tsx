import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Filter, Search, Star, FileText, Download, MoreVertical, Eye } from 'lucide-react';
import { bookingService, Booking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, activeFilter, searchTerm, sortBy, currentPage]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy: sortBy === 'date' ? 'bookingDate' : sortBy === 'price' ? 'totalPrice' : 'createdAt',
        sortOrder: 'desc'
      };

      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await bookingService.getUserBookings(user.id, params);
      
      setBookings(response.data);
      setTotalResults(response.total || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const reason = prompt('Please provide a reason for cancellation:');
      if (!reason) return;

      await bookingService.cancelBooking(bookingId, reason);
      await fetchBookings(); // Refresh bookings
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'confirmed':
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
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Bookings', count: totalResults },
    { value: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed').length },
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card p-8 text-center">
          <h2 className="text-heading-2 mb-4">Access Denied</h2>
          <p className="text-body mb-6">Please log in to view your bookings.</p>
          <Link to="/auth/login" className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading && currentPage === 1) {
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
                  placeholder="Search by confirmation code..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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
                      onClick={() => {
                        setActiveFilter(option.value);
                        setCurrentPage(1);
                      }}
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
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
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
                {totalResults} booking{totalResults !== 1 ? 's' : ''} found
              </p>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="card p-6 mb-6 border-red-200 bg-red-50">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchBookings}
                  className="btn-primary mt-3"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Bookings Cards */}
            <div className="space-y-6 mb-8">
              {bookings.map((booking) => (
                <div key={booking._id} className="card">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image */}
                      <div className="md:w-24 md:h-24 h-48 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={booking.tour?.images?.[0] || booking.hotel?.images?.[0] || '/placeholder-image.jpg'}
                          alt={booking.tour?.title || booking.hotel?.name || 'Booking'}
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
                                    {booking.bookingType.toUpperCase()}
                                  </span>
                                </div>
                                <h3 className="text-heading-3 text-lg font-semibold text-gray-900 mb-1">
                                  {booking.tour?.title || booking.hotel?.name}
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
                                <span>{booking.tour?.location || booking.hotel?.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-small text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDateRange(booking.bookingDate, booking.checkOutDate)}</span>
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
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                              <Link
                                to={`/bookings/${booking._id}`}
                                className="btn-secondary flex items-center space-x-2 text-sm"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </Link>

                              {(booking.status === 'upcoming' || booking.status === 'confirmed') && (
                                <>
                                  <button className="btn-secondary text-sm">
                                    Modify Booking
                                  </button>
                                  <button 
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              {booking.status === 'completed' && (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded ${
                          page === currentPage
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && bookings.length === 0 && (
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
                      setCurrentPage(1);
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
