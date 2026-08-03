import { MapPin } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { LuxeButton } from "@/components/ui/luxe-button";
import { Reveal } from "@/components/ui/reveal";

/** Google Maps location block — responsive, editable from Admin. */
export function MapSection() {
  const { content } = useContent();
  if (!content.mapUrl && !content.mapEmbedUrl) return null;

  return (
    <section
      id="location"
      className="border-t border-gold/15 bg-surface/20 px-4 py-10 sm:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                <MapPin size={18} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl sm:text-2xl">{content.mapTitle}</h2>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {content.mapText}
                </p>
              </div>
            </div>
            {content.mapUrl ? (
              <LuxeButton asChild size="sm" className="shrink-0">
                <a href={content.mapUrl} target="_blank" rel="noreferrer">
                  {content.mapButtonLabel}
                </a>
              </LuxeButton>
            ) : null}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-gold/25 shadow-luxe">
            <iframe
              title={content.mapTitle}
              src={
                content.mapEmbedUrl ||
                "https://www.google.com/maps?q=Bilal+Tailor&output=embed"
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0 sm:h-72 lg:h-80"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
