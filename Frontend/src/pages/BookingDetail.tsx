import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Clock, ArrowLeft, Download, Print, 
  Mail, Phone, Star, Check, AlertTriangle, CreditCard, MapIcon,
  MessageSquare, Edit3, X
} from 'lucide-react';

interface BookingDetails {
  id: string;
  confirmationCode: string;
  type: 'tour' | 'hotel' | 'car_rental';
  title: string;
  description: string;
  images: string[];
  location: string;
  address: string;
  date: string;
  endDate?: string;
  time?: string;
  travelers: number;
  totalPrice: number;
  basePrice: number;
  taxes: number;
  fees: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  itinerary?: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  policies: {
    cancellation: string;
    checkIn?: string;
    checkOut?: string;
  };
  rating?: number;
  review?: string;
  partnerContact?: {
    name: string;
    phone: string;
    email: string;
  };
}

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Mock booking detail data
  const mockBookingDetail: BookingDetails = {
    id: id || '1',
    confirmationCode: 'GTB-ABC123',
    type: 'tour',
    title: 'Chocolate Hills + Tarsier Sanctuary Day Tour',
    description: 'Experience the iconic Chocolate Hills and meet the world\'s smallest primates in this comprehensive day tour. Perfect for nature lovers and photographers.',
    images: [
      'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618644-fbd1e7647dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Carmen, Bohol',
    address: 'Carmen Municipality, Bohol, Philippines',
    date: '2024-12-25',
    time: '7:00 AM',
    travelers: 2,
    totalPrice: 5000,
    basePrice: 4500,
    taxes: 400,
    fees: 100,
    status: 'upcoming',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (****4242)',
    createdAt: '2024-12-10T10:00:00Z',
    customerInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+63 123 456 7890',
      specialRequests: 'Please arrange vegetarian meals for lunch'
    },
    itinerary: [
      {
        time: '7:00 AM',
        title: 'Hotel Pick-up',
        description: 'Pick-up from your hotel in Tagbilaran City'
      },
      {
        time: '8:30 AM',
        title: 'Tarsier Sanctuary Visit',
        description: 'Observe the world\'s smallest primates in their natural habitat'
      },
      {
        time: '10:30 AM',
        title: 'Travel to Chocolate Hills',
        description: 'Scenic drive through Bohol countryside'
      },
      {
        time: '12:00 PM',
        title: 'Chocolate Hills Viewing',
        description: 'Climb to the viewing deck and enjoy panoramic views'
      },
      {
        time: '1:00 PM',
        title: 'Lunch Break',
        description: 'Traditional Filipino lunch at a local restaurant'
      },
      {
        time: '3:00 PM',
        title: 'Return Journey',
        description: 'Return to Tagbilaran City with photo stops'
      }
    ],
    inclusions: [
      'Round-trip transportation',
      'Professional English-speaking guide',
      'Entrance fees to all attractions',
      'Traditional Filipino lunch',
      'Bottled water',
      'Travel insurance'
    ],
    exclusions: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Additional food and drinks'
    ],
    policies: {
      cancellation: 'Free cancellation up to 24 hours before the tour starts. 50% refund for cancellations within 24 hours.',
      checkIn: 'Please arrive 15 minutes before departure time',
      checkOut: 'Tour ends at approximately 4:30 PM'
    },
    partnerContact: {
      name: 'Bohol Adventure Tours',
      phone: '+63 123 456 7890',
      email: 'info@boholadventure.com'
    }
  };

  useEffect(() => {
    const fetchBookingDetail = () => {
      setLoading(true);
      // Instant loading for better UX
      setTimeout(() => {
        setBooking(mockBookingDetail);
        setLoading(false);
      }, 100);
    };

    fetchBookingDetail();
  }, [id]);

  const handleCancelBooking = () => {
    console.log('Cancelling booking:', booking?.id);
    setShowCancelModal(false);
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', { rating: reviewRating, review: reviewText });
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (date: string, time?: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return time ? `${formattedDate} at ${time}` : formattedDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="card">
              <div className="p-8">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-48 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-heading-2 mb-4">Booking Not Found</h2>
          <p className="text-body mb-6">The booking you're looking for doesn't exist.</p>
          <Link to="/bookings" className="btn-primary">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container py-6">
          <nav className="flex items-center space-x-2 text-small mb-4">
            <Link to="/bookings" className="modern-link flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Bookings</span>
            </Link>
          </nav>
          <h1 className="text-heading-1 text-2xl">Booking Details</h1>
        </div>
      </div>

      <div className="container py-8">
        {/* Booking Status Banner */}
        <div className={`card border-2 p-6 mb-8 ${getStatusColor(booking.status)}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} Booking
                </h2>
                <span className="font-mono text-sm">
                  {booking.confirmationCode}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {booking.status === 'upcoming' && 'Your booking is confirmed and ready!'}
                {booking.status === 'completed' && 'Thank you for choosing our service!'}
                {booking.status === 'cancelled' && 'This booking has been cancelled.'}
                {booking.status === 'pending' && 'Your booking is being processed.'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Print className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Information */}
            <div className="card p-8">
              <h3 className="text-heading-3 text-xl mb-6">Booking Information</h3>
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img
                  src={booking.images[0]}
                  alt={booking.title}
                  className="w-full md:w-48 h-48 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="badge text-xs">
                      {booking.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <h4 className="text-heading-3 text-xl mb-3">{booking.title}</h4>
                  <p className="text-body mb-4">{booking.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(booking.date, booking.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Duration: 8 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-6">
                <h4 className="text-heading-3 text-lg mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small">
                  <div>
                    <span className="font-medium text-gray-700">Name: </span>
                    <span className="text-gray-600">
                      {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email: </span>
                    <span className="text-gray-600">{booking.customerInfo.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone: </span>
                    <span className="text-gray-600">{booking.customerInfo.phone}</span>
                  </div>
                  {booking.customerInfo.specialRequests && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Special Requests: </span>
                      <span className="text-gray-600">{booking.customerInfo.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Itinerary (for tours) */}
            {booking.itinerary && booking.itinerary.length > 0 && (
              <div className="card p-8">
                <h3 className="text-heading-3 text-xl mb-6">Tour Itinerary</h3>
                <div className="space-y-6">
                  {booking.itinerary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <span className="text-small font-medium text-gray-900">{item.time}</span>
                        </div>
                        <p className="text-body">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-heading-3 text-lg mb-4 text-green-800">What's Included</h3>
                  <ul className="space-y-3">
                    {booking.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-heading-3 text-lg mb-4 text-red-800">What's Not Included</h3>
                  <ul className="space-y-3">
                    {booking.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="card p-8">
              <h3 className="text-heading-3 text-xl mb-6">Important Policies</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2">Cancellation Policy</h4>
                      <p className="text-small text-yellow-700">{booking.policies.cancellation}</p>
                    </div>
                  </div>
                </div>
                {booking.policies.checkIn && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Check-in Instructions</h4>
                        <p className="text-small text-blue-700">{booking.policies.checkIn}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Price Summary */}
            <div className="card p-6">
              <h3 className="text-heading-3 text-lg mb-6">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-small">
                  <span className="text-gray-600">Subtotal ({booking.travelers} people)</span>
                  <span className="text-gray-900">₱{booking.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">₱{booking.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-small">
                  <span className="text-gray-600">Service Fees</span>
                  <span className="text-gray-900">₱{booking.fees.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-gray-900">₱{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-2 text-small text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Paid via {booking.paymentMethod}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Payment Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* Partner Contact */}
            {booking.partnerContact && (
              <div className="card p-6">
                <h3 className="text-heading-3 text-lg mb-4">Tour Provider</h3>
                <div className="space-y-3">
                  <div className="font-medium text-gray-900">
                    {booking.partnerContact.name}
                  </div>
                  <div className="flex items-center space-x-2 text-small text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${booking.partnerContact.phone}`} className="modern-link">
                      {booking.partnerContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-small text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${booking.partnerContact.email}`} className="modern-link">
                      {booking.partnerContact.email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="card p-6">
              <h3 className="text-heading-3 text-lg mb-4">Actions</h3>
              <div className="space-y-3">
                {booking.status === 'upcoming' && (
                  <>
                    <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                      <Edit3 className="w-4 h-4" />
                      <span>Modify Booking</span>
                    </button>
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-center font-medium"
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                
                {booking.status === 'completed' && !booking.rating && (
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Write Review</span>
                  </button>
                )}

                <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>

                <Link 
                  to="/tours" 
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <span>Book Similar Tour</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-heading-3 text-lg mb-4">Cancel Booking</h3>
            <p className="text-body mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary flex-1"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleCancelBooking}
                className="btn-danger flex-1"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-heading-3 text-lg mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="form-label mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-2xl"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="form-label">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="input h-24 resize-none"
              />
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                className="btn-primary flex-1"
                disabled={reviewRating === 0}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;