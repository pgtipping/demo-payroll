import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log metrics in development
    if (process.env.NODE_ENV === "development") {
      console.log("Web Vitals:", body);
    }

    // TODO: Store metrics in your database or send to analytics service
    // Example: You might want to store this in a database or send to a service like Google Analytics

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing web vitals:", error);
    return NextResponse.json(
      { error: "Failed to process web vitals" },
      { status: 500 }
    );
  }
}
