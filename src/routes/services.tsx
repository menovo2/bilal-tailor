import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { Reveal } from "@/components/ui/reveal";
import { LuxeButton } from "@/components/ui/luxe-button";
import { images, services } from "@/lib/site";
import { useLinks } from "@/lib/content-store";
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
  const { waOrder } = useLinks();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Adeegyada"
        title="Shan adeeg, hal heer tayo"
        description="Adeeg walba wuxuu ku bilaabmaa qiyaas sax ah wuxuuna ku dhammaadaa dhar aad ku faanto."
        image={images.measure}
      />

      <div className="mx-auto max-w-7xl space-y-24 px-5 py-24 sm:px-8 lg:space-y-32 lg:py-32">
        {services.map((service, i) => (
          <Reveal key={service.key}>
            <article
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="placeholder-luxe grid aspect-4/3 place-items-center rounded-xl border border-gold/25 shadow-luxe">
                <span className="relative z-10 text-center">
                  <span className="block font-display text-4xl text-gold-soft">Coming Soon</span>
                  <span className="mt-3 block text-[0.6rem] tracking-[0.42em] text-muted-foreground uppercase">
                    {service.title}
                  </span>
                </span>
              </div>
              <div>
                <p className="eyebrow">Adeeg {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-5 text-3xl sm:text-4xl">{service.title}</h2>
                <div className="hairline mt-6 w-24" aria-hidden="true" />
                <p className="mt-7 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {service.long}
                </p>
                <LuxeButton asChild size="lg" className="mt-9">
                  <a
                    href={waOrder(service.key)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dalbo
                  </a>
                </LuxeButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SiteLayout>
  );
}
