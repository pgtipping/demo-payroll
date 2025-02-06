import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BatchPayslipPDF } from "./PayslipPDF";
import { useToast } from "@/components/ui/use-toast";
import { CustomPDFDownload } from "./PDFComponents";
import { useFeatures } from "@/lib/config/features";
import { PayslipData, BatchPayslipDownloadProps } from "@/lib/types/payslip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function BatchPayslipDownload({
  payslips,
  period,
}: BatchPayslipDownloadProps) {
  const { toast } = useToast();
  const { isEnabled } = useFeatures();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // MVP: Batch payslip generation is a core feature for efficient payroll management
  if (!isEnabled("payslipView")) {
    return null;
  }

  const handleGenerateStart = () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
  };

  const handleProgress = (percentage: number) => {
    setProgress(percentage);
  };

  const handleError = (error: Error) => {
    setError("Failed to generate PDFs. Please try again.");
    setIsGenerating(false);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to generate batch PDF. Please try again.",
    });
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
            <CustomPDFDownload
              document={<BatchPayslipPDF payslips={payslips} />}
              fileName={`payslips-${period
                .toLowerCase()
                .replace(/\s+/g, "-")}.pdf`}
              onError={handleError}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
