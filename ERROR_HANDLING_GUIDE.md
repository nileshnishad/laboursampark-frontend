# Error Boundary & Error Handling Guide

## Overview
This document explains the comprehensive error handling system implemented for LabourSampark.

## Files Created

### 1. **app/error.tsx** (Global Error Handler)
- Catches all unhandled errors in the application
- Displays user-friendly error message
- Shows error details in development mode only
- Provides "Try Again" and "Go Home" buttons
- Logs error with unique error ID (digest)

### 2. **app/not-found.tsx** (404 Page)
- Handles non-existent routes
- Provides navigation to main pages
- Styled consistently with error pages
- Quick links to Homepage, Labours, and Contractors

### 3. **app/labours/error.tsx**
- Catches errors specific to `/labours/all` page
- Custom message for labour loading failures
- Reset button to retry loading

### 4. **app/contractors/error.tsx**
- Catches errors specific to `/contractors/all` page
- Custom message for contractor loading failures
- Reset button to retry loading

### 5. **app/components/ErrorBoundary.tsx**
- React Class Component for component-level error handling
- Catches errors from child components
- Supports custom fallback UI
- Optional error callback for logging
- Development mode error display

### 6. **lib/error-logger.ts**
- Centralized error logging utility
- Singleton pattern for consistency
- Multiple severity levels: low, medium, high, critical
- Export logs as JSON
- Hook for React components (`useErrorLogger`)

## Error Handling Flow

```
User Action
    ↓
Error Occurs (in component/page)
    ↓
Error Boundary / error.tsx catches it
    ↓
Display User-Friendly Error UI
    ↓
User can "Retry" or "Go Home"
    ↓
Error logged to console/server
```

## Usage Examples

### Using ErrorBoundary in Components

```tsx
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export default function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Using ErrorBoundary with Custom Fallback

```tsx
<ErrorBoundary
  fallback={<CustomErrorComponent />}
  onError={(error, info) => {
    console.log("Custom error handler:", error, info);
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### Using Error Logger in Components

```tsx
"use client";

import { useErrorLogger } from "@/lib/error-logger";
import { useEffect } from "react";

export default function MyComponent() {
  const { log, warn, critical } = useErrorLogger();

  useEffect(() => {
    try {
      // Your code here
      log("Info message", "MyComponent", "low");
    } catch (error) {
      warn("Warning occurred", "MyComponent");
      critical(String(error), "MyComponent");
    }
  }, [log, warn, critical]);

  return <div>My Component</div>;
}
```

### Using Error Logger Directly

```tsx
import { errorLogger } from "@/lib/error-logger";

// Log different severity levels
errorLogger.info("User logged in", "AuthService");
errorLogger.warn("Retry attempt 3", "DataFetch");
errorLogger.log(error, "FormSubmit", "medium");
errorLogger.critical("Payment failed", "CheckoutService");

// Get all logs
const allLogs = errorLogger.getLogs();

// Export logs
const jsonLogs = errorLogger.exportLogs();

// Clear logs
errorLogger.clearLogs();
```

## Error Pages Styling

All error pages feature:
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Accessible icons
- ✅ User-friendly messages
- ✅ Clear call-to-action buttons
- ✅ Error ID for tracking
- ✅ Development mode error details

## Error Types Handled

| Error Type | Handler | Location |
|-----------|---------|----------|
| Global Unhandled Errors | `app/error.tsx` | Entire app |
| Page Not Found (404) | `app/not-found.tsx` | All routes |
| Labour Page Errors | `app/labours/error.tsx` | `/labours/*` |
| Contractor Page Errors | `app/contractors/error.tsx` | `/contractors/*` |
| Component Errors | `ErrorBoundary` | Wrappable components |

## File Structure

```
app/
├── error.tsx                           # Global error handler
├── not-found.tsx                       # 404 page
├── layout.tsx
├── page.tsx
├── labours/
│   ├── error.tsx                       # Labour page errors
│   ├── all/
│   │   └── page.tsx
│   └── layout.tsx
├── contractors/
│   ├── error.tsx                       # Contractor page errors
│   ├── all/
│   │   └── page.tsx
│   └── layout.tsx
└── components/
    ├── ErrorBoundary.tsx               # Reusable error boundary
    └── ... other components
lib/
└── error-logger.ts                     # Error logging utility
```

## Best Practices

### 1. **Wrap Critical Components**
```tsx
<ErrorBoundary>
  <SliderComponent />
</ErrorBoundary>
```

### 2. **Log Errors with Context**
```tsx
try {
  // Fetch data
} catch (error) {
  errorLogger.warn(`Failed to load labours: ${error}`, "LaboursSection");
}
```

### 3. **Provide User Feedback**
- Always show a user-friendly error message
- Never expose technical details to users in production
- Provide actionable next steps (Retry, Go Home, Contact Support)

### 4. **Monitor Logs**
- Regularly check error logs in development
- Implement server-side error tracking in production
- Set up alerts for critical errors

## Production Setup

### 1. **Integrate with Error Tracking Service**

Update `lib/error-logger.ts` `sendToServer` method:

```tsx
private sendToServer(errorLog: ErrorLog): void {
  if (process.env.NODE_ENV === "production") {
    fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_URL || "/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorLog),
    }).catch(console.error);
  }
}
```

### 2. **Popular Error Tracking Services**

- **Sentry**: https://sentry.io
  ```tsx
  import * as Sentry from "@sentry/nextjs";
  Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
  ```

- **LogRocket**: https://logrocket.com
  ```tsx
  import LogRocket from "logrocket";
  LogRocket.init("YOUR_APP_ID");
  ```

- **Rollbar**: https://rollbar.com
  ```tsx
  import Rollbar from "rollbar";
  const rollbar = new Rollbar({ accessToken: "YOUR_TOKEN" });
  ```

### 3. **Environment Variables**
```env
NEXT_PUBLIC_ERROR_TRACKING_URL=https://your-api.com/logs
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Testing Error Boundaries

### 1. **Test Global Error**
```tsx
// In any page
export default function TestPage() {
  throw new Error("Test error");
}
```

### 2. **Test 404 Page**
```
Navigate to: /non-existent-page
```

### 3. **Test Component Error**
```tsx
export function BadComponent() {
  throw new Error("Component error");
}

<ErrorBoundary>
  <BadComponent />
</ErrorBoundary>
```

## Monitoring Checklist

- [ ] Global error handler is working
- [ ] 404 page displays for non-existent routes
- [ ] ErrorBoundary prevents full page crashes
- [ ] Errors are logged with context
- [ ] Development mode shows technical details
- [ ] Production mode shows user-friendly messages
- [ ] Error tracking service is connected (production)
- [ ] Logs are exported and monitored regularly
- [ ] Critical errors trigger alerts

## Future Enhancements

1. **Error Analytics Dashboard**
   - Track error frequency
   - Identify common error patterns
   - Monitor error trends over time

2. **User Error Reporting**
   - Allow users to report issues
   - Capture user context (page, browser, etc.)
   - Screenshot capture capability

3. **Automatic Error Recovery**
   - Auto-retry failed operations
   - Fallback to cached data
   - Graceful degradation

4. **AI-Powered Error Messages**
   - Contextual error suggestions
   - Link to relevant documentation
   - Recommended actions
