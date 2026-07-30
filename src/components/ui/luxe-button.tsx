import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const luxeButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-[0.72rem] font-medium uppercase tracking-[0.24em] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "bg-gold text-primary-foreground shadow-luxe hover:brightness-110 hover:shadow-[0_0_38px_-8px_var(--gold)]",
        outline:
          "border border-gold/60 text-gold hover:border-gold hover:bg-gold hover:text-primary-foreground hover:shadow-[0_0_38px_-12px_var(--gold)]",
        ghost: "text-foreground/80 hover:text-gold",
        dark: "border border-gold/30 bg-surface text-foreground hover:border-gold hover:text-gold",
      },
      size: {
        sm: "h-9 px-5",
        md: "h-11 px-7",
        lg: "h-14 px-10 text-[0.78rem]",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export function LuxeButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof luxeButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(luxeButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { luxeButtonVariants };
