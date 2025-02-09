"use client";

import React from "react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UserX, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminApi, Employee } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EmployeesPage() {
  const router = useRouter();
  const { isEnabled } = useFeatures();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedEmployeesForAction, setSelectedEmployeesForAction] = useState<
    Employee[]
  >([]);
  const [bulkAction, setBulkAction] = useState<
    "delete" | "deactivate" | "activate" | null
  >(null);

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

  const handleBulkAction = async () => {
    if (!bulkAction || !selectedEmployeesForAction.length) return;

    try {
      let successMessage = "";
      switch (bulkAction) {
        case "delete":
          await Promise.all(
            selectedEmployeesForAction.map((employee) =>
              adminApi.deleteEmployee(employee.id)
            )
          );
          successMessage = "Successfully deleted selected employees";
          break;
        case "deactivate":
          await Promise.all(
            selectedEmployeesForAction.map((employee) =>
              adminApi.updateEmployee(employee.id, {
                ...employee,
                status: "inactive",
              })
            )
          );
          successMessage = "Successfully deactivated selected employees";
          break;
        case "activate":
          await Promise.all(
            selectedEmployeesForAction.map((employee) =>
              adminApi.updateEmployee(employee.id, {
                ...employee,
                status: "active",
              })
            )
          );
          successMessage = "Successfully activated selected employees";
          break;
      }

      showToast.success(successMessage);
      loadEmployees();
    } catch (err) {
      showToast.error("Failed to perform bulk action", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsConfirmDialogOpen(false);
      setBulkAction(null);
      setSelectedEmployeesForAction([]);
    }
  };

  const columns = [
    {
      key: "firstName",
      title: "First Name",
      filterable: true,
    },
    {
      key: "lastName",
      title: "Last Name",
      filterable: true,
    },
    {
      key: "email",
      title: "Email",
      filterable: true,
    },
    {
      key: "role",
      title: "Role",
      filterable: true,
      render: (employee: Employee) => (
        <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
          {employee.role}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      filterable: true,
      render: (employee: Employee) => (
        <Badge
          variant={employee.status === "active" ? "default" : "destructive"}
        >
          {employee.status}
        </Badge>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Delete Selected",
      action: (selected: Employee[]) => {
        setSelectedEmployeesForAction(selected);
        setBulkAction("delete");
        setIsConfirmDialogOpen(true);
      },
    },
    {
      label: "Deactivate Selected",
      action: (selected: Employee[]) => {
        setSelectedEmployeesForAction(selected);
        setBulkAction("deactivate");
        setIsConfirmDialogOpen(true);
      },
    },
    {
      label: "Activate Selected",
      action: (selected: Employee[]) => {
        setSelectedEmployeesForAction(selected);
        setBulkAction("activate");
        setIsConfirmDialogOpen(true);
      },
    },
  ];

  const getConfirmationContent = () => {
    if (!bulkAction || !selectedEmployeesForAction.length) return null;

    const actionMap = {
      delete: {
        title: "Delete Employees",
        description:
          "Are you sure you want to delete the selected employees? This action cannot be undone.",
        icon: Trash2,
      },
      deactivate: {
        title: "Deactivate Employees",
        description:
          "Are you sure you want to deactivate the selected employees?",
        icon: UserX,
      },
      activate: {
        title: "Activate Employees",
        description:
          "Are you sure you want to activate the selected employees?",
        icon: UserCheck,
      },
    };

    const content = actionMap[bulkAction];
    const Icon = content.icon;

    return {
      title: content.title,
      description: content.description,
      icon: <Icon className="h-6 w-6 text-destructive" />,
    };
  };

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
        bulkActions={bulkActions}
      />

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getConfirmationContent()?.icon}
              {getConfirmationContent()?.title}
            </DialogTitle>
            <DialogDescription>
              {getConfirmationContent()?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setBulkAction(null);
                setSelectedEmployeesForAction([]);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
