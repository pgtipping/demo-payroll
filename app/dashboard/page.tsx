"use client";

import { useEffect, useState } from "react";
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
import { LucideIcon } from "lucide-react";

interface Payslip {
  id: string;
  employeeName: string;
  period: string;
  amount: number;
  status: string;
}

interface QuickAction {
  name: string;
  icon: LucideIcon;
  href: string;
  show: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isEnabled } = useFeatures();

  // Render appropriate dashboard based on user role
  if (!user) {
    return null; // or loading state
  }

  return (
    <div className="container mx-auto p-6">
      {user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const { isEnabled } = useFeatures();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  const [recentPayslips, setRecentPayslips] = useState<Payslip[]>([]);

  useEffect(() => {
    // MVP: Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const [employeesRes, payrollRes, payslipsRes] = await Promise.all([
          fetch("/api/admin/employees/count"),
          fetch("/api/admin/payroll/monthly-total"),
          fetch("/api/admin/payslips/recent"),
        ]);

        if (employeesRes.ok) {
          const { count } = await employeesRes.json();
          setEmployeeCount(count);
        }

        if (payrollRes.ok) {
          const { total } = await payrollRes.json();
          setMonthlyPayroll(total);
        }

        if (payslipsRes.ok) {
          const { payslips } = await payslipsRes.json();
          setRecentPayslips(payslips);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // MVP: Quick actions for common tasks
  const quickActions: QuickAction[] = [
    {
      name: "View Payslips",
      icon: FileText,
      href: "/payslips",
      show: isEnabled("payslipView"),
    },
    {
      name: "Manage Employees",
      icon: Users,
      href: "/dashboard/employees",
      show: isEnabled("employeeManagement"),
    },
    {
      name: "Process Payroll",
      icon: Calculator,
      href: "/dashboard/payroll",
      show: isEnabled("payrollProcessing"),
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
            <div className="text-2xl font-bold">{employeeCount}</div>
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
            <div className="text-2xl font-bold">
              ${monthlyPayroll.toFixed(2)}
            </div>
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
              key={action.name}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(action.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle>{action.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.name}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Payslips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payslips</CardTitle>
          <CardDescription>Latest processed payslips</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPayslips.length > 0 ? (
            <div className="space-y-4">
              {recentPayslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/payslips/${payslip.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{payslip.employeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {payslip.period}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payslip.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {payslip.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent payslips found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmployeeDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [recentPayslips, setRecentPayslips] = useState<Payslip[]>([]);
  const [ytdEarnings, setYtdEarnings] = useState(0);

  useEffect(() => {
    // MVP: Fetch employee dashboard data
    const fetchDashboardData = async () => {
      try {
        const [payslipsRes, earningsRes] = await Promise.all([
          fetch("/api/payslips/recent"),
          fetch("/api/employee/ytd-earnings"),
        ]);

        if (payslipsRes.ok) {
          const { payslips } = await payslipsRes.json();
          setRecentPayslips(payslips);
        }

        if (earningsRes.ok) {
          const { total } = await earningsRes.json();
          setYtdEarnings(total);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

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
            <div className="text-2xl font-bold">${ytdEarnings.toFixed(2)}</div>
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
