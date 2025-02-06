import React from "react";
import {
  PDFDownloadLink as PDFDownload,
  PDFViewer as PDFView,
  PDFDownloadLinkProps,
  PDFViewerProps,
  DocumentProps,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface BlobProviderParams {
  blob: Blob | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

interface CustomPDFDownloadProps {
  document: React.ReactElement<DocumentProps>;
  fileName: string;
  onError?: (error: Error) => void;
}

interface CustomPDFViewerProps extends Omit<PDFViewerProps, "children"> {
  document: React.ReactElement<DocumentProps>;
  width?: string;
  height?: string;
  className?: string;
  onLoadSuccess?: () => void;
  onLoadError?: () => void;
}

export function CustomPDFDownload({
  document,
  fileName,
  onError,
}: CustomPDFDownloadProps) {
  const renderContent = React.useCallback(
    (props: BlobProviderParams) => {
      if (props.error && onError) {
        onError(props.error);
      }
      return (
        <Button disabled={props.loading}>
          {props.loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      );
    },
    [onError]
  );

  return (
    <PDFDownload document={document} fileName={fileName}>
      {renderContent as unknown as React.ReactNode}
    </PDFDownload>
  );
}

export function CustomPDFViewer({
  document,
  width,
  height,
  className,
  onLoadSuccess,
  onLoadError,
  ...props
}: CustomPDFViewerProps) {
  return (
    <PDFView style={{ width, height }} className={className} {...props}>
      {document}
    </PDFView>
  );
}
