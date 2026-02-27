import { toast, ToastOptions, Id } from 'react-toastify';

/**
 * Default toast configuration
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Success toast notification
 */
export const showSuccessToast = (
  message: string,
  options?: ToastOptions
) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    autoClose: options?.autoClose ?? 3000,
  });
};

/**
 * Error toast notification
 */
export const showErrorToast = (
  message: string,
  options?: ToastOptions
) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    autoClose: options?.autoClose ?? false, // Keep error persistent by default
  });
};

/**
 * Warning toast notification
 */
export const showWarningToast = (
  message: string,
  options?: ToastOptions
) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
    autoClose: options?.autoClose ?? 3000,
  });
};

/**
 * Info toast notification
 */
export const showInfoToast = (
  message: string,
  options?: ToastOptions
) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
    autoClose: options?.autoClose ?? 3000,
  });
};

/**
 * Loading toast notification - returns toast ID for later dismissal
 */
export const showLoadingToast = (
  message: string,
  options?: ToastOptions
): Id => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Dismiss a specific toast or all toasts
 */
export const dismissToast = (toastId?: Id) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Update an existing toast (useful for converting loading toast to success/error)
 */
export const updateToast = (
  toastId: Id,
  options: {
    render?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    isLoading?: boolean;
    autoClose?: number | false | null;
    [key: string]: any;
  }
) => {
  toast.update(toastId, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Success toast for API responses
 */
export const showApiSuccessToast = (message?: string) => {
  return showSuccessToast(message || 'Operation successful!', {
    autoClose: 3000,
  });
};

/**
 * Error toast for API responses
 */
export const showApiErrorToast = (error?: string | Error) => {
  let message = 'Something went wrong. Please try again.';

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return showErrorToast(message, {
    autoClose: false,
  });
};

/**
 * Loading toast for async operations
 */
export const showApiLoadingToast = (message: string = 'Processing...') => {
  return showLoadingToast(message);
};

/**
 * Promise-based toast: shows loading, then success or error
 * Useful for wrapping async functions
 */
export const toastPromise = <T extends unknown = unknown,>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise as Promise<unknown>,
    {
      pending: {
        render: messages.pending,
        ...defaultOptions,
      },
      success: {
        render: messages.success,
        ...defaultOptions,
        autoClose: 3000,
      },
      error: {
        render: messages.error,
        ...defaultOptions,
        autoClose: false,
      },
    }
  );
};
