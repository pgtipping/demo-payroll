import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Settings, Calculator } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useFeatures } from "@/lib/config/features";
import type { FeatureFlag } from "@/lib/config/features";

interface QuickAction {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  show: boolean;
}

export function QuickActions({ isAdmin = false }) {
  const router = useRouter();
  const { isEnabled } = useFeatures();

  const employeeActions: QuickAction[] = [
    {
      name: "View Payslips",
      description: "Access your payslip history",
      icon: FileText,
      href: "/payslips",
      show: isEnabled("payslipView"),
    },
    {
      name: "Profile Settings",
      description: "Update your personal information",
      icon: User,
      href: "/profile",
      show: isEnabled("employeeManagement"),
    },
    {
      name: "Financial Tools",
      description: "Access financial planning tools",
      icon: Calculator,
      href: "/financial-tools",
      show: false, // Not an MVP feature
    },
  ];

  const adminActions: QuickAction[] = [
    {
      name: "Process Payroll",
      description: "Run payroll for all employees",
      icon: Calculator,
      href: "/dashboard/payroll",
      show: isEnabled("payrollProcessing"),
    },
    {
      name: "Manage Employees",
      description: "View and manage employee records",
      icon: User,
      href: "/dashboard/employees",
      show: isEnabled("employeeManagement"),
    },
    {
      name: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      href: "/settings",
      show: isEnabled("employeeManagement"), // Using employee management as proxy for admin features
    },
  ];

  const actions = isAdmin ? adminActions : employeeActions;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions
        .filter((action) => action.show)
        .map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.name}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(action.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-base">{action.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
