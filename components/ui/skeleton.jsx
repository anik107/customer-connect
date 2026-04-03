import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent dark:bg-[#8C9DB4]", className)}
      {...props} />)
  );
}

export { Skeleton }
