# Redux Toolkit Setup - State Management & API Integration

## Overview

Redux Toolkit is used for global state management, API calls, and handling async operations. This keeps your components clean and maintainable.

## Architecture

```
┌─────────────────────────────────────────┐
│        React Component                  │
│  (ContractorRegisterForm.tsx)           │
└──────────────┬──────────────────────────┘
               │ Dispatches Action
               ▼
┌─────────────────────────────────────────┐
│        Redux Slice (authSlice.ts)       │
│  - Async Thunks (registerContractor)    │
│  - Reducers                             │
│  - State Management                     │
└──────────────┬──────────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────────┐
│      API Service (api-service.ts)       │
│  - Makes HTTP calls                     │
│  - Handles tokens                       │
│  - Error handling                       │
└──────────────┬──────────────────────────┘
               │ Communicates with
               ▼
┌─────────────────────────────────────────┐
│      Backend API Server                 │
└─────────────────────────────────────────┘
```

## File Structure

```
store/
├── store.ts           # Redux store configuration
├── provider.tsx       # Redux provider component
├── hooks.ts           # Custom typed hooks
└── slices/
    └── authSlice.ts   # Auth reducers & thunks
```

## Key Files

### 1. store.ts - Store Configuration

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

**Purpose:** Combines all reducers and configures the Redux store.

### 2. authSlice.ts - Auth State & Thunks

Contains:
- **State:** `loading`, `success`, `error`, `user`, `token`
- **Async Thunks:** `registerContractor`, `registerLabour`
- **Reducers:** `resetAuthState`, `clearError`, `logout`, `setToken`

### 3. hooks.ts - Custom Typed Hooks

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
```

**Purpose:** Provides type-safe access to Redux dispatch and state.

### 4. provider.tsx - Redux Provider

```typescript
<Provider store={store}>
  {children}
</Provider>
```

**Purpose:** Wraps your entire app to provide Redux store access.

## Usage in Components

### Step 1: Import Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor, resetAuthState } from "@/store/slices/authSlice";
```

### Step 2: Get State & Dispatch

```typescript
const dispatch = useAppDispatch();
const { loading, success, error, message } = useAppSelector((state) => state.auth);
```

### Step 3: Dispatch Action on Form Submit

```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const formPayload = {
    userType: "contractor",
    basicInfo: { /* ... */ },
    businessDetails: { /* ... */ },
    // ... rest of payload
  };
  
  dispatch(registerContractor(formPayload));
};
```

### Step 4: Handle Success/Error

```typescript
useEffect(() => {
  if (success) {
    alert('Registration successful!');
    router.push('/login');
    dispatch(resetAuthState());
  }
}, [success, dispatch, router]);
```

## Complete Example

```typescript
'use client';

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor, resetAuthState } from "@/store/slices/authSlice";
import { useEffect } from "react";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.auth);

  // Handle successful registration
  useEffect(() => {
    if (success) {
      alert('Registration complete!');
      dispatch(resetAuthState());
      // Redirect to login
    }
  }, [success, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      userType: "contractor",
      basicInfo: { /* form data */ },
      // ... rest of payload
    };
    
    dispatch(registerContractor(payload));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {error && <div className="text-red-500">{error}</div>}
      {loading && <p>Registering...</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
```

## Redux State

### Auth State Structure

```typescript
interface AuthState {
  loading: boolean;      // API request in progress
  success: boolean;      // Registration was successful
  error: string | null;  // Error message if any
  message: string | null; // Success message
  user: any | null;      // User data after login
  token: string | null;  // Auth token
}
```

## Async Thunks

### registerContractor

Handles contractor registration. Flow:

1. **Pending:** `loading = true`
2. **Success:** `loading = false, success = true, token = saved`
3. **Error:** `loading = false, success = false, error = message`

```typescript
dispatch(registerContractor({
  userType: "contractor",
  basicInfo: { /* ... */ },
  // ...
}));
```

### registerLabour

Similar to registerContractor but for labour registration.

```typescript
dispatch(registerLabour({
  userType: "labour",
  basicInfo: { /* ... */ },
  // ...
}));
```

## Reducer Actions

### resetAuthState
Resets all auth state to initial values.

```typescript
dispatch(resetAuthState());
```

### clearError
Clears only the error message.

```typescript
dispatch(clearError());
```

### logout
Clears user and token, removes from localStorage.

```typescript
dispatch(logout());
```

### setToken
Sets auth token in state and localStorage.

