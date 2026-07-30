import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { images } from "@/lib/site";

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
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Gallery"
        title="Shaqadeena iyo Naqshadeena"
        description="Sawirada rasmiga ah dhawaan waa la soo gelinayaa. Dooro qayb oo dalbo hadda."
        image={images.measureLight}
      />
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <GalleryShowcase withFilter />
      </section>
    </SiteLayout>
  );
}
