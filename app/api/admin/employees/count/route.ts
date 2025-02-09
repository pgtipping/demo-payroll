import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const count = await prisma.employee.count();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to get employee count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
