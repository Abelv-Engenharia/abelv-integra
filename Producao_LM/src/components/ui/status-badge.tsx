import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        elaboracao: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
        revisao: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
        aprovado: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
        obsoleto: "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100",
        default: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  );
}

export { StatusBadge, statusBadgeVariants };