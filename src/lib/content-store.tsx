import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { images, services } from "@/lib/site";

/**
 * Frontend content store for the admin panel.
 * Everything the admin edits lives here and is persisted in localStorage,
 * so the public pages update immediately with no backend.
 */
export type GalleryItem = {
  id: string;
  category: string;
  label: string;
  /** Empty = show the "Coming Soon" placeholder photo. */
  imageUrl: string;
  visible: boolean;
};

export type AdminUser = {
  id: string;
  email: string;
  password: string;
};

export type SiteContent = {
  logoImage: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;

  heroText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  galleryTitle: string;
  galleryText: string;
  galleryImage: string;
  servicesImage: string;
  contactImage: string;
  comingSoonImage: string;
  whatsapp: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  /** Auto message used by every general "Dalbo Hadda" WhatsApp link. */
  whatsappMessage: string;
  /** Auto message per service/gallery item — {item} is replaced by the name. */
  orderMessage: string;
  /** First line of the booking form WhatsApp message. */
  bookingMessage: string;
  admins: AdminUser[];
  gallery: GalleryItem[];
};


const ITEMS_PER_CATEGORY = 6;

function seedGallery(): GalleryItem[] {
  return services.flatMap((s) =>
    Array.from({ length: ITEMS_PER_CATEGORY }, (_, i) => ({
      id: `${s.key.toLowerCase()}-${i + 1}`,
      category: s.key,
      label: `${s.key} ${i + 1}`,
      imageUrl: "",
      visible: true,
    })),
  );
}

export const defaultContent: SiteContent = {
  logoImage: images.logo,
  heroEyebrow: "Tailored to Perfection",

  heroTitle: "Luxury Tailoring for",
  heroHighlight: "Modern Gentlemen",
  heroText:
    "Suit, safari, qamiis, surwaal iyo shaar oo qiyaas sax ah lagu tolay — maro tayo sare iyo farsamo gacan.",
  heroImage: images.heroTailor,
  aboutTitle: "Sheekada BILAL TAILOR",
  aboutText: "Dukaan tolid oo lagu dhisay tayo, khibrad iyo ixtiraam macmiil.",
  aboutImage: images.aboutRack,
  galleryTitle: "Shaqadeena iyo Naqshadeena",
  galleryText: "Sawirada rasmiga ah dhawaan waa la soo gelinayaa. Dooro qayb oo dalbo hadda.",
  galleryImage: images.aboutRack,
  servicesImage: images.hero,
  contactImage: images.measureLight,
  comingSoonImage: images.comingSoon,
  whatsapp: "251940744442",
  phone: "+251940744442",
  email: "Billaalyare88@gmail.com",
  facebook: "https://facebook.com",
  instagram: "",
  whatsappMessage: "Salaan, waxaan rabaa inaan dalbado adeeg tolid.",
  orderMessage: "Salaan, waxaan rabaa inaan dalbado adeegga {item}.",
  bookingMessage: "ASC BILAAL TAILOR, waxaan rabaa in aan dalbado:",
  admins: [{ id: "root", email: "Billaalyare88@gmail.com", password: "secure#4" }],
  gallery: seedGallery(),

};

const STORAGE_KEY = "bilal-tailor-content-v1";

type Ctx = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  updateItem: (id: string, patch: Partial<GalleryItem>) => void;
  addItem: (category: string) => void;
  removeItem: (id: string) => void;
  addAdmin: (email: string, password: string) => void;
  updateAdmin: (id: string, patch: Partial<Omit<AdminUser, "id">>) => void;
  removeAdmin: (id: string) => void;
  reset: () => void;
};


const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  // Read persisted content after hydration to avoid SSR mismatches.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<SiteContent>;
      // Drop any legacy preview-only asset URLs so images resolve from /assets in production.
      for (const [k, v] of Object.entries(saved)) {
        if (typeof v === "string" && v.includes("/__l5e/")) delete (saved as Record<string, unknown>)[k];
      }
      if (Array.isArray(saved.gallery)) {
        saved.gallery = saved.gallery.map((g) =>
          typeof g?.imageUrl === "string" && g.imageUrl.includes("/__l5e/")
            ? { ...g, imageUrl: "" }
            : g,
        );
      }
      setContent({ ...defaultContent, ...saved });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      content,
      update: (patch) => persist({ ...content, ...patch }),
      updateItem: (id, patch) =>
        persist({
          ...content,
          gallery: content.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        }),
      addItem: (category) => {
        const count = content.gallery.filter((g) => g.category === category).length + 1;
        persist({
          ...content,
          gallery: [
            ...content.gallery,
            {
              id: `${category.toLowerCase()}-${Date.now()}`,
              category,
              label: `${category} ${count}`,
              imageUrl: "",
              visible: true,
            },
          ],
        });
      },
      removeItem: (id) =>
        persist({ ...content, gallery: content.gallery.filter((g) => g.id !== id) }),
      addAdmin: (email, password) =>
        persist({
          ...content,
          admins: [...content.admins, { id: `admin-${Date.now()}`, email, password }],
        }),
      updateAdmin: (id, patch) =>
        persist({
          ...content,
          admins: content.admins.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        }),
      removeAdmin: (id) =>
        persist({ ...content, admins: content.admins.filter((a) => a.id !== id) }),
      reset: () => persist(defaultContent),

    }),
    [content, persist],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
