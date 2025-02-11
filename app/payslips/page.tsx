"use client";

import { useEffect, useState } from "react";
import { useFeatures } from "@/lib/config/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePayslipPDF } from "@/lib/utils/pdf";

interface Payslip {
  id: string;
  month: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: string;
  paidOn: string;
}

interface YTDSummary {
  totalEarnings: number;
  totalDeductions: number;
  netIncome: number;
}

// MVP: Basic payslip viewing functionality for employees
export default function PayslipsPage() {
  const { isEnabled } = useFeatures();
  const { toast } = useToast();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [ytdSummary, setYtdSummary] = useState<YTDSummary>({
    totalEarnings: 0,
    totalDeductions: 0,
    netIncome: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const response = await fetch("/api/payslips");
        if (!response.ok) {
          throw new Error("Failed to fetch payslips");
        }
        const data = await response.json();
        setPayslips(data.payslips);
        setYtdSummary(data.ytdSummary);
      } catch (error) {
        console.error("Error fetching payslips:", error);
        toast({
          title: "Error",
          description: "Failed to load payslips. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isEnabled("payslipView")) {
      fetchPayslips();
    } else {
      setIsLoading(false);
    }
  }, [isEnabled, toast]);

  // MVP: Only show if payslip viewing is enabled
  if (!isEnabled("payslipView")) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          Payslip viewing is not available.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      toast({
        title: "Download Started",
        description: "Your payslips are being prepared for download.",
      });

      // Generate PDFs for all payslips
      const pdfs = await Promise.all(
        payslips.map(async (payslip) => {
          const response = await fetch(`/api/payslips/${payslip.id}`);
          if (!response.ok)
            throw new Error(`Failed to fetch payslip ${payslip.id}`);
          const data = await response.json();
          return generatePayslipPDF(data);
        })
      );

      // Combine PDFs and download
      const blob = new Blob(pdfs, { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `payslips-${new Date().toISOString().split("T")[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Your payslips have been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading payslips:", error);
      toast({
        title: "Error",
        description: "Failed to download payslips. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pay Slips</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isDownloading ? "Downloading..." : "Download All"}
          </Button>
        </div>
      </div>

      {/* MVP: Basic payslip list view */}
      <Card>
        <CardHeader>
          <CardTitle>All Pay Slips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payslips.length > 0 ? (
              payslips.map((payslip) => (
                <Link
                  key={payslip.id}
                  href={`/payslips/${payslip.id}`}
                  className="block"
                >
                  <div className="flex flex-col gap-4 rounded-lg border p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{payslip.month}</span>
                        <Badge variant="outline">{payslip.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Paid on {new Date(payslip.paidOn).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-row-reverse">
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Gross Pay:
                          </span>
                          <span className="font-medium">
                            ${payslip.grossPay.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Deductions:
                          </span>
                          <span className="font-medium text-secondary">
                            -${payslip.deductions.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Net Pay:</span>
                          <span className="font-bold text-primary">
                            ${payslip.netPay.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No payslips found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MVP: Basic year-to-date summary */}
      <Card>
        <CardHeader>
          <CardTitle>Year-to-Date Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Total Earnings
              </div>
              <div className="text-2xl font-bold">
                ${ytdSummary.totalEarnings.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Total Deductions
              </div>
              <div className="text-2xl font-bold text-secondary">
                ${ytdSummary.totalDeductions.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Net Income</div>
              <div className="text-2xl font-bold text-primary">
                ${ytdSummary.netIncome.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
