import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

interface EmployeeStatsProps {
  ytdEarnings: number;
  lastPayAmount: number;
  nextPayDate: string;
}

export function EmployeeStats({
  ytdEarnings,
  lastPayAmount,
  nextPayDate,
}: EmployeeStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">YTD Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${ytdEarnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total earnings this year
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${lastPayAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Last payroll amount</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Pay Date</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nextPayDate}</div>
          <p className="text-xs text-muted-foreground">Upcoming payment</p>
        </CardContent>
      </Card>
    </div>
  );
}
