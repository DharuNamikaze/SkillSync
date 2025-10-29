import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-base bg-secondary-background border-2 border-border",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
