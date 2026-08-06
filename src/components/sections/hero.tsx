import { useEffect, useState } from "react";
import { images, site } from "@/lib/site";
import { SafeImage } from "@/components/ui/safe-image";

import { useContent, useLinks } from "@/lib/content-store";
import { LuxeButton } from "@/components/ui/luxe-button";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const [offset, setOffset] = useState(0);
  const { content } = useContent();
  const { waGeneral } = useLinks();

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden sm:min-h-[100svh]">
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translate3d(0, ${offset * 0.2}px, 0)` }}
        aria-hidden="true"
      >
        <SafeImage
          src={content.heroImage}
          fallbackSrc={images.hero}
          alt="Tailor-ka oo qiyaasaya jaakad suit gudaha dukaanka BILAL TAILOR"
          className="animate-hero-zoom h-full w-full object-cover object-center sm:h-[112%]"
        />

        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-0 bg-background/55" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-in">{content.heroEyebrow || site.tagline}</p>
          <h1 className="animate-fade-in text-shadow-luxe mt-5 text-3xl leading-[1.08] sm:text-6xl lg:text-7xl">
            {content.heroTitle} <span className="text-gold-gradient">{content.heroHighlight}</span>
          </h1>
          <div className="hairline mt-7 w-32" aria-hidden="true" />
          <p className="animate-fade-in text-shadow-luxe mt-7 max-w-xl text-sm leading-relaxed text-foreground/85 sm:text-base">
            {content.heroText}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <LuxeButton asChild size="lg">
              <a
                href={waGeneral()}
                target="_blank"
                rel="noreferrer"
              >
                Dalbo Hadda
              </a>
            </LuxeButton>
            <LuxeButton asChild variant="outline" size="lg">
              <Link to="/services">Daawo Adeegyadeena</Link>
            </LuxeButton>
          </div>
        </div>
      </div>
    </section>
  );
}
