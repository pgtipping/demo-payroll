"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFeatures } from "@/lib/config/features";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface PayrollRun {
  id: string;
  period: string;
  totalEmployees: number;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export default function PayrollProcessingPage() {
  const router = useRouter();
  const { isEnabled } = useFeatures();
  const { toast } = useToast();
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!isEnabled("payrollProcessing")) {
      router.push("/admin");
      return;
    }

    fetchPayrollRuns();
  }, []);

  const fetchPayrollRuns = async () => {
    try {
      const response = await fetch("/api/admin/payroll/runs");
      if (!response.ok) throw new Error("Failed to fetch payroll runs");
      const data = await response.json();
      setPayrollRuns(data.runs);
    } catch (error) {
      console.error("Error fetching payroll runs:", error);
      toast({
        title: "Error",
        description: "Failed to load payroll runs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Error",
        description: "Please select both month and year.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/payroll/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
        }),
      });

      if (!response.ok) throw new Error("Failed to process payroll");

      toast({
        title: "Success",
        description: "Payroll processing started successfully.",
      });
      fetchPayrollRuns();
    } catch (error) {
      console.error("Error processing payroll:", error);
      toast({
        title: "Error",
        description: "Failed to process payroll. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReport = async (runId: string) => {
    try {
      const response = await fetch(`/api/admin/payroll/runs/${runId}/report`);
      if (!response.ok) throw new Error("Failed to download report");

      // Handle the report download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll-report-${runId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!isEnabled("payrollProcessing")) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Loading payroll data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Payroll Processing</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Payroll</CardTitle>
          <CardDescription>
            Process payroll for a specific month and year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = format(new Date(2024, i), "MMMM");
                      return (
                        <SelectItem key={month} value={String(i + 1)}>
                          {month}
                        </SelectItem>
                      );
                    })}
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
                    {[currentYear - 1, currentYear, currentYear + 1].map(
                      (year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>View past payroll runs and reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed On</TableHead>
                  <TableHead className="w-[100px]">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRuns.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No payroll runs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>{run.period}</TableCell>
                      <TableCell>{run.totalEmployees}</TableCell>
                      <TableCell>${run.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            run.status === "completed"
                              ? "default"
                              : run.status === "processing"
                              ? "secondary"
                              : run.status === "failed"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {run.completedAt
                          ? new Date(run.completedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {run.status === "completed" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDownloadReport(run.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Report
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            disabled
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            N/A
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
