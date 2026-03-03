/**
 * Get User Payment History API Route
 * Returns list of all payments made by the user
 * 
 * Backend Implementation Guide:
 * - Receive: userId from URL parameter
 * - Query database for all payment records of user
 * - Return:
 *   {
 *     success: boolean,
 *     payments: [
 *       {
 *         id: string,
 *         amount: number,
 *         status: "success" | "failed" | "pending",
 *         createdAt: ISO date string,
 *         verifiedAt: ISO date string,
 *         razorpayOrderId: string,
 *         razorpayPaymentId: string
 *       }
 *     ]
 *   }
 * - Sort by creation date (newest first)
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

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // TODO: Call your backend API to get payment history
    // Example:
    // const response = await fetch(
    //   `${process.env.BACKEND_API}/payments/history/${userId}?limit=${limit}&skip=${skip}`,
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
        success: true,
        payments: [],
        total: 0,
        limit,
        skip,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch payment history",
      },
      { status: 500 }
    );
  }
}
