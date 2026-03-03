# Razorpay Payment Integration - Setup & Configuration Guide

## 📋 Overview

This document provides a complete overview of the Razorpay payment integration implemented in the LabourSampark platform. The integration enables users (both labourers and contractors) to pay for profile verification.

## 💰 Pricing Structure

| User Type | Amount | Duration | Benefits |
|-----------|--------|----------|----------|
| **Labour** | ₹499 | 3 months | Profile visibility, Search appearance, Enhanced credibility |
| **Contractor** | ₹999 | 3 months | Profile verification badge, Higher visibility, Premium listing |

## 🏗️ System Architecture

### Frontend Components (Completed ✅)

1. **Razorpay Service** (`/lib/razorpay-service.ts`)
   - Core payment operations handler
   - Dynamically loads Razorpay SDK
   - Creates orders via API
   - Verifies payment signatures
   - Records payment failures
   - Features:
     - Singleton pattern for reliability
     - Comprehensive error handling
     - Automatic failure logging

2. **Payment Modal Component** (`/app/components/RazorpayPaymentModal.tsx`)
   - User-facing payment interface
   - 3 payment method options:
     - UPI (Google Pay, PhonePe, Paytm)
     - Credit/Debit Card (Visa, Mastercard, Amex)
     - Net Banking (All major Indian banks)
   - Loading states with spinner
   - Toast notifications for feedback
   - Mobile-responsive design
   - Dark mode support

3. **Payment Page** (`/app/user/[username]/[userType]/payment/page.tsx`)
   - Complete checkout experience
   - Benefits explanation (5 key points)
   - FAQ section (4 common questions)
   - Security information display
   - Loading states and error handling

4. **Payment API Configuration** (`/lib/payment-api.ts`)
   - Centralized endpoint management
   - Type-safe request/response handling
   - 6 payment-related methods:
     - Create order
     - Verify payment
     - Get payment history
     - Check subscription status
     - Get payment details
     - Record payment failure

## 🔌 API Routes (Frontend - Templated ✅)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/payments/create-order` | POST | Create Razorpay order | Template ready |
| `/api/payments/verify-payment` | POST | Verify payment signature | Template ready |
| `/api/payments/subscription-status` | GET | Check user verification | Template ready |
| `/api/payments/history` | GET | Fetch payment history | Template ready |
| `/api/payments/failure` | POST | Log payment failures | Template ready |

## 🔐 Security Features

### Frontend Security
- ✅ Public key only (never exposed secret)
- ✅ Payment signature verification on backend
- ✅ Secure token authentication
- ✅ HTTPS-only payment modal
- ✅ Automatic failure logging

### Backend Security (To Implement)
- HMAC-SHA256 signature verification required
- Secret key never shared with frontend
- Payment verification before subscription update
- Idempotency handling for duplicate requests
- Rate limiting on payment endpoints

## 📱 Frontend Payment Flow

```
User Views Payment Page
        ↓
Clicks "Pay ₹{amount}" Button
        ↓
RazorpayPaymentModal Opens
        ↓
Selects Payment Method
        ↓
Clicks "Pay Now"
        ↓
razorpayService.loadRazorpayScript()
        ↓
razorpayService.createOrder()
        ↓
Backend Creates Razorpay Order
        ↓
Returns Order ID to Frontend
        ↓
razorpayService.openPayment()
        ↓
Razorpay Checkout Modal Opens
        ↓
User Completes Payment
        ↓
Razorpay Returns Payment Response
        ↓
razorpayService.verifyPayment()
        ↓
Backend Verifies Signature & Updates DB
        ↓
SUCCESS: Toast notification + Redirect
        ↓
User Dashboard (Profile now verified)
```

## 🌐 Environment Configuration

### Required Environment Variables

