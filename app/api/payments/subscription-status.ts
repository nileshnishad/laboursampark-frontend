/**
 * Check User Subscription Status API Route
 * Returns whether a user has active subscription/verification
 * 
 * Backend Implementation Guide:
 * - Receive: userId from URL parameter
 * - Query database for user's subscription record
 * - Check if current date < subscription end date
 * - Return:
 *   {
 *     isVerified: boolean,
 *     expiresAt: ISO date string,
 *     daysRemaining: number,
 *     verificationBadge: boolean // Can be shown on profile
 *   }
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get auth token from request headers
    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // TODO: Call your backend API to get subscription status
    // Example:
    // const response = await fetch(
    //   `${process.env.BACKEND_API}/payments/subscription-status/${userId}`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   }
    // );
    //
    // const result = await response.json();
    // return NextResponse.json(result, { status: response.status });

    // Default response when backend is not ready
    return NextResponse.json(
      {
        isVerified: false,
        expiresAt: null,
        daysRemaining: 0,
        verificationBadge: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to check subscription status",
      },
      { status: 500 }
    );
  }
}
