# Contact Form API Integration Guide

## Overview
The ContactSection component now integrates with Redux to submit inquiries to your backend API endpoint: `http://localhost:5000/api/inquiries`

---

## 🔧 What Was Added/Modified

### 1. **New Redux Slice** (`store/slices/inquirySlice.ts`)
Handles all inquiry form submission logic:
```typescript
interface InquiryState {
  loading: boolean;        // API call in progress
  success: boolean;        // Form submitted successfully
  error: string | null;    // Error message if failed
  message: string | null;  // Success message
  submittedData: InquiryFormData | null; // Submitted data
}
```

**Actions Available:**
- `submitInquiry(formData)` - AsyncThunk to submit form to API
- `resetInquiryState()` - Clear all state after success
- `clearError()` - Clear error message

### 2. **Updated Redux Store** (`store/store.ts`)
Added inquiryReducer to the store:
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    inquiry: inquiryReducer,  // ← NEW
  },
});
```

### 3. **Enhanced ContactSection** (`app/components/ContactSection.tsx`)
Updated with Redux integration:
- Uses `useDispatch` and `useSelector` for state management
- Calls API when form is submitted
- Shows loading state while submitting
- Displays success/error messages
- Auto-clears form after successful submission

---

## 📋 API Request Format

### Request
```javascript
POST http://localhost:5000/api/inquiries
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "subject": "Need Labour for Construction",
  "message": "I need experienced workers for my residential project in Mumbai..."
}
```

### Expected Response (Success)
```javascript
Status: 201 Created
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "data": {
    "id": "inquiry_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "subject": "Need Labour for Construction",
    "message": "I need experienced workers...",
    "submittedAt": "2026-02-28T12:34:56Z"
  }
}
```

### Expected Response (Error)
```javascript
Status: 400/500
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

## 🎯 Features

### 1. **Form Validation**
- Checks required fields (name, email, subject, message)
- Shows alert if any required field is missing
- Phone is optional

### 2. **Loading State**
- Submit button shows "Submitting..." with spinner
- Button is disabled during submission
- Button text and appearance change

### 3. **Success Message**
- Shows green alert: "✓ Thank you! Your inquiry has been submitted successfully..."
- Auto-clears after 5 seconds

### 4. **Error Handling**
- Shows red alert with error message if API fails
- Error persists until next submission attempt
- Network errors are caught and displayed

### 5. **Redux State Management**
```typescript
// Access in any component:
const { loading, success, error } = useSelector(
  (state: RootState) => state.inquiry
);
```

---

## 💻 Usage Example

### In Any Component
```typescript
import { useDispatch } from "react-redux";
import { submitInquiry } from "@/store/slices/inquirySlice";
import type { AppDispatch } from "@/store/store";

export default function MyComponent() {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (formData: {
    fullName: string;
    email: string;
    mobile: string;
    subject: string;
    message: string;
  }) => {
    const result = await dispatch(submitInquiry(formData));
    
    if (submitInquiry.fulfilled.match(result)) {
      console.log("Success!", result.payload);
    } else {
      console.log("Error!", result.payload);
    }
  };

  return <button onClick={() => handleSubmit(...)}>Submit</button>;
}
```

---

## 🔄 Form Flow

```
User fills form
    ↓
User clicks "Send Message"
    ↓
Form validation (frontend)
    ↓ (Pass)
Show loading spinner
    ↓
POST request to /api/inquiries
    ↓
Response received
    ↓ (Success)
Show green success message
Clear form
Auto-dismiss after 5 seconds
    ↓ (Error)
Show red error message
Keep form data
User can retry
```

---

## 🛠️ Backend API Requirements

Your backend API at `http://localhost:5000/api/inquiries` should:

1. **Accept POST requests** with JSON body
2. **Validate input fields**
3. **Store inquiry in database**
4. **Return JSON response** with status 201/400/500

### Example Node.js/Express Backend

