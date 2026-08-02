import { faqs } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16">
      <SectionHeading eyebrow="Su'aalo" title="Su'aalaha Badanaa La Weydiiyo" />
      <Reveal className="mt-8" delay={100}>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="overflow-hidden rounded-lg border border-gold/25 bg-surface/60 px-6 transition-colors data-[state=open]:border-gold/60"
            >
              <AccordionTrigger className="py-6 text-left font-display text-lg text-foreground hover:text-gold hover:no-underline sm:text-xl">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
