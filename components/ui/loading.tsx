import { Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";

interface LoadingProps {
  size?: number;
  className?: string;
  text?: string;
}

export function Loading({ size = 24, className = "", text }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="h-[50vh] flex items-center justify-center">
      <Loading size={32} text="Loading..." />
    </div>
  );
}

export function ButtonLoading() {
  return <Loading size={16} />;
}

export const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
);

export const ContentLoader = () => (
  <div className="space-y-4 w-full">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
