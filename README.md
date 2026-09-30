This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cashfree Integration

Cashfree is integrated alongside the existing PayU flow. The subscription payment screen uses Cashfree by default; set `NEXT_PUBLIC_PAYMENT_PROVIDER=payu` to retain PayU for an environment. Cashfree checkout uses `NEXT_PUBLIC_CASHFREE_MODE=sandbox` or `production` and only receives the backend-created `paymentSessionId`. No Cashfree secret or webhook credential belongs in frontend environment variables.

The typed service in `lib/cashfree-service.ts` uses the existing authenticated fetch client. It provides order creation, backend payment-status verification, refunds, beneficiaries, and admin payout operations. Payment success is shown only after `GET /api/cashfree/orders/:paymentId/status` confirms it. The checkout page is `/user/[username]/[userType]/payment`; verification is handled at `/payment/cashfree-status`. Beneficiaries are managed at `/cashfree/beneficiaries`, and the role-gated admin tools are at `/admin/cashfree`.

Install the declared SDK manually before running the app:

```bash
npm install
```

User flow: login, choose a subscription, create the backend order, complete sandbox checkout, refresh the backend status page, and confirm the existing subscription/profile data refreshes. Admin flow: open the Cashfree operations page, create or retry payouts, and submit full or partial refunds. Backend authorization remains authoritative for admin endpoints.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
