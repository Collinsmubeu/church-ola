import * as React from "react";
import { cn } from "@/lib/utils";

function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 text-sm [&>svg~p]:translate-y-[-3px]",
        variant === "destructive"
          ? "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
          : "border-border bg-card",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm leading-relaxed [&+div]:mt-2", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription };