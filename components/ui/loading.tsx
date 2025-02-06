import { Loader2 } from "lucide-react";

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
