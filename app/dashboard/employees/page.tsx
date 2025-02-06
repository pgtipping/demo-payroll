"use client";

import React from "react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminApi, Employee } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
import { Badge } from "@/components/ui/badge";

export default function EmployeesPage() {
  const router = useRouter();
  const { isEnabled } = useFeatures();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // MVP: Employee management is a core feature for admin users
    if (!isEnabled("employeeManagement")) {
      router.push("/dashboard");
      return;
    }

    // MVP: Employee self-service access is a core feature for all users
    if (!isEnabled("employeeSelfService")) {
      router.push("/dashboard");
      return;
    }

    loadEmployees();
  }, [isEnabled, router]);

  // MVP: Employee management view is a core feature for admin users
  if (!isEnabled("employeeManagement")) {
    return null;
  }

  const loadEmployees = async () => {
    // MVP: Employee data retrieval is essential for workforce management
    if (!isEnabled("employeeManagement")) {
      router.push("/dashboard");
      return;
    }
    try {
      const response = await adminApi.getEmployees();
      if (response.data) {
        setEmployees(response.data);
      } else if (response.error) {
        showToast.error("Failed to load employees", {
          description: response.error,
        });
      }
    } catch (err) {
      showToast.error("An unexpected error occurred", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const columns = [
    {
      key: "firstName",
      title: "First Name",
    },
    {
      key: "lastName",
      title: "Last Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "role",
      title: "Role",
      render: (employee: Employee) => (
        <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
          {employee.role}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (employee: Employee) => (
        <Badge
          variant={employee.status === "active" ? "default" : "destructive"}
        >
          {employee.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* MVP: Employee listing and management interface is essential for workforce administration */}
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => router.push("/dashboard/employees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* MVP: Employee data table is essential for workforce overview and management */}
      <DataTable
        data={employees}
        columns={columns}
        isLoading={!employees.length}
        onRowClick={(employee) =>
          router.push(`/dashboard/employees/${employee.id}`)
        }
      />
    </div>
  );
}
