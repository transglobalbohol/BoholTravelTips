import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface BookingItem {
  type: 'tour' | 'hotel';
  id: string;
  name: string;
  image: string;
  price: number;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  travelers: number;
  duration?: string;
  location: string;
}

export interface BookingState {
  items: BookingItem[];
  totalPrice: number;
  isProcessing: boolean;
  currentBooking: BookingItem | null;
  searchCriteria: SearchCriteria;
}

export interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  travelers: number;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface BookingContextType extends BookingState {
  addBookingItem: (item: BookingItem) => void;
  removeBookingItem: (id: string) => void;
  updateBookingItem: (id: string, updates: Partial<BookingItem>) => void;
  clearBooking: () => void;
  setCurrentBooking: (booking: BookingItem | null) => void;
  updateSearchCriteria: (criteria: Partial<SearchCriteria>) => void;
  processBooking: (bookingData: ProcessBookingData) => Promise<string>;
}

export interface ProcessBookingData {
  customerInfo: CustomerInfo;
  paymentMethod: string;
  specialRequests?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Action Types
type BookingAction =
  | { type: 'ADD_ITEM'; payload: BookingItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<BookingItem> } }
  | { type: 'CLEAR_BOOKING' }
  | { type: 'SET_CURRENT_BOOKING'; payload: BookingItem | null }
  | { type: 'UPDATE_SEARCH_CRITERIA'; payload: Partial<SearchCriteria> }
  | { type: 'SET_PROCESSING'; payload: boolean };

// Initial State
const initialState: BookingState = {
  items: [],
  totalPrice: 0,
  isProcessing: false,
  currentBooking: null,
  searchCriteria: {
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: 1,
  },
};

// Reducer
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }
    case 'UPDATE_ITEM': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.price, 0),
      };
    }
    case 'CLEAR_BOOKING':
      return {
        ...state,
        items: [],
        totalPrice: 0,
        currentBooking: null,
      };
    case 'SET_CURRENT_BOOKING':
      return {
        ...state,
        currentBooking: action.payload,
      };
    case 'UPDATE_SEARCH_CRITERIA':
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          ...action.payload,
        },
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    default:
      return state;
  }
};

// Create Context
export const BookingContext = createContext<BookingContextType>({} as BookingContextType);

// Provider Component
interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const addBookingItem = (item: BookingItem): void => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeBookingItem = (id: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateBookingItem = (id: string, updates: Partial<BookingItem>): void => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  };

  const clearBooking = (): void => {
    dispatch({ type: 'CLEAR_BOOKING' });
  };

  const setCurrentBooking = (booking: BookingItem | null): void => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  const updateSearchCriteria = (criteria: Partial<SearchCriteria>): void => {
    dispatch({ type: 'UPDATE_SEARCH_CRITERIA', payload: criteria });
  };

  const processBooking = async (bookingData: ProcessBookingData): Promise<string> => {
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: state.items,
          totalPrice: state.totalPrice,
          customerInfo: bookingData.customerInfo,
          paymentMethod: bookingData.paymentMethod,
          specialRequests: bookingData.specialRequests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear booking after successful processing
        dispatch({ type: 'CLEAR_BOOKING' });
        return data.bookingId;
      } else {
        throw new Error(data.message || 'Booking processing failed');
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const value: BookingContextType = {
    ...state,
    addBookingItem,
    removeBookingItem,
    updateBookingItem,
    clearBooking,
    setCurrentBooking,
    updateSearchCriteria,
    processBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};