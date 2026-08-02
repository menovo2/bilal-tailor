import { createFileRoute } from "@tanstack/react-router";
import { Award, Gem, HeartHandshake, Ruler, Scissors, Target } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { images, services } from "@/lib/site";
import { useContent } from "@/lib/content-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Naga Ogow — BILAL TAILOR" },
      {
        name: "description",
        content:
          "BILAL TAILOR: tolid heer sare ah, qiyaas sax ah, farsamo gacaneed. Suit, safari, qamiis iyo surwaal oo si gaar ah kuu tolan.",
      },
      { property: "og:title", content: "Naga Ogow — BILAL TAILOR" },
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

const values = [
  {
    icon: Target,
    title: "Himilo",
    text: "Dhar qiyaas sax ah leh oo kor u qaada kalsoonidaada.",
  },
  {
    icon: Gem,
    title: "Aragti",
    text: "Inaan noqonno magaca ugu horreeya ee tolidda heer sare ah.",
  },
  {
    icon: Award,
    title: "Tayo",
    text: "Maro la doortay, tolid adkaysi leh oo sanado socota.",
  },
  {
    icon: Scissors,
    title: "Farsamo",
    text: "Gacan farsamo leh oo qiyaasaysa, jarta oo tolaysa taxaddar.",
  },
  {
    icon: Ruler,
    title: "Faahfaahin",
    text: "Wax kastoo yar waa muhiim — halkaas ayaa quruxdu ka dhalataa.",
  },
  {
    icon: HeartHandshake,
    title: "Adeeg Shaqsi Ah",
    text: "Ka bilaabo soo dhaweynta ilaa dhammaadka, adeeg deggan oo xushmad leh.",
  },
];

function AboutPage() {
  const { content } = useContent();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ku Saabsan"
        title={content.aboutTitle}
        description={content.aboutText}
        image={content.aboutImage}
      />


      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Naga</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">Farsamo Gacmeed</h2>
            <div className="hairline mt-6 w-28" aria-hidden="true" />
            <div className="mt-7 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                BILAL TAILOR waa dukaan tolid heer sare ah oo u adeega ragga raadinaya dhar qiyaas
                sax ah leh, qurux badan, oo waara. Waxaan ku takhasusnay{" "}
                {services.map((s) => s.title).join(", ")} — mid kastaa qaab gaar ah.
              </p>
              <p>
                Waxaan ka bilownaa qiyaas sax ah iyo faham buuxa oo aragtidaada ah. Kadib waxaan
                dooranaa maro ku habboon, waxaana si taxaddar leh u tolnaa.
              </p>
              <p>
                Dharku waa maalgashi, mana aha alaab si degdeg ah loo iibsado. Sidaas darteed,
                tayadu horta ayay u timaadaa.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140} className="relative">
            <img
              src={images.detail}
              alt="Gacmo tolid oo maro cad ku qiyaasaya"
              loading="lazy"
              className="h-full w-full rounded-xl border border-gold/25 object-cover shadow-luxe"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-surface/30 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Qiyamkeena"
            title="Waxa Naga Dhigaya Kuwa Kala Duwan"
            description="Afar tiir: tayo, farsamo, faahfaahin iyo adeeg."
          />
          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 80}>
                <article className="card-luxe group h-full rounded-lg p-8">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-primary-foreground">
                    <v.icon size={22} />
                  </span>
                  <h3 className="mt-7 text-2xl">{v.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
