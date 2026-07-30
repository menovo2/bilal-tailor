import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
}

/** Compact hero used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="animate-hero-zoom h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-0 bg-background/45" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8">

        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
