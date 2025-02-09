import { NextRequest, NextResponse } from "next/server";
import { TEST_EMPLOYEES } from "../route";

// MVP: Employee data update endpoint is essential for workforce management
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, role, status } = data;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In development, update test employee
    if (process.env.NODE_ENV === "development") {
      const employeeIndex = TEST_EMPLOYEES.findIndex(
        (emp) => emp.id === params.id
      );

      if (employeeIndex === -1) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      TEST_EMPLOYEES[employeeIndex] = {
        ...TEST_EMPLOYEES[employeeIndex],
        firstName,
        lastName,
        email,
        role,
        status,
      };

      return NextResponse.json(TEST_EMPLOYEES[employeeIndex]);
    }

    // In production, call backend API
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/employees/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// MVP: Employee deletion endpoint is essential for workforce management
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In development, remove from test employees
    if (process.env.NODE_ENV === "development") {
      const employeeIndex = TEST_EMPLOYEES.findIndex(
        (emp) => emp.id === params.id
      );

      if (employeeIndex === -1) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      TEST_EMPLOYEES.splice(employeeIndex, 1);
      return NextResponse.json({ success: true });
    }

    // In production, call backend API
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/employees/${params.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
