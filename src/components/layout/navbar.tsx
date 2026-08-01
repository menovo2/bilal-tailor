import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { images, navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LuxeButton } from "@/components/ui/luxe-button";
import { whatsappLink } from "@/lib/site";
import { useContent } from "@/lib/content-store";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { content } = useContent();
  const pathname = useRouterState({ select: (s) => s.location.pathname });


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-gold/20 bg-background/92 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
          <img
            src={images.logo}
            alt={`Astaanta ${site.name}`}
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 rounded-full border border-gold/40 object-cover"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg tracking-[0.22em] text-gold-soft">
              BILAL
            </span>
            <span className="block truncate text-[0.55rem] tracking-[0.42em] text-muted-foreground">
              TAILOR
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation weyn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="group relative py-2 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-foreground/70 transition-colors hover:text-gold data-[status=active]:text-gold"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LuxeButton asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a
              href={whatsappLink("Salaan, waxaan rabaa inaan dalbado adeeg tolid.")}
              target="_blank"
              rel="noreferrer"
            >
              Dalbo Hadda
            </a>
          </LuxeButton>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Xir menu-ga" : "Fur menu-ga"}
            aria-expanded={open}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-gold/10 transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8" aria-label="Navigation mobile">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="border-b border-gold/10 py-4 text-xs uppercase tracking-[0.28em] text-foreground/75 transition-colors hover:text-gold data-[status=active]:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
