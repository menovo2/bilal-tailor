import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories, orderMessage, whatsappLink } from "@/lib/site";
import { useContent, type GalleryItem } from "@/lib/content-store";
import { LuxeButton } from "@/components/ui/luxe-button";
import { cn } from "@/lib/utils";

/** One gallery card — real photo when set, otherwise the numbered "Coming Soon" photo. */
function GalleryCard({
  item,
  fallback,
  onOpen,
}: {
  item: GalleryItem;
  fallback: string;
  onOpen: () => void;
}) {
  const src = item.imageUrl || fallback;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Fur sawirka ${item.label}`}
      className="group relative w-[78vw] shrink-0 overflow-hidden rounded-xl border border-gold/25 shadow-luxe transition-all duration-500 hover:border-gold hover:shadow-[0_0_44px_-14px_var(--gold)] sm:w-[300px] lg:w-[340px]"
    >
      <img
        src={src}
        alt={item.label}
        loading="lazy"
        className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-background via-background/80 to-transparent p-4 text-left sm:p-5">
        <span className="min-w-0 truncate font-display text-lg text-foreground">{item.label}</span>
        <span className="shrink-0 text-[0.6rem] tracking-[0.3em] text-gold uppercase">Daawo</span>
      </span>
    </button>
  );
}

function CategorySlider({
  category,
  items,
  fallback,
  onOpen,
}: {
  category: string;
  items: GalleryItem[];
  fallback: string;
  onOpen: (item: GalleryItem) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slides = [...items, ...items];
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

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const el = trackRef.current;
      if (!el || dragging.current) return;
      el.scrollLeft += 1;
    }, 24);
    return () => window.clearInterval(id);
  }, [paused]);

  if (items.length === 0) return null;

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <h3 className="min-w-0 truncate font-display text-2xl text-foreground sm:text-3xl">
          {category}
        </h3>
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
        className="no-scrollbar mt-6 flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing sm:gap-5"
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
            fallback={fallback}
            onOpen={() => onOpen(item)}
          />
        ))}
      </div>
    </div>
  );
}

export function GalleryShowcase({ withFilter = false }: { withFilter?: boolean }) {
  const { content } = useContent();
  const [active, setActive] = useState<string>("Dhammaan");
  const [modal, setModal] = useState<GalleryItem | null>(null);

  const shown = useMemo(
    () =>
      (!withFilter || active === "Dhammaan"
        ? galleryCategories
        : galleryCategories.filter((c) => c === active)
      ).map((category) => ({
        category,
        items: content.gallery.filter((g) => g.category === category && g.visible),
      })),
    [withFilter, active, content.gallery],
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
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {["Dhammaan", ...galleryCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.62rem] tracking-[0.22em] uppercase transition-all duration-400 sm:px-6 sm:py-2.5 sm:text-[0.66rem]",
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

      <div className="mt-6 space-y-14 sm:space-y-16">
        {shown.map(({ category, items }) => (
          <CategorySlider
            key={category}
            category={category}
            items={items}
            fallback={content.comingSoonImage}
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
            className="animate-scale-in relative my-auto w-full max-w-3xl rounded-xl border border-gold/30 bg-surface p-4 shadow-luxe sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="Xir"
              className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-background/70 text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              <X size={18} />
            </button>
            <img
              src={modal.imageUrl || content.comingSoonImage}
              alt={modal.label}
              className="max-h-[60vh] w-full rounded-lg border border-gold/20 object-cover"
            />
            <div className="mt-6 flex flex-col items-center gap-4 text-center sm:mt-7 sm:gap-5">
              <h3 className="font-display text-2xl sm:text-3xl">{modal.label}</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Noo soo dir fariin WhatsApp oo hel qiimo iyo talo bilaash ah.
              </p>
              <LuxeButton asChild size="lg">
                <a href={whatsappLink(orderMessage(modal.label))} target="_blank" rel="noreferrer">
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
