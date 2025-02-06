"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PayrollRun {
  id: string;
  month: number;
  year: number;
  processedAt: string;
  status: "COMPLETED" | "FAILED" | "PROCESSING";
  totalEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
}

type SortField = "period" | "status" | "processedAt" | "totalNetPay";
type SortOrder = "asc" | "desc";

export default function PayrollPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("processedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get current month and year for default values
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Generate month options
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate year options (current year and previous year)
  const years = [
    { value: currentYear.toString(), label: currentYear.toString() },
    {
      value: (currentYear - 1).toString(),
      label: (currentYear - 1).toString(),
    },
  ];

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  async function fetchPayrollRuns() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payroll/runs", {
        credentials: "include",
      });
      const data = await response.json();
      setPayrollRuns(data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch payroll runs",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRunPayroll() {
    if (!selectedMonth || !selectedYear) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both month and year",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch("/api/payroll/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payroll");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: `Processed payroll for ${data.processed} employees`,
      });

      // Refresh the payroll runs list
      fetchPayrollRuns();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process payroll",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  const filteredAndSortedRuns = payrollRuns
    .filter((run) => {
      if (!searchTerm) return true;
      const period = format(new Date(run.year, run.month - 1), "MMMM yyyy");
      return (
        period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      switch (sortField) {
        case "period":
          return (
            order *
            (new Date(a.year, a.month - 1).getTime() -
              new Date(b.year, b.month - 1).getTime())
          );
        case "status":
          return order * a.status.localeCompare(b.status);
        case "processedAt":
          return (
            order *
            (new Date(a.processedAt).getTime() -
              new Date(b.processedAt).getTime())
          );
        case "totalNetPay":
          return order * (a.totalNetPay - b.totalNetPay);
        default:
          return 0;
      }
    });

  if (user?.role !== "admin") {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payroll Processing</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Run Payroll</CardTitle>
            <CardDescription>
              Process payroll for all employees for the selected month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleRunPayroll}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Run Payroll"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Runs</CardTitle>
            <CardDescription>
              View recent payroll processing history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search by period or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("period")}
                      className="cursor-pointer"
                    >
                      Period <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("status")}
                      className="cursor-pointer"
                    >
                      Status <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("processedAt")}
                      className="cursor-pointer"
                    >
                      Processed <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("totalNetPay")}
                      className="cursor-pointer text-right"
                    >
                      Total Net <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        {format(new Date(run.year, run.month - 1), "MMMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            run.status === "COMPLETED"
                              ? "default"
                              : run.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(run.processedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        ${run.totalNetPay.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
