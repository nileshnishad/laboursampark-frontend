# API Service - Quick Reference

## Import Cheat Sheet

```typescript
// API Service (direct usage)
import { apiService } from '@/lib/api-service';

// Pre-configured endpoints
import { contractorApi, labourApi, authApi, dropdownApi } from '@/lib/api-endpoints';

// Custom hooks
import { 
  useApiGet, 
  useApiPost, 
  useApiPut, 
  useApiPatch, 
  useApiDelete, 
  useApiUploadFile,
  useApiForm,
  useApiQuery 
} from '@/lib/use-api';
```

---

## Common Operations

### GET - Fetch Data
```typescript
// Using hook (recommended)
const { data, loading, error } = useApiGet('/contractors');

// Using service directly
const response = await apiService.get('/contractors');

// Using pre-configured endpoint
const response = await contractorApi.getAll({ page: 1 });

// With token
const { data } = useApiGet('/contractors', true);
```

### POST - Create Data
```typescript
// Using hook
const { mutate, loading } = useApiPost('/contractors');
await mutate({ name: 'John' });

// Using service directly
const response = await apiService.post('/contractors', { name: 'John' });

// Using pre-configured endpoint
const response = await contractorApi.create({ name: 'John' });
```

### PUT - Update Entire Resource
```typescript
// Using hook
const { mutate } = useApiPut('/contractors/123');
await mutate({ name: 'Jane' });

// Using service directly
const response = await apiService.put('/contractors/123', { name: 'Jane' });

// Using pre-configured endpoint
const response = await contractorApi.update('123', { name: 'Jane' });
```

### PATCH - Partial Update
```typescript
// Using hook
const { mutate } = useApiPatch('/contractors/123');
await mutate({ phone: '1234567890' });

// Using service directly
const response = await apiService.patch('/contractors/123', { phone: '1234567890' });

// Using pre-configured endpoint
const response = await contractorApi.patch('123', { phone: '1234567890' });
```

### DELETE - Remove Resource
```typescript
// Using hook
const { mutate } = useApiDelete('/contractors/123');
await mutate();

// Using service directly
const response = await apiService.delete('/contractors/123');

// Using pre-configured endpoint
const response = await contractorApi.delete('123');
```

### UPLOAD - File Upload
```typescript
// Using hook
const { upload } = useApiUploadFile('/contractors/123/profile-pic');
await upload(file, { userId: '123' });

// Using service directly
const response = await apiService.uploadFile('/contractors/123/profile-pic', file);

// Using pre-configured endpoint
const response = await contractorApi.uploadProfilePic('123', file);
```

---

## Hook Quick Reference

| Hook | Purpose | Data | Mutate Function |
|------|---------|------|-----------------|
| `useApiGet` | Fetch on mount | `data` | `refetch()` |
| `useApiPost` | Create resource | `data` | `mutate(payload)` |
| `useApiPut` | Full update | `data` | `mutate(payload)` |
| `useApiPatch` | Partial update | `data` | `mutate(payload)` |
| `useApiDelete` | Delete resource | `data` | `mutate()` |
| `useApiUploadFile` | Upload file | `data` | `upload(file)` |
| `useApiForm` | Form submission | `data` | `submit(formData)` |
| `useApiQuery` | Search/filter | `data` | `query(params)` |

---

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;      // true/false
  data?: T;              // Response data (if success)
  error?: string;        // Error message (if failed)
  status?: number;       // HTTP status
  message?: string;      // Detailed message
}

// Usage
const response = await apiService.get('/contractors');
if (response.success) {
  // Use response.data
} else {
  // Use response.error
}
```

---

## Pre-configured Endpoints

### Auth
```typescript
authApi.login(email, password)
authApi.register(payload)
authApi.logout()
authApi.refreshToken()
authApi.getCurrentUser()
```

### Contractors
```typescript
contractorApi.getAll(params?)
contractorApi.getById(id)
contractorApi.create(payload)
contractorApi.update(id, payload)
contractorApi.patch(id, payload)
contractorApi.delete(id)
contractorApi.search(query)
contractorApi.uploadProfilePic(id, file)
```

### Labour
```typescript
labourApi.getAll(params?)
labourApi.getById(id)
labourApi.create(payload)
labourApi.update(id, payload)
labourApi.patch(id, payload)
labourApi.delete(id)
labourApi.search(query)
labourApi.uploadProfilePic(id, file)
labourApi.getSkills(id)
labourApi.addSkill(id, skill)
```

### Dropdowns
```typescript
dropdownApi.getAll()
dropdownApi.getByKey(key)
dropdownApi.getMultiple(keys)
```

---

## Token Management

```typescript
// Set token after login
apiService.setToken('your-token');

// Clear token on logout
apiService.clearToken();

// Get token (internal - no need to call)
// Automatically retrieved from localStorage
```

---

## Error Handling Patterns

### Pattern 1: Check success flag
```typescript
const response = await apiService.post('/contractors', data);
if (!response.success) {
  console.error('Error:', response.error);
}
```

### Pattern 2: Use hook error state
```typescript
const { loading, error, mutate } = useApiPost('/contractors');
{error && <div className="error">{error}</div>}
```

### Pattern 3: Handle different status codes
```typescript
const response = await apiService.post('/contractors', data);
if (response.status === 401) {
  // Unauthorized
  window.location.href = '/login';
} else if (response.status === 404) {
  // Not found
} else if (!response.success) {
  // Generic error
}
```

---

## Request Options

```typescript
// All options available
{
  headers?: Record<string, string>,           // Custom headers
  includeToken?: boolean,                      // Add auth token (default: true)
  contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data',
  timeout?: number,                            // Request timeout in ms (default: 10000)
  withCredentials?: boolean,                   // Include cookies (default: false)
}

// Example: Custom timeout
const response = await apiService.get('/contractors', { 
  timeout: 20000 
});
```

---

## Configuration

### Via Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Via Service Methods
```typescript
// Set base URL
apiService.setBaseURL('https://api.example.com');

// Set default timeout
apiService.setTimeout(15000);

// Get current base URL
const baseURL = apiService.getBaseURL();
```

---

## Common Use Cases

### 1. Fetch and Display List
```typescript
const { data: items, loading } = useApiGet('/items');
{loading ? 'Loading...' : items?.map(item => <div>{item.name}</div>)}
```

### 2. Form Submission
```typescript
const { submit, loading } = useApiForm('/items', 'POST');
const handleSubmit = (e) => {
  e.preventDefault();
  submit(Object.fromEntries(new FormData(e.target)));
};
```

### 3. Create and Refresh List
```typescript
const { data, refetch } = useApiGet('/items');
const { mutate: create } = useApiPost('/items');
const handleCreate = async (data) => {
  await create(data);
  refetch();
};
```

### 4. Edit with Pre-filled Data
```typescript
const { data: item } = useApiGet(`/items/${id}`);
const { mutate: update, loading } = useApiPut(`/items/${id}`);
const handleSave = () => update(formData);
```

### 5. Search/Filter
```typescript
const { data: results, query } = useApiQuery('/items');
const handleSearch = (term) => query({ search: term });
```

### 6. Delete with Confirmation
```typescript
const { mutate: delete } = useApiDelete(`/items/${id}`);
const handleDelete = async () => {
  if (confirm('Delete?')) {
    await delete();
    refetch(); // Refresh list
  }
};
```

### 7. File Upload
```typescript
const { upload, loading } = useApiUploadFile('/items/123/image');
const handleFileSelect = async (e) => {
  const file = e.target.files?.[0];
  if (file) await upload(file);
};
```

### 8. Login
```typescript
const { mutate: login, loading } = useApiPost('/auth/login', false);
const handleLogin = async (email, password) => {
  const response = await login({ email, password });
  if (response?.success) {
    apiService.setToken(response.data.token);
  }
};
```

---

## Debugging Tips

### Check if token is set
```typescript
console.log(localStorage.getItem('authToken'));
```

### Test API directly
```typescript
const response = await apiService.get('/contractors');
console.log('Response:', response);
```

### Check request headers
Open DevTools → Network tab → check request headers include `Authorization`

### Verify API URL
```typescript
console.log(apiService.getBaseURL());
```

### Test timeout
```typescript
await apiService.get('/contractors', { timeout: 1000 }); // Will timeout
```

---

## Response Status Codes

| Code | Meaning | Handle |
|------|---------|--------|
| 200 | OK | Should have data |
| 201 | Created | Success, send created item |
| 204 | No Content | Success, no data |
| 400 | Bad Request | Show error message |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show forbidden message |
| 404 | Not Found | Show not found |
| 500 | Server Error | Show server error |
| Timeout | Request exceeded timeout | Show timeout message |

---

## Component Template - Full CRUD

```typescript
'use client';

import { useApiGet, useApiPost, useApiDelete } from '@/lib/use-api';

export default function ItemsPage() {
  // Fetch list
  const { data: items, refetch } = useApiGet('/items');
  
  // Create new
  const { mutate: create, loading: creating } = useApiPost('/items');
  
  // Delete item
  const { mutate: deleteItem } = useApiDelete('/items/:id');

  const handleCreate = async (name: string) => {
    await create({ name });
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) {
      await deleteItem(); // Update with real endpoint
      refetch();
    }
  };

  return (
    <div>
      <h1>Items</h1>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
        handleCreate(input.value);
        input.value = '';
      }}>
        <input name="name" required />
        <button disabled={creating}>Add</button>
      </form>

      <ul>
        {items?.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Comparison: With vs Without Hooks

### Without Hooks (Long Way)
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  apiService.get('/items')
    .then(res => {
      if (res.success) setData(res.data);
      else setError(res.error);
      setLoading(false);
    });
}, []);
```

### With Hooks (Short Way)
```typescript
const { data, loading, error } = useApiGet('/items');
```

---

## Keyboard Shortcuts (VS Code)

```
Ctrl+/ (Cmd+/): Toggle comment
Ctrl+L: Select line
Ctrl+Shift+L: All occurrences
Ctrl+H: Replace
```

---

## File Locations

| File | Purpose |
|------|---------|
| `lib/api-service.ts` | Core API service |
| `lib/api-endpoints.ts` | Pre-configured endpoints |
| `lib/use-api.ts` | React hooks |
| `API_SERVICE_GUIDE.md` | Detailed documentation |
| `REACT_HOOKS_GUIDE.md` | Hook usage guide |
| `INTEGRATION_GUIDE.md` | Migration examples |

---

## Getting Help

1. **Quick answer?** → Check this file
2. **Hook usage?** → See `REACT_HOOKS_GUIDE.md`
3. **API details?** → See `API_SERVICE_GUIDE.md`
4. **Migrating code?** → See `INTEGRATION_GUIDE.md`
5. **Examples?** → Check `lib/api-endpoints.ts`

---

## Pro Tips

✅ Always check `response.success` before using data  
✅ Use pre-configured endpoints for consistency  
✅ Use hooks in components, service directly in utilities  
✅ Set token after login  
✅ Use `includeToken: true` for protected endpoints  
✅ Refetch after mutations if needed  
✅ Handle errors gracefully  
✅ Use appropriate timeouts for slow operations  

❌ Don't make raw fetch calls  
❌ Don't forget to set token after login  
❌ Don't ignore error states  
❌ Don't make multiple requests for same data  
❌ Don't hardcode API URLs  
