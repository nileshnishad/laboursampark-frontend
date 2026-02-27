/**
 * API Endpoints - Usage examples and API call functions
 * This file demonstrates how to use the API service
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
