import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { BatchPayslipPDF } from "./PayslipPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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

interface BatchPayslipDownloadProps {
  payslips: PayslipData[];
  period: string;
}

export function BatchPayslipDownload({
  payslips,
  period,
}: BatchPayslipDownloadProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStart = () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
  };

  const handleProgress = (percentage: number) => {
    setProgress(percentage);
  };

  const handleError = () => {
    setError("Failed to generate PDFs. Please try again.");
    setIsGenerating(false);
  };

  const handleSuccess = () => {
    setIsGenerating(false);
    setProgress(100);
    toast({
      title: "Success",
      description: `Generated ${payslips.length} payslips successfully.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleGenerateStart}>
          <Download className="mr-2 h-4 w-4" />
          Download All Payslips
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generating Payslips</DialogTitle>
        </DialogHeader>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">
              {isGenerating
                ? `Generating ${payslips.length} payslips...`
                : progress === 100
                ? "Generation complete!"
                : "Ready to generate payslips"}
            </p>
            <PDFDownloadLink
              document={<BatchPayslipPDF payslips={payslips} />}
              fileName={`payslips-${period
                .toLowerCase()
                .replace(/\s+/g, "-")}.pdf`}
            >
              {({ loading, error }) => {
                if (error) handleError();
                if (!loading && progress === 100) handleSuccess();
                return (
                  <Button className="w-full" disabled={loading || isGenerating}>
                    {loading || isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      "Download PDF"
                    )}
                  </Button>
                );
              }}
            </PDFDownloadLink>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
