import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay);
  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
