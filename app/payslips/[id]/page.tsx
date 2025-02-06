"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { payslipApi } from "@/lib/services/api";
import { showToast } from "@/components/ui/toast";
import { useFeatures } from "@/lib/config/features";
import { PayslipData } from "@/lib/types/payslip";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
import { PayslipPDF } from "@/components/PayslipPDF";
import { Badge } from "@/components/ui/badge";

export default function PayslipDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [payslip, setPayslip] = useState<PayslipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const { isEnabled } = useFeatures();

  useEffect(() => {
    // MVP: Payslip viewing is a core feature for employee compensation transparency
    if (!isEnabled("payslipView")) {
      router.push("/dashboard");
      return;
    }

    loadPayslip();
  }, [isEnabled, router, params.id]);

  const loadPayslip = async () => {
    // MVP: Payslip data loading is essential for employee compensation management
    if (!isEnabled("payslipView")) {
      router.push("/dashboard");
      return;
    }
    try {
      const response = await payslipApi.getPayslip(params.id);
      if (response.data) {
        setPayslip(response.data as PayslipData);
      } else if (response.error) {
        showToast.error("Failed to load payslip", {
          description: response.error,
        });
        router.push("/payslips");
      }
    } catch (error) {
      showToast.error("An unexpected error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      router.push("/payslips");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    // MVP: Payslip downloading is essential for employee record keeping
    if (!isEnabled("payslipView")) {
      return;
    }
    try {
      const response = await payslipApi.downloadPayslip(params.id);
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data || !(response.data instanceof ArrayBuffer)) {
        throw new Error("Invalid PDF data received");
      }

      // Create blob from response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${payslip?.period.replace("/", "-")}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast.success("Payslip downloaded successfully");
    } catch (error) {
      showToast.error("Failed to download payslip", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!payslip) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/payslips")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Payslip Details</h1>
        <div className="ml-auto space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period</span>
              <span className="font-medium">{payslip.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={payslip.status === "paid" ? "default" : "secondary"}
              >
                {payslip.status}
              </Badge>
            </div>
            {payslip.paidOn && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid On</span>
                <span className="font-medium">
                  {new Date(payslip.paidOn).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Salary</span>
              <span className="font-medium">
                {payslip.currency} {payslip.grossSalary.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-destructive">
                  - {payslip.currency} {payslip.deductions.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Health Insurance</span>
                <span className="text-destructive">
                  - {payslip.currency}{" "}
                  {payslip.deductions.healthInsurance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pension</span>
                <span className="text-destructive">
                  - {payslip.currency} {payslip.deductions.pension.toFixed(2)}
                </span>
              </div>
              {payslip.deductions.other && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Other Deductions
                  </span>
                  <span className="text-destructive">
                    - {payslip.currency} {payslip.deductions.other.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-medium">Net Salary</span>
              <span className="font-bold text-primary">
                {payslip.currency} {payslip.netSalary.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {showPreview && (
        <Card>
          <CardHeader>
            {/* MVP: Payslip preview is essential for employee verification before download */}
            <CardTitle>PDF Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[1/1.4142] w-full border">
              <PayslipPDF data={payslip} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
