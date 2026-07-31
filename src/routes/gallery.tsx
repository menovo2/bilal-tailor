import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { useContent } from "@/lib/content-store";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — BILAL TAILOR" },
      {
        name: "description",
        content:
          "Gallery-ga BILAL TAILOR: Suits, Safari, Qamiis, Surwaal iyo Shaar. Sawirada dhawaan waa la soo gelinayaa.",
      },
      { property: "og:title", content: "Gallery — BILAL TAILOR" },
      {
        property: "og:description",
        content: "Daawo qaybaha shaqadeena: Suits, Safari, Qamiis, Surwaal iyo Shaar.",
      },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { content } = useContent();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Gallery"
        title={content.galleryTitle}
        description={content.galleryText}
        image={content.galleryImage}
      />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
        <GalleryShowcase withFilter />
      </section>
    </SiteLayout>
  );
}
