# React Hooks for API Service

This guide explains how to use the custom React hooks provided in `lib/use-api.ts` for seamless API integration in your components.

## Available Hooks

### 1. useApiGet - Fetch Data

Automatically fetches data when component mounts and refetches when dependencies change.

```typescript
import { useApiGet } from '@/lib/use-api';

export default function ContractorsPage() {
  const { data, loading, error, refetch } = useApiGet<Contractor[]>(
    '/contractors',
    false // includeToken
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(contractor => (
        <div key={contractor.id}>{contractor.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

**Parameters:**
- `endpoint` (string | null) - API endpoint. Use null to skip fetching
- `includeToken` (boolean) - Include auth token (default: false)
- `dependencies` (array) - Dependencies to refetch (default: [])

**Returns:**
- `data` - Fetched data
- `loading` - Loading state
- `error` - Error message if any
- `refetch` - Function to manually refetch

---

### 2. useApiPost - Create Data

For creating new resources with POST requests.

```typescript
import { useApiPost } from '@/lib/use-api';

export default function CreateContractor() {
  const { data, loading, error, isSuccess, mutate } = useApiPost(
    '/contractors', 
    true // includeToken
  );

  const handleSubmit = async (formData: any) => {
    await mutate(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'John', email: 'john@example.com' });
    }}>
      {loading && <span>Creating...</span>}
      {error && <span style={{ color: 'red' }}>{error}</span>}
      {isSuccess && <span style={{ color: 'green' }}>Created!</span>}
      <button type="submit" disabled={loading}>Create</button>
    </form>
  );
}
```

**Parameters:**
- `endpoint` (string) - API endpoint
- `includeToken` (boolean) - Include auth token (default: true)

**Returns:**
- `data` - Response data
- `loading` - Loading state
- `error` - Error message
- `isSuccess` - Success state
- `mutate(payload)` - Function to execute POST request

---

### 3. useApiPut - Update Entire Resource

For updating entire resources with PUT requests.

```typescript
import { useApiPut } from '@/lib/use-api';

export default function EditContractor({ id }: { id: string }) {
  const { loading, error, isSuccess, mutate } = useApiPut(
    `/contractors/${id}`,
    true // includeToken
  );

  const handleUpdate = async (updatedData: any) => {
    await mutate(updatedData);
  };

  return (
    <button onClick={() => handleUpdate({ name: 'Jane' })} disabled={loading}>
      {loading ? 'Updating...' : 'Update'}
      {error && <span> Error: {error}</span>}
      {isSuccess && <span> Updated!</span>}
    </button>
  );
}
```

---

### 4. useApiPatch - Partial Update

For partially updating resources with PATCH requests.

```typescript
import { useApiPatch } from '@/lib/use-api';

export default function UpdatePhoneNumber({ id }: { id: string }) {
  const { mutate, loading } = useApiPatch(
    `/contractors/${id}`,
    true // includeToken
  );

  return (
    <button onClick={() => mutate({ phone: '9876543210' })} disabled={loading}>
      Update Phone
    </button>
  );
}
```

---

### 5. useApiDelete - Delete Resource

For deleting resources.

```typescript
import { useApiDelete } from '@/lib/use-api';

