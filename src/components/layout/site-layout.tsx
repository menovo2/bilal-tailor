import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsappFloat } from "@/components/ui/whatsapp-float";
import { SafeImage } from "@/components/ui/safe-image";
import { images } from "@/lib/site";


export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main className="animate-fade-in">{children}</main>
      <Footer />
      <WhatsappFloat />
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
    <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden sm:min-h-[62vh]">
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={image}
          fallbackSrc={images.hero}
          alt={title}
          className="animate-hero-zoom h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-0 bg-background/55" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-12 sm:px-8 sm:pt-36 sm:pb-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-shadow-luxe mt-5 max-w-3xl text-3xl leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="text-shadow-luxe mt-5 max-w-xl text-sm leading-relaxed text-foreground/85 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
