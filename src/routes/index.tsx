import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/site-layout";
import { Hero } from "@/components/sections/hero";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { BookingSection } from "@/components/sections/booking-section";
import { FaqSection } from "@/components/sections/faq-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BILAL TAILOR — Luxury Tailoring for MEN." },
      {
        name: "description",
        content:
          "Tolidda dharka Ragga : suit, safari, qamiis, surwaal iyo shaar oo qiyaas gaar ah lagu tolay. Dalbo hadda WhatsApp.",
      },
      { property: "og:title", content: "BILAL TAILOR — Luxury Tailoring for MEN." },
      {
        property: "og:description",
        content: "Tolidda dharka Ragga: suit, safari, qamiis, surwaal iyo shaar oo qiyaas gaar ah lagu tolay. Dalbo hadda WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-14">
        <SectionHeading eyebrow="Sawirrada" title="Dharka" />
        <div className="mt-8">
          <GalleryShowcase />
        </div>
        <div className="mt-10 flex justify-center">
          <LuxeButton asChild variant="outline" size="lg">
            <Link to="/gallery">Daawo Sawirrada Dharka oo Dhan</Link>
          </LuxeButton>
        </div>
      </section>

      <BookingSection />
      <FaqSection />
    </SiteLayout>
  );
}
