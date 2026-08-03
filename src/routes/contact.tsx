import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { ContactSection } from "@/components/sections/contact-section";
import { MapSection } from "@/components/sections/map-section";
import { images } from "@/lib/site";
import { useContent } from "@/lib/content-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Nala Soo Xiriir — BILAL TAILOR" },
      {
        name: "description",
        content:
          "Nala soo xiriir BILAL TAILOR: taleefan, WhatsApp iyo iimayl. Sabti–Khamiis 8:00 AM – 9:00 PM.",
      },
      { property: "og:title", content: "Nala Soo Xiriir — BILAL TAILOR" },
      {
        property: "og:description",
        content: "Taleefan, WhatsApp, iimayl iyo saacadaha furitaanka.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { content } = useContent();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={content.contactEyebrow}
        title={content.contactTitle}
        description={content.contactText}
        image={content.contactImage || images.detail}
      />
      <ContactSection compact />
      <MapSection />
    </SiteLayout>
  );
}
