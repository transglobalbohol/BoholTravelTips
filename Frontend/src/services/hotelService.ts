import { apiClient } from './api';
import { Hotel, SearchParams, PaginatedResponse, ApiResponse } from '../types';

export const hotelService = {
  getHotels: async (params?: SearchParams): Promise<PaginatedResponse<Hotel>> => {
    const response = await apiClient.get('/hotels', { params });
    
    // Handle both old and new response formats
    if (response.data.pagination) {
      return response.data;
    } else {
      // Convert old format to new format
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 12,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  getFeaturedHotels: async (limit: number = 8): Promise<ApiResponse<Hotel[]>> => {
    const response = await apiClient.get(`/hotels/featured?limit=${limit}`);
    return response.data;
  },

  getHotel: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await apiClient.get(`/hotels/${id}`);
    return response.data;
  },

  getHotelBySlug: async (slug: string): Promise<ApiResponse<Hotel>> => {
    const response = await apiClient.get(`/hotels/slug/${slug}`);
    return response.data;
  },

  searchHotels: async (query: string, filters?: SearchParams): Promise<PaginatedResponse<Hotel>> => {
    const params = { q: query, ...filters };
    const response = await apiClient.get('/hotels/search', { params });
    
    // Handle both old and new response formats
    if (response.data.pagination) {
      return response.data;
    } else {
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 12,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  getHotelsByLocation: async (location: string, params?: SearchParams): Promise<PaginatedResponse<Hotel>> => {
    const response = await apiClient.get(`/hotels/location/${location}`, { params });
    
    if (response.data.pagination) {
      return response.data;
    } else {
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 12,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  getHotelsByCategory: async (category: string, params?: SearchParams): Promise<PaginatedResponse<Hotel>> => {
    const response = await apiClient.get(`/hotels/category/${category}`, { params });
    
    if (response.data.pagination) {
      return response.data;
    } else {
      return {
        ...response.data,
        pagination: {
          page: response.data.page || 1,
          limit: response.data.limit || 12,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        }
      };
    }
  },

  getHotelLocations: async (): Promise<ApiResponse<Array<{ name: string; slug: string; count: number }>>> => {
    const response = await apiClient.get('/hotels/locations');
    return response.data;
  },

  getHotelCategories: async (): Promise<ApiResponse<Array<{ name: string; slug: string; count: number }>>> => {
    const response = await apiClient.get('/hotels/categories');
    return response.data;
  },

  getPopularAmenities: async (): Promise<ApiResponse<Array<{ name: string; count: number }>>> => {
    const response = await apiClient.get('/hotels/amenities');
    return response.data;
  },

  getHotelAvailability: async (hotelId: string, checkIn: string, checkOut: string): Promise<ApiResponse<{
    available: boolean;
    availableRooms: number;
    totalPrice: number;
  }>> => {
    const response = await apiClient.post(`/hotels/${hotelId}/check-availability`, {
      checkIn,
      checkOut
    });
    return response.data;
  },

  getSimilarHotels: async (hotelId: string, limit: number = 4): Promise<ApiResponse<Hotel[]>> => {
    const response = await apiClient.get(`/hotels/${hotelId}/similar?limit=${limit}`);
    return response.data;
  },

  addToWishlist: async (hotelId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/hotels/${hotelId}/wishlist`);
    return response.data;
  },

  removeFromWishlist: async (hotelId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/hotels/${hotelId}/wishlist`);
    return response.data;
  },

  getWishlist: async (): Promise<ApiResponse<Hotel[]>> => {
    const response = await apiClient.get('/hotels/wishlist');
    return response.data;
  },

  rateHotel: async (hotelId: string, rating: number, comment?: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/hotels/${hotelId}/rate`, {
      rating,
      comment
    });
    return response.data;
  },

  getHotelReviews: async (hotelId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<{
    _id: string;
    user: { name: string; avatar?: string };
    rating: number;
    comment: string;
    createdAt: string;
    helpful: number;
  }>> => {
    const response = await apiClient.get(`/hotels/${hotelId}/reviews`, {
      params: { page, limit }
    });
    
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

  markReviewHelpful: async (reviewId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/hotels/reviews/${reviewId}/helpful`);
    return response.data;
  },

  reportReview: async (reviewId: string, reason: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post(`/hotels/reviews/${reviewId}/report`, {
      reason
    });
    return response.data;
  },

  getHotelStats: async (hotelId: string): Promise<ApiResponse<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
    occupancyRate: number;
    bookingsByMonth: Array<{ month: string; bookings: number; revenue: number }>;
  }>> => {
    const response = await apiClient.get(`/hotels/${hotelId}/stats`);
    return response.data;
  },
};

export default hotelService;
