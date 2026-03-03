/**
 * API Endpoints - Centralized API call functions
 * Uses the API service to manage all backend communications
 */

import { apiService } from './api-service';

/**
 * Authentication APIs
 */
export const authApi = {
  // Register new user
  register: (payload: any) =>
    apiService.post('/auth/register', payload, { includeToken: false }),
};

/**
 * Inquiry APIs - Contact form submissions
 */
export const inquiryApi = {
  // Submit inquiry form
  submit: (payload: {
    fullName: string;
    email: string;
    mobile?: string;
    subject: string;
    message: string;
  }) => apiService.post('/api/inquiries', payload, { includeToken: false }),

  // Get all inquiries (admin only)
  getAll: () => apiService.get('/inquiries'),

  // Get single inquiry by ID
  getById: (id: string) => apiService.get(`/inquiries/${id}`),

  // Delete inquiry (admin only)
  delete: (id: string) => apiService.delete(`/inquiries/${id}`),
};

/**
 * Contractor APIs - Browse contractors (public)
 */
export const contractorApi = {
  // Get all contractors (public)
  getAll: () => apiService.get('/api/users/contractors', { includeToken: false }),

  // Get single contractor by ID (public)
  getById: (id: string) => apiService.get(`/api/users/contractors/${id}`, { includeToken: false }),
};

/**
 * Labour APIs - Browse labours (public)
 */
export const labourApi = {
  // Get all labours (public)
  getAll: () => apiService.get('/api/users/labours', { includeToken: false }),

  // Get single labour by ID (public)
  getById: (id: string) => apiService.get(`/api/users/labours/${id}`, { includeToken: false }),
};

