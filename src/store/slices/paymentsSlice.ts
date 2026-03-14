import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Payment } from '@/types';

interface PaymentsState {
  list: Payment[];
  selected: Payment | null;
  history: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  list: [],
  selected: null,
  history: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.list = action.payload;
      state.error = null;
    },
    setPaymentHistory: (state, action: PayloadAction<Payment[]>) => {
      state.history = action.payload;
    },
    setSelectedPayment: (state, action: PayloadAction<Payment | null>) => {
      state.selected = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.list.unshift(action.payload);
      state.history.unshift(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const update = (list: Payment[]) => {
        const idx = list.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) list[idx] = action.payload;
      };
      update(state.list);
      update(state.history);
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
    },
    setPagination: (state, action: PayloadAction<Partial<PaymentsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
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
  setPayments,
  setPaymentHistory,
  setSelectedPayment,
  addPayment,
  updatePayment,
  setPagination,
  setLoading,
  setError,
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
