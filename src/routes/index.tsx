import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/site-layout";
import { Hero } from "@/components/sections/hero";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { BookingSection } from "@/components/sections/booking-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";
import { MapSection } from "@/components/sections/map-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";
import { useContent } from "@/lib/content-store";

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
        content:
          "Tolidda dharka Ragga: suit, safari, qamiis, surwaal iyo shaar oo qiyaas gaar ah lagu tolay. Dalbo hadda WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { content } = useContent();
  return (
    <SiteLayout>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-10">
        <SectionHeading eyebrow={content.homeGalleryEyebrow} title={content.homeGalleryTitle} />
        <div className="mt-4">
          <GalleryShowcase limitPerCategory={8} />
        </div>
        <div className="mt-6 flex justify-center">
          <LuxeButton asChild variant="outline" size="lg">
            <Link to="/gallery">{content.homeGalleryCta}</Link>
          </LuxeButton>
        </div>
      </section>

      <BookingSection />
      <FaqSection />
      <ContactSection />
      <MapSection />
    </SiteLayout>
  );
}