export default function DeleteContractor({ id }: { id: string }) {
  const { mutate, loading, isSuccess } = useApiDelete(
    `/contractors/${id}`,
    true // includeToken
  );

  return (
    <button onClick={() => mutate()} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

### 6. useApiUploadFile - File Upload

For uploading files with multipart/form-data.

```typescript
import { useApiUploadFile } from '@/lib/use-api';

export default function UploadProfilePic({ contractorId }: { contractorId: string }) {
  const { upload, loading, error, isSuccess } = useApiUploadFile(
    `/contractors/${contractorId}/profile-pic`,
    true // includeToken
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file, { userId: contractorId }); // additional form data optional
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      {loading && <span>Uploading...</span>}
      {error && <span style={{ color: 'red' }}>{error}</span>}
      {isSuccess && <span style={{ color: 'green' }}>Uploaded!</span>}
    </div>
  );
}
```

**Parameters:**
- `endpoint` (string) - API endpoint
- `includeToken` (boolean) - Include auth token (default: true)

**Returns:**
- `upload(file, additionalData?)` - Upload function
- `data` - Response data
- `loading` - Loading state
- `error` - Error message
- `isSuccess` - Success state

---

### 7. useApiForm - Form Submission Helper

Simplifies form submission with automatic loading and error handling.

```typescript
import { useApiForm } from '@/lib/use-api';

export default function ContractorForm() {
  const { submit, loading, error, isSuccess, reset } = useApiForm(
    '/contractors',
    'POST', // or 'PUT' or 'PATCH'
    true // includeToken
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    await submit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      
      {loading && <p>Submitting...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isSuccess && (
        <p style={{ color: 'green' }}>
          Success! <button type="button" onClick={reset}>Create another</button>
        </p>
      )}
      
      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
}
```

---

### 8. useApiQuery - Search/Filter Helper

For queries with dynamic search and filter parameters.

```typescript
import { useApiQuery } from '@/lib/use-api';

export default function ContractorSearch() {
  const { data, loading, error, query } = useApiQuery('/contractors');

  const handleSearch = async (searchTerm: string) => {
    await query({
      search: searchTerm,
      page: 1,
      limit: 10,
      sortBy: 'name'
    });
  };

  return (
    <div>
      <input 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search contractors..."
      />
      {loading && <span>Searching...</span>}
      {error && <span>{error}</span>}
      {data && <span>Found {data.total} results</span>}
    </div>
  );
}
```

---

## Complete Examples

### Example 1: List with Pagination

```typescript
'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/use-api';

interface Contractor {
  id: string;
  name: string;
  email: string;
}

export default function ContractorsList() {
  const [page, setPage] = useState(1);
  const { data, loading, error, query } = useApiQuery('/contractors');

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    query({ page: newPage, limit: 10 });
  };

  return (
    <div>
      <h1>Contractors</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {data?.contractors && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {(data.contractors as Contractor[]).map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => handlePageChange(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### Example 2: Create and List Combined

```typescript
'use client';

import { useState } from 'react';
import { useApiGet, useApiPost } from '@/lib/use-api';

interface Contractor {
  id: string;
  name: string;
}

export default function ContractorsManager() {
  const { data: contractors, refetch } = useApiGet<Contractor[]>('/contractors');
  const { mutate: createContractor, loading: creating } = useApiPost('/contractors');

  const handleCreate = async (name: string) => {
    const response = await createContractor({ name });
    if (response) {
      refetch(); // Refresh the list
    }
  };

  return (
    <div>
      <h1>Manage Contractors</h1>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
        handleCreate(input.value);
        input.value = '';
      }}>
        <input name="name" placeholder="New contractor name" required />
        <button disabled={creating}>Add</button>
      </form>

      <ul>
        {contractors?.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 3: Edit Form with Pre-filled Data

```typescript
'use client';

import { useApiGet, useApiPut } from '@/lib/use-api';
import { useEffect, useState } from 'react';

export default function EditContractor({ id }: { id: string }) {
  const { data: contractor } = useApiGet(`/contractors/${id}`);
  const { mutate: update, loading, error } = useApiPut(`/contractors/${id}`);
  const [name, setName] = useState('');

  useEffect(() => {
    if (contractor?.name) {
      setName(contractor.name);
    }
  }, [contractor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
      <button disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

---

## Hook Comparison Table

| Hook | Method | Use Case | Manual Trigger |
|------|--------|----------|-----------------|
| `useApiGet` | GET | Fetch data on mount | Yes (`refetch`) |
| `useApiPost` | POST | Create resource | Yes (`mutate`) |
| `useApiPut` | PUT | Update entire resource | Yes (`mutate`) |
| `useApiPatch` | PATCH | Partial update | Yes (`mutate`) |
| `useApiDelete` | DELETE | Delete resource | Yes (`mutate`) |
| `useApiUploadFile` | POST | Upload file | Yes (`upload`) |
| `useApiForm` | POST/PUT/PATCH | Form submission | Yes (`submit`) |
| `useApiQuery` | GET | Search/filter | Yes (`query`) |

---

## Best Practices

1. **Always handle loading state:**
   ```typescript
   <button disabled={loading}>
     {loading ? 'Processing...' : 'Submit'}
   </button>
   ```

2. **Display errors to users:**
   ```typescript
   {error && <div className="error">{error}</div>}
   ```

3. **Refetch after mutations when needed:**
   ```typescript
   const { refetch } = useApiGet('/contractors');
   const { mutate } = useApiPost('/contractors');
   
   const handleCreate = async (data) => {
     await mutate(data);
     refetch(); // Refresh list after creating
   };
   ```

4. **Optional token inclusion:**
   ```typescript
   // Public endpoint, no token needed
   const { data } = useApiGet('/contractors', false);
   
   // Protected endpoint, include token
   const { data } = useApiGet('/contractors/me', true);
   ```

5. **Reset form after successful submission:**
   ```typescript
   const { submit, reset, isSuccess } = useApiForm('/contractors');
   
   useEffect(() => {
     if (isSuccess) {
       reset();
       // Show success message, redirect, etc
     }
   }, [isSuccess]);
   ```

---

## Troubleshooting

### Hook not updating when endpoint changes

Ensure the endpoint is included in dependencies or passed correctly:

```typescript
// ✅ Correct - component re-renders when id changes
const { data } = useApiGet(`/contractors/${id}`);

// ❌ Avoid - dynamic endpoint without dependency
const endpoint = `/contractors/${id}`;
const { data } = useApiGet(endpoint);
```

### Data not refetching

Use the `refetch` function explicitly:

```typescript
const { data, refetch } = useApiGet('/contractors');

useEffect(() => {
  refetch();
}, [searchTerm]); // Refetch when search changes
```

### Token not being sent

Ensure `includeToken` is set to `true` for protected endpoints:

```typescript
// ❌ Won't include token
const { data } = useApiGet('/contractors');

// ✅ Includes token
const { data } = useApiGet('/contractors', true);
```

---

## Performance Tips

1. **Skip fetching with null endpoint:**
   ```typescript
   const { data } = useApiGet(id ? `/contractors/${id}` : null);
   ```

2. **Debounce search queries:**
   ```typescript
   const [searchTerm, setSearchTerm] = useState('');
   const debouncedTerm = useDebounce(searchTerm, 500);
   
   const { query } = useApiQuery('/contractors', false);
   
   useEffect(() => {
     query({ search: debouncedTerm });
   }, [debouncedTerm]);
   ```

3. **Cache results when possible:**
   Store frequently accessed data in a context or state management library.
