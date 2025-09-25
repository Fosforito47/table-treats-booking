import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  partySize: number;
  tablePreference: string;
  specialRequests?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

interface BookingState {
  reservations: Reservation[];
  isLoading: boolean;
}

type BookingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: Reservation }
  | { type: 'CANCEL_RESERVATION'; payload: string }
  | { type: 'SET_RESERVATIONS'; payload: Reservation[] };

const initialState: BookingState = {
  reservations: [],
  isLoading: false,
};

const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_RESERVATION':
      return { ...state, reservations: [...state.reservations, action.payload] };
    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload.id ? action.payload : res
        ),
      };
    case 'CANCEL_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload ? { ...res, status: 'cancelled' as const } : res
        ),
      };
    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.payload };
    default:
      return state;
  }
};

interface BookingContextType {
  state: BookingState;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  getActiveReservations: () => Reservation[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load reservations from localStorage on mount
  useEffect(() => {
    const savedReservations = localStorage.getItem('restaurant-reservations');
    if (savedReservations) {
      try {
        const reservations = JSON.parse(savedReservations);
        dispatch({ type: 'SET_RESERVATIONS', payload: reservations });
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    }
  }, []);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('restaurant-reservations', JSON.stringify(state.reservations));
  }, [state.reservations]);

  const addReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const reservation: Reservation = {
      ...reservationData,
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    dispatch({ type: 'ADD_RESERVATION', payload: reservation });
  };

  const updateReservation = (reservation: Reservation) => {
    dispatch({ type: 'UPDATE_RESERVATION', payload: reservation });
  };

  const cancelReservation = (id: string) => {
    dispatch({ type: 'CANCEL_RESERVATION', payload: id });
  };

  const getActiveReservations = () => {
    return state.reservations.filter(res => res.status === 'confirmed');
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        addReservation,
        updateReservation,
        cancelReservation,
        getActiveReservations,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};