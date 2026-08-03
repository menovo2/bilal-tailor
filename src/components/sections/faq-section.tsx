import { useContent } from "@/lib/content-store";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const { content } = useContent();
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-10 sm:px-8 lg:py-12">
      <SectionHeading eyebrow={content.faqEyebrow} title={content.faqTitle} />
      <Reveal className="mt-6" delay={80}>
        <Accordion type="single" collapsible className="space-y-3">
          {content.faqs.map((f) => (
            <AccordionItem
              key={f.id}
              value={f.id}
              className="overflow-hidden rounded-lg border border-gold/25 bg-surface/60 px-4 transition-colors data-[state=open]:border-gold/60 sm:px-6"
            >
              <AccordionTrigger className="py-4 text-left font-display text-base text-foreground hover:text-gold hover:no-underline sm:text-xl">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
