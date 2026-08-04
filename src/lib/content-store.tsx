import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { images } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

/**
 * Single source of truth for EVERY piece of editable website content.
 * The admin panel writes here, the public pages read from here, and everything
 * is persisted to Supabase so changes are shared across browsers and deployments.
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
  /** The first admin can never be deleted. */
  protected?: boolean;
};

export type ServiceItem = {
  id: string;
  key: string;
  title: string;
  short: string;
  long: string;
  icon: string;
};

export type FaqItem = { id: string; q: string; a: string };

export type HourItem = { id: string; days: string; time: string };

/** Gallery categories with the exact photo counts requested. */
export const GALLERY_CATEGORIES: { name: string; count: number }[] = [
  { name: "Suits", count: 30 },
  { name: "Safari Suits", count: 15 },
  { name: "Safari Normal", count: 10 },
  { name: "Shaar", count: 20 },
  { name: "Qamis", count: 15 },
  { name: "Surwaal", count: 10 },
];

export const galleryCategoryNames = GALLERY_CATEGORIES.map((c) => c.name);

export type SiteContent = {
  /* Brand + navigation */
  logoImage: string;
  brandName: string;
  brandSub: string;
  navHome: string;
  navAbout: string;
  navServices: string;
  navGallery: string;
  navContact: string;
  navCta: string;

  /* Home hero */
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroImage: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;

  /* Home gallery teaser */
  homeGalleryEyebrow: string;
  homeGalleryTitle: string;
  homeGalleryCta: string;

  /* About */
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  aboutStoryEyebrow: string;
  aboutStoryTitle: string;
  aboutStoryBody: string;

  /* Services */
  servicesEyebrow: string;
  servicesTitle: string;
  servicesText: string;
  servicesImage: string;
  serviceOrderCta: string;
  comingSoonLabel: string;
  services: ServiceItem[];

  /* Gallery */
  galleryEyebrow: string;
  galleryTitle: string;
  galleryText: string;
  galleryImage: string;
  galleryAllLabel: string;
  galleryViewLabel: string;
  galleryModalText: string;
  galleryModalCta: string;
  comingSoonImage: string;
  gallery: GalleryItem[];

  /* Booking */
  bookingEyebrow: string;
  bookingTitle: string;
  bookingText: string;
  bookingNameLabel: string;
  bookingPhoneLabel: string;
  bookingTypeLabel: string;
  bookingNotesLabel: string;
  bookingSubmit: string;

  /* FAQ */
  faqEyebrow: string;
  faqTitle: string;
  faqs: FaqItem[];

  /* Contact */
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  contactImage: string;
  contactHoursLabel: string;
  contactCtaTitle: string;
  contactCtaText: string;
  contactCtaButton: string;
  hours: HourItem[];

  /* Map */
  mapTitle: string;
  mapText: string;
  mapUrl: string;
  mapEmbedUrl: string;
  mapButtonLabel: string;

  /* Footer */
  footerNote: string;

  /* Links + auto messages */
  whatsapp: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  whatsappMessage: string;
  orderMessage: string;
  bookingMessage: string;

  admins: AdminUser[];
};

