import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        notificationPreferences: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      preferences: user.notificationPreferences || {
        email: true,
        push: false,
        sms: false,
      },
    });
  } catch (error) {
    console.error("Failed to fetch notification preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences || typeof preferences !== "object") {
      return new NextResponse("Invalid preferences data", { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        notificationPreferences: preferences,
      },
    });

    return NextResponse.json({
      preferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
