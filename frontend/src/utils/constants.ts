// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:5000/api';

// App Configuration
export const APP_NAME = 'Guide to Bohol';
export const APP_DESCRIPTION = 'Your ultimate guide to exploring Bohol, Philippines';
export const APP_URL = process.env.NODE_ENV === 'production' 
  ? 'https://guidetobohol.ph' 
  : 'http://localhost:5173';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'guidetobohol_token',
  USER: 'guidetobohol_user',
  CART: 'guidetobohol_cart',
  WISHLIST: 'guidetobohol_wishlist',
  SEARCH_HISTORY: 'guidetobohol_search_history',
  PREFERENCES: 'guidetobohol_preferences',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // Tours
  TOURS: '/tours',
  TOUR_BY_ID: '/tours/:id',
  TOUR_BY_SLUG: '/tours/slug/:slug',
  FEATURED_TOURS: '/tours/featured',
  TOUR_CATEGORIES: '/tours/categories',
  TOUR_SEARCH: '/tours/search',
  TOUR_WISHLIST: '/tours/wishlist',
  TOUR_REVIEWS: '/tours/:id/reviews',
  
  // Hotels
  HOTELS: '/hotels',
  HOTEL_BY_ID: '/hotels/:id',
  HOTEL_BY_SLUG: '/hotels/slug/:slug',
  FEATURED_HOTELS: '/hotels/featured',
  HOTEL_SEARCH: '/hotels/search',
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: '/bookings/:id',
  USER_BOOKINGS: '/bookings/user',
  BOOKING_CONFIRMATION: '/bookings/confirmation/:code',
  CANCEL_BOOKING: '/bookings/:id/cancel',
  BOOKING_PAYMENT: '/bookings/:id/payment',
  
  // Reviews
  REVIEWS: '/reviews',
  REVIEW_BY_ID: '/reviews/:id',
  
  // Upload
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_MULTIPLE: '/upload/multiple',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  PARTNER: 'partner',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially-paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

// Tour Categories
export const TOUR_CATEGORIES = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { value: 'beach', label: 'Beach & Water Sports', icon: '🏖️' },
  { value: 'historical', label: 'Historical', icon: '🏰' },
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'island-hopping', label: 'Island Hopping', icon: '🏝️' },
] as const;

// Tour Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'green' },
  { value: 'moderate', label: 'Moderate', color: 'yellow' },
  { value: 'challenging', label: 'Challenging', color: 'orange' },
  { value: 'extreme', label: 'Extreme', color: 'red' },
] as const;

// Hotel Categories
export const HOTEL_CATEGORIES = [
  { value: 'budget', label: 'Budget', icon: '💰' },
  { value: 'mid-range', label: 'Mid-range', icon: '🏨' },
  { value: 'luxury', label: 'Luxury', icon: '⭐' },
  { value: 'resort', label: 'Resort', icon: '🏝️' },
  { value: 'boutique', label: 'Boutique', icon: '🎨' },
] as const;

// Popular Destinations
export const DESTINATIONS = [
  { value: 'chocolate-hills', label: 'Chocolate Hills', image: '/images/chocolate-hills.jpg' },
  { value: 'panglao-island', label: 'Panglao Island', image: '/images/panglao.jpg' },
  { value: 'loboc-river', label: 'Loboc River', image: '/images/loboc-river.jpg' },
  { value: 'anda', label: 'Anda', image: '/images/anda.jpg' },
  { value: 'tagbilaran-city', label: 'Tagbilaran City', image: '/images/tagbilaran.jpg' },
  { value: 'baclayon-church', label: 'Baclayon Church', image: '/images/baclayon.jpg' },
  { value: 'tarsier-sanctuary', label: 'Tarsier Sanctuary', image: '/images/tarsier.jpg' },
  { value: 'hinagdanan-cave', label: 'Hinagdanan Cave', image: '/images/hinagdanan.jpg' },
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
  { value: 'debit_card', label: 'Debit Card', icon: '💳' },
  { value: 'gcash', label: 'GCash', icon: '📱' },
  { value: 'paymaya', label: 'PayMaya', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'paypal', label: 'PayPal', icon: '💰' },
] as const;

// File Upload Constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES_PER_UPLOAD: 10,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

// Search Filters
export const SEARCH_FILTERS = {
  SORT_OPTIONS: [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'latest', label: 'Latest' },
    { value: 'alphabetical', label: 'A - Z' },
  ],
  PRICE_RANGES: [
    { value: '0-1000', label: 'Under ₱1,000', min: 0, max: 1000 },
    { value: '1000-2500', label: '₱1,000 - ₱2,500', min: 1000, max: 2500 },
    { value: '2500-5000', label: '₱2,500 - ₱5,000', min: 2500, max: 5000 },
    { value: '5000-10000', label: '₱5,000 - ₱10,000', min: 5000, max: 10000 },
    { value: '10000+', label: 'Over ₱10,000', min: 10000, max: Infinity },
  ],
  DURATION_OPTIONS: [
    { value: '1-3', label: '1-3 hours' },
    { value: '4-6', label: '4-6 hours' },
    { value: '7-8', label: 'Full Day (7-8 hours)' },
    { value: '2-days', label: '2 Days' },
    { value: '3-days', label: '3+ Days' },
  ],
} as const;

// Social Media Links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/guidetobohol',
  INSTAGRAM: 'https://instagram.com/guidetobohol',
  TWITTER: 'https://twitter.com/guidetobohol',
  YOUTUBE: 'https://youtube.com/@guidetobohol',
  TIKTOK: 'https://tiktok.com/@guidetobohol',
} as const;

// Contact Information
export const CONTACT_INFO = {
  PHONE: '+63 123 456 7890',
  EMAIL: 'info@guidetobohol.ph',
  SUPPORT_EMAIL: 'support@guidetobohol.ph',
  ADDRESS: 'Tagbilaran City, Bohol, Philippines',
  BUSINESS_HOURS: 'Monday - Sunday: 24/7',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_REGISTRATION: true,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_WISHLIST: true,
  ENABLE_REVIEWS: true,
  ENABLE_CHAT_SUPPORT: false,
  ENABLE_NEWSLETTER: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_DARK_MODE: false,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Account created successfully! Welcome to Guide to Bohol.',
  LOGIN_SUCCESS: 'Welcome back! You have been successfully logged in.',
  LOGOUT_SUCCESS: 'You have been successfully logged out.',
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  PASSWORD_CHANGED: 'Your password has been changed successfully.',
  BOOKING_SUCCESS: 'Your booking has been confirmed! Check your email for details.',
  REVIEW_SUBMITTED: 'Thank you for your review! It has been submitted successfully.',
  NEWSLETTER_SUBSCRIBED: 'You have been successfully subscribed to our newsletter.',
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PH: /^(\+63|63|0)9\d{9}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMMM dd, yyyy HH:mm',
  RELATIVE: 'relative',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export default {
  API_BASE_URL,
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  STORAGE_KEYS,
  API_ENDPOINTS,
  HTTP_STATUS,
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  TOUR_CATEGORIES,
  DIFFICULTY_LEVELS,
  HOTEL_CATEGORIES,
  DESTINATIONS,
  PAYMENT_METHODS,
  UPLOAD_CONSTRAINTS,
  PAGINATION,
  SEARCH_FILTERS,
  SOCIAL_MEDIA,
  CONTACT_INFO,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX,
  DATE_FORMATS,
  ANIMATION_DURATION,
  BREAKPOINTS,
};