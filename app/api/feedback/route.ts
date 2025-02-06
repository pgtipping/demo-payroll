import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || "dev-team@example.com";
const MAX_REQUESTS_PER_HOUR = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

function checkRateLimit(userEmail: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userEmail);

  if (!userLimit) {
    rateLimitMap.set(userEmail, { count: 1, firstRequest: now });
    return true;
  }

  // Reset if window has passed
  if (now - userLimit.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(userEmail, { count: 1, firstRequest: now });
    return true;
  }

  // Check if user has exceeded limit
  if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }

  // Increment count
  userLimit.count++;
  rateLimitMap.set(userEmail, userLimit);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const area = formData.get("area") as string | undefined;
    const userEmail = formData.get("userEmail") as string;
    const userName = formData.get("userName") as string;
    const attachments = formData.getAll("attachments") as File[];

    // Check rate limit
    if (!checkRateLimit(userEmail)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        { status: 429 }
      );
    }

    // Validate file types and sizes
    for (const file of attachments) {
      // Max file size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        return new NextResponse(
          JSON.stringify({
            error: "File size exceeds 5MB limit",
          }),
          { status: 400 }
        );
      }

      // Allow only images and text files
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        return new NextResponse(
          JSON.stringify({
            error:
              "Invalid file type. Only images, PDFs, and text files are allowed",
          }),
          { status: 400 }
        );
      }
    }

    // Create email template based on feedback type
    const emailTemplate = {
      bug: {
        subject: `🐛 Bug Report: ${title}`,
        intro: "A new bug has been reported",
        color: "#dc2626", // red
      },
      feature: {
        subject: `✨ Feature Request: ${title}`,
        intro: "A new feature has been requested",
        color: "#0070f3", // blue
      },
      improvement: {
        subject: `📈 Improvement Suggestion: ${title}`,
        intro: "A new improvement has been suggested",
        color: "#059669", // green
      },
    }[type];

    // Forward the request to the backend email service
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/feedback/submit`,
      {
        method: "POST",
        headers: {
          Cookie: headers().get("cookie") || "",
        },
        body: formData, // Forward the entire FormData
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to submit feedback");
    }

    return NextResponse.json({
      message: "Thank you for your feedback! Our team will review it shortly.",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to submit feedback",
      }),
      { status: 500 }
    );
  }
}
