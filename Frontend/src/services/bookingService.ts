import { apiClient } from './api';
import { Booking, BookingFormData, ApiResponse, PaginatedResponse } from '../types';

export interface BookingResponse {
  success: boolean;
  booking: Booking;
  message: string;
}

export interface PaymentData {
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData: BookingFormData): Promise<BookingResponse> => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  // Process payment for booking
  processPayment: async (bookingId: string, paymentData: PaymentData): Promise<ApiResponse<{
    paymentStatus: string;
    transactionId: string;
    receiptUrl?: string;
  }>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/payment`, paymentData);
    return response.data;
  },

  // Get booking by ID
  getBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Get booking by confirmation code
  getBookingByCode: async (confirmationCode: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get(`/bookings/confirmation/${confirmationCode}`);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: 'tour' | 'hotel';
  }): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get('/bookings/user', { params });
    return response.data;
  },

  // Update booking
  updateBooking: async (id: string, updateData: Partial<Booking>): Promise<BookingResponse> => {
    const response = await apiClient.put(`/bookings/${id}`, updateData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string, reason?: string): Promise<ApiResponse<{
    message: string;
    refundAmount?: number;
    refundStatus?: string;
  }>> => {
    const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Request booking modification
  requestModification: async (id: string, changes: {
    newDate?: string;
    newTravelers?: number;
    reason: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${id}/modify`, changes);
    return response.data;
  },

  // Confirm booking (for tour operators)
  confirmBooking: async (id: string, notes?: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${id}/confirm`, { notes });
    return response.data;
  },

  // Mark booking as completed
  completeBooking: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${id}/complete`);
    return response.data;
  },

  // Add special requests to booking
  addSpecialRequests: async (id: string, requests: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${id}/special-requests`, { requests });
    return response.data;
  },

  // Get booking receipt
  getReceipt: async (id: string): Promise<ApiResponse<{
    receiptUrl: string;
    receiptNumber: string;
  }>> => {
    const response = await apiClient.get(`/bookings/${id}/receipt`);
    return response.data;
  },

  // Download booking voucher
  getVoucher: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/bookings/${id}/voucher`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Send booking confirmation email
  resendConfirmation: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${id}/resend-confirmation`);
    return response.data;
  },

  // Get booking statistics (for admin/partners)
  getBookingStats: async (params?: {
    startDate?: string;
    endDate?: string;
    partnerId?: string;
    type?: 'tour' | 'hotel';
  }): Promise<ApiResponse<{
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    bookingsByStatus: Record<string, number>;
    bookingsByMonth: Array<{ month: string; bookings: number; revenue: number }>;
    topTours: Array<{ tourId: string; title: string; bookings: number }>;
  }>> => {
    const response = await apiClient.get('/bookings/stats', { params });
    return response.data;
  },

  // Check booking availability before creating
  checkBookingAvailability: async (data: {
    tourId?: string;
    hotelId?: string;
    date: string;
    travelers: number;
    checkIn?: string;
    checkOut?: string;
  }): Promise<ApiResponse<{
    available: boolean;
    price: number;
    availableSlots?: number;
    blockedDates?: string[];
    alternativeDates?: Array<{ date: string; price: number }>;
  }>> => {
    const response = await apiClient.post('/bookings/check-availability', data);
    return response.data;
  },

  // Get booking pricing
  getBookingPrice: async (data: {
    tourId?: string;
    hotelId?: string;
    travelers: number;
    date?: string;
    checkIn?: string;
    checkOut?: string;
  }): Promise<ApiResponse<{
    basePrice: number;
    taxes: number;
    fees: number;
    totalPrice: number;
    priceBreakdown: Array<{ description: string; amount: number }>;
  }>> => {
    const response = await apiClient.post('/bookings/calculate-price', data);
    return response.data;
  },

  // Apply promo code
  applyPromoCode: async (bookingData: any, promoCode: string): Promise<ApiResponse<{
    discountAmount: number;
    newTotal: number;
    promoCodeDetails: {
      code: string;
      description: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
    };
  }>> => {
    const response = await apiClient.post('/bookings/apply-promo', {
      ...bookingData,
      promoCode
    });
    return response.data;
  },

  // Get available payment methods
  getPaymentMethods: async (): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    type: string;
    fees: number;
    isActive: boolean;
    logo?: string;
  }>>> => {
    const response = await apiClient.get('/bookings/payment-methods');
    return response.data;
  },

  // Verify payment status
  verifyPayment: async (bookingId: string, paymentId: string): Promise<ApiResponse<{
    paymentStatus: string;
    transactionId: string;
    paidAmount: number;
    paymentDate: string;
  }>> => {
    const response = await apiClient.get(`/bookings/${bookingId}/payment/${paymentId}/verify`);
    return response.data;
  },
};

export default bookingService;