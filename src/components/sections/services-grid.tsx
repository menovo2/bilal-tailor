import { Scissors, Shirt, Ruler, Sparkles, Crown } from "lucide-react";
import type { ComponentType } from "react";
import { services, whatsappLink, orderMessage } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  suit: Crown,
  safari: Sparkles,
  qamiis: Shirt,
  surwaal: Ruler,
  shaar: Scissors,
};

export function ServicesGrid({ withCta = false }: { withCta?: boolean }) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <SectionHeading
        eyebrow="Adeegyadeena"
        title="Farsamo la tolay si gaar ah"
        description="Shan adeeg oo aan ku takhasusnay, mid walbana lagu dhisay qiyaas sax ah iyo maro tayo sare leh."
      />

      <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = icons[service.icon] ?? Crown;
          return (
            <Reveal as="li" key={service.key} delay={i * 90}>
              <article className="card-luxe group h-full rounded-lg p-8">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-primary-foreground">
                  <Icon size={22} />
                </span>
                <h3 className="mt-7 text-2xl">{service.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {service.short}
                </p>
                {withCta ? (
                  <LuxeButton asChild variant="outline" size="sm" className="mt-7">
                    <a
                      href={whatsappLink(orderMessage(service.key))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dalbo
                    </a>
                  </LuxeButton>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
