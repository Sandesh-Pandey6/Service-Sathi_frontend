import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Booking } from '@/types';

interface BookingsState {
  customerBookings: Booking[];
  providerBookings: Booking[];
  selected: Booking | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  statusFilter: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  customerBookings: [],
  providerBookings: [],
  selected: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  statusFilter: null,
  isLoading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setCustomerBookings: (state, action: PayloadAction<Booking[]>) => {
      state.customerBookings = action.payload;
      state.error = null;
    },
    setProviderBookings: (state, action: PayloadAction<Booking[]>) => {
      state.providerBookings = action.payload;
      state.error = null;
    },
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selected = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.customerBookings.unshift(action.payload);
    },
    updateBookingInList: (state, action: PayloadAction<Booking>) => {
      const update = (list: Booking[]) => {
        const idx = list.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) list[idx] = action.payload;
      };
      update(state.customerBookings);
      update(state.providerBookings);
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
    },
    setPagination: (state, action: PayloadAction<Partial<BookingsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCustomerBookings,
  setProviderBookings,
  setSelectedBooking,
  addBooking,
  updateBookingInList,
  setPagination,
  setStatusFilter,
  setLoading,
  setError,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;
