# Login System Setup Guide

## Overview
Complete login system with Redux integration supporting both email/mobile and password/OTP authentication methods.

## Features

### 1. **User Type Selection**
- Labour
- Contractor

### 2. **Contact Method**
- Email
- Mobile Number

### 3. **Authentication Method**
- Password
- OTP (One-Time Password)

### 4. **Redux Integration**
- Automatic state management
- Loading, success, and error handling
- Auth state persistence
- Token management

### 5. **Toast Notifications**
- Loading toast: "Signing in..."
- Success toast: Shows message from API (auto-close in 3 seconds)
- Error toast: Shows error message (persistent until dismissed)

## API Integration

### Endpoint
`POST /auth/login`

### Request Payload
```typescript
{
  email?: string;        // Required if contactType === "email"
  mobile?: string;       // Required if contactType === "mobile"
  password?: string;     // Required if authType === "password"
  otp?: string;          // Required if authType === "otp"
  userType: "labour" | "contractor";
}
```

### Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "User Name",
      "email": "user@example.com",
      "mobile": "+91XXXXXXXXXX",
      "userType": "contractor",
      // ... other user fields
    },
    "token": "jwt_token_here",
    "userType": "contractor"
  }
}
```

## Code Structure

### Redux Slice (`store/slices/authSlice.ts`)

#### State Interface
```typescript
export interface AuthState {
  loading: boolean;      // Loading state during login
  success: boolean;      // Success flag
  error: string | null;  // Error message
  message: string | null;// Response message
  user: any | null;      // User object from API
  token: string | null;  // JWT token
}
```

#### Login Payload Interface
```typescript
export interface LoginPayload {
  email?: string;
  mobile?: string;
  password?: string;
  otp?: string;
  userType: 'labour' | 'contractor';
}
```

#### Async Thunk - `loginUser`
Handles API call to `/auth/login` endpoint with automatic token saving.

**On Pending:**
- Sets `loading = true`
- Shows loading toast: "Signing in..."

**On Success:**
- Sets `loading = false`, `success = true`
- Stores user data and token in Redux state
- Saves token to localStorage via `setToken()`
- Dismisses loading toast
- Shows success toast with API message

**On Error:**
- Sets `loading = false`, `success = false`
- Stores error message in Redux state
- Dismisses loading toast
- Shows error toast (persistent)

### Component (`app/login/page.tsx`)

#### Form State Management
```typescript
const [userType, setUserType] = useState<"labour" | "contractor">("labour");
const [contactType, setContactType] = useState<"email" | "mobile">("email");
const [authType, setAuthType] = useState<"password" | "otp">("password");
const [email, setEmail] = useState("");
const [mobile, setMobile] = useState("");
const [password, setPassword] = useState("");
const [otp, setOtp] = useState("");
const [rememberMe, setRememberMe] = useState(false);
```

#### Redux Hooks Integration
```typescript
const dispatch = useDispatch<AppDispatch>();
const { loading, success, user } = useSelector((state: RootState) => state.auth);
```

#### Form Submission
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const payload: LoginPayload = {
    userType,
    // email or mobile
    // password or otp
  };
  
  await dispatch(loginUser(payload));
};
```

#### Redirect on Success
Uses `useEffect` to redirect after successful login:
- Labour users → `/dashboard/labour`
- Contractor users → `/dashboard/contractor`

## Usage Example

### 1. **Login with Email and Password**
```typescript
const payload: LoginPayload = {
  email: "bob.smith@example.com",
  password: "hashed_password_2",
  userType: "contractor"
};

dispatch(loginUser(payload));
```

### 2. **Login with Mobile and OTP**
```typescript
const payload: LoginPayload = {
  mobile: "+918369098559",
  otp: "123456",
  userType: "labour"
};

dispatch(loginUser(payload));
```

## Toast Notifications

### Toast Utilities (from `lib/toast-utils.ts`)

Used automatically in Redux thunks:

- **Loading Toast**: `showLoadingToast(message)` - No auto-close
- **Success Toast**: `showSuccessToast(message)` - Auto-closes in 3 seconds
- **Error Toast**: `showErrorToast(message)` - Persistent, user must dismiss

### Configuration

ToastContainer configured in `store/provider.tsx`:
```typescript
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
```

## Error Handling

**Automatic Error Handling:**
- API errors are caught and formatted
- Error messages displayed via toast notification
- Error state reflected in Redux state

**Form Validation:**
- Email/Mobile required based on selection
- Password/OTP required based on selection
- Submit button disabled during loading

## Token Management

### Automatic Token Handling
1. Token received from API response
2. Saved to localStorage via `setToken()` in `lib/api-service.ts`
3. Automatically included in subsequent requests via `getToken()`
4. Cleared on logout via `clearToken()`

### Token Storage
Stored in localStorage under key: `labour_sampark_auth_token`

## Redirect Flow

After successful login:
```
Login Success
    ↓
dispatch(loginUser(payload)) ⟶ Success
    ↓
success = true, user populated
    ↓
useEffect triggered
    ↓
Check user.userType
    ├─ labour ⟶ /dashboard/labour
    └─ contractor ⟶ /dashboard/contractor
```

## Best Practices

1. **Never hardcode API endpoint** - Use environment variables in production
2. **Validate on both client and server** - Server validation is mandatory
3. **Secure token storage** - Consider using httpOnly cookies for enhanced security
4. **Handle network errors** - Timeout errors, 5xx errors handled automatically
5. **Clear auth state on logout** - Use `logout()` action to clear state and token
6. **Implement refresh token** - For long-lived sessions, implement refresh token flow

## Troubleshooting

### Login Always Shows Error
- Check API endpoint in `loginUser` thunk
- Verify API is returning correct response format
- Check Redux DevTools for actual API response

### Token Not Persisting
- Verify `setToken()` is called in thunk
- Check localStorage has correct key: `labour_sampark_auth_token`
- Verify `getToken()` retrieves token in subsequent requests

### Toast Not Showing
- Ensure `ToastContainer` is rendered in `store/provider.tsx`
- Check `react-toastify` is installed: `npm install react-toastify`
- Verify CSS is imported: `import 'react-toastify/dist/ReactToastify.css'`

### Redirect Not Working
- Check `useEffect` dependency array includes `success` and `user`
- Verify user object is populated after successful login
- Check dashboard routes exist: `/dashboard/labour`, `/dashboard/contractor`

## Files Modified

1. **store/slices/authSlice.ts**
   - Added `LoginPayload` interface
   - Added `loginUser` async thunk
   - Added reducer cases for login (pending, fulfilled, rejected)

2. **app/login/page.tsx**
   - Integrated Redux `useDispatch` and `useSelector`
   - Added contact method selection (email/mobile)
   - Added auth method selection (password/OTP)
   - Implemented form submission with Redux
   - Added auto-redirect on successful login
   - Added toast notifications via Redux

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Dependencies

- `react-redux` - Redux bindings for React
- `@reduxjs/toolkit` - Redux state management
- `react-toastify` - Toast notifications
- `next` - Next.js framework

All dependencies should already be installed. If not:
```bash
npm install react-redux @reduxjs/toolkit react-toastify
```
