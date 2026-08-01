import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import { images, navLinks, site, whatsappLink } from "@/lib/site";
import { useContent } from "@/lib/content-store";

export function Footer() {
  const { content } = useContent();
  return (
    <footer className="border-t border-gold/20 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={content.logoImage || images.logo}
              alt={`Astaanta ${site.name}`}
              loading="lazy"
              width={72}
              height={72}
              className="h-16 w-16 rounded-full border border-gold/40 bg-white object-contain p-0.5"
            />

            <div>
              <p className="font-display text-xl tracking-[0.2em] text-gold-soft">BILAL</p>
              <p className="text-[0.55rem] tracking-[0.42em] text-muted-foreground">TAILOR</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Tolid heer sare ah oo loogu talagalay ragga casriga ah. Qiyaas sax ah, maro tayo leh,
            iyo faahfaahin aan la iska indhatirin.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h3 className="eyebrow">Quick Links</h3>
          <ul className="mt-6 space-y-3">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="eyebrow">Saacadaha Furitaanka</h3>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {site.hours.map((h) => (
              <li key={h.days} className="flex items-center justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-gold-soft">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Nala Soo Xiriir</h3>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 hover:text-gold">
                <Phone size={15} className="text-gold" /> {site.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Salaan, waxaan rabaa inaan dalbado adeeg tolid.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-gold"
              >
                <MessageCircle size={15} className="text-gold" /> WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 break-all hover:text-gold"
              >
                <Mail size={15} className="shrink-0 text-gold" /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-gold"
              >
                <Facebook size={15} className="text-gold" /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/10 px-5 py-6 text-center sm:px-8">
        <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} {site.name} — Dhammaan xuquuqda way dhowran yihiin.
        </p>
      </div>
    </footer>
  );
}
