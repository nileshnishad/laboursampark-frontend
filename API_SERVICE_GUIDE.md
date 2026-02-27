# API Service Documentation

## Overview

The API Service provides a centralized, type-safe way to handle all HTTP requests in your application. It supports GET, POST, PUT, DELETE, PATCH requests with built-in authentication, error handling, and file uploads.

## Features

- ✅ Multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ✅ Built-in authentication token management
- ✅ Automatic error handling
- ✅ Request timeout handling
- ✅ File upload support (multipart/form-data)
- ✅ TypeScript support with full type safety
- ✅ Customizable headers, timeouts, and content types
- ✅ Singleton pattern for consistent usage

## Installation & Setup

### 1. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Or use the default: `http://localhost:3000/api`

### 2. Import the Service

```typescript
import { apiService } from '@/lib/api-service';
// or use pre-configured endpoints
import { contractorApi, labourApi, authApi } from '@/lib/api-endpoints';
```

## Usage Examples

### Basic GET Request (Without Token)

```typescript
const response = await apiService.get('/contractors');
if (response.success) {
  console.log('Data:', response.data);
} else {
  console.log('Error:', response.error);
}
```

### GET Request (With Token)

```typescript
const response = await apiService.get('/contractors', { 
  includeToken: true 
});
```

### POST Request (Create Resource)

```typescript
const payload = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210'
};

const response = await apiService.post('/contractors', payload, {
  includeToken: true
});
```

### PUT Request (Replace Entire Resource)

```typescript
const response = await apiService.put(
  `/contractors/123`,
  {
    name: 'Jane Doe',
    email: 'jane@example.com'
  },
  { includeToken: true }
);
```

### PATCH Request (Partial Update)

```typescript
const response = await apiService.patch(
  `/contractors/123`,
  { phone: '9876543210' },
  { includeToken: true }
);
```

### DELETE Request

```typescript
const response = await apiService.delete(`/contractors/123`, {
  includeToken: true
});
```

### File Upload

```typescript
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const response = await apiService.uploadFile(
    `/contractors/123/profile-pic`,
    file,
    { userId: '123' }, // Additional form data (optional)
    { includeToken: true }
  );
}
```

## Using Pre-configured Endpoints

The `api-endpoints.ts` file provides pre-configured API functions:

### Authentication

```typescript
import { authApi } from '@/lib/api-endpoints';

// Login
const loginResponse = await authApi.login('user@example.com', 'password');
if (loginResponse.success) {
  apiService.setToken(loginResponse.data.token);
}

// Get current user
const userResponse = await authApi.getCurrentUser();

// Logout
await authApi.logout();
```

### Contractor Operations

```typescript
import { contractorApi } from '@/lib/api-endpoints';

// Get all contractors
const allContractors = await contractorApi.getAll({ page: 1, limit: 10 });

// Get specific contractor
const contractor = await contractorApi.getById('123');

// Create
const newContractor = await contractorApi.create({ name: 'John' });

// Update
const updated = await contractorApi.update('123', { name: 'Jane' });

// Delete
await contractorApi.delete('123');

// Search
const results = await contractorApi.search('plumber');

// Upload profile picture
await contractorApi.uploadProfilePic('123', file);
```

### Labour Operations

```typescript
import { labourApi } from '@/lib/api-endpoints';

// Same methods as contractor
const labours = await labourApi.getAll();
const labour = await labourApi.getById('123');
await labourApi.create(payload);
// ... etc
```

## Response Format

All API calls return a standardized response object:

```typescript
interface ApiResponse<T = any> {
  success: boolean;      // true if request succeeded
  data?: T;              // Response data (if successful)
  error?: string;        // Error message (if failed)
  status?: number;       // HTTP status code
  message?: string;      // Detailed message
}
```

### Example:

```typescript
const response = await apiService.get('/contractors');

// Success response
{
  success: true,
  data: { id: 1, name: 'John' },
  status: 200
}

// Error response
{
  success: false,
  error: 'Not Found',
  status: 404,
  message: 'Contractor not found'
}
```

## Advanced Options

### Custom Headers

```typescript
const response = await apiService.get('/contractors', {
  headers: {
    'X-Custom-Header': 'custom-value'
  }
});
```

### Custom Timeout

```typescript
const response = await apiService.get('/contractors', {
  timeout: 20000 // 20 seconds (default is 10 seconds)
});
```

### Custom Content Type

```typescript
const response = await apiService.post('/data', payload, {
  contentType: 'application/x-www-form-urlencoded'
});
```

### With Credentials (CORS)

```typescript
const response = await apiService.get('/contractors', {
  withCredentials: true
});
```

