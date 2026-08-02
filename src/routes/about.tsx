import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/layout/site-layout";
import { Reveal } from "@/components/ui/reveal";
import { images, services } from "@/lib/site";
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
  <strong>BILAL TAILOR</strong> waa xarun tolmo oo heer sare ah, taas oo u adeegta ragga raba dhar ku tikhan qiyaas sax ah, bilic gooni ah, iyo adkaysi waara. Waxaan ku takhasusnay{" "}
  {services.map((s) => s.title).join(", ")} — iyadoo mid kasta loo qaabeeyo si gaar ah.
</p>
<p>
  Adeegganaga waxaan ka bilownaa qiyaas suuban iyo faham mug leh oo ku saabsan rabitaankaaga. Kadib, waxaan dooranaa marada ku habboon, anagoo u tolna si hufan oo farshaxannimo leh.
</p>
<p>
  Maadaama dharku yahay maalgashi ee aanu ahayn agab si kumeel-gaar ah loo iibsado, tayada sare iyo xarragu waa halbeegga koowaad ee adeegayaga.
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
    </SiteLayout>
  );
}
