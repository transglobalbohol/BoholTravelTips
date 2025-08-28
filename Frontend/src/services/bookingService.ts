import { apiClient } from './api';
import { SearchParams, PaginatedResponse, ApiResponse } from '../types';

export interface Booking {
  _id: string;
  userId: string;
  tourId?: string;
  hotelId?: string;
  bookingType: 'tour' | 'hotel' | 'package';
  bookingDate: string;
  checkInDate?: string;
  checkOutDate?: string;
  travelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'upcoming' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed';
  confirmationCode: string;
  guestDetails?: any;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  tour?: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    location: string;
  };
  hotel?: {
    _id: string;
    name: string;
    pricePerNight: number;
    images: string[];
    location: string;
  };
}

interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  tourBookings: number;
  hotelBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

interface BookingFilters extends SearchParams {
  status?: string;
  bookingType?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export const bookingService = {
  // Get all bookings (admin only)
  getBookings: async (params?: BookingFilters): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get('/bookings', { params });
    
    if (response.data.pagination) {
      return response.data;
    } else {
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  // Create new booking
  createBooking: async (bookingData: {
    tourId?: string;
    hotelId?: string;
    bookingType: 'tour' | 'hotel' | 'package';
    bookingDate: string;
    checkInDate?: string;
    checkOutDate?: string;
    travelers: number;
    guestDetails?: any;
    contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    specialRequests?: string;
  }): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId: string, params?: BookingFilters): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get(`/bookings/user/${userId}`, { params });
    
    if (response.data.pagination) {
      return response.data;
    } else {
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  // Get single booking
  getBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (bookingId: string, updateData: Partial<Booking>): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, cancellationReason?: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.delete(`/bookings/${bookingId}`, {
      data: { cancellationReason }
    });
    return response.data;
  },

  // Get booking statistics (admin only)
  getBookingStats: async (startDate?: string, endDate?: string): Promise<ApiResponse<{
    overview: BookingStats;
    monthlyStats: Array<{
      _id: { year: number; month: number };
      bookings: number;
      revenue: number;
    }>;
  }>> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get('/bookings/stats', { params });
    return response.data;
  },

  // Generate booking receipt
  getBookingReceipt: async (bookingId: string): Promise<Blob> => {
    const response = await apiClient.get(`/bookings/${bookingId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Confirm booking (admin/partner)
  confirmBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  // Mark booking as completed (admin/partner)
  completeBooking: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/complete`);
    return response.data;
  },

  // Mark booking as no-show (admin/partner)
  markNoShow: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/no-show`);
    return response.data;
  },

  // Process refund (admin only)
  processRefund: async (bookingId: string, refundAmount: number, reason: string): Promise<ApiResponse<{
    message: string;
    refundAmount: number;
  }>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/refund`, {
      refundAmount,
      reason
    });
    return response.data;
  },

  // Send booking reminder
  sendBookingReminder: async (bookingId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/bookings/${bookingId}/remind`);
    return response.data;
  }
};

export default bookingService;
