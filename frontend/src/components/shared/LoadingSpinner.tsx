import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  size = "md",
  label,
  className,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}) {
  const sizes = { sm: "size-4", md: "size-6", lg: "size-8" };
  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
      <Loader2 className={cn(sizes[size], "animate-spin text-primary")} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
