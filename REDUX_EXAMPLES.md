# Redux + API Service - Quick Examples

## Quick Start

### 1. Basic Registration

```typescript
'use client';

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor } from "@/store/slices/authSlice";

export function RegistrationForm() {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(registerContractor({
      userType: "contractor",
      basicInfo: {
        businessName: "My Business",
        email: "user@example.com",
        password: "password123",
        mobileNumber: "9876543210",
        location: "Mumbai",
        registrationNumber: "REG123",
      },
      businessDetails: {
        businessType: "Plumbing",
        experienceRange: "5-10 years",
        teamSize: "5-10",
      },
      services: {
        offered: ["Plumbing", "Electrical"],
        coverageArea: ["Mumbai", "Pune"],
      },
      additionalInfo: {
        about: "Best plumbing services",
        businessLicense: null,
        companyLogo: null,
      },
      agreement: { termsAgreed: true },
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Registered successfully!</p>}
      <button disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### 2. Get Data from Redux State

```typescript
// In any component
const { user, token, loading, success, error } = useAppSelector(
  (state) => state.auth
);

console.log('User:', user);
console.log('Token:', token);
console.log('Loading:', loading);
console.log('Error:', error);
```

### 3. Dispatch Multiple Actions

```typescript
import { logout, resetAuthState, clearError } from "@/store/slices/authSlice";

// Logout
dispatch(logout());

// Reset all auth state
dispatch(resetAuthState());

// Clear only error
dispatch(clearError());
```

### 4. Handle Success with useEffect

```typescript
useEffect(() => {
  if (success) {
    // Show success message
    alert('Operation successful!');
    
    // Redirect
    router.push('/dashboard');
    
    // Reset state
    dispatch(resetAuthState());
  }
}, [success, dispatch, router]);
```

## Common Patterns

### Pattern 1: Form with Auto-submit

```typescript
'use client';

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor } from "@/store/slices/authSlice";
import { useState } from "react";

export function QuickRegister() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(registerContractor({
      userType: "contractor",
      basicInfo: {
        ...formData,
        mobileNumber: "",
        location: "",
        registrationNumber: "",
      },
      businessDetails: {
        businessType: "",
        experienceRange: "",
        teamSize: "",
      },
      services: {
        offered: [],
        coverageArea: [],
      },
      additionalInfo: {
        about: "",
        businessLicense: null,
        companyLogo: null,
      },
      agreement: { termsAgreed: true },
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      
      {error && <p className="error">{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

### Pattern 2: Loading Spinner

```typescript
export function RegisterButton() {
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <button disabled={loading}>
      <span style={{ 
        display: loading ? 'inline-block' : 'none',
        animation: 'spin 1s infinite',
        marginRight: '8px'
      }}>
        ⏳
      </span>
      {loading ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

### Pattern 3: Error Toast

```typescript
export function ErrorToast() {
  const { error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  if (!error) return null;

  return (
    <div className="error-toast">
      <p>{error}</p>
      <button onClick={() => dispatch(clearError())}>
        Dismiss
      </button>
    </div>
  );
}
```

### Pattern 4: Protected Component

```typescript
'use client';

import { useAppSelector } from "@/store/hooks";

export function Dashboard() {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <p>Please log in first</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name || 'User'}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Pattern 5: Conditional Rendering

```typescript
export function RegistrationPage() {
  const { loading, success, error } = useAppSelector((state) => state.auth);

  return (
    <div>
      {success && (
        <div className="success">
          ✓ Registration complete! Redirecting...
        </div>
      )}

      {error && (
        <div className="error">
          ✗ {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          Processing your registration...
        </div>
      )}

      {!success && !loading && (
        <RegistrationForm />
      )}
    </div>
  );
}
```

## Advanced Patterns

### Pattern 6: Custom Hook for Registration

```typescript
// hooks/useRegisterContractor.ts
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor } from "@/store/slices/authSlice";

export function useRegisterContractor() {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.auth);

  const register = (payload: ContractorRegisterPayload) => {
    dispatch(registerContractor(payload));
  };

  return { register, loading, success, error };
}

// Usage in component
const { register, loading, error } = useRegisterContractor();
register(formPayload);
```

### Pattern 7: Error Handling with Retry

```typescript
export function FormWithRetry() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [retries, setRetries] = useState(0);

  const handleSubmit = (payload: ContractorRegisterPayload) => {
    if (retries > 3) {
      alert('Too many retries. Please try again later.');
      return;
    }

    dispatch(registerContractor(payload));
  };

  const handleRetry = (payload: ContractorRegisterPayload) => {
    setRetries((prev) => prev + 1);
    handleSubmit(payload);
  };

  return (
    <div>
      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={() => handleRetry(formPayload)}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
```

### Pattern 8: Multi-step Form

```typescript
export function MultiStepRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const dispatch = useAppDispatch();
  const { loading, success } = useAppSelector((state) => state.auth);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = () => {
    dispatch(registerContractor({
      ...formData,
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <div>
      {step === 1 && <BasicInfoStep onChange={setFormData} onNext={handleNext} />}
      {step === 2 && <BusinessDetailsStep onChange={setFormData} onNext={handleNext} onPrev={handlePrev} />}
      {step === 3 && <ReviewStep onSubmit={handleFinalSubmit} loading={loading} onPrev={handlePrev} />}
      {success && <SuccessMessage />}
    </div>
  );
}
```

## State Selectors

### Create Reusable Selectors

```typescript
// store/selectors/authSelectors.ts
import { RootState } from '@/store/store';

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthSuccess = (state: RootState) => state.auth.success;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

// Usage in component
const isAuthenticated = useAppSelector(selectIsAuthenticated);
const user = useAppSelector(selectAuthUser);
```

## Testing Examples

### Test Thunk Execution

```typescript
import { registerContractor } from "@/store/slices/authSlice";

it('should handle successful registration', (done) => {
  const payload = {
    userType: "contractor",
    basicInfo: { /* ... */ },
    // ... rest of payload
  };

  dispatch(registerContractor(payload)).then((result) => {
    expect(result.type).toBe(registerContractor.fulfilled.type);
    expect(store.getState().auth.success).toBe(true);
    done();
  });
});
```

### Test Component with Redux

```typescript
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import RegistrationForm from '@/app/register/ContractorRegisterForm';

it('should render form and handle submission', () => {
  render(
    <Provider store={store}>
      <RegistrationForm />
    </Provider>
  );

  const submitButton = screen.getByText(/create account/i);
  userEvent.click(submitButton);

  // Check that dispatch was called
  expect(store.getState().auth.loading).toBe(true);
});
```

## Debugging

### Log State Changes

```typescript
const state = useAppSelector((state) => state.auth);

useEffect(() => {
  console.log('Auth state changed:', state);
}, [state]);
```

### Monitor API Calls

Open DevTools Network tab to see POST requests to `/auth/register`

### Use Redux DevTools

Install browser extension to:
- See all dispatched actions
- Track state changes
- Time-travel debug

## Common Mistakes to Avoid

**❌ Calling API directly in component:**
```typescript
// DON'T do this
const handleSubmit = async (payload) => {
  const response = await apiService.post('/auth/register', payload);
};
```

**✅ Use Redux thunk:**
```typescript
// DO this
const handleSubmit = (payload) => {
  dispatch(registerContractor(payload));
};
```

---

**Follow these patterns for consistency and maintainability!** ✨
