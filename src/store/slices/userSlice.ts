import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface UserState {
  profile: User | null;
  customerProfile: Record<string, unknown> | null;
  providerProfile: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  customerProfile: null,
  providerProfile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
      state.error = null;
    },
    setCustomerProfile: (state, action: PayloadAction<Record<string, unknown> | null>) => {
      state.customerProfile = action.payload;
    },
    setProviderProfile: (state, action: PayloadAction<Record<string, unknown> | null>) => {
      state.providerProfile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.customerProfile = null;
      state.providerProfile = null;
      state.error = null;
    },
  },
});

export const {
  setProfile,
  setCustomerProfile,
  setProviderProfile,
  setLoading,
  setError,
  clearProfile,
} = userSlice.actions;
export default userSlice.reducer;