function seedGallery(): GalleryItem[] {
  return GALLERY_CATEGORIES.flatMap((c) =>
    Array.from({ length: c.count }, (_, i) => ({
      id: `${c.name.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
      category: c.name,
      label: `${c.name} ${i + 1}`,
      imageUrl: "",
      visible: true,
    })),
  );
}

const defaultServices: ServiceItem[] = [
  {
    id: "svc-suit",
    key: "Suit",
    title: "Suit",
    short: "Suit rasmi ah oo qiyaas gaar ah, maro tayo sare leh.",
    long: "Suit lagu dhisay qiyaas sax ah: maro tayo sare, garab la qaabeeyay iyo tolid adkaysata — ku habboon aroos, shaqo iyo munaasabado rasmi ah.",
    icon: "suit",
  },
  {
    id: "svc-safari",
    key: "Safari",
    title: "Safari",
    short: "Safari raaxo leh oo qurux badan, maalin iyo munaasabad.",
    long: "Qaab toosan, jeebab si fiican loo qaabeeyay iyo maro neefsata — dhaqan iyo casriyeyn isku dhafan.",
    icon: "safari",
  },
  {
    id: "svc-qamiis",
    key: "Qamiis",
    title: "Qamiis",
    short: "Qamiis nadiif ah oo qiyaas gaar ah lagu tolay.",
    long: "Xariiq toosan iyo faahfaahin nadiif ah, iyadoo maro, badhamo iyo qoor-qaabeyn aad dooranayso.",
    icon: "qamiis",
  },
  {
    id: "svc-surwaal",
    key: "Surwaal",
    title: "Surwaal",
    short: "Surwaal qiyaas sax ah, dherer iyo qaab gaar ah.",
    long: "Dhererka, ballaca iyo qaabka waxaa loo habeeyaa jirkaaga, iyadoo tolid xoogan la isticmaalayo.",
    icon: "surwaal",
  },
  {
    id: "svc-shaar",
    key: "Shaar",
    title: "Shaar",
    short: "Shaar casri ah oo tayo leh, shaqo iyo maalin.",
    long: "Garab sax ah, gacmo cabbir leh iyo maro fudud oo neefsata — faahfaahin yar oo wax weyn beddesha.",
    icon: "shaar",
  },
];

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    q: "Muddo intee le'eg ayay qaadataa tolidda?",
    a: "Inta badan 3 – 7 maalmood. Adeeg degdeg ah oo 48 saac ah ayaa sidoo kale la heli karaa.",
  },
  {
    id: "faq-2",
    q: "Qiimaha sidee loo ogaadaa?",
    a: "Wuxuu ku xiran yahay nooca dharka iyo marada. Noo soo dir WhatsApp oo hel qiime cad.",
  },
  {
    id: "faq-3",
    q: "Ma keeni karaa naqshad aan rabo?",
    a: "Haa. Keen sawir ama fikrad, waxaanan si dhow kuula shaqaynaynaa.",
  },
  {
    id: "faq-4",
    q: "Miyaad samaysaan suits rasmi ah?",
    a: "Haa. Waxaan ku takhasusnay suits aroos, shaqo iyo munaasabado waaweyn.",
  },
  {
    id: "faq-5",
    q: "Ma qiyaasi kartaa dharka ka hor dhammaystirka?",
    a: "Haa. Waxaan bixinnaa hal ama laba fitting si dharku sax kuu noqdo.",
  },
];

const MAP_URL = "https://maps.app.goo.gl/4BZiCM9PDRboTWsw7";

export const defaultContent: SiteContent = {
  logoImage: images.logo,
  brandName: "BILAAL",
  brandSub: "TAILOR",
  navHome: "Home",
  navAbout: "About",
  navServices: "Services",
  navGallery: "Gallery",
  navContact: "Contact",
  navCta: "Dalbo Hadda",

  heroEyebrow: "Tailored to Perfection",
  heroTitle: "Luxury Tailoring for",
  heroHighlight: "Modern Gentlemen",
  heroText:
    "Suit, safari, qamiis, surwaal iyo shaar oo qiyaas sax ah lagu tolay — maro tayo sare iyo farsamo gacan.",
  heroImage: images.heroTailor,
  heroCtaPrimary: "Dalbo Hadda",
  heroCtaSecondary: "Daawo Adeegyadeena",

  homeGalleryEyebrow: "Sawirrada",
  homeGalleryTitle: "Dharka",
  homeGalleryCta: "Daawo Sawirrada Dharka oo Dhan",

  aboutEyebrow: "Ku Saabsan",
  aboutTitle: "Sheekada BILAL TAILOR",
  aboutText: "Dukaan tolid oo lagu dhisay tayo, khibrad iyo ixtiraam macmiil.",
  aboutImage: images.aboutRack,
  aboutStoryEyebrow: "Naga",
  aboutStoryTitle: "Farsamo Gacmeed",
  aboutStoryBody:
    "BILAL TAILOR waa xarun tolmo heer sare ah oo u adeegta ragga raba dhar qiyaas sax ah, bilic gooni ah iyo adkaysi waara. Waxaan ka bilownaa qiyaas suuban, waxaanan dooranaa marada ku habboon, kadibna u tolnaa si hufan oo farshaxannimo leh.",

  servicesEyebrow: "Adeegyada",
  servicesTitle: "Shan adeeg, hal heer tayo",
  servicesText: "Adeeg walba wuxuu ku bilaabmaa qiyaas sax ah.",
  servicesImage: images.hero,
  serviceOrderCta: "Dalbo",
  comingSoonLabel: "Coming Soon",
  services: defaultServices,

  galleryEyebrow: "Gallery",
  galleryTitle: "Shaqadeena iyo Naqshadeena",
  galleryText: "Dooro qayb oo dalbo hadda.",
  galleryImage: images.aboutRack,
  galleryAllLabel: "Dhammaan",
  galleryViewLabel: "Daawo",
  galleryModalText: "Noo soo dir fariin WhatsApp oo hel qiimo iyo talo bilaash ah.",
  galleryModalCta: "Hadda Dalbo",
  comingSoonImage: images.comingSoon,
  gallery: seedGallery(),

  bookingEyebrow: "Dalbo",
  bookingTitle: "Ballan Qabso Hadda",
  bookingText: "Buuxi foomka, waxaan si degdeg ah kugula soo xidhiidhaynaa.",
  bookingNameLabel: "Magacaga oo Saddexan",
  bookingPhoneLabel: "Lambarka Taleefanka",
  bookingTypeLabel: "Dooro Nooca Dharka",
  bookingNotesLabel: "Faahfaahi Dalabkaaga",
  bookingSubmit: "Dalbo Hada",

  faqEyebrow: "Su'aalo",
  faqTitle: "Su'aalaha Badanaa La Weydiiyo",
  faqs: defaultFaqs,

  contactEyebrow: "Xiriir",
  contactTitle: "Nala Soo Xiriir",
  contactText: "Waxaan diyaar u nahay qiyaas, qiimo iyo talo naqshad.",
  contactImage: images.measureLight,
  contactHoursLabel: "Saacadaha Furitaanka",
  contactCtaTitle: "Diyaar ma tahay dalabkaaga?",
  contactCtaText: "Nagala hadal WhatsApp oo hel jawaab degdeg ah.",
  contactCtaButton: "WhatsApp Nagala Soo Xiriir",
  hours: [
    { id: "h-1", days: "Sabti – Khamiis", time: "8:00 AM – 9:00 PM" },
    { id: "h-2", days: "Jimce", time: "Xiran" },
  ],

  mapTitle: "Halkee naga heli kartaa",
  mapText: "Booqo dukaankeena — ku dhufo tilmaamaha si aad noo soo martid.",
  mapUrl: MAP_URL,
  mapEmbedUrl: "",
  mapButtonLabel: "Fur Google Maps",

  footerNote: "Dhammaan xuquuqda way dhowran yihiin.",

  whatsapp: "251940744442",
  phone: "+251940744442",
  email: "Billaalyare88@gmail.com",
  facebook: "https://facebook.com",
  instagram: "",
  whatsappMessage: "Salaan, waxaan rabaa inaan dalbado adeeg tolid.",
  orderMessage: "Salaan, waxaan rabaa inaan dalbado adeegga {item}.",
  bookingMessage: "ASC BILAAL TAILOR, waxaan rabaa in aan dalbado:",

  admins: [
    { id: "root", email: "Billaalyare88@gmail.com", password: "secure#4", protected: true },
  ],
};

const uid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

type SaveState = "idle" | "saved" | "error";

type Ctx = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  /** Explicit "Save Changes" — persists and reports success/failure. */
  save: () => Promise<boolean>;
  saveState: SaveState;
  dirty: boolean;
  updateItem: (id: string, patch: Partial<GalleryItem>) => void;
  addItem: (category: string) => void;
  removeItem: (id: string) => void;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  addService: () => void;
  removeService: (id: string) => void;
  updateFaq: (id: string, patch: Partial<FaqItem>) => void;
  addFaq: () => void;
  removeFaq: (id: string) => void;
  updateHour: (id: string, patch: Partial<HourItem>) => void;
  addHour: () => void;
  removeHour: (id: string) => void;
  addAdmin: (email: string, password: string) => void;
  updateAdmin: (id: string, patch: Partial<Omit<AdminUser, "id" | "protected">>) => void;
  removeAdmin: (id: string) => void;
  reset: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

/** Migrate saved content so new editable fields and gallery categories exist. */
function normalize(saved: Partial<SiteContent>): SiteContent {
  const next: SiteContent = { ...defaultContent, ...saved };

  // Drop legacy preview-only asset URLs so images resolve from /assets in production.
  for (const [k, v] of Object.entries(next)) {
    if (typeof v === "string" && v.includes("/__l5e/")) {
      (next as Record<string, unknown>)[k] = (defaultContent as Record<string, unknown>)[k];
    }
  }

  // Gallery: keep saved photos, but enforce the required category structure.
  const savedGallery = Array.isArray(saved.gallery) ? saved.gallery : [];
  const clean = savedGallery
    .filter((g) => g && typeof g.category === "string")
    .map((g) => ({
      ...g,
      imageUrl: typeof g.imageUrl === "string" && !g.imageUrl.includes("/__l5e/") ? g.imageUrl : "",
    }));
  const usesNewCategories = clean.some((g) => galleryCategoryNames.includes(g.category));
  next.gallery = usesNewCategories
    ? GALLERY_CATEGORIES.flatMap((c) => {
        const existing = clean.filter((g) => g.category === c.name);
        const missing = Math.max(0, c.count - existing.length);
        return [
          ...existing,
          ...Array.from({ length: missing }, (_, i) => ({
            id: `${c.name.toLowerCase().replace(/\s+/g, "-")}-${existing.length + i + 1}`,
            category: c.name,
            label: `${c.name} ${existing.length + i + 1}`,
            imageUrl: "",
            visible: true,
          })),
        ];
      })
    : seedGallery();

  // Arrays that gained ids / must never be empty.
  next.services = Array.isArray(saved.services) && saved.services.length
    ? saved.services.map((s, i) => ({ ...defaultServices[0], ...s, id: s.id || `svc-${i}` }))
    : defaultServices;
  next.faqs = Array.isArray(saved.faqs) && saved.faqs.length
    ? saved.faqs.map((f, i) => ({ ...f, id: f.id || `faq-${i}` }))
    : defaultFaqs;
  next.hours = Array.isArray(saved.hours) && saved.hours.length
    ? saved.hours.map((h, i) => ({ ...h, id: h.id || `h-${i}` }))
    : defaultContent.hours;

  // The first admin is always protected and always present.
  const admins = Array.isArray(saved.admins) && saved.admins.length ? saved.admins : defaultContent.admins;
  next.admins = admins.map((a, i) => ({ ...a, protected: i === 0 ? true : undefined }));

  return next;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [dirty, setDirty] = useState(false);

  // Load the shared website content from Supabase after hydration.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("id", "main")
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        if (data?.content) {
          setContent(normalize(data.content as Partial<SiteContent>));
          return;
        }

        // The table may be empty on first run. Keep the bundled defaults
        // locally until the authenticated Admin saves them to Supabase.
        setContent(normalize(defaultContent));
      } catch (error) {
        console.error("Failed to load website content from Supabase:", error);
        // Keep the bundled defaults available if Supabase is unavailable.
        if (!cancelled) setContent(normalize(defaultContent));
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: SiteContent) => {
    setContent(next);
    setDirty(true);
    setSaveState("idle");
  }, []);

  const value = useMemo<Ctx>(() => {
    const patch = (p: Partial<SiteContent>) => persist(normalize({ ...content, ...p }));

    return {
      content,
      dirty,
      saveState,
      update: patch,
      save: async () => {
        try {
          setSaveState("idle");

          const { error } = await supabase
            .from("site_content")
            .upsert(
              {
                id: "main",
                content: normalize(content),
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" },
            );

          if (error) throw error;

          setSaveState("saved");
          setDirty(false);
          return true;
        } catch (error) {
          console.error("Failed to save website content to Supabase:", error);
          setSaveState("error");
          return false;
        }
      },
      updateItem: (id, p) =>
        patch({ gallery: content.gallery.map((g) => (g.id === id ? { ...g, ...p } : g)) }),
      addItem: (category) => {
        const count = content.gallery.filter((g) => g.category === category).length + 1;
        patch({
          gallery: [
            ...content.gallery,
            {
              id: uid(category.toLowerCase().replace(/\s+/g, "-")),
              category,
              label: `${category} ${count}`,
              imageUrl: "",
              visible: true,
            },
          ],
        });
      },
      removeItem: (id) => patch({ gallery: content.gallery.filter((g) => g.id !== id) }),
      updateService: (id, p) =>
        patch({ services: content.services.map((s) => (s.id === id ? { ...s, ...p } : s)) }),
      addService: () =>
        patch({
          services: [
            ...content.services,
            { id: uid("svc"), key: "Adeeg cusub", title: "Adeeg cusub", short: "", long: "", icon: "suit" },
          ],
        }),
      removeService: (id) => patch({ services: content.services.filter((s) => s.id !== id) }),
      updateFaq: (id, p) =>
        patch({ faqs: content.faqs.map((f) => (f.id === id ? { ...f, ...p } : f)) }),
      addFaq: () => patch({ faqs: [...content.faqs, { id: uid("faq"), q: "Su'aal cusub", a: "" }] }),
      removeFaq: (id) => patch({ faqs: content.faqs.filter((f) => f.id !== id) }),
      updateHour: (id, p) =>
        patch({ hours: content.hours.map((h) => (h.id === id ? { ...h, ...p } : h)) }),
      addHour: () => patch({ hours: [...content.hours, { id: uid("h"), days: "", time: "" }] }),
      removeHour: (id) => patch({ hours: content.hours.filter((h) => h.id !== id) }),
      addAdmin: (email, password) =>
        patch({ admins: [...content.admins, { id: uid("admin"), email, password }] }),
      updateAdmin: (id, p) =>
        patch({ admins: content.admins.map((a) => (a.id === id ? { ...a, ...p } : a)) }),
      removeAdmin: (id) =>
        patch({ admins: content.admins.filter((a) => a.id !== id || a.protected) }),
      reset: () => persist(normalize(defaultContent)),
    };
  }, [content, persist, dirty, saveState]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

/** Build WhatsApp links from the admin-managed number and auto messages. */
export function useLinks() {
  const { content } = useContent();
  const wa = (message: string) =>
    `https://wa.me/${content.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
  return {
    content,
    waGeneral: () => wa(content.whatsappMessage),
    waOrder: (item: string) => wa((content.orderMessage || "{item}").replace(/\{item\}/g, item)),
    wa,
  };
}

/** Navigation is fully editable from Admin. */
export function useNavLinks() {
  const { content } = useContent();
  return [
    { to: "/", label: content.navHome },
    { to: "/about", label: content.navAbout },
    { to: "/services", label: content.navServices },
    { to: "/gallery", label: content.navGallery },
    { to: "/contact", label: content.navContact },
  ] as const;
}
