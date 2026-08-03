import { Scissors, Shirt, Ruler, Sparkles, Crown } from "lucide-react";
import type { ComponentType } from "react";
import { useContent, useLinks } from "@/lib/content-store";
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
  const { waOrder } = useLinks();
  const { content } = useContent();
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:py-12">
      <SectionHeading
        eyebrow={content.servicesEyebrow}
        title={content.servicesTitle}
        description={content.servicesText}
      />

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.services.map((service, i) => {
          const Icon = icons[service.icon] ?? Crown;
          return (
            <Reveal as="li" key={service.id} delay={i * 70}>
              <article className="card-luxe group h-full rounded-lg p-5 sm:p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-primary-foreground">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-xl sm:text-2xl">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.short}
                </p>
                {withCta ? (
                  <LuxeButton asChild variant="outline" size="sm" className="mt-4">
                    <a href={waOrder(service.key)} target="_blank" rel="noreferrer">
                      {content.serviceOrderCta}
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
