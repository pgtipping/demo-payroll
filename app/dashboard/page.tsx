"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeatures } from "@/lib/config/features";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isEnabled } = useFeatures();

  // MVP: Quick actions for common tasks
  const quickActions = [
    {
      name: "View Payslips",
      icon: FileText,
      href: "/payslips",
      // MVP: Payslip viewing is a core feature for all users
      show: isEnabled("payslipView"),
    },
    {
      name: "Manage Employees",
      icon: Users,
      href: "/dashboard/employees",
      // MVP: Employee management is a core feature for admin users
      show: user?.role === "admin" && isEnabled("employeeManagement"),
    },
    {
      name: "Process Payroll",
      icon: Calculator,
      href: "/dashboard/payroll",
      // MVP: Payroll processing is a core feature for admin users
      show: user?.role === "admin" && isEnabled("payrollProcessing"),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {user ? `${user.firstName} ${user.lastName}` : "User"}
      </h1>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions
              .filter((action) => action.show)
              .map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push(action.href)}
                >
                  <action.icon className="h-6 w-6" />
                  {action.name}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - MVP: Basic activity tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your recent payroll activities will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const router = useRouter();

  const quickActions = [
    {
      title: "Manage Employees",
      description: "Add, edit, or view employee details",
      icon: Users,
      href: "/dashboard/employees",
    },
    {
      title: "Process Payroll",
      description: "Run payroll for the current period",
      icon: Calculator,
      href: "/dashboard/payroll",
    },
    {
      title: "View Payslips",
      description: "Access all employee payslips",
      icon: FileText,
      href: "/dashboard/payslips",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payroll
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mar 1, 2024</div>
            <p className="text-xs text-muted-foreground">In 15 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.title}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(action.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle>{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Payslip
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 2024</div>
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-xs text-muted-foreground"
              onClick={() => router.push("/dashboard/payslips")}
            >
              View Payslip →
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.56</div>
            <p className="text-xs text-muted-foreground">As of February 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payday</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mar 1, 2024</div>
            <p className="text-xs text-muted-foreground">In 15 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Payslip Generated</p>
                <p className="text-sm text-muted-foreground">
                  February 2024 payslip is ready
                </p>
              </div>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Profile Updated</p>
                <p className="text-sm text-muted-foreground">
                  Contact information changed
                </p>
              </div>
              <p className="text-sm text-muted-foreground">5 days ago</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/payslips")}
            >
              <FileText className="mr-2 h-4 w-4" />
              View All Payslips
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/settings")}
            >
              <Users className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
