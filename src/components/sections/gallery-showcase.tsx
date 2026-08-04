import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useContent, useLinks, galleryCategoryNames, type GalleryItem } from "@/lib/content-store";
import { LuxeButton } from "@/components/ui/luxe-button";
import { cn } from "@/lib/utils";

/** One gallery card — real photo when set, otherwise the numbered "Coming Soon" photo. */
function GalleryCard({
  item,
  viewLabel,
  onOpen,
}: {
  item: GalleryItem;
  viewLabel: string;
  onOpen: () => void;
}) {
  const src = item.imageUrl;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Fur sawirka ${item.label}`}
      className="group relative w-[70vw] max-w-[280px] shrink-0 overflow-hidden rounded-xl border border-gold/25 shadow-luxe transition-all duration-500 hover:border-gold hover:shadow-[0_0_44px_-14px_var(--gold)] sm:w-[240px] lg:w-[280px]"
    >
      <img
        src={src}
        alt={item.label}
        loading="lazy"
        className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-background via-background/80 to-transparent p-3 text-left">
        <span className="min-w-0 truncate font-display text-base text-foreground">{item.label}</span>
        <span className="shrink-0 text-[0.55rem] tracking-[0.28em] text-gold uppercase">
          {viewLabel}
        </span>
      </span>
    </button>
  );
}

function CategorySlider({
  category,
  items,
  viewLabel,
  onOpen,
}: {
  category: string;
  items: GalleryItem[];
  viewLabel: string;
  onOpen: (item: GalleryItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
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
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el || dragging.current) return;
      el.scrollLeft += 1;
    }, 26);
    return () => window.clearInterval(id);
  }, [paused]);

  if (items.length === 0) return null;
  const slides = [...items, ...items];

  return (
    <div
      className="mt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <h3 className="min-w-0 truncate font-display text-xl text-foreground sm:text-2xl">
          {category}
          <span className="ml-2 text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
            {items.length}
          </span>
        </h3>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={`${category}: sawirka hore`}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`${category}: sawirka xiga`}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label={`Sawirada ${category}`}
        className="no-scrollbar mt-3 flex cursor-grab gap-3 overflow-x-auto pb-2 active:cursor-grabbing sm:gap-4"
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
        {slides.map((item, i) => (
          <GalleryCard
            key={`${item.id}-${i}`}
            item={item}
            
            viewLabel={viewLabel}
            onOpen={() => onOpen(item)}
          />
        ))}
      </div>
    </div>
  );
}

export function GalleryShowcase({
  withFilter = false,
  limitPerCategory,
}: {
  withFilter?: boolean;
  limitPerCategory?: number;
}) {
  const { content } = useContent();
  const { waOrder } = useLinks();
  const all = content.galleryAllLabel || "Dhammaan";
  const [active, setActive] = useState<string>(all);
  const [modal, setModal] = useState<GalleryItem | null>(null);

  const shown = useMemo(
    () =>
      (!withFilter || active === all
        ? galleryCategoryNames
        : galleryCategoryNames.filter((c) => c === active)
      ).map((category) => {
        const items = content.gallery.filter(
          (g) => g.category === category && g.visible && g.imageUrl,
        );
        return { category, items: limitPerCategory ? items.slice(0, limitPerCategory) : items };
      }),
    [withFilter, active, all, content.gallery, limitPerCategory],
  );

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
        <div className="flex flex-wrap justify-center gap-2">
          {[all, ...galleryCategoryNames].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase transition-all duration-300 sm:px-5 sm:py-2",
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

      <div className="space-y-6 sm:space-y-8">
        {shown.map(({ category, items }) => (
          <CategorySlider
            key={category}
            category={category}
            items={items}
            viewLabel={content.galleryViewLabel}
            onOpen={setModal}
          />
        ))}
      </div>

      {modal ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Sawirka ${modal.label}`}
          className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-md sm:p-8"
          onClick={() => setModal(null)}
        >
          <div
            className="animate-scale-in relative my-auto w-full max-w-3xl rounded-xl border border-gold/30 bg-surface p-4 shadow-luxe sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="Xir"
              className="absolute top-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-background/70 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              <X size={18} />
            </button>
            <img
              src={modal.imageUrl}
              alt={modal.label}
              className="max-h-[58vh] w-full rounded-lg border border-gold/20 object-contain"
            />
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              <h3 className="font-display text-xl sm:text-2xl">{modal.label}</h3>
              <p className="max-w-md text-sm text-muted-foreground">{content.galleryModalText}</p>
              <LuxeButton asChild size="lg">
                <a href={waOrder(modal.label)} target="_blank" rel="noreferrer">
                  {content.galleryModalCta}
                </a>
              </LuxeButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
