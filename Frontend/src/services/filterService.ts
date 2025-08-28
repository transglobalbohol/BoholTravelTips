import { SearchParams } from '../types';

export interface FilterOptions {
  destination?: string;
  location?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  duration?: string;
  difficulty?: string;
  amenities?: string[];
  tags?: string[];
  status?: string;
  bookingType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
}

export class FilterService {
  // Build query parameters from filters
  static buildQueryParams(filters: FilterOptions): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'priceRange' && typeof value === 'object' && value !== null) {
          const priceRange = value as { min?: number; max?: number };
          if (priceRange.min !== undefined && priceRange.min > 0) {
            params.set('minPrice', priceRange.min.toString());
          }
          if (priceRange.max !== undefined && priceRange.max < 100000) {
            params.set('maxPrice', priceRange.max.toString());
          }
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (item && item !== '') {
              params.append(key, item.toString());
            }
          });
        } else if (typeof value === 'object') {
          // Handle nested objects
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== undefined && subValue !== null && subValue !== '') {
              params.set(`${key}.${subKey}`, subValue.toString());
            }
          });
        } else {
          params.set(key, value.toString());
        }
      }
    });

    return params;
  }

  // Parse URL search params into filter object
  static parseFiltersFromURL(searchParams: URLSearchParams): FilterOptions {
    const filters: FilterOptions = {};

    searchParams.forEach((value, key) => {
      if (key === 'minPrice' || key === 'maxPrice') {
        if (!filters.priceRange) filters.priceRange = {};
        const priceKey = key === 'minPrice' ? 'min' : 'max';
        filters.priceRange[priceKey] = parseInt(value);
      } else if (key === 'rating') {
        filters.rating = parseFloat(value);
      } else if (key === 'page' || key === 'limit') {
        filters[key] = parseInt(value);
      } else if (key === 'amenities' || key === 'tags') {
        if (!filters[key]) filters[key] = [];
        (filters[key] as string[]).push(value);
      } else if (value !== '' && value !== 'undefined' && value !== 'null') {
        (filters as any)[key] = value;
      }
    });

    return filters;
  }

  // Validate filter values
  static validateFilters(filters: FilterOptions): FilterOptions {
    const validated = { ...filters };

    // Validate price range
    if (validated.priceRange) {
      if (validated.priceRange.min !== undefined && validated.priceRange.min < 0) {
        validated.priceRange.min = 0;
      }
      if (validated.priceRange.max !== undefined && validated.priceRange.max > 100000) {
        validated.priceRange.max = 100000;
      }
      if (validated.priceRange.min !== undefined && validated.priceRange.max !== undefined && 
          validated.priceRange.min > validated.priceRange.max) {
        const temp = validated.priceRange.min;
        validated.priceRange.min = validated.priceRange.max;
        validated.priceRange.max = temp;
      }
    }

    // Validate rating
    if (validated.rating !== undefined) {
      if (validated.rating < 0) validated.rating = 0;
      if (validated.rating > 5) validated.rating = 5;
    }

    // Validate page and limit
    if (validated.page !== undefined && validated.page < 1) {
      validated.page = 1;
    }
    if (validated.limit !== undefined) {
      if (validated.limit < 1) validated.limit = 12;
      if (validated.limit > 100) validated.limit = 100;
    }

    // Validate sort order
    if (validated.sortOrder && !['asc', 'desc'].includes(validated.sortOrder)) {
      validated.sortOrder = 'desc';
    }

    return validated;
  }

  // Clear empty filters
  static clearEmptyFilters(filters: FilterOptions): FilterOptions {
    const cleaned: FilterOptions = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'priceRange' && typeof value === 'object') {
          const priceRange = value as { min?: number; max?: number };
          const cleanedPriceRange: { min?: number; max?: number } = {};
          if (priceRange.min !== undefined && priceRange.min > 0) {
            cleanedPriceRange.min = priceRange.min;
          }
          if (priceRange.max !== undefined && priceRange.max < 100000) {
            cleanedPriceRange.max = priceRange.max;
          }
          if (Object.keys(cleanedPriceRange).length > 0) {
            cleaned.priceRange = cleanedPriceRange;
          }
        } else if (Array.isArray(value)) {
          const cleanedArray = value.filter(item => item !== undefined && item !== null && item !== '');
          if (cleanedArray.length > 0) {
            (cleaned as any)[key] = cleanedArray;
          }
        } else if (typeof value === 'string' && value.trim() !== '') {
          (cleaned as any)[key] = value.trim();
        } else if (typeof value !== 'string') {
          (cleaned as any)[key] = value;
        }
      }
    });

    return cleaned;
  }

  // Convert filters to SearchParams format for API calls
  static toSearchParams(filters: FilterOptions): SearchParams {
    const searchParams: SearchParams = {};

    // Map common filter fields
    if (filters.destination) searchParams.destination = filters.destination;
    if (filters.location) searchParams.destination = filters.location; // Map location to destination
    if (filters.category) searchParams.category = filters.category;
    if (filters.rating) searchParams.rating = filters.rating;
    if (filters.date) searchParams.date = filters.date;
    if (filters.duration) searchParams.duration = filters.duration;
    if (filters.sortBy) searchParams.sortBy = filters.sortBy;
    if (filters.sortOrder) searchParams.sortOrder = filters.sortOrder;
    if (filters.page) searchParams.page = filters.page;
    if (filters.limit) searchParams.limit = filters.limit;
    if (filters.search) searchParams.q = filters.search;
    if (filters.q) searchParams.q = filters.q;

    // Handle price range
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        searchParams.minPrice = filters.priceRange.min;
      }
      if (filters.priceRange.max !== undefined) {
        searchParams.maxPrice = filters.priceRange.max;
      }
    }

    return searchParams;
  }

  // Get default filters for different entity types
  static getDefaultFilters(entityType: 'tours' | 'hotels' | 'bookings'): FilterOptions {
    const baseFilters: FilterOptions = {
      sortBy: 'popularity',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    };

    switch (entityType) {
      case 'tours':
        return {
          ...baseFilters,
          priceRange: { min: 0, max: 10000 }
        };
      case 'hotels':
        return {
          ...baseFilters,
          priceRange: { min: 500, max: 15000 }
        };
      case 'bookings':
        return {
          ...baseFilters,
          sortBy: 'createdAt',
          limit: 10
        };
      default:
        return baseFilters;
    }
  }

  // Merge filters with defaults
  static mergeWithDefaults(filters: FilterOptions, entityType: 'tours' | 'hotels' | 'bookings'): FilterOptions {
    const defaults = this.getDefaultFilters(entityType);
    return { ...defaults, ...filters };
  }
}

export default FilterService;