```typescript
dispatch(setToken(token));
```

## Adding More Slices

To add a new feature (e.g., contractor management):

### 1. Create new slice (store/slices/contractorSlice.ts)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/lib/api-service';

export const getContractors = createAsyncThunk(
  'contractor/getContractors',
  async (params?: any) => {
    const response = await apiService.get('/contractors', { 
      includeToken: false 
    });
    return response.data;
  }
);

const contractorSlice = createSlice({
  name: 'contractor',
  initialState: { /* ... */ },
  reducers: { /* ... */ },
  extraReducers: (builder) => {
    builder.addCase(getContractors.fulfilled, (state, action) => {
      state.contractors = action.payload;
    });
  },
});

export default contractorSlice.reducer;
```

### 2. Add to store.ts

```typescript
import contractorReducer from './slices/contractorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contractor: contractorReducer,  // Add here
  },
});
```

### 3. Use in component

```typescript
const { contractors } = useAppSelector((state) => state.contractor);
dispatch(getContractors());
```

## Error Handling

### In Thunks

```typescript
export const registerContractor = createAsyncThunk(
  'auth/registerContractor',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/auth/register', payload);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### In Components

```typescript
{error && (
  <div className="text-red-500">
    Error: {error}
    <button onClick={() => dispatch(clearError())}>Dismiss</button>
  </div>
)}
```

## Token Management

Token is automatically:
1. **Saved** after successful login/registration
2. **Included** in API requests (with `apiService.setToken()`)
3. **Cleared** on logout

```typescript
// Automatically called in thunk on success
if (response.data?.token) {
  apiService.setToken(response.data.token);
}
```

## Loading States

Use `loading` state to disable buttons and show spinners:

```typescript
<button 
  type="submit" 
  disabled={loading}
  className="disabled:opacity-50"
>
  {loading ? (
    <>
      <Spinner />
      Processing...
    </>
  ) : (
    'Submit'
  )}
</button>
```

## Data Flow Example

```
User fills form
    ↓
Clicks "Create Account"
    ↓
handleSubmit called
    ↓
dispatch(registerContractor(payload))
    ↓
Thunk executes:
  - loading = true
  - Calls apiService.post('/auth/register', payload)
    ↓
  - If success: loading = false, success = true, token saved
  - If error: loading = false, error = message
    ↓
Component re-renders with new state
    ↓
useEffect checks success flag
    ↓
If success: show alert, reset form, redirect
If error: show error message
```

## Best Practices

✅ Use thunks for async operations  
✅ Keep components focused on UI  
✅ Use custom hooks for type safety  
✅ Handle loading, success, and error states  
✅ Reset state after operations  
✅ Clear errors when user interacts again  
✅ Save tokens after successful auth  

❌ Don't make API calls directly in components without Redux  
❌ Don't forget to dispatch actions  
❌ Don't ignore loading/error states  
❌ Don't store sensitive data in localStorage directly  
❌ Don't forget to reset form after success  

## Debugging Redux

### Check Redux DevTools
Install Redux DevTools browser extension to inspect actions and state changes.

### Log State Changes
```typescript
const state = useAppSelector((state) => state.auth);
console.log('Auth State:', state);
```

### Verify Thunk Execution
Check Network tab in DevTools to see API calls made by thunks.

## Testing

### Test Thunks

```typescript
it('should register contractor', async () => {
  const payload = { /* ... */ };
  const result = await dispatch(registerContractor(payload));
  
  expect(result.payload).toBeDefined();
  expect(useAppSelector(state => state.auth.success)).toBe(true);
});
```

## Common Issues

### Issue: "Cannot read property 'auth' of undefined"

**Solution:** Make sure Redux provider wraps your entire app in `layout.tsx`:

```typescript
<ReduxProvider>
  {children}
</ReduxProvider>
```

### Issue: Token not being sent

**Solution:** Verify token is being set after successful registration:

```typescript
if (response.data?.token) {
  apiService.setToken(response.data.token);
}
```

### Issue: Component not updating after dispatch

**Solution:** Check that you're using the correct selector:

```typescript
const { loading, success } = useAppSelector((state) => state.auth);
```

---

## Summary

- **Redux Toolkit** manages global state and async operations
- **Thunks** handle API calls without cluttering components
- **Custom hooks** provide type-safe access to Redux
- **Components** stay clean, focused only on UI
- **API service** remains agnostic to Redux, fully reusable

This architecture scales well and keeps your codebase maintainable! 🚀