```env
# .env.local (Backend)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# .env.local (Frontend - public safe)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

### How to Get Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign in with your account
3. Navigate to **Settings → API Keys**
4. Copy **Key ID** and **Key Secret**
5. Add to environment variables
6. Test in sandbox mode first (optional)

## 📚 Integration Checklist

### ✅ Completed (Frontend)
- [x] Razorpay service created (200+ lines)
- [x] Payment modal component created (225+ lines)
- [x] Payment page updated with integration
- [x] API endpoint templates created
- [x] Error handling implemented
- [x] Loading states added
- [x] Toast notifications configured
- [x] Dark mode support added
- [x] Mobile responsiveness verified
- [x] Failure logging mechanism added

### ⏳ Pending (Backend Implementation)
- [ ] Install `razorpay` NPM package
- [ ] Configure environment variables
- [ ] Implement `/api/payments/create-order` endpoint
- [ ] Implement `/api/payments/verify-payment` endpoint
- [ ] Implement `/api/payments/subscription-status` endpoint
- [ ] Create/update database schema for subscriptions
- [ ] Add payment history tracking
- [ ] Set up webhook for payment confirmations
- [ ] Implement refund logic (if needed)
- [ ] Add payment failure notifications
- [ ] Test with Razorpay sandbox
- [ ] Deploy to production

## 🧪 Testing Guidelines

### Test Payment Credentials

**Test Card:**
- Number: `4111111111111111`
- Expiry: `12/25` (any future date)
- CVV: `123`
- Name: Any name (e.g., "Test User")

**Test UPI:**
- Use Razorpay-provided test UPI IDs
- Check Razorpay docs for available test IDs

### Testing Checklist

- [ ] Order creation API working
- [ ] Razorpay checkout modal opens successfully
- [ ] Payment can be completed with test card
- [ ] Payment signature verification passes
- [ ] User subscription updated in database
- [ ] Subscription status endpoint returns correct data
- [ ] Profile shows verification badge after payment
- [ ] Payment history visible in user account
- [ ] Failed payments logged correctly
- [ ] Error messages display properly in modal
- [ ] User redirected to dashboard on success
- [ ] Wallet/UPI payments work
- [ ] International cards (if enabled) work
- [ ] Net Banking payments work

## 📞 Support & Documentation

### Razorpay Documentation Links
- **Main Docs:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/
- **Orders API:** https://razorpay.com/docs/api/orders/
- **Payments API:** https://razorpay.com/docs/api/payments/
- **Dashboard:** https://dashboard.razorpay.com/

### Common Issues & Solutions

**Issue: "Script not loaded"**
- Solution: Check internet connection, verify Razorpay CDN is accessible
- Check browser console for CORS errors

**Issue: "Key not configured"**
- Solution: Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in environment
- Restart development server after env changes

**Issue: "Order creation fails"**
- Solution: Backend `/api/payments/create-order` not implemented
- Check backend server is running
- Verify authentication token is valid

**Issue: "Payment verification timeout"**
- Solution: Network issue between frontend and backend
- Check backend server logs
- Implement retry logic

**Issue: "Signature verification failed"**
- Solution: Verify `RAZORPAY_KEY_SECRET` is correct
- Check signature string format: `${orderId}|${paymentId}`
- Ensure no whitespace or special characters

## 🔄 Payment Status Flow

```
PENDING (Order created, awaiting payment)
    ↓
PROCESSING (User in checkout modal)
    ↓
SUCCESS (Payment received, signature verified)
    OR
FAILED (Payment declined, user cancelled, network error)
```

## 📊 Available Endpoints for Frontend

### Create Order
```bash
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 499,           # In rupees (₹)
  "currency": "INR",       # Default: INR
  "receipt": "labour_123", # Optional
  "userId": "user123",     # Optional but recommended
  "userType": "labour"     # "labour" or "contractor"
}

Response:
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 49900,        # In paise
    "currency": "INR",
    "created_at": 1234567890
  }
}
```

### Verify Payment
```bash
POST /api/payments/verify-payment
Content-Type: application/json

{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_hash",
  "userId": "user123",       # Optional
  "userType": "labour"       # Optional
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "subscriptionEndDate": "2025-04-15T10:30:00Z"
}
```

### Check Subscription Status
```bash
GET /api/payments/subscription-status/:userId
Authorization: Bearer <token>

Response:
{
  "isVerified": true,
  "expiresAt": "2025-04-15T10:30:00Z",
  "daysRemaining": 90,
  "verificationBadge": true
}
```

## 🎯 Next Steps

1. **Backend Team:**
   - Refer to [RAZORPAY_BACKEND_IMPLEMENTATION.md](./RAZORPAY_BACKEND_IMPLEMENTATION.md) for detailed implementation guide
   - Install dependencies
   - Configure environment variables
   - Implement payment endpoints

2. **Testing Team:**
   - Test complete payment flow
   - Verify error handling
   - Test all payment methods
   - Verify database updates

3. **DevOps Team:**
   - Configure production Razorpay keys
   - Set up webhook endpoints
   - Configure SSL/TLS certificates
   - Set up monitoring and alerts

## 📝 Implementation Notes

### Design Decisions

1. **Singleton Razorpay Service**
   - Ensures consistent state management
   - Reusable across components
   - Easy to test and maintain

2. **Modal-Based Payment**
   - Non-intrusive user experience
   - Can be placed on any page
   - Easy to dismiss and retry

3. **Automatic Failure Logging**
   - Helps with debugging
   - Tracks user pain points
   - Enables follow-up with users

4. **Flexible Payment Methods**
   - Caters to diverse user base
   - UPI for mobile users
   - Cards for online shoppers
   - Bank transfers for conservative users

### Performance Considerations

- Razorpay script loaded on-demand (not on every page load)
- Payment verification async (doesn't block UI)
- Failure logging happens in background
- Toast notifications don't interrupt user flow

### Accessibility

- Modal is keyboard navigable
- Error messages are clear and helpful
- Loading states indicated visually and with text
- Works on mobile devices
- Dark mode support for accessibility

## 🚀 Deployment Notes

### Pre-Production
1. Test with sandbox keys
2. Verify all endpoints working
3. Check error handling
4. Load test payment system

### Production
1. Switch to production keys
2. Enable Razorpay fraud detection
3. Set up webhooks for reliability
4. Configure webhook retry logic
5. Test end-to-end once more
6. Monitor payment success rates

## 📞 Support Contacts

For issues or questions:
- **Razorpay Support:** support@razorpay.com
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **API Status:** https://status.razorpay.com/

---

**Last Updated:** December 2024
**Status:** Frontend Complete ✅ | Backend Pending ⏳
**Next Phase:** Backend Implementation & Testing
