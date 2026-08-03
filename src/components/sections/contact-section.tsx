import { Clock, Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { useContent, useLinks } from "@/lib/content-store";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";

/** Contact block — used on the Home page and the Contact page. */
export function ContactSection({ compact = false }: { compact?: boolean }) {
  const { content } = useContent();
  const { waGeneral } = useLinks();

  const cards = [
    { icon: Phone, label: "Taleefan", value: content.phone, href: `tel:${content.phone}` },
    { icon: MessageCircle, label: "WhatsApp", value: content.phone, href: waGeneral() },
    { icon: Mail, label: "Iimayl", value: content.email, href: `mailto:${content.email}` },
    content.facebook
      ? { icon: Facebook, label: "Facebook", value: content.brandName, href: content.facebook }
      : null,
    content.instagram
      ? { icon: Instagram, label: "Instagram", value: content.brandName, href: content.instagram }
      : null,
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:py-12">
      {compact ? null : (
        <SectionHeading
          eyebrow={content.contactEyebrow}
          title={content.contactTitle}
          description={content.contactText}
        />
      )}

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal as="li" key={c.label} delay={i * 60}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="card-luxe flex h-full items-center gap-4 rounded-lg p-4 sm:p-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                <c.icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="eyebrow block">{c.label}</span>
                <span className="mt-1 block truncate font-display text-lg text-foreground">
                  {c.value}
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-4" delay={100}>
        <div className="card-luxe rounded-lg p-4 sm:p-6">
          <span className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
              <Clock size={18} />
            </span>
            <span className="eyebrow">{content.contactHoursLabel}</span>
          </span>
          <ul className="mt-3 divide-y divide-gold/10">
            {content.hours.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-4 py-2.5">
                <span className="min-w-0 text-sm text-muted-foreground">{h.days}</span>
                <span className="shrink-0 font-display text-base text-gold-soft">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="mt-6 text-center" delay={140}>
        <h2 className="text-2xl sm:text-3xl">{content.contactCtaTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {content.contactCtaText}
        </p>
        <LuxeButton asChild size="lg" className="mt-4">
          <a href={waGeneral()} target="_blank" rel="noreferrer">
            {content.contactCtaButton}
          </a>
        </LuxeButton>
      </Reveal>
    </section>
  );
}
