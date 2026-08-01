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

export type SiteContent = {
  logoImage: string;
  heroEyebrow: string;

  heroHighlight: string;
  heroText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  galleryTitle: string;
  galleryText: string;
  galleryImage: string;
  comingSoonImage: string;
  whatsapp: string;
  phone: string;
  email: string;
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
  heroEyebrow: "Tailored to Perfection",
  heroTitle: "Luxury Tailoring for",
  heroHighlight: "Modern Gentlemen",
  heroText:
    "BILAL TAILOR waa goobta ay ragga casriga ah ka helaan dhar la tolay si gaar ah — suit, safari, qamiis, surwaal iyo shaar. Qiyaas sax ah, maro tayada ugu sarreysa, iyo tolid gacan farsamo leh oo sharaf iyo kalsooni kuu soo kordhisa.",
  heroImage: images.heroTailor,
  aboutTitle: "Sheekada BILAL TAILOR",
  aboutText: "Dukaan tolid oo lagu dhisay tayo, khibrad iyo ixtiraam macmiil.",
  aboutImage: images.aboutRack,
  galleryTitle: "Shaqadeena iyo Naqshadeena",
  galleryText: "Sawirada rasmiga ah dhawaan waa la soo gelinayaa. Dooro qayb oo dalbo hadda.",
  galleryImage: images.aboutRack,
  comingSoonImage: images.comingSoon,
  whatsapp: "251940744442",
  phone: "+251940744442",
  email: "Billaalyare88@gmail.com",
  gallery: seedGallery(),
};

const STORAGE_KEY = "bilal-tailor-content-v1";

type Ctx = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  updateItem: (id: string, patch: Partial<GalleryItem>) => void;
  addItem: (category: string) => void;
  removeItem: (id: string) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  // Read persisted content after hydration to avoid SSR mismatches.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setContent({ ...defaultContent, ...JSON.parse(raw) });
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
