"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFeatures } from "@/lib/config/features";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface PayslipDetail {
  id: string;
  month: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  grossPay: number;
  deductions: {
    name: string;
    amount: number;
  }[];
  netPay: number;
  status: string;
  paidOn: string;
}

export default function PayslipDetailPage() {
  const { isEnabled } = useFeatures();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [payslip, setPayslip] = useState<PayslipDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayslipDetails = async () => {
      try {
        const response = await fetch(`/api/payslips/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payslip details");
        }
        const data = await response.json();
        setPayslip(data);
      } catch (error) {
        console.error("Error fetching payslip details:", error);
        toast({
          title: "Error",
          description:
            "Failed to load payslip details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isEnabled("payslipView")) {
      fetchPayslipDetails();
    } else {
      setIsLoading(false);
    }
  }, [isEnabled, params.id, toast]);

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
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Loading payslip details...</p>
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Payslip not found.</p>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      // MVP: Basic download functionality
      toast({
        title: "Download Started",
        description: "Your payslip is being prepared for download.",
      });
      // TODO: Implement actual download functionality
    } catch (error) {
      console.error("Error downloading payslip:", error);
      toast({
        title: "Error",
        description: "Failed to download payslip. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back to Payslips
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{payslip.month}</CardTitle>
              <CardDescription>Payslip Details</CardDescription>
            </div>
            <Badge variant="outline">{payslip.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Employee Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{payslip.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{payslip.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{payslip.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{payslip.position}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Earnings & Deductions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Earnings & Deductions</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Gross Pay</span>
                <span className="font-medium">
                  ${payslip.grossPay.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Deductions</p>
                {payslip.deductions.map((deduction, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{deduction.name}</span>
                    <span className="text-secondary">
                      -${deduction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Net Pay</span>
                <span className="font-bold text-primary">
                  ${payslip.netPay.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-medium">
                  {new Date(payslip.paidOn).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">Direct Deposit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
