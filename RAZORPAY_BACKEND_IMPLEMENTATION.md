# Razorpay Payment Integration - Backend Implementation Guide

## Overview

The frontend has been set up with complete Razorpay payment infrastructure. This guide provides step-by-step instructions for the backend team to implement the payment verification endpoints and integrate with Razorpay API.

## Architecture

```
Frontend Payment Flow:
┌─────────────────┐
│  Payment Modal  │
└────────┬────────┘
         │
         ├──► Create Order API (/api/payments/create-order)
         │         │
         │         ├──► Backend Calls Razorpay API
         │         │
         │         └──► Returns Order ID
         │
         ├──► Razorpay Checkout Modal Opens
         │
         ├──► User Completes Payment
         │
         └──► Verify Payment API (/api/payments/verify-payment)
                   │
                   ├──► Backend Verifies Signature
                   │
                   ├──► Updates User Subscription
                   │
                   └──► Returns Success/Failure
```

## Step 1: Install Dependencies

```bash
npm install razorpay
```

Or if using yarn:
```bash
yarn add razorpay
```

## Step 2: Configure Environment Variables

Add these to your `.env.local` (backend):

```env
# Razorpay Keys (get from: Dashboard → Settings → API Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx          # Public key (safe to use in frontend if needed)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx    # NEVER expose to frontend!

# Backend Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx  # For frontend (public key only)
```

**How to get keys:**
1. Log in to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to: Settings → API Keys
3. Copy Key ID and Key Secret
4. Test in sandbox mode first (optional)

## Step 3: Implement Create Order Endpoint

**File:** `/app/api/payments/create-order.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Razorpay } from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt, userId, userType } = await request.json();
    
    // Verify auth token
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise (INR * 100)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        userId,
        userType,
        description: `${userType} verification payment`,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
```

## Step 4: Implement Payment Verification Endpoint

**File:** `/app/api/payments/verify-payment.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Razorpay } from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      userType,
    } = await request.json();

    // Verify auth token
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate inputs
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const signature = shasum.digest('hex');

    if (signature !== razorpay_signature) {
      // Invalid signature - potential fraud attempt
      console.warn('Invalid payment signature:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Signature verified! Now update user subscription in database
    // TODO: Update your database schema:
    // UserSubscription {
    //   userId: string,
    //   isVerified: boolean,
    //   subscriptionEndDate: Date,
    //   lastPaymentId: string,
    //   lastOrderId: string,
    // }
    
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3); // 3 months validity

    // Example database update (pseudo-code):
    // await UserSubscription.findByIdAndUpdate(userId, {
    //   isVerified: true,
    //   subscriptionEndDate,
    //   lastPaymentId: razorpay_payment_id,
    //   lastOrderId: razorpay_order_id,
    //   updatedAt: new Date(),
    // });

    // Optional: Fetch payment details from Razorpay for additional validation
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log('Payment verified:', {
        paymentId: payment.id,
        amount: payment.amount / 100, // Convert from paise to rupees
        status: payment.status,
        method: payment.method,
      });
    } catch (fetchError) {
      console.error('Error fetching payment details:', fetchError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      subscriptionEndDate,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Payment verification failed',
      },
      { status: 500 }
    );
  }
}
```

## Step 5: Implement Subscription Status Endpoint

**File:** `/app/api/payments/subscription-status.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Verify auth token
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database:
    // const subscription = await UserSubscription.findOne({ userId });
    // if (!subscription) {
    //   return default non-verified response
    // }

    const now = new Date();
    // const expiresAt = subscription.subscriptionEndDate;
    // const isVerified = expiresAt > now;
    // const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      isVerified: false,          // Change to: isVerified
      expiresAt: null,             // Change to: expiresAt?.toISOString()
      daysRemaining: 0,            // Change to: daysRemaining
      verificationBadge: false,    // Change to: isVerified
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to check subscription',
      },
      { status: 500 }
    );
  }
}
```

## Step 6: Database Schema Required

Add these collections/models to your MongoDB:

### UserSubscription Collection
```javascript
db.createCollection("user_subscriptions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        isVerified: { bsonType: "bool" },
        subscriptionEndDate: { bsonType: "date" },
        lastPaymentId: { bsonType: "string" },
        lastOrderId: { bsonType: "string" },
        userType: { bsonType: "string", enum: ["labour", "contractor"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      }
    }
  }
});

// Create index for quick lookups
db.user_subscriptions.createIndex({ userId: 1 });
```

### PaymentRecords Collection (Optional, for audit trail)
```javascript
db.createCollection("payment_records", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "orderId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        orderId: { bsonType: "string" },
        paymentId: { bsonType: "string" },
        amount: { bsonType: "int" },
        currency: { bsonType: "string" },
        status: { bsonType: "string", enum: ["pending", "success", "failed"] },
        userType: { bsonType: "string", enum: ["labour", "contractor"] },
        method: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        verifiedAt: { bsonType: "date" },
      }
    }
  }
});

db.payment_records.createIndex({ userId: 1 });
db.payment_records.createIndex({ orderId: 1 });
db.payment_records.createIndex({ status: 1 });
```

