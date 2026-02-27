# Form Payload Documentation

## Overview
Both the Contractor and Labour registration forms now collect all input values and create comprehensive payloads that are ready to be sent to your backend API.

## Contractor Registration Payload

### Payload Structure
```typescript
{
  userType: "contractor",
  basicInfo: {
    businessName: string,
    mobileNumber: string,
    email: string,
    password: string,
    location: string,
    registrationNumber: string,
  },
  businessDetails: {
    businessType: string,
    experienceRange: string,
    teamSize: string,
  },
  services: {
    offered: string[],
    coverageArea: string[],
  },
  additionalInfo: {
    about: string,
    businessLicense: string | null,
    companyLogo: string | null,
  },
  agreement: {
    termsAgreed: boolean,
  },
  timestamp: string,
}
```

### Example Contractor Payload
```json
{
  "userType": "contractor",
  "basicInfo": {
    "businessName": "ABC Construction Services",
    "mobileNumber": "+91 9876543210",
    "email": "business@example.com",
    "password": "secure_password_123",
    "location": "Mumbai",
    "registrationNumber": "REG-12345"
  },
  "businessDetails": {
    "businessType": "Construction",
    "experienceRange": "5-10 years",
    "teamSize": "6-10 workers"
  },
  "services": {
    "offered": ["Residential", "Industrial", "Installation"],
    "coverageArea": ["Within City", "Multi-City"]
  },
  "additionalInfo": {
    "about": "We provide premium construction services with 10 years of experience...",
    "businessLicense": "license.pdf",
    "companyLogo": "logo.png"
  },
  "agreement": {
    "termsAgreed": true
  },
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Form Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| businessName | string | Yes | Name of the business |
| mobileNumber | string | Yes | Contact phone number |
| email | string | Yes | Email address |
| password | string | Yes | Password or OTP |
| location | string | Yes | City/Location |
| registrationNumber | string | No | Business registration number |
| businessType | string | Yes | Type from dropdown |
| experienceRange | string | Yes | Years of experience |
| teamSize | string | Yes | Team size category |
| offered | string[] | Yes | Array of services (multi-select) |
| coverageArea | string[] | Yes | Array of coverage areas (multi-select) |
| about | string | No | Business description |
| businessLicense | File | No | License/Insurance document |
| companyLogo | File | No | Logo/Photo file |
| termsAgreed | boolean | Yes | Terms acceptance checkbox |

---

## Labour Registration Payload

### Payload Structure
```typescript
{
  userType: "labour",
  basicInfo: {
    fullName: string,
    age: number | null,
    mobileNumber: string,
    email: string,
    password: string,
    location: string,
  },
  professionalInfo: {
    experience: string,
    skills: string[],
    workTypes: string[],
    preferredWorkingHours: string,
  },
  additionalInfo: {
    bio: string,
    profilePhoto: string | null,
  },
  agreement: {
    termsAgreed: boolean,
  },
  timestamp: string,
}
```

### Example Labour Payload
```json
{
  "userType": "labour",
  "basicInfo": {
    "fullName": "Raj Kumar",
    "age": 28,
    "mobileNumber": "+91 9876543210",
    "email": "raj@example.com",
    "password": "secure_password_123",
    "location": "Delhi"
  },
  "professionalInfo": {
    "experience": "3-5 years",
    "skills": ["Plumbing", "Carpentry", "Electrical Work"],
    "workTypes": ["Full-time", "Contract"],
    "preferredWorkingHours": "8 AM - 5 PM"
  },
  "additionalInfo": {
    "bio": "Experienced skilled worker with expertise in residential construction...",
    "profilePhoto": "profile.jpg"
  },
  "agreement": {
    "termsAgreed": true
  },
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

### Form Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | string | Yes | Full name |
| age | number | Yes | Age in years |
| mobileNumber | string | Yes | Contact phone number |
| email | string | Yes | Email address |
| password | string | Yes | Password or OTP |
| location | string | Yes | City/Location |
| experience | string | Yes | Years of experience |
| skills | string[] | Yes | Array of skills (multi-select) |
| workTypes | string[] | Yes | Array of work types (multi-select) |
| preferredWorkingHours | string | Yes | Working hours preference |
| bio | string | No | Bio/About description |
| profilePhoto | File | No | Profile photo file |
| termsAgreed | boolean | Yes | Terms acceptance checkbox |

---

## How to Use the Payloads

### Sending to Backend API

```typescript
// In both form components, the payload is logged to console
// To send to your API, add this in the handleSubmit function:

// For Contractor Form
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const formPayload = {
    // ... payload structure
  };

  // Send to API
  try {
    const response = await fetch('/api/auth/register/contractor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formPayload),
    });
    
    const data = await response.json();
    console.log('Registration successful:', data);
    // Redirect to success page or login
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

### File Handling

Files are currently stored as **file names** in the payload. To handle actual file uploads:

```typescript
// Create FormData to handle file uploads
const formData = new FormData();
formData.append('data', JSON.stringify(formPayload));

if (businessLicense) {
  formData.append('businessLicense', businessLicense);
}
if (companyLogo) {
  formData.append('companyLogo', companyLogo);
}

// Send with FormData
const response = await fetch('/api/auth/register/contractor', {
  method: 'POST',
  body: formData, // Don't set Content-Type header, browser will set it
});
```

---

## Backend Integration Checklist

- [ ] Create `/api/auth/register/contractor` endpoint
- [ ] Create `/api/auth/register/labour` endpoint
- [ ] Set up validation for required fields
- [ ] Implement file upload handling (if applicable)
- [ ] Hash passwords before storing
- [ ] Validate email format
- [ ] Validate phone number format
- [ ] Verify terms agreement is true
- [ ] Store timestamp with registration
- [ ] Return success/error response with appropriate status code
- [ ] Send confirmation email
- [ ] Create database schema for contractor and labour profiles

---

## Common API Response Structure

Suggested response format from backend:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "user_123",
    "userType": "contractor",
    "email": "business@example.com",
    "profile": {
      "businessName": "ABC Construction Services",
      "location": "Mumbai"
    }
  },
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

Error response format:

```json
{
  "success": false,
  "message": "Email already exists",
  "error": "DUPLICATE_EMAIL",
  "timestamp": "2026-02-24T10:30:00.000Z"
}
```

---

## Next Steps

1. **Review Payloads**: Open browser DevTools console and submit a form to see the exact payload structure
2. **Create API Endpoints**: Implement backend endpoints to receive and process these payloads
3. **Add Validation**: Implement form-level validation before submission
4. **Handle Files**: Set up file upload mechanism for profile photos and documents
5. **Error Handling**: Add error handling and user feedback for submission failures
6. **Success Page**: Create success/redirect flow after registration

---

## Component Files

- Contractor Form: `app/register/ContractorRegisterForm.tsx`
- Labour Form: `app/register/LabourRegisterForm.tsx`
- Dropdown Data: `data/dropdowns.json`
