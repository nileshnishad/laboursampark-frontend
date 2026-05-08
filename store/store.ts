import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inquiryReducer from './slices/inquirySlice';
import visibleUsersReducer from './slices/visibleUsersSlice';
import jobEnquiryReducer from './slices/jobEnquirySlice';
import skillsReducer from './slices/skillsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inquiry: inquiryReducer,
    visibleUsers: visibleUsersReducer,
    jobEnquiry: jobEnquiryReducer,
    skills: skillsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
