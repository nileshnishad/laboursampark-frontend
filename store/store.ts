import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inquiryReducer from './slices/inquirySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inquiry: inquiryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
