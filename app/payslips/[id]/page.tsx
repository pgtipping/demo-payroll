"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { PayslipPDF } from "@/components/PayslipPDF";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PayslipData {
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  deductions: {
    tax: number;
    healthInsurance: number;
    pension: number;
    other?: number;
  };
  netSalary: number;
  currency: string;
  generatedAt: Date;
}

interface BlobProviderParams {
  blob: Blob | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

export default function PaySlipPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Fetch payslip data
  useEffect(() => {
    async function fetchPayslip() {
      try {
        const response = await fetch(`/api/payslips/${params.id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch payslip");
        const data = await response.json();
        setPayslipData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load payslip data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPayslip();
  }, [params.id, toast]);

  const handlePreviewOpen = () => {
    setPreviewError(null);
    setIsPdfLoading(true);
    setPreviewOpen(true);
  };

  const handlePdfLoadSuccess = () => {
    setIsPdfLoading(false);
    setPreviewError(null);
  };

  const handlePdfLoadError = () => {
    setIsPdfLoading(false);
    setPreviewError(
      "Failed to load PDF preview. Please try downloading instead."
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!payslipData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Payslip not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/payslips">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{payslipData.period} Pay Slip</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pay Details</CardTitle>
            <div className="flex gap-2">
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handlePreviewOpen}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Payslip Preview</DialogTitle>
                  </DialogHeader>
                  {previewError ? (
                    <Alert variant="destructive">
                      <AlertDescription>{previewError}</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex-1 w-full h-full min-h-[80vh] relative">
                      {isPdfLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      )}
                      <PDFViewer
                        width="100%"
                        height="100%"
                        className="rounded-md"
                        onLoadSuccess={handlePdfLoadSuccess}
                        onLoadError={handlePdfLoadError}
                      >
                        <PayslipPDF data={payslipData} />
                      </PDFViewer>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <PDFDownloadLink
                document={<PayslipPDF data={payslipData} />}
                fileName={`payslip-${payslipData.period
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.pdf`}
              >
                {({ loading, error }) => (
                  <Button disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? "Generating PDF..." : "Download PDF"}
                    {error &&
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description:
                          "Failed to generate PDF. Please try again.",
                      })}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Earnings</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span>
                      {payslipData.currency}{" "}
                      {payslipData.grossSalary.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Deductions</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>
                      {payslipData.currency}{" "}
                      {payslipData.deductions.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Health Insurance
                    </span>
                    <span>
                      {payslipData.currency}{" "}
                      {payslipData.deductions.healthInsurance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pension</span>
                    <span>
                      {payslipData.currency}{" "}
                      {payslipData.deductions.pension.toFixed(2)}
                    </span>
                  </div>
                  {payslipData.deductions.other &&
                    payslipData.deductions.other > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Other Deductions
                        </span>
                        <span>
                          {payslipData.currency}{" "}
                          {payslipData.deductions.other.toFixed(2)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Gross Pay</span>
                <span className="font-semibold">
                  {payslipData.currency} {payslipData.grossSalary.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Deductions</span>
                <span className="font-semibold text-secondary">
                  -{payslipData.currency}{" "}
                  {(
                    payslipData.deductions.tax +
                    payslipData.deductions.healthInsurance +
                    payslipData.deductions.pension +
                    (payslipData.deductions.other || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t mt-2 pt-2">
                <span className="text-lg font-bold">Net Pay</span>
                <span className="text-lg font-bold text-primary">
                  {payslipData.currency} {payslipData.netSalary.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deduction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "Health Insurance",
                amount: payslipData.deductions.healthInsurance,
                startDate: "Jan 2024",
                endDate: "Dec 2024",
                progress: 70,
              },
              {
                type: "Pension",
                amount: payslipData.deductions.pension,
                startDate: "Jan 2024",
                endDate: "Dec 2024",
                progress: 70,
              },
            ].map((deduction) => (
              <div
                key={deduction.type}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{deduction.type}</div>
                  <Badge variant="outline">
                    {payslipData.currency}
                    {deduction.amount.toFixed(2)}/month
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {deduction.startDate} - {deduction.endDate}
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${deduction.progress}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {deduction.progress}% complete
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
