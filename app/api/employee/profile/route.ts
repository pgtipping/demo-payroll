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

    // Get employee profile data
    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Format response
    const profileData = {
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      email: employee.user.email,
      status: employee.user.status,
      employeeId: employee.id,
      department: "Engineering", // TODO: Add department to employee model
      position: "Software Engineer", // TODO: Add position to employee model
      joinDate: employee.createdAt.toISOString(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Failed to fetch employee profile:", error);
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
    const { firstName, lastName, email, phone, address } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update user data
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    // Update employee data
    const employee = await prisma.employee.update({
      where: {
        userId: session.user.id,
      },
      data: {
        department: body.department,
        position: body.position,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
    });

    // Format response
    const profileData = {
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      email: employee.user.email,
      status: employee.user.status,
      employeeId: employee.id,
      department: employee.department || "N/A",
      position: employee.position || "N/A",
      joinDate: employee.createdAt.toISOString(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Failed to update employee profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
