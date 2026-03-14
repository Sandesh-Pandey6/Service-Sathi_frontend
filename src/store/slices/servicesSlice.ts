import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Service, ServiceCategory } from '@/types';

interface ServicesState {
  list: Service[];
  categories: ServiceCategory[];
  selected: Service | null;
  filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  list: [],
  categories: [],
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

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.list = action.payload;
      state.error = null;
    },
    setCategories: (state, action: PayloadAction<ServiceCategory[]>) => {
      state.categories = action.payload;
    },
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selected = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ServicesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<Partial<ServicesState['pagination']>>) => {
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
  setServices,
  setCategories,
  setSelectedService,
  setFilters,
  resetFilters,
  setPagination,
  setLoading,
  setError,
} = servicesSlice.actions;
export default servicesSlice.reducer;