### Exclude Token from Specific Request

```typescript
const response = await apiService.get('/public-data', {
  includeToken: false
});
```

## Token Management

### Set Token

```typescript
apiService.setToken('your-auth-token');
```

### Clear Token

```typescript
apiService.clearToken();
```

### Get Token

```typescript
// Tokens are automatically retrieved from localStorage
// The service handles this internally
```

## Base URL Management

### Set Custom Base URL

```typescript
apiService.setBaseURL('https://api.example.com/v1');
```

### Get Current Base URL

```typescript
const baseURL = apiService.getBaseURL();
```

### Set Default Timeout

```typescript
apiService.setTimeout(15000); // 15 seconds for all requests
```

## Using in Components

### React Component Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { contractorApi } from '@/lib/api-endpoints';

export default function ContractorsPage() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContractors = async () => {
      const response = await contractorApi.getAll();
      if (response.success) {
        setContractors(response.data);
      } else {
        setError(response.error || 'Failed to fetch');
      }
      setLoading(false);
    };

    fetchContractors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {contractors.map(contractor => (
        <div key={contractor.id}>{contractor.name}</div>
      ))}
    </div>
  );
}
```

### Form Submission Example

```typescript
'use client';

import { useState } from 'react';
import { contractorApi } from '@/lib/api-endpoints';

export default function CreateContractor() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const response = await contractorApi.create(formData);
    
    if (response.success) {
      alert('Contractor created successfully!');
    } else {
      alert(`Error: ${response.error}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'John', email: 'john@example.com' });
    }}>
      {/* form fields */}
    </form>
  );
}
```

## Error Handling

The service provides comprehensive error handling:

```typescript
const response = await apiService.post('/contractors', payload);

if (!response.success) {
  // Handle different error types
  if (response.status === 401) {
    // Unauthorized - redirect to login
    window.location.href = '/login';
  } else if (response.status === 404) {
    // Not found
    console.log('Resource not found');
  } else if (response.message === 'Request timeout') {
    // Timeout error
    console.log('Request took too long');
  } else {
    // Generic error
    console.log(response.error);
  }
}
```

## Query Parameters

### Method 1: Using URL

```typescript
const response = await apiService.get('/contractors?page=1&limit=10');
```

### Method 2: Using Pre-configured Functions

```typescript
const response = await contractorApi.getAll({ 
  page: 1, 
  limit: 10,
  sortBy: 'name'
});
```

## Request/Response Flow

```
┌─────────────────────┐
│  Your Component     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   API Endpoints     │ (api-endpoints.ts)
│  (Higher level)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   API Service       │ (api-service.ts)
│  (Core handler)     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌────────────┐
│ Fetch   │  │ Local      │
│ API     │  │ Storage    │
│         │  │ (Token)    │
└────┬────┘  └────────────┘
     │
     ▼
┌─────────────────────┐
│  API Response       │
└─────────────────────┘
```

## Best Practices

1. **Always check response.success** before using data:
   ```typescript
   if (response.success) {
     // Use response.data
   }
   ```

2. **Use pre-configured endpoints** for consistency:
   ```typescript
   // Good
   import { contractorApi } from '@/lib/api-endpoints';
   await contractorApi.getAll();
   
   // Avoid
   await apiService.get('/contractors');
   ```

3. **Set token after login**:
   ```typescript
   const loginResponse = await authApi.login(email, password);
   if (loginResponse.success) {
     apiService.setToken(loginResponse.data.token);
   }
   ```

4. **Handle timeouts gracefully**:
   ```typescript
   if (response.message === 'Request timeout') {
     // Show user-friendly message
   }
   ```

5. **Use custom timeout for slow operations**:
   ```typescript
   const response = await apiService.post('/long-operation', data, {
     timeout: 30000 // 30 seconds for slower operations
   });
   ```

## Troubleshooting

### Token Not Being Sent

- Verify token is set: `apiService.setToken(token)`
- Check `includeToken` is not explicitly set to `false`
- Verify localStorage is accessible (not in private mode)

### CORS Errors

- Add `withCredentials: true` if your backend requires it
- Verify backend CORS configuration

### Request Timeout

- Increase timeout for slow endpoints
- Check backend API is running

### 401 Unauthorized

- Token may be expired - implement token refresh
- Redirect to login

## Migration Guide

If you have existing API calls scattered in your components, migrate them:

### Before

```typescript
const response = await fetch('/api/contractors', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### After

```typescript
const response = await contractorApi.getAll();
if (response.success) {
  const data = response.data;
}
```

## Support

For issues or questions, refer to the main error-logger utility in `lib/error-logger.ts`.
