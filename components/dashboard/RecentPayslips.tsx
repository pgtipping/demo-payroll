import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Payslip {
  id: string;
  employeeName: string;
  period: string;
  amount: number;
  status: string;
}

interface RecentPayslipsProps {
  payslips: Payslip[];
  isAdmin?: boolean;
}

export function RecentPayslips({
  payslips,
  isAdmin = false,
}: RecentPayslipsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isAdmin ? "Recent Payslips" : "Your Recent Payslips"}
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Latest processed payslips"
            : "Your latest payslip history"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payslips.length > 0 ? (
          <div className="space-y-4">
            {payslips.map((payslip) => (
              <div
                key={payslip.id}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
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
  );
}
