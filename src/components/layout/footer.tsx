import { Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import { images, site } from "@/lib/site";
import { useContent, useLinks } from "@/lib/content-store";

export function Footer() {
  const { content } = useContent();
  const { waGeneral } = useLinks();

  return (
    <footer className="border-t border-gold/20 bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-8 sm:px-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={content.logoImage || images.logo}
            alt={`Astaanta ${site.name}`}
            loading="lazy"
            width={64}
            height={64}
            className="h-14 w-14 rounded-full border border-gold/40 bg-white object-contain p-0.5"
          />
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.16em] text-gold-gradient">
              BILAAL
            </p>
            <p className="text-[0.62rem] font-semibold tracking-[0.44em] text-gold-soft">TAILOR</p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <li>
            <a href={`tel:${content.phone}`} className="flex items-center gap-2 hover:text-gold">
              <Phone size={15} className="text-gold" /> {content.phone}
            </a>
          </li>
          <li>
            <a
              href={waGeneral()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-gold"
            >
              <MessageCircle size={15} className="text-gold" /> WhatsApp
            </a>
          </li>
          <li>
            <a
              href={`mailto:${content.email}`}
              className="flex items-center gap-2 break-all hover:text-gold"
            >
              <Mail size={15} className="shrink-0 text-gold" /> {content.email}
            </a>
          </li>
          {content.facebook ? (
            <li>
              <a
                href={content.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <Facebook size={15} className="text-gold" /> Facebook
              </a>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="border-t border-gold/10 px-5 py-4 text-center sm:px-8">
        <p className="text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} {site.name} — Dhammaan xuquuqda way dhowran yihiin.
        </p>
      </div>
    </footer>
  );
}
