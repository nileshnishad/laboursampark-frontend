/**
 * API Service - Simple functional approach
 * Handles GET, POST, PUT, DELETE, PATCH requests
 * Auto-detects FormData for file uploads
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const DEFAULT_TIMEOUT = 10000;

// ============= Types =============

interface ApiOptions {
  headers?: Record<string, string>;
  includeToken?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// ============= Token Management =============

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || null;
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// ============= Helper Functions =============

/**
 * Build complete URL for API endpoint
 */
const buildURL = (endpoint: string): string => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Check if object contains File instances
 */
const containsFiles = (obj: any): boolean => {
  if (obj instanceof File) return true;
  if (obj instanceof FormData) return true;
  if (typeof obj !== 'object' || obj === null) return false;

  for (const key in obj) {
    if (obj[key] instanceof File) return true;
    if (typeof obj[key] === 'object' && containsFiles(obj[key])) {
      return true;
    }
  }
  return false;
};

/**
 * Convert object to FormData recursively
 */
const objectToFormData = (
  obj: any,
  formData: FormData = new FormData(),
  prefix = ''
): FormData => {
  if (obj === null || obj === undefined) return formData;

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const fieldName = prefix ? `${prefix}[${key}]` : key;

    if (value instanceof File) {
      formData.append(fieldName, value);
    } else if (value === null || value === undefined) {
      continue;
    } else if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      objectToFormData(value, formData, fieldName);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayFieldName = `${fieldName}[${index}]`;
        if (typeof item === 'object' && !(item instanceof File)) {
          objectToFormData(item, formData, arrayFieldName);
        } else {
          formData.append(arrayFieldName, item);
        }
      });
    } else {
      formData.append(fieldName, String(value));
    }
  }

  return formData;
};

/**
 * Prepare headers for request
 */
const prepareHeaders = (
  payload?: any,
  customHeaders?: Record<string, string>,
  includeToken: boolean = true
): Record<string, string> => {
  const headers: Record<string, string> = {};

  // Set Content-Type only if not FormData
  if (payload && !containsFiles(payload)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add custom headers
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  // Add authorization token
  if (includeToken) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Generic request handler
 */
const request = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  payload?: any,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const url = buildURL(endpoint);
  const headers = prepareHeaders(
    payload,
    options.headers,
    options.includeToken !== false
  );
  const timeout = options.timeout || DEFAULT_TIMEOUT;

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'omit',
  };

  // Add body for POST, PUT, PATCH
  if (payload && ['POST', 'PUT', 'PATCH'].includes(method)) {
    if (containsFiles(payload)) {
      fetchOptions.body = objectToFormData(payload);
    } else {
      fetchOptions.body = JSON.stringify(payload);
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    // Handle response
    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status,
      };
    }

    return {
      success: false,
      data,
      error: data?.message || `HTTP Error: ${response.status}`,
      message: data?.message || response.statusText,
      status: response.status,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        message: 'The request took too long to complete',
      };
    }

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

// ============= Public API Methods =============

/**
 * GET request
 */
export const apiGet = async <T = any>(
  endpoint: string,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, 'GET', undefined, options);
};

/**
 * POST request
 */
export const apiPost = async <T = any>(
  endpoint: string,
  payload?: any,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, 'POST', payload, options);
};

/**
 * PUT request
 */
export const apiPut = async <T = any>(
  endpoint: string,
  payload?: any,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, 'PUT', payload, options);
};

/**
 * PATCH request
 */
export const apiPatch = async <T = any>(
  endpoint: string,
  payload?: any,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, 'PATCH', payload, options);
};

/**
 * DELETE request
 */
export const apiDelete = async <T = any>(
  endpoint: string,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  return request<T>(endpoint, 'DELETE', undefined, options);
};

/**
 * Upload file with additional data
 */
export const apiUploadFile = async <T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>,
  options?: ApiOptions
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });
  }

  const headers = prepareHeaders(
    formData,
    options?.headers,
    options?.includeToken !== false
  );

  const url = buildURL(endpoint);
  const timeout = options?.timeout || DEFAULT_TIMEOUT;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'omit',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status,
      };
    }

    return {
      success: false,
      data,
      error: data?.message || `HTTP Error: ${response.status}`,
      message: data?.message || response.statusText,
      status: response.status,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        message: 'The request took too long to complete',
      };
    }

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

// ============= Backward Compatibility =============

export const apiService = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  uploadFile: apiUploadFile,
  getToken,
  setToken,
  clearToken,
};
