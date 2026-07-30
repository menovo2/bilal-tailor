import { createFileRoute } from "@tanstack/react-router";
import { Award, Gem, HeartHandshake, Ruler, Scissors, Target } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { images, services } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Ku Saabsan — BILAL TAILOR" },
      {
        name: "description",
        content:
          "BILAL TAILOR waa dukaan tolid heer sare ah oo ku takhasusay suit, safari, qamiis, surwaal iyo shaar. Aqoon, tayo iyo faahfaahin.",
      },
      { property: "og:title", content: "Ku Saabsan — BILAL TAILOR" },
      {
        property: "og:description",
        content: "Sheekada BILAL TAILOR: farsamo, tayo iyo khibrad tolid heer sare ah.",
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
    title: "Himilada (Mission)",
    text: "In nin walba oo naga soo dalbada ka helo dhar si sax ah u habboon, tayo leh, oo kalsooni iyo sharaf ku kordhiya.",
  },
  {
    icon: Gem,
    title: "Aragtida (Vision)",
    text: "Inaan noqonno magaca ugu horreeya ee lala xiriiriyo tolidda heer sare ah ee ragga gudaha gobolka iyo kaga baxsan.",
  },
  {
    icon: Award,
    title: "Tayada",
    text: "Waxaan dooranaa maro tayada ugu sarreysa oo la tijaabiyay, iyo tolid adkaysi leh oo sanado socota.",
  },
  {
    icon: Scissors,
    title: "Farsamada",
    text: "Sanado khibrad ah oo gacan farsamo leh: qeybta walba waxaa lagu qiyaasay, la jaray, waana la tolay si taxaddar leh.",
  },
  {
    icon: Ruler,
    title: "Faahfaahinta",
    text: "Badhamada, tolidda, dhererka, garabka — wax yar walba waan qiimeynaa, waayo waa wixii dharka wax weyn ka dhiga.",
  },
  {
    icon: HeartHandshake,
    title: "Khibrad Raaxo leh",
    text: "Ka soo dhaweynta ilaa qiyaasta ugu dambeysa, adeegga waa mid deggan, xushmad leh oo shaqsi ah.",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ku Saabsan"
        title="Sheekada BILAL TAILOR"
        description="Dukaan tolid oo lagu dhisay tayo, khibrad iyo ixtiraam macmiil."
        image={images.workshop}
      />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Naga</p>
            <h2 className="mt-5 text-3xl sm:text-4xl">Farsamo la tolay si gacan ah</h2>
            <div className="hairline mt-6 w-28" aria-hidden="true" />
            <div className="mt-7 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                BILAL TAILOR waa dukaan tolid heer sare ah oo si gaar ah u adeega ragga raadinaya
                dhar la qiyaasay, qurux leh, oo muddo dheer adkaysta. Waxaan ku takhasusnay{" "}
                {services.map((s) => s.title).join(", ")} — nooc walbana wuxuu leeyahay habka uu
                jirka ku raaco.
              </p>
              <p>
                Shaqadeena waxay ku bilaabataa qiyaas sax ah iyo wada-hadal aad ku sheegto sida aad
                doonayso in dharkaagu u ekaado. Kadib waxaan dooranaa maro ku habboon, waxaanan
                jaraa oo tolnaa iyadoo la tixgelinayo qaabka jirkaaga.
              </p>
              <p>
                Waxaan aaminsanahay in dhar wanaagsan uu yahay maalgashi, ma aha wax la iibsado
                maalin kasta. Sidaas darteed tayada ayaan hormarinnaa marka hore, ka dibna quruxda
                iyo raaxada.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140} className="relative">
            <img
              src={images.detail}
              alt="Gacmo tolid tayo sare leh oo maro cad lagu qiyaasayo biinno"
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
            title="Waxa naga dhigaya kala duwan"
            description="Afar tiir oo shaqadeena ku dhisan tahay: tayo, farsamo, faahfaahin iyo adeeg raaxo leh."
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
