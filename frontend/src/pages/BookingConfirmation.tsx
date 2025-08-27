import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Booking } from '../types';

const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock booking data - replace with API call
  const mockBooking: Booking = {
    _id: id || '1',
    userId: 'user1',
    type: 'tour',
    tourId: 'tour1',
    bookingDate: '2024-12-15',
    travelers: 2,
    totalPrice: 5000,
    basePrice: 4500,
    taxes: 450,
    fees: 50,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    customerInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+63 123 456 7890',
    },
    confirmationCode: 'GTB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate API call
    const fetchBooking = async () => {
      setLoading(true);
      setTimeout(() => {
        setBooking(mockBooking);
        setLoading(false);
      }, 1000);
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-green-800">Booking Confirmed!</h1>
                <p className="text-green-700">
                  Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="bg-blue-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                  {booking.confirmationCode}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-2 text-sm">
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
                  </div>
                </div>

                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Type: </span>
                      <span className="text-gray-600 capitalize">{booking.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date: </span>
                      <span className="text-gray-600">
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Travelers: </span>
                      <span className="text-gray-600">{booking.travelers} people</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status: </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({booking.travelers} people)</span>
                    <span className="text-gray-900">₱{booking.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900">₱{(booking.taxes + booking.fees).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total Paid</span>
                      <span className="text-blue-600">₱{booking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                  <span className="text-gray-600">via {booking.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Print Confirmation
            </button>
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/tours"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              Book Another Tour
            </Link>
          </div>

          {/* Important Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Please bring a valid ID and this confirmation on the day of your tour</li>
              <li>• Arrive at the meeting point 15 minutes before departure time</li>
              <li>• Check your email for detailed tour instructions and contact information</li>
              <li>• For any changes or cancellations, contact us at least 24 hours in advance</li>
              <li>• Save this confirmation code: <strong>{booking.confirmationCode}</strong></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Need help with your booking?</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <a href="tel:+631234567890" className="text-blue-600 hover:text-blue-700 font-medium">
                📞 +63 123 456 7890
              </a>
              <a href="mailto:support@guidetobohol.ph" className="text-blue-600 hover:text-blue-700 font-medium">
                ✉️ support@guidetobohol.ph
              </a>
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                💬 Live Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;