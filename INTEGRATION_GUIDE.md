# Integration Guide - Migrating to API Service

This guide shows how to update your existing components to use the new centralized API service.

## Before and After Examples

### Example 1: Fetching a List

#### Before (Without API Service)
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ContractorsPage() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/contractors')
      .then(res => res.json())
      .then(data => {
        setContractors(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {contractors.map(c => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
```

#### After (With API Service and Hooks)
```typescript
'use client';

import { useApiGet } from '@/lib/use-api';

export default function ContractorsPage() {
  const { data: contractors, loading, error } = useApiGet('/contractors');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {contractors?.map(c => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
```

**What improved:**
- ✅ Less boilerplate code
- ✅ Automatic type safety
- ✅ Built-in error handling
- ✅ Consistent error messages

---

### Example 2: Creating a Resource

#### Before (Without API Service)
```typescript
'use client';

import { useState } from 'react';

export default function CreateContractorForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/contractors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create contractor');
      }

      const result = await response.json();
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      
      {loading && <p>Creating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Created successfully!</p>}
      
      <button type="submit" disabled={loading}>Create</button>
    </form>
  );
}
```

#### After (With API Service and Hooks)
```typescript
'use client';

import { useApiForm } from '@/lib/use-api';

export default function CreateContractorForm() {
  const { submit, loading, error, isSuccess, reset } = useApiForm(
    '/contractors',
    'POST'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submit(Object.fromEntries(formData));
    if (isSuccess) {
      e.currentTarget.reset();
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      
      {loading && <p>Creating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isSuccess && <p style={{ color: 'green' }}>Created successfully!</p>}
      
      <button type="submit" disabled={loading}>Create</button>
    </form>
  );
}
```

**What improved:**
- ✅ 50% less code
- ✅ Token management handled automatically
- ✅ No manual error catching needed
- ✅ Cleaner state management

---

### Example 3: Update with Existing Data

#### Before (Without API Service)
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function EditContractorPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing data
  useEffect(() => {
    fetch(`/api/contractors/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/contractors/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="email"
        placeholder="Email"
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
```

#### After (With API Service and Hooks)
```typescript
'use client';

import { useApiGet, useApiPut } from '@/lib/use-api';
import { useEffect, useState } from 'react';

export default function EditContractorPage({ params }: { params: { id: string } }) {
  const { data: contractor, loading } = useApiGet(`/contractors/${params.id}`);
  const { mutate: update, loading: saving, error } = useApiPut(`/contractors/${params.id}`);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (contractor) {
      setFormData(contractor);
    }
  }, [contractor]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="email"
        placeholder="Email"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => update(formData)} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
```

**What improved:**
- ✅ 40% less code
- ✅ Automatic token handling
- ✅ Separated data fetching from UI logic
- ✅ Better state management

---

### Example 4: File Upload

#### Before (Without API Service)
```typescript
'use client';

import { useState } from 'react';

export default function UploadProfilePicture({ contractorId }: { contractorId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload file
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `/api/contractors/${contractorId}/profile-pic`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {preview && <img src={preview} alt="Preview" style={{ width: 100 }} />}
      <input
        type="file"
        onChange={handleFileChange}
        disabled={loading}
        accept="image/*"
      />
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

#### After (With API Service and Hooks)
```typescript
'use client';

import { useApiUploadFile } from '@/lib/use-api';
import { useState } from 'react';

export default function UploadProfilePicture({ contractorId }: { contractorId: string }) {
  const [preview, setPreview] = useState('');
  const { upload, loading, error } = useApiUploadFile(
    `/contractors/${contractorId}/profile-pic`
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    await upload(file);
  };

  return (
    <div>
      {preview && <img src={preview} alt="Preview" style={{ width: 100 }} />}
      <input
        type="file"
        onChange={handleFileChange}
        disabled={loading}
        accept="image/*"
      />
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

**What improved:**
- ✅ Cleaner code
- ✅ Automatic FormData handling
- ✅ No manual token management
- ✅ Built-in error handling

---

## Step-by-Step Migration Checklist

### Phase 1: Setup (30 minutes)

- [ ] Review `API_SERVICE_GUIDE.md`
- [ ] Review `REACT_HOOKS_GUIDE.md`
- [ ] Set up `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Test API service in a simple component

### Phase 2: Update Components (1-2 hours)

- [ ] Update list/fetch components to use `useApiGet`
- [ ] Update form components to use `useApiForm` or `useApiPost`
- [ ] Update edit forms to use `useApiGet` + `useApiPut`
- [ ] Update delete functionality to use `useApiDelete`

### Phase 3: Update Forms (30 minutes)

- [ ] Replace manual fetch calls with API hooks
- [ ] Update error handling
- [ ] Test all functionality

### Phase 4: File Uploads (15 minutes)

- [ ] Update file upload components with `useApiUploadFile`
- [ ] Test uploads

### Phase 5: Testing & Cleanup (30 minutes)

- [ ] Test all CRUD operations
- [ ] Test error scenarios
- [ ] Test with/without authentication
- [ ] Clean up any old API call code

---

## Common Migration Patterns

### Pattern 1: List with Pagination

**Old approach:**
```typescript
const [page, setPage] = useState(1);
const [contractors, setContractors] = useState([]);

useEffect(() => {
  fetch(`/api/contractors?page=${page}`)
    .then(r => r.json())
    .then(setContractors);
}, [page]);
```

**New approach:**
```typescript
const [page, setPage] = useState(1);
const { data: contractors, query } = useApiQuery('/contractors');

useEffect(() => {
  query({ page, limit: 10 });
}, [page]);
```

### Pattern 2: Search/Filter

**Old approach:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [results, setResults] = useState([]);

const handleSearch = async (term: string) => {
  const res = await fetch(`/api/contractors/search?q=${term}`);
  setResults(await res.json());
};
```

**New approach:**
```typescript
const { data: results, query } = useApiQuery('/contractors');

const handleSearch = (term: string) => {
  query({ search: term });
};
```

### Pattern 3: Create and Refresh List

**Old approach:**
```typescript
const [contractors, setContractors] = useState([]);

const handleCreate = async (data) => {
  await fetch('/api/contractors', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  // Manually refetch
  const res = await fetch('/api/contractors');
  setContractors(await res.json());
};
```

**New approach:**
```typescript
const { data: contractors, refetch } = useApiGet('/contractors');
const { mutate: create } = useApiPost('/contractors');

const handleCreate = async (data) => {
  await create(data);
  refetch();
};
```

---

## File Structure After Migration

```
app/
├── components/
│   ├── ContractorList.tsx       (uses useApiGet)
│   ├── ContractorForm.tsx       (uses useApiForm)
│   ├── ContractorCard.tsx       (uses useApiDelete)
│   └── ProfileUpload.tsx        (uses useApiUploadFile)
│
lib/
├── api-service.ts              ✅ NEW - Core API service
├── api-endpoints.ts            ✅ NEW - Pre-configured endpoints
├── use-api.ts                  ✅ NEW - React hooks
├── error-logger.ts             (existing)
└── seo-config.ts              (existing)
```

---

## Performance Tips After Migration

1. **Use refetch strategically:**
   ```typescript
   const { data, refetch } = useApiGet('/contractors');
   // Only refetch when needed, not on every interaction
   ```

2. **Implement debouncing for searches:**
   ```typescript
   import { useCallback } from 'react';
   
   const debouncedSearch = useCallback(
     debounce((term: string) => query({ search: term }), 500),
     []
   );
   ```

3. **Use conditional fetching:**
   ```typescript
   // Only fetch if contractor ID exists
   const { data } = useApiGet(id ? `/contractors/${id}` : null);
   ```

---

## Troubleshooting Migration Issues

### Issue: "token is undefined"
**Solution:** Ensure token is set after login:
```typescript
const response = await authApi.login(email, password);
if (response.success) {
  apiService.setToken(response.data.token);
}
```

### Issue: "CORS errors"
**Solution:** Check API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Issue: "Token not being sent"
**Solution:** Ensure `includeToken: true` is set (or default):
```typescript
const { data } = useApiGet('/contractors', true); // true for with token
```

### Issue: "Data is null after fetch"
**Solution:** Check that endpoint returns correct data structure:
```typescript
const { data } = useApiGet('/contractors');
// data will be the response.data from API
// Check what your API actually returns
```

---

## Testing the Migration

### Test Checklist

- [ ] Can fetch data (list)
- [ ] Can create new resource
- [ ] Can update existing resource
- [ ] Can delete resource
- [ ] Can upload files
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Success messages work
- [ ] Authentication works
- [ ] Pagination/filtering works

### Example Test

```typescript
// Test useApiGet
const { data, loading, error } = useApiGet('/contractors');
expect(loading).toBe(true);
// Wait for API call
await waitFor(() => expect(loading).toBe(false));
expect(data).toBeDefined();
```

---

## Need Help?

1. **Review examples:** Check `REACT_HOOKS_GUIDE.md` for hook usage
2. **Check API Service:** Review `API_SERVICE_GUIDE.md` for options
3. **Debug:** Check network tab to verify API calls
4. **Token issues:** Verify token is set with `localStorage.getItem('authToken')`
