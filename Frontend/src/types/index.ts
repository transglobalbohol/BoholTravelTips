export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'partner';
  avatar?: string;
  phone?: string;
  bookings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: TourCategory | string;
  price: number;
  originalPrice?: number;
  duration: string;
  location: string;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  availability: Date[];
  maxGroupSize: number;
  minGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviewCount: number;
  reviews: Review[];
  partnerId: string;
  partner?: TourOperator;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  cancellationPolicy: string;
  importantNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  location?: string;
  duration?: string;
}

export interface TourCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface Hotel {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  pricePerNight: number;
  originalPrice?: number;
  amenities: string[];
  rooms: Room[];
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  policies: HotelPolicies;
  nearbyAttractions?: NearbyAttraction[];
  isActive: boolean;
  isFeatured: boolean;
  category: 'Budget' | 'Mid-range' | 'Luxury' | 'Resort' | 'Boutique';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id?: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  availability: Date[];
  maxOccupancy: number;
}

export interface HotelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  children: string;
  pets: string;
  smoking: string;
}

export interface Booking {
  _id: string;
  userId: string;
  user?: User;
  type: 'tour' | 'hotel';
  tourId?: string;
  tour?: Tour;
  hotelId?: string;
  hotel?: Hotel;
  roomId?: string;
  bookingDate: string;
  checkIn?: string;
  checkOut?: string;
  travelers: number;
  totalPrice: number;
  basePrice: number;
  taxes: number;
  fees: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  customerInfo: CustomerInfo;
  specialRequests?: string;
  confirmationCode: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  specialRequests?: string;
  dietaryRequirements?: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Review {
  _id: string;
  userId: string;
  user?: User;
  userName?: string;
  userAvatar?: string;
  tourId?: string;
  hotelId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerified?: boolean;
  helpful: number;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourOperator {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  contactInfo: ContactInfo;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  licenseNumber: string;
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: Address;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attractions: string[];
  bestTimeToVisit: string[];
  activities: string[];
  tourCount: number;
  hotelCount: number;
  isPopular: boolean;
  createdAt: string;
}

export interface SearchFilters {
  destination?: string;
  location?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  rating?: number;
  difficulty?: string;
  amenities?: string[];
  tags?: string[];
  status?: string;
  bookingType?: string;
  sortBy?: 'price' | 'rating' | 'popularity' | 'latest' | 'name' | 'title' | 'date' | 'created' | 'createdAt' | 'bookingDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  count?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'upcoming'
  | 'cancelled'
  | 'completed'
  | 'no-show';

export interface NearbyAttraction {
  name: string;
  distance: string;
  type: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'partially-paid'
  | 'refunded'
  | 'failed';

export interface BookingFormData {
  tourId?: string;
  hotelId?: string;
  roomId?: string;
  travelers: number;
  bookingDate?: string;
  checkIn?: string;
  checkOut?: string;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  specialRequests?: string;
}

export interface SearchParams {
  q?: string;
  destination?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  rating?: number;
  difficulty?: string;
  status?: string;
  bookingType?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  amenities?: string | string[];
  tags?: string | string[];
}

// Form interfaces
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
  preferences?: {
    deals: boolean;
    guides: boolean;
    updates: boolean;
  };
}

// Filter-specific interfaces
export interface FilterOption {
  name: string;
  value: string;
  count?: number;
  slug?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

// Car rental interface for consistency
export interface CarRental {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  images: string[];
  pricePerDay: number;
  originalPrice?: number;
  transmission: 'Manual' | 'Automatic';
  fuelType: 'Gasoline' | 'Diesel' | 'Hybrid';
  seats: number;
  features: string[];
  rating: number;
  reviewCount: number;
  availability: boolean;
  description: string;
  location: string;
  category: 'Economy' | 'Compact' | 'Mid-size' | 'Premium' | 'SUV';
  isActive: boolean;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced search and filter types
export interface AdvancedSearchFilters extends SearchFilters {
  // Additional filters for more complex searches
  minRating?: number;
  maxRating?: number;
  minDuration?: number;
  maxDuration?: number;
  includeTags?: string[];
  excludeTags?: string[];
  nearbyAttractions?: string[];
  facilitiesIncluded?: boolean;
  hasAvailability?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  partnerVerified?: boolean;
  hasReviews?: boolean;
  minReviews?: number;
}

// Filter state management
export interface FilterState {
  filters: SearchFilters;
  isLoading: boolean;
  results: any[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

export interface FilterAction {
  type: 'SET_FILTER' | 'CLEAR_FILTERS' | 'SET_RESULTS' | 'SET_LOADING' | 'SET_ERROR' | 'SET_PAGE';
  payload?: any;
}
