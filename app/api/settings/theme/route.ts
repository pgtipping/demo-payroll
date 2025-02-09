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
        theme: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      theme: user.theme || "system",
    });
  } catch (error) {
    console.error("Failed to fetch theme preference:", error);
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
    const { theme } = body;

    if (!theme || !["light", "dark", "system"].includes(theme)) {
      return new NextResponse("Invalid theme value", { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        theme,
      },
    });

    return NextResponse.json({
      theme: user.theme,
    });
  } catch (error) {
    console.error("Failed to update theme preference:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
