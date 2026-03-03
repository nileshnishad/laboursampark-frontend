/**
 * Record Payment Failure API Route
 * Logs failed payment attempts for debugging and support
 * 
 * Backend Implementation Guide:
 * - Receive: orderId, error message, userId (optional), userType (optional)
 * - Create record in "failed_payments" collection with:
 *   {
 *     orderId: string,
 *     userId: string | null,
 *     userType: string | null,
 *     error: string,
 *     errorType: string (user cancelled, timeout, network error, etc),
 *     timestamp: Date,
 *     userAgent: string (for debugging)
 *   }
 * - Return success confirmation
 * - Use this data to:
 *   - Debug payment issues
 *   - Identify common failure patterns
 *   - Follow up with users who had failures
 *   - Improve error messages
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, error, userId, userType } = await request.json();

    // Get auth token from request headers (optional for failure logging)
    const token = request.headers.get("authorization");

    // Validate inputs
    if (!orderId || !error) {
      return NextResponse.json(
        { success: false, message: "Order ID and error message are required" },
        { status: 400 }
      );
    }

    // Get user agent for debugging
    const userAgent = request.headers.get("user-agent") || "unknown";

    // TODO: Call your backend API to record failure
    // Example:
    // const response = await fetch(
    //   `${process.env.BACKEND_API}/payments/failure`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       ...(token && { 'Authorization': `Bearer ${token}` }),
    //     },
    //     body: JSON.stringify({
    //       orderId,
    //       error,
    //       userId,
    //       userType,
    //       userAgent,
    //       timestamp: new Date().toISOString(),
    //     }),
    //   }
    // );
    //
    // const result = await response.json();
    // return NextResponse.json(result, { status: response.status });

    // Log failure locally for now
    console.log("Payment failure recorded:", {
      orderId,
      error,
      userId,
      userType,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Failure recorded" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recording payment failure:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to record payment failure",
      },
      { status: 500 }
    );
  }
}
