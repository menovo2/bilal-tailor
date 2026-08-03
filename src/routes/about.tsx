import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { Reveal } from "@/components/ui/reveal";
import { MapSection } from "@/components/sections/map-section";
import { images } from "@/lib/site";
import { useContent } from "@/lib/content-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "xog kooban oo kuu saabsan BILAL TAILOR." },
      {
        name: "description",
        content:
          "BILAL TAILOR: Goob tolmo oo heer sare ah, taas oo saldhig u leh tayo, khibrad iyo qadarin macmiil..",
      },
      { property: "og:title", content: "xog kooban oo kuu saabsan BILAL TAILOR." },
      {
        property: "og:description",
        content: "Farsamo gacaneed, tayo aan lala tartami karin, adeeg shaqsi ah.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { content } = useContent();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={content.aboutEyebrow}
        title={content.aboutTitle}
        description={content.aboutText}
        image={content.aboutImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <p className="eyebrow">{content.aboutStoryEyebrow}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl">{content.aboutStoryTitle}</h2>
            <div className="hairline mt-3 w-24" aria-hidden="true" />
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.aboutStoryBody
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <img
              src={content.aboutImage || images.detail}
              alt={content.aboutTitle}
              loading="lazy"
              className="h-full max-h-96 w-full rounded-xl border border-gold/25 object-cover shadow-luxe"
            />
          </Reveal>
        </div>
      </section>

      <MapSection />
    </SiteLayout>
  );
}