## Step 7: Update User Model

Add subscription fields to your User model:

```javascript
// Add to existing User schema:
{
  // ... existing fields ...
  isVerified: { type: Boolean, default: false },
  subscriptionEndDate: Date,
  lastPaymentId: String,
  lastOrderId: String,
  paymentMethod: String,
  verificationBadge: { type: Boolean, default: false },
}
```

## Step 8: Payment Verification During User Profile Display

Update your user profile/listing endpoint to include verification status:

```typescript
// When returning user data for profile/listings:
{
  // ... user data ...
  isVerified: user.isVerified,
  verificationBadge: user.subscriptionEndDate && user.subscriptionEndDate > new Date(),
  subscriptionExpiresAt: user.subscriptionEndDate,
  daysRemainingInSubscription: calculateDaysRemaining(user.subscriptionEndDate),
}
```

## Step 9: Testing

### Test Payment Amounts:
- **Labour:** ₹499 (3 months verification)
- **Contractor:** ₹999 (3 months verification)

### Test with Razorpay Sandbox:

Use these test credentials:

**Test Card:**
- Number: `4111111111111111`
- Expiry: Any future date (e.g., 12/25)
- CVV: `123`

**Test UPI:**
- Use any test UPI ID (Razorpay provides test UPI IDs)

### Verification Checklist:
- [ ] Order creation API working
- [ ] Razorpay checkout modal opens
- [ ] Test payment completes successfully
- [ ] Payment signature verification passes
- [ ] User subscription updated in database
- [ ] Subscription status endpoint returns correct data
- [ ] Profile shows verification badge after payment
- [ ] Third-month payment works (only 1 active subscription)
- [ ] Failed payments logged correctly
- [ ] Error messages shown to users in modal

## Step 10: Webhook Setup (Recommended)

For additional security, set up a webhook to confirm payment completion:

**Razorpay Webhook Configuration:**

1. Dashboard → Settings → Webhooks
2. Add webhook listener: `https://yoursite.com/api/payments/webhook`
3. Select events:
   - `payment.authorized`
   - `payment.failed`

**Webhook Handler Example:**

```typescript
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature');
  const body = await request.text();
  
  // Verify webhook signature
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!);
  shasum.update(body);
  const expectedSignature = shasum.digest('hex');
  
  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const payload = JSON.parse(body);
  const { event, payload: data } = payload;
  
  if (event === 'payment.authorized') {
    // Update subscription
    await UserSubscription.updateOne(
      { lastOrderId: data.order_id },
      { isVerified: true, subscriptionEndDate: newDate }
    );
  }
});
```

## Critical Security Notes

⚠️ **NEVER expose `RAZORPAY_KEY_SECRET` in frontend code**

⚠️ **Always verify signatures on backend before updating records**

⚠️ **Amount verification:** Check that amount matches expected amount for user type:
- Labour: ₹499
- Contractor: ₹999

⚠️ **Idempotency:** Handle duplicate verification requests (same orderId twice)

## Common Issues & Solutions

### Issue: "Invalid Signature"
- Check that `RAZORPAY_KEY_SECRET` is correct
- Verify signature string format: exactly `${orderId}|${paymentId}`
- Ensure no whitespace or special characters

### Issue: "Order Not Found"
- Order was created but not found in Razorpay database
- Usually indicates backend connectivity issue
- Check API credentials

### Issue: "Payment Verification Timeout"
- Network issue between backend and Razorpay
- Implement retry logic
- Consider async job queue for verification

### Issue: "Duplicate Subscription"
- Multiple payments for same user
- Implement idempotency key
- Check if subscription already active before creating new one

## Frontend Payment Status

After backend implementation, the frontend will automatically:

✅ Create payment orders via API call
✅ Open Razorpay checkout modal
✅ Call verification endpoint after payment
✅ Redirect user to dashboard on success
✅ Show error message on failure
✅ Display verification badge on profile
✅ Track payment history

## Questions?

Refer to:
- Razorpay Documentation: https://razorpay.com/docs/
- API Keys: https://dashboard.razorpay.com/ → Settings → API Keys
- Payment APIs: https://razorpay.com/docs/payments/

---

**Backend Implementation Status:**
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Create order endpoint implemented
- [ ] Payment verification endpoint implemented
- [ ] Database schema created
- [ ] User model updated
- [ ] Subscription status endpoint implemented
- [ ] Payment history endpoint implemented
- [ ] Webhook handler implemented
- [ ] Testing completed
- [ ] Production ready
