import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// MVP: Basic employee data for testing
export const TEST_EMPLOYEES = [
  {
    id: "emp001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@test.com",
    role: "employee",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "emp002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@test.com",
    role: "employee",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@test.com",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

// MVP: Get all employees
export async function GET(request: NextRequest) {
  try {
    // MVP: In development, return test data
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(TEST_EMPLOYEES);
    }

    // Production: This would fetch from the backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/employees`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// MVP: Create new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // MVP: In development, create test employee
    if (process.env.NODE_ENV === "development") {
      const newEmployee = {
        id: `emp${Date.now()}`,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: body.role || "employee",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      // In a real app, we would save to a database
      TEST_EMPLOYEES.push(newEmployee);
      return NextResponse.json(newEmployee);
    }

    // Production: This would create in the backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to create employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