```javascript
app.post('/api/inquiries', async (req, res) => {
  try {
    const { fullName, email, mobile, subject, message } = req.body;

    // Validate
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Save to database
    const inquiry = await Inquiry.create({
      fullName,
      email,
      mobile,
      subject,
      message,
      submittedAt: new Date()
    });

    // Return success
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## 📊 Contact Form Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| fullName | String | Yes | 100 | User's full name |
| email | Email | Yes | 100 | Valid email address |
| mobile | String | No | 20 | Phone number (optional) |
| subject | String | Yes | 100 | Inquiry subject |
| message | String | Yes | 5000 | Detailed message/inquiry |

---

## 🔐 Security Considerations

### Frontend Validation ✓
- Already implemented
- Checks required fields

### Backend Validation ⚠️ (You should implement)
- Validate data types
- Sanitize input
- Check email format
- Rate limiting
- CSRF protection
- SQL injection prevention

### Recommended Backend Validations
```javascript
// Example validations
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => phone.length >= 7 && phone.length <= 20;
const validateMessageLength = (msg) => msg.length > 10 && msg.length <= 5000;

// Rate limiting example (using express-rate-limit)
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per 15 minutes
});

app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
  // Handle request
});
```

---

## 🧪 Testing the Integration

### Test with cURL
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "subject": "Need Labour for Construction",
    "message": "I need experienced workers for my residential project in Mumbai. Please contact me with available options."
  }'
```

### Test with Postman
1. Create new POST request
2. URL: `http://localhost:5000/api/inquiries`
3. Headers: Set `Content-Type: application/json`
4. Body (raw): Paste the JSON from cURL example
5. Click Send

### Test in Browser
1. Go to contact section on your site
2. Fill out the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Subject: Need Labour for Construction
   - Message: I need experienced workers...
3. Click "Send Message"
4. Should see success or error message

---

## 📝 Form Data Mapping

Form input → API field mapping:

```typescript
Form Input     →   API Field
name           →   fullName
email          →   email
phone          →   mobile
subject        →   subject
message        →   message
```

---

## 🔗 Related Files

- Redux Slice: `store/slices/inquirySlice.ts`
- Redux Store: `store/store.ts`
- Component: `app/components/ContactSection.tsx`
- Store Types: `store/store.ts` (AppDispatch, RootState)

---

## 🐛 Troubleshooting

### API Not Receiving Requests
- Check backend is running on `localhost:5000`
- Check CORS is enabled on backend
- Open DevTools → Network tab → Check request

### Success Message Not Showing
- Check Redux DevTools for state changes
- Verify API returns correct response format
- Check browser console for errors

### Form Not Submitting
- Check all required fields are filled
- Open browser console for error messages
- Check network request in DevTools

### Loading State Not Working
- Check Redux store is configured correctly
- Verify `loading` state is coming from Redux
- Check async thunk is being dispatched

---

## ✨ Features & Improvements

### Current Features ✓
- Redux state management
- Form validation
- Loading spinner
- Success/error messages
- Auto-clear form
- Auto-dismiss messages
- Disabled button during submission

### Future Enhancements 💡
- Email notifications to admin
- Inquiry tracking dashboard
- ReCAPTCHA integration
- File attachments
- Multi-language support
- Email confirmation to user
- Inquiry status tracking

---

## 📞 Support

If you need to modify the API endpoint or add new functionality:

1. **Change API endpoint**: Edit `submitInquiry` thunk in `inquirySlice.ts`
2. **Add new fields**: Update `InquiryFormData` interface and form validation
3. **Modify success behavior**: Edit `handleSubmit` function in `ContactSection.tsx`
4. **Add file uploads**: Extend `submitInquiry` to use FormData instead of JSON

---

## Summary

Your contact form is now fully integrated with:
- ✅ Redux state management
- ✅ API submission to backend
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Form validation

Simply set up your backend API at `http://localhost:5000/api/inquiries` and the form will automatically submit inquiries! 🚀
