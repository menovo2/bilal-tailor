import { useEffect, useState } from "react";
import { images, site, whatsappLink } from "@/lib/site";
import { LuxeButton } from "@/components/ui/luxe-button";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ transform: `translate3d(0, ${offset * 0.25}px, 0)` }}
        aria-hidden="true"
      >
        <img
          src={images.hero}
          alt="Jaakadaha suit-yada oo saaran raq gudaha dukaanka tolidda BILAL TAILOR"
          className="animate-hero-zoom h-[115%] w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-0 bg-background/45" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-24 sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-in">{site.tagline}</p>
          <h1 className="animate-fade-in mt-6 text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Luxury Tailoring for{" "}
            <span className="text-gold-gradient">Modern Gentlemen</span>
          </h1>
          <div className="hairline mt-8 w-32" aria-hidden="true" />
          <p className="animate-fade-in mt-8 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            BILAL TAILOR waa goobta ay ragga casriga ah ka helaan dhar la tolay si gaar ah — suit,
            safari, qamiis, surwaal iyo shaar. Qiyaas sax ah, maro tayada ugu sarreysa, iyo tolid
            gacan farsamo leh oo sharaf iyo kalsooni kuu soo kordhisa.
          </p>
          <div className="mt-11 flex flex-wrap items-center gap-4">
            <LuxeButton asChild size="lg">
              <a
                href={whatsappLink("Salaan, waxaan rabaa inaan dalbado adeeg tolid.")}
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
