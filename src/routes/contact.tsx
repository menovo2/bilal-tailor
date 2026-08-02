import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { Reveal } from "@/components/ui/reveal";
import { LuxeButton } from "@/components/ui/luxe-button";
import { images, site } from "@/lib/site";
import { useContent, useLinks } from "@/lib/content-store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Nala Soo Xiriir — BILAL TAILOR" },
      {
        name: "description",
        content:
          "Nala soo xiriir BILAL TAILOR: taleefan +251940744442, WhatsApp, iimayl Billaalyare88@gmail.com. Sabti–Khamiis 8:00 AM – 9:00 PM.",
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
  const { waGeneral } = useLinks();
  const cards = [
    { icon: Phone, label: "Taleefan", value: content.phone, href: `tel:${content.phone}` },
    { icon: MessageCircle, label: "WhatsApp", value: content.phone, href: waGeneral() },
    { icon: Mail, label: "Iimayl", value: content.email, href: `mailto:${content.email}` },
    { icon: Facebook, label: "Facebook", value: "BILAAL TAILOR", href: content.facebook },
  ];
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Xiriir"
        title="Nala Soo Xiriir"
        description="Waxaan diyaar u nahay inaan kaa caawinno qiyaas, qiimo iyo talo naqshad."
        image={images.detail}
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <ul className="grid gap-6 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 80}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="card-luxe flex h-full items-center gap-5 rounded-lg p-7"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                  <c.icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">{c.label}</span>
                  <span className="mt-2 block truncate font-display text-xl text-foreground">
                    {c.value}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8" delay={120}>
          <div className="card-luxe rounded-lg p-8">
            <span className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                <Clock size={20} />
              </span>
              <span className="eyebrow">Saacadaha Furitaanka</span>
            </span>
            <ul className="mt-7 divide-y divide-gold/10">
              {site.hours.map((h) => (
                <li key={h.days} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-muted-foreground">{h.days}</span>
                  <span className="font-display text-lg text-gold-soft">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="mt-14 text-center" delay={160}>
          <h2 className="text-3xl sm:text-4xl">Diyaar ma tahay dalabkaaga?</h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">
            Nagala hadal WhatsApp oo hel jawaab degdeg ah.
          </p>
          <LuxeButton asChild size="lg" className="mt-8">
            <a
              href={waGeneral()}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Nagala Soo Xiriir
            </a>
          </LuxeButton>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
