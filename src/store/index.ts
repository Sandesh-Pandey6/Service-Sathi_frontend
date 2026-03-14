import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import servicesReducer from './slices/servicesSlice';
import bookingsReducer from './slices/bookingsSlice';
import providersReducer from './slices/providersSlice';
import messagesReducer from './slices/messagesSlice';
import paymentsReducer from './slices/paymentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
    providers: providersReducer,
    messages: messagesReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
