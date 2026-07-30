import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories, orderMessage, whatsappLink } from "@/lib/site";
import { LuxeButton } from "@/components/ui/luxe-button";
import { cn } from "@/lib/utils";

const SLIDES_PER_CATEGORY = 6;

type Slide = { id: string; category: string; index: number };

function buildSlides(category: string): Slide[] {
  return Array.from({ length: SLIDES_PER_CATEGORY }, (_, i) => ({
    id: `${category}-${i}`,
    category,
    index: i + 1,
  }));
}

/** Luxury "Coming Soon" placeholder card. Swap the inner div for an <img> once photos exist. */
function GalleryCard({ slide, onOpen }: { slide: Slide; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Fur sawirka ${slide.category} ${slide.index}`}
      className="group relative w-[76vw] shrink-0 overflow-hidden rounded-xl border border-gold/25 shadow-luxe transition-all duration-500 hover:border-gold hover:shadow-[0_0_44px_-14px_var(--gold)] sm:w-[340px]"
    >
      <div className="placeholder-luxe flex aspect-3/4 items-center justify-center transition-transform duration-700 group-hover:scale-[1.06]">
        <span className="relative z-10 text-center">
          <span className="block font-display text-3xl text-gold-soft">Coming Soon</span>
          <span className="mt-3 block text-[0.6rem] tracking-[0.4em] text-muted-foreground uppercase">
            {slide.category}
          </span>
        </span>
      </div>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-background to-transparent p-5 text-left">
        <span className="font-display text-lg text-foreground">{slide.category}</span>
        <span className="text-[0.6rem] tracking-[0.3em] text-gold uppercase">Daawo</span>
      </span>
    </button>
  );
}

function CategorySlider({
  category,
  onOpen,
}: {
  category: string;
  onOpen: (category: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slides = [...buildSlides(category), ...buildSlides(category)];
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [paused, setPaused] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: "smooth" });
  }, []);

  // Infinite loop: reset to the first half when the duplicated half is reached.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el || dragging.current) return;
      el.scrollLeft += 1;
    }, 24);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="flex items-end justify-between gap-4">
        <h3 className="font-display text-2xl text-foreground sm:text-3xl">{category}</h3>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`${category}: sawirka hore`}
            className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`${category}: sawirka xiga`}
            className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label={`Sawirada ${category}`}
        className="no-scrollbar mt-6 flex cursor-grab gap-5 overflow-x-auto pb-2 active:cursor-grabbing"
        onPointerDown={(e) => {
          dragging.current = true;
          startX.current = e.clientX;
          startScroll.current = trackRef.current?.scrollLeft ?? 0;
        }}
        onPointerMove={(e) => {
          if (!dragging.current || !trackRef.current) return;
          trackRef.current.scrollLeft = startScroll.current - (e.clientX - startX.current);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        {slides.map((slide, i) => (
          <GalleryCard key={`${slide.id}-${i}`} slide={slide} onOpen={() => onOpen(category)} />
        ))}
      </div>
    </div>
  );
}

export function GalleryShowcase({ withFilter = false }: { withFilter?: boolean }) {
  const [active, setActive] = useState<string>("Dhammaan");
  const [modal, setModal] = useState<string | null>(null);

  const shown =
    !withFilter || active === "Dhammaan"
      ? galleryCategories
      : galleryCategories.filter((c) => c === active);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal]);

  return (
    <>
      {withFilter ? (
        <div className="flex flex-wrap justify-center gap-3">
          {["Dhammaan", ...galleryCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-6 py-2.5 text-[0.66rem] tracking-[0.24em] uppercase transition-all duration-400",
                active === c
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-gold/30 text-muted-foreground hover:border-gold hover:text-gold",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 space-y-16">
        {shown.map((category) => (
          <CategorySlider key={category} category={category} onOpen={setModal} />
        ))}
      </div>

      {modal ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Sawirka ${modal}`}
          className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setModal(null)}
        >
          <div
            className="animate-scale-in relative w-full max-w-3xl rounded-xl border border-gold/30 bg-surface p-5 shadow-luxe sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="Xir"
              className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              <X size={18} />
            </button>
            <div className="placeholder-luxe grid aspect-4/3 place-items-center rounded-lg border border-gold/20">
              <span className="relative z-10 text-center">
                <span className="block font-display text-4xl text-gold-soft sm:text-5xl">
                  Coming Soon
                </span>
                <span className="mt-4 block text-[0.6rem] tracking-[0.42em] text-muted-foreground uppercase">
                  {modal}
                </span>
              </span>
            </div>
            <div className="mt-7 flex flex-col items-center gap-5 text-center">
              <h3 className="font-display text-3xl">{modal}</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Sawirada shaqadeena ugu dambeeyay dhawaan waa la soo gelinayaa. Hadda dalbo oo naga
                hel qiimo iyo talo bilaash ah.
              </p>
              <LuxeButton asChild size="lg">
                <a href={whatsappLink(orderMessage(modal))} target="_blank" rel="noreferrer">
                  Hadda Dalbo
                </a>
              </LuxeButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
