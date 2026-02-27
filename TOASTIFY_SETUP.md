# React Toastify Integration

## Overview
Toast notifications have been integrated into the application using React Toastify v10. Toasts are automatically shown for:
- **Pending State**: Loading toast while registration is in progress
- **Success State**: Success toast when registration completes
- **Error State**: Error toast when registration fails

## Installation
```bash
npm install react-toastify
```

## Setup

### 1. Provider Configuration
Configured in [store/provider.tsx](store/provider.tsx):
```typescript
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </Provider>
  );
}
```

### 2. Redux Integration
Updated in [store/slices/authSlice.ts](store/slices/authSlice.ts):

**Contractor Registration:**
```typescript
registerContractor.pending → toast.loading('Creating contractor account...')
registerContractor.fulfilled → toast.success('Contractor registered successfully!')
registerContractor.rejected → toast.error('Error message from backend')
```

**Labour Registration:**
```typescript
registerLabour.pending → toast.loading('Creating labour account...')
registerLabour.fulfilled → toast.success('Labour registered successfully!')
registerLabour.rejected → toast.error('Error message from backend')
```

## Features

✅ **Automatic Notifications**
- No manual toast calls needed in components
- Handled entirely in Redux async thunks

✅ **Loading Indicator**
- Shows loading toast while registration is pending
- Auto-dismissed when request completes

✅ **Success Messages**
- Displays backend message or default success message
- Auto-closes after 3 seconds

✅ **Error Handling**
- Shows error message from backend or rejection payload
- Persistent until user dismisses

✅ **User-Friendly**
- Position: Top-right
- Draggable toast items
- Pause on hover
- Click to dismiss
- Pause on focus loss

## Configuration Options

Current toast configuration:
```typescript
position: "top-right"          // Toast position on screen
autoClose: 3000                // Auto-close time (3 seconds)
hideProgressBar: false         // Show progress bar
newestOnTop: true              // Stack new toasts on top
closeOnClick: true             // Click to close
pauseOnFocusLoss: true         // Pause timer when window loses focus
draggable: true                // Drag to dismiss
pauseOnHover: true             // Pause timer on hover
theme: "light"                 // Theme (light/dark/colored)
```

## Customization

To change toast behavior, modify `ToastContainer` props in [store/provider.tsx](store/provider.tsx).

To customize individual toast messages, edit cases in [store/slices/authSlice.ts](store/slices/authSlice.ts):

```typescript
toast.success('Custom message', {
  position: 'top-right',
  autoClose: 5000,  // Different auto-close time
  // ... other options
});
```

## Dark Mode Support

To enable dark mode for toasts:
```typescript
theme="dark"  // or "colored"
```

Change in `ToastContainer` theme prop in provider.tsx.

## Testing

Toasts will appear:
1. When contractor registration form is submitted
2. When labour registration form is submitted
3. Success: Shows success message for 3 seconds
4. Error: Shows error message until dismissed

## References

- [React Toastify Documentation](https://fkhadra.github.io/react-toastify/introduction)
- [API Reference](https://fkhadra.github.io/react-toastify/toast-options)
