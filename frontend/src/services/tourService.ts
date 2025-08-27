import { apiClient } from './api';
import { Tour, SearchParams, PaginatedResponse, ApiResponse } from '../types';

export const tourService = {
  // Get all tours with optional filters
  getTours: async (params?: SearchParams): Promise<PaginatedResponse<Tour>> => {
    const response = await apiClient.get('/tours', { params });
    return response.data;
  },

  // Get featured tours
  getFeaturedTours: async (limit: number = 8): Promise<ApiResponse<Tour[]>> => {
    const response = await apiClient.get(`/tours/featured?limit=${limit}`);
    return response.data;
  },

  // Get a single tour by ID
  getTour: async (id: string): Promise<ApiResponse<Tour>> => {
    const response = await apiClient.get(`/tours/${id}`);
    return response.data;
  },

  // Get tour by slug
  getTourBySlug: async (slug: string): Promise<ApiResponse<Tour>> => {
    const response = await apiClient.get(`/tours/slug/${slug}`);
    return response.data;
  },

  // Search tours
  searchTours: async (query: string, filters?: SearchParams): Promise<PaginatedResponse<Tour>> => {
    const params = { q: query, ...filters };
    const response = await apiClient.get('/tours/search', { params });
    return response.data;
  },

  // Get tours by category
  getToursByCategory: async (category: string, params?: SearchParams): Promise<PaginatedResponse<Tour>> => {
    const response = await apiClient.get(`/tours/category/${category}`, { params });
    return response.data;
  },

  // Get tours by destination
  getToursByDestination: async (destination: string, params?: SearchParams): Promise<PaginatedResponse<Tour>> => {
    const response = await apiClient.get(`/tours/destination/${destination}`, { params });
    return response.data;
  },

  // Get tour categories
  getCategories: async (): Promise<ApiResponse<Array<{ _id: string; name: string; slug: string; count: number }>>> => {
    const response = await apiClient.get('/tours/categories');
    return response.data;
  },

  // Get tour destinations
  getDestinations: async (): Promise<ApiResponse<Array<{ name: string; slug: string; count: number }>>> => {
    const response = await apiClient.get('/tours/destinations');
    return response.data;
  },

  // Get tour availability
  getTourAvailability: async (tourId: string, month: string): Promise<ApiResponse<Date[]>> => {
    const response = await apiClient.get(`/tours/${tourId}/availability?month=${month}`);
    return response.data;
  },

  // Check tour availability for specific date
  checkAvailability: async (tourId: string, date: string, travelers: number): Promise<ApiResponse<{
    available: boolean;
    availableSlots: number;
    price: number;
  }>> => {
    const response = await apiClient.post(`/tours/${tourId}/check-availability`, {
      date,
      travelers
    });
    return response.data;
  },

  // Get similar tours
  getSimilarTours: async (tourId: string, limit: number = 4): Promise<ApiResponse<Tour[]>> => {
    const response = await apiClient.get(`/tours/${tourId}/similar?limit=${limit}`);
    return response.data;
  },

  // Add tour to wishlist
  addToWishlist: async (tourId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/tours/${tourId}/wishlist`);
    return response.data;
  },

  // Remove tour from wishlist
  removeFromWishlist: async (tourId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/tours/${tourId}/wishlist`);
    return response.data;
  },

  // Get user's wishlist
  getWishlist: async (): Promise<ApiResponse<Tour[]>> => {
    const response = await apiClient.get('/tours/wishlist');
    return response.data;
  },

  // Rate a tour
  rateTour: async (tourId: string, rating: number, comment?: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/tours/${tourId}/rate`, {
      rating,
      comment
    });
    return response.data;
  },

  // Get tour reviews
  getTourReviews: async (tourId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<{
    _id: string;
    user: { name: string; avatar?: string };
    rating: number;
    comment: string;
    createdAt: string;
    helpful: number;
  }>> => {
    const response = await apiClient.get(`/tours/${tourId}/reviews`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/tours/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Report a review
  reportReview: async (reviewId: string, reason: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/tours/reviews/${reviewId}/report`, {
      reason
    });
    return response.data;
  },

  // Get tour statistics (for admin)
  getTourStats: async (tourId: string): Promise<ApiResponse<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    bookingsByMonth: Array<{ month: string; bookings: number; revenue: number }>;
  }>> => {
    const response = await apiClient.get(`/tours/${tourId}/stats`);
    return response.data;
  },
};

export default tourService;