/**
 * Custom React hooks for API calls
 * Provides easy integration with React components
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiService } from './api-service';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseMutationState<T> extends UseApiState<T> {
  isSuccess: boolean;
}

/**
 * Hook for GET requests with automatic data fetching
 * @param endpoint - API endpoint to fetch from
 * @param includeToken - Whether to include auth token (default: false)
 * @param dependencies - Dependencies array to refetch when changed
 */
export function useApiGet<T = any>(
  endpoint: string | null,
  includeToken: boolean = false,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    if (!endpoint) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    const response = await apiService.get<T>(endpoint, { includeToken });

    if (response.success) {
      setState({ data: response.data || null, loading: false, error: null });
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error || 'Failed to fetch data',
      });
    }
  }, [endpoint, includeToken]);

  useEffect(() => {
    fetch();
  }, [endpoint, includeToken, ...dependencies]);

  return { ...state, refetch: fetch };
}

/**
 * Hook for POST requests
 * @param endpoint - API endpoint to post to
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiPost<T = any>(
  endpoint: string,
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(
    async (payload?: any) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isSuccess: false,
      }));

      const response = await apiService.post<T>(endpoint, payload, {
        includeToken,
      });

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          isSuccess: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Failed to complete request',
          isSuccess: false,
        });
      }
    },
    [endpoint, includeToken]
  );

  return { ...state, mutate };
}

/**
 * Hook for PUT requests
 * @param endpoint - API endpoint (can include ID placeholder like '/contractors/:id')
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiPut<T = any>(
  endpoint: string,
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(
    async (payload?: any) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isSuccess: false,
      }));

      const response = await apiService.put<T>(endpoint, payload, {
        includeToken,
      });

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          isSuccess: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Failed to update',
          isSuccess: false,
        });
      }
    },
    [endpoint, includeToken]
  );

  return { ...state, mutate };
}

/**
 * Hook for PATCH requests
 * @param endpoint - API endpoint
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiPatch<T = any>(
  endpoint: string,
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(
    async (payload?: any) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isSuccess: false,
      }));

      const response = await apiService.patch<T>(endpoint, payload, {
        includeToken,
      });

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          isSuccess: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Failed to patch',
          isSuccess: false,
        });
      }
    },
    [endpoint, includeToken]
  );

  return { ...state, mutate };
}

/**
 * Hook for DELETE requests
 * @param endpoint - API endpoint
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiDelete<T = any>(
  endpoint: string,
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const mutate = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      isSuccess: false,
    }));

    const response = await apiService.delete<T>(endpoint, { includeToken });

    if (response.success) {
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        isSuccess: true,
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error || 'Failed to delete',
        isSuccess: false,
      });
    }
  }, [endpoint, includeToken]);

  return { ...state, mutate };
}

/**
 * Hook for file uploads
 * @param endpoint - API endpoint for upload
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiUploadFile<T = any>(
  endpoint: string,
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const upload = useCallback(
    async (file: File, additionalData?: Record<string, any>) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isSuccess: false,
      }));

      const response = await apiService.uploadFile<T>(
        endpoint,
        file,
        additionalData,
        { includeToken }
      );

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          isSuccess: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Failed to upload file',
          isSuccess: false,
        });
      }
    },
    [endpoint, includeToken]
  );

  return { ...state, upload };
}

/**
 * Hook for form submission with automatic loading and error handling
 * @param endpoint - API endpoint
 * @param method - HTTP method (default: POST)
 * @param includeToken - Whether to include auth token (default: true)
 */
export function useApiForm<T = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST',
  includeToken: boolean = true
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
  });

  const submit = useCallback(
    async (formData: any) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isSuccess: false,
      }));

      let response;

      if (method === 'POST') {
        response = await apiService.post<T>(endpoint, formData, {
          includeToken,
        });
      } else if (method === 'PUT') {
        response = await apiService.put<T>(endpoint, formData, {
          includeToken,
        });
      } else {
        response = await apiService.patch<T>(endpoint, formData, {
          includeToken,
        });
      }

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
          isSuccess: true,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Form submission failed',
          isSuccess: false,
        });
      }
    },
    [endpoint, method, includeToken]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return { ...state, submit, reset };
}

/**
 * Hook for queries with search/filter parameters
 * @param baseEndpoint - Base API endpoint (without query params)
 * @param includeToken - Whether to include auth token (default: false)
 */
export function useApiQuery<T = any>(
  baseEndpoint: string,
  includeToken: boolean = false
) {
  const [state, setState] = useState<UseApiState<T & { total?: number }>>({
    data: null,
    loading: false,
    error: null,
  });

  const query = useCallback(
    async (params?: Record<string, any>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      let endpoint = baseEndpoint;
      if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        endpoint = `${baseEndpoint}?${queryString}`;
      }

      const response = await apiService.get<T>(endpoint, { includeToken });

      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Query failed',
        });
      }
    },
    [baseEndpoint, includeToken]
  );

  return { ...state, query };
}
