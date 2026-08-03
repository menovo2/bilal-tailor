import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { Reveal } from "@/components/ui/reveal";
import { LuxeButton } from "@/components/ui/luxe-button";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { images } from "@/lib/site";
import { useContent, useLinks } from "@/lib/content-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Adeegyada — BILAL TAILOR" },
      {
        name: "description",
        content:
          "Adeegyada BILAL TAILOR: Suit, Safari, Qamiis, Surwaal iyo Shaar oo qiyaas gaar ah lagu tolay. Dalbo hadda.",
      },
      { property: "og:title", content: "Adeegyada — BILAL TAILOR" },
      {
        property: "og:description",
        content: "Suit, Safari, Qamiis, Surwaal iyo Shaar oo tayo sare leh.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { waOrder, content } = useLinks();
  const { content: c } = useContent();

  return (
    <SiteLayout>
      <PageHero
        eyebrow={content.servicesEyebrow}
        title={content.servicesTitle}
        description={content.servicesText}
        image={content.servicesImage || images.measure}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-8 lg:space-y-12 lg:py-12">
        {content.services.map((service, i) => (
          <Reveal key={service.id}>
            <article
              className={cn(
                "grid items-center gap-5 lg:grid-cols-2 lg:gap-10",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="relative overflow-hidden rounded-xl border border-gold/25 shadow-luxe">
                <img
                  src={c.comingSoonImage || images.comingSoon}
                  alt={`${service.title} — ${c.comingSoonLabel}`}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background via-background/70 to-transparent p-3 text-center">
                  <span className="block text-[0.58rem] tracking-[0.34em] text-gold uppercase">
                    {service.title}
                  </span>
                </span>
              </div>
              <div className="min-w-0">
                <p className="eyebrow">
                  {content.servicesEyebrow} {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl">{service.title}</h2>
                <div className="hairline mt-3 w-20" aria-hidden="true" />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {service.long || service.short}
                </p>
                <LuxeButton asChild size="lg" className="mt-5">
                  <a href={waOrder(service.key)} target="_blank" rel="noreferrer">
                    {content.serviceOrderCta}
                  </a>
                </LuxeButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Gallery lives inside Services as well */}
      <section
        id="gallery"
        className="border-t border-gold/15 bg-surface/20 px-4 py-10 sm:px-8 lg:py-12"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={content.galleryEyebrow}
            title={content.galleryTitle}
            description={content.galleryText}
          />
          <div className="mt-5">
            <GalleryShowcase withFilter limitPerCategory={10} />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
