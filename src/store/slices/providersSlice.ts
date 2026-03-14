import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Provider } from '@/types';

interface ProvidersState {
  list: Provider[];
  selected: Provider | null;
  filters: {
    city?: string;
    is_verified?: boolean;
    min_rating?: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProvidersState = {
  list: [],
  selected: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.list = action.payload;
      state.error = null;
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selected = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProvidersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<ProvidersState['pagination']>>) => {
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
  setProviders,
  setSelectedProvider,
  setFilters,
  setPagination,
  setLoading,
  setError,
} = providersSlice.actions;
export default providersSlice.reducer;
