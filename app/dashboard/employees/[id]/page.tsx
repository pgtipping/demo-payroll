"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PageLoading } from "@/components/ui/loading";
import { toast } from "sonner";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "employee";
  status: "active" | "inactive";
}

export default function EmployeeFormPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === "new";
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
    status: "active",
  });

  const router = useRouter();
  const { isEnabled } = useFeatures();

  useEffect(() => {
    // MVP: Employee detail view is a core feature for employee management
    if (!isEnabled("employeeManagement")) {
      router.push("/dashboard");
      return;
    }

    if (!isNew) {
      loadEmployee();
    }
  }, [params.id]);

  const loadEmployee = async () => {
    // MVP: Employee data retrieval is essential for workforce management
    if (!isEnabled("employeeManagement")) {
      router.push("/dashboard");
      return;
    }
    try {
      const response = await adminApi.getEmployees();
      const employees = response.data as any[];
      const employee = employees.find((e) => e.id === params.id);

      if (employee) {
        setFormData({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          status: employee.status,
        });
      } else {
        showToast.error("Employee not found");
        router.push("/dashboard/employees");
      }
    } catch (error) {
      showToast.error("Failed to load employee");
      router.push("/dashboard/employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // MVP: Employee data modification is essential for workforce records management
    if (!isEnabled("employeeManagement")) {
      router.push("/dashboard");
      return;
    }
    setIsSaving(true);

    try {
      const response = isNew
        ? await adminApi.createEmployee(formData)
        : await adminApi.updateEmployee(params.id, formData);

      if (response.error) {
        throw new Error(response.error);
      }

      showToast.success(
        isNew
          ? "Employee created successfully"
          : "Employee updated successfully"
      );
      router.push("/dashboard/employees");
    } catch (error) {
      showToast.error(
        isNew ? "Failed to create employee" : "Failed to update employee",
        {
          description: error instanceof Error ? error.message : undefined,
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // MVP: Employee detail view is restricted to admin users
  if (!isEnabled("employeeManagement")) {
    return null;
  }

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/employees")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isNew ? "Add Employee" : "Edit Employee"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          {/* MVP: Employee details form is essential for workforce data management */}
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* MVP: Employee data modification form is essential for workforce management */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: value as "admin" | "employee",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  toast.custom((t) => (
                    <div className="flex flex-col gap-2 rounded-lg border bg-background p-4 shadow-lg">
                      <div className="text-lg font-semibold">
                        Delete Employee
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Are you sure you want to delete this employee?
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.dismiss(t)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await adminApi.deleteEmployee(
                                params.id
                              );
                              if (response.error) {
                                throw new Error(response.error);
                              }
                              toast.success("Employee deleted successfully");
                              router.push("/dashboard/employees");
                            } catch (error) {
                              toast.error("Failed to delete employee", {
                                description:
                                  error instanceof Error
                                    ? error.message
                                    : undefined,
                              });
                            }
                            toast.dismiss(t);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ));
                }}
              >
                Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/employees")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isNew ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
