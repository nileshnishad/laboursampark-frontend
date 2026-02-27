# Redux + API Service Integration Summary

## What We Created

A complete state management and API integration system for your application.

## Components Overview

### 1. **API Service** (`lib/api-service.ts`)
- Core HTTP client
- Handles GET, POST, PUT, DELETE, PATCH, and file uploads
- Manages authentication tokens
- Handles errors and timeouts
- **Responsibility:** Making HTTP requests

### 2. **Redux Slice** (`store/slices/authSlice.ts`)
- Defines state structure
- Contains async thunks for registration
- Manages state transitions (pending, fulfilled, rejected)
- **Responsibility:** Managing auth state globally

### 3. **Redux Store** (`store/store.ts`)
- Configures Redux store
- Combines all reducers
- **Responsibility:** Centralizing state management

### 4. **Redux Provider** (`store/provider.tsx`)
- Wraps application with Redux
- Makes store accessible to all components
- **Responsibility:** Providing Redux context

### 5. **Custom Hooks** (`store/hooks.ts`)
- Typed dispatch and selector hooks
- Type-safe Redux access
- **Responsibility:** Providing developer ergonomics

## How Contractor Registration Works

```
┌──────────────────────┐
│   User fills form    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  ContractorRegisterForm Component        │
│  - Manages form state (businessName...)  │
│  - On submit: dispatch(registerContractor())
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Redux Action: registerContractor        │
│  (Async Thunk in authSlice.ts)           │
│  - Sets loading = true                   │
│  - Calls apiService.post()               │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  API Service (api-service.ts)            │
│  - Makes POST request to /auth/register  │
│  - Adds auth token if needed             │
│  - Handles response parsing              │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Backend API Server                      │
│  POST /auth/register                     │
│  - Validates data                        │
│  - Creates user                          │
│  - Returns token + user data             │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  API Response reaches Redux Thunk        │
│  - Saves token: apiService.setToken()    │
│  - Sets loading = false                  │
│  - Sets success = true                   │
│  - Returns response.data                 │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Redux State Updated                     │
│  - loading: false                        │
│  - success: true                         │
│  - user: {...}                           │
│  - token: "jwt..."                       │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Component Re-renders                    │
│  - useEffect runs (success flag changed) │
│  - Shows success message                 │
│  - Resets form                           │
│  - Redirects to /login                   │
└──────────────────────────────────────────┘
```

## Code Example: Registration Flow

### 1. Component Dispatches Action

```typescript
// Inside ContractorRegisterForm.tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const payload = {
    userType: "contractor",
    basicInfo: { businessName, email, password, ... },
    businessDetails: { businessType, ... },
    // ... more data
  };
  
  // Dispatch Redux action
  dispatch(registerContractor(payload));
};
```

### 2. Redux Thunk Executes

```typescript
// In store/slices/authSlice.ts
export const registerContractor = createAsyncThunk(
  'auth/registerContractor',
  async (payload: ContractorRegisterPayload, { rejectWithValue }) => {
    try {
      // Call API service
      const response = await apiService.post(
        '/auth/register', 
        payload, 
        { includeToken: false }
      );

      if (response.success) {
        // Save token automatically
        if (response.data?.token) {
          apiService.setToken(response.data.token);
        }
        return response.data; // Return data to fulfilled action
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. Redux Reducers Handle Response

```typescript
// In authSlice.ts extraReducers
builder
  .addCase(registerContractor.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(registerContractor.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.user = action.payload?.user;
    state.token = action.payload?.token;
  })
  .addCase(registerContractor.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
```

### 4. Component Handles State

```typescript
// In ContractorRegisterForm.tsx
const { loading, success, error } = useAppSelector((state) => state.auth);

useEffect(() => {
  if (success) {
    alert('Registration successful!');
    router.push('/login');
    dispatch(resetAuthState());
  }
}, [success]);

return (
  <>
    {error && <div className="error">{error}</div>}
    {loading && <p>Loading...</p>}
    <button disabled={loading}>
      {loading ? 'Creating...' : 'Create Account'}
    </button>
  </>
);
```

## Benefits of This Architecture

| Aspect | Before | After |
|--------|--------|-------|
| **Code Organization** | All in component | Separated concerns |
| **Reusability** | Only in this component | Global state accessible anywhere |
| **Error Handling** | Manual try-catch | Automated in Redux |
| **Loading States** | Manual state | Built-in loading flag |
| **Token Management** | Manual | Automatic with apiService |
| **Testing** | Hard to test | Easy to mock and test |
| **Scalability** | Duplicate code | Single source of truth |

## File Structure

```
app/
├── register/
│   └── ContractorRegisterForm.tsx  ← Uses Redux

store/
├── store.ts                 ← Redux config
├── provider.tsx             ← Redux wrapper
├── hooks.ts                 ← Custom hooks
└── slices/
    └── authSlice.ts         ← Auth state & thunks

lib/
├── api-service.ts           ← HTTP client
└── api-endpoints.ts         ← Pre-configured endpoints

app/
└── layout.tsx               ← Wrapped with Redux provider
```

## Adding More Features

### Add Contractor Management Slice

```typescript
// store/slices/contractorSlice.ts
export const getContractors = createAsyncThunk(
  'contractor/getContractors',
  async () => {
    const response = await apiService.get('/contractors');
    return response.data;
  }
);

// Use in component
const { contractors } = useAppSelector((state) => state.contractor);
dispatch(getContractors());
```

### Add Labour Management Slice

```typescript
// store/slices/labourSlice.ts
export const getLabours = createAsyncThunk(
  'labour/getLabours',
  async () => {
    const response = await apiService.get('/labours');
    return response.data;
  }
);
```

## Key Concepts

### Async Thunk
- Executes async operations (API calls)
- Automatically dispatches pending/fulfilled/rejected actions
- Can handle errors with `rejectWithValue`

### Reducers
- Pure functions that update state
- Synchronous only
- Handle pending/fulfilled/rejected states

### Selectors
- Functions to access state
- Can be used with `useAppSelector` hook
- Memoized for performance

### Dispatch
- Sends actions to Redux
- Updates state through reducers
- Triggers re-renders in subscribed components

## Token Management Flow

```
Login/Register
    ↓
API returns token
    ↓
Thunk calls apiService.setToken(token)
    ↓
Token saved in localStorage
    ↓
Redux state updated with token
    ↓
Future API calls automatically include token
    ↓
On logout: apiService.clearToken() + dispatch(logout())
```

## Next Steps

1. ✅ API Service created
2. ✅ Redux Toolkit setup
3. ✅ Contractor registration integrated
4. ⏭️ Create Labour registration component (similar to contractor)
5. ⏭️ Add login/logout functionality
6. ⏭️ Create contractor/labour management slices
7. ⏭️ Add error boundaries and recovery

## Testing the Flow

1. Start development server: `npm run dev`
2. Navigate to registration page
3. Fill and submit form
4. Check:
   - Console for info logs
   - Network tab for API calls
   - Redux DevTools for state changes
   - Browser localStorage for token

---

**This architecture is production-ready and scales with your application!** 🚀
