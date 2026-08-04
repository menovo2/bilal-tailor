import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Info,
  LayoutTemplate,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Scissors,
  Search,
  Trash2,
  Upload,
  Link2,
  Settings,
  ImagePlus,
  UserPlus,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "@/lib/utils";
import { CropModal } from "@/components/admin/crop-modal";
import { fileToDataUrl } from "@/lib/image-tools";
import {
  adminAccountExists,
  bootstrapFirstAdmin,
  createAdminAccount,
  deleteAdminAccount,
  listAdminAccounts,
  updateAdminAccount,
} from "@/lib/admin-accounts.functions";
import { supabase } from "@/integrations/supabase/client";
import { images, site } from "@/lib/site";
import {
  useContent,
  galleryCategoryNames,
  GALLERY_CATEGORIES,
  type SiteContent,
} from "@/lib/content-store";
import { mockBookings, mockMessages, type Booking } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BILAL TAILOR" },
      { name: "description", content: "Maamulka websaydka BILAL TAILOR." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — BILAL TAILOR" },
      { property: "og:description", content: "Maamulka websaydka BILAL TAILOR." },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const sections = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "brand", label: "Brand & Menu", icon: LayoutTemplate },
  { key: "home", label: "Home Page", icon: Home },
  { key: "about", label: "About Page", icon: Info },
  { key: "services", label: "Services", icon: Scissors },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "booking", label: "Booking", icon: CalendarCheck },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "contact", label: "Contact & Footer", icon: MessageSquare },
  { key: "map", label: "Location / Map", icon: MapPin },
  { key: "backgrounds", label: "Backgrounds", icon: ImagePlus },
  { key: "links", label: "Links & Messages", icon: Link2 },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type SectionKey = (typeof sections)[number]["key"];

const inputClass =
  "mt-2 w-full rounded-lg border border-navy-line bg-navy px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/70";

const labelClass =
  "text-[0.62rem] tracking-[0.2em] text-white/70 uppercase";

const cardClass =
  "rounded-xl border border-navy-line bg-navy-2 p-4 text-white shadow-luxe sm:p-6";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors disabled:opacity-50";

const btnPrimary = cn(btn, "bg-white text-navy hover:bg-white/85");

const btnGhost = cn(
  btn,
  "border border-navy-line text-white hover:bg-navy-3",
);

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setAuthed(!!data.session);
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setAuthed(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy text-white">
        <p className="text-sm tracking-[0.2em] uppercase">
          Loading...
        </p>
      </div>
    );
  }

  return authed ? (
    <Dashboard
      onLogout={async () => {
        await supabase.auth.signOut();
        setAuthed(false);
      }}
    />
  ) : (
    <Login onLogin={() => setAuthed(true)} />
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const { content } = useContent();
  const checkExists = useServerFn(adminAccountExists);
  const bootstrap = useServerFn(bootstrapFirstAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  // First run: no admin account exists yet, so offer a one-time secure setup.
  useEffect(() => {
    let mounted = true;
    checkExists({})
      .then((res) => {
        if (mounted) setSetupMode(!res.exists);
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [checkExists]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (setupMode) {
        if (password.length < 6) {
          setError("Password-ka waa inuu ka badan yahay 6 xaraf.");
          return;
        }
        await bootstrap({ data: { email: email.trim(), password } });
        setSetupMode(false);
      }

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        console.error("Login error:", loginError);
        setError("Email ama password khaldan.");
        return;
      }

      onLogin();
    } catch (err) {
      console.error("Admin login error:", err);
      setError(
        "Login-ku wuu fashilmay. Fadlan mar kale isku day.",
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4 py-12">
      <form
        onSubmit={handleLogin}
        className={cn(cardClass, "w-full max-w-md")}
      >
        <img
          src={content.logoImage || images.logo}
          alt={`Astaanta ${site.name}`}
          width={80}
          height={80}
          className="mx-auto h-20 w-20 rounded-full border border-navy-line bg-white object-contain p-1"
        />

        <h1 className="mt-5 text-center font-display text-3xl text-white">
          {setupMode ? "Setup Admin" : "Admin Panel"}
        </h1>

        <p className="mt-2 text-center text-xs tracking-[0.2em] text-white/60 uppercase">
          {content.brandName} {content.brandSub}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={cn(btnPrimary, "mt-6 w-full")}
        >
          {loading ? "La galayaa..." : setupMode ? "Samee admin-ka koowaad" : "Gal"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>

      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

/**
 * Image input:
 * - Paste a URL
 * - Upload an image from device
 */
function ImageField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const onFile = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      onChange(String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-w-0">
      <Field
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <label className="mt-2 block">
        <span className="text-[0.58rem] tracking-[0.2em] text-white/50 uppercase">
          Ama soo geli sawir device-kaaga
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e.target.files?.[0])}
          className={cn(
            inputClass,
            "file:mr-3 file:rounded file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-xs file:text-white",
          )}
        />
      </label>

      {value ? (
        <button
          type="button"
          className={cn(btnGhost, "mt-2")}
          onClick={() => onChange("")}
        >
          <Trash2 size={13} /> Tirtir sawirka
        </button>
      ) : null}
    </div>
  );
}

function Panel({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cardClass}>
      <h2 className="font-display text-xl text-white">
        {title}
      </h2>

      {hint ? (
        <p className="mt-1 text-sm text-white/60">{hint}</p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const {
    content,
    update,
    save,
    saveState,
    dirty,
    updateItem,
    addItem,
    removeItem,
    updateService,
    addService,
    removeService,
    updateFaq,
    addFaq,
    removeFaq,
    updateHour,
    addHour,
    removeHour,
    reset,
  } = useContent();

  const [section, setSection] =
    useState<SectionKey>("dashboard");

  const [query, setQuery] = useState("");

  const [bookings, setBookings] =
    useState<Booking[]>(mockBookings);

  const [filter, setFilter] = useState(galleryCategoryNames[0]);

  const set =
    (key: keyof SiteContent) =>
    (v: string) => {
      update({ [key]: v } as Partial<SiteContent>);
    };

  const filteredGallery = useMemo(
    () =>
      content.gallery.filter(
        (g) =>
          g.category === filter &&
          g.label
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [content.gallery, query, filter],
  );

  const stats = [
    {
      label: "Sawirada Gallery",
      value: String(content.gallery.length),
    },
    {
      label: "Sawiro dhab ah",
      value: String(
        content.gallery.filter((g) => g.imageUrl).length,
      ),
    },
    {
      label: "Adeegyada",
      value: String(content.services.length),
    },
    {
      label: "FAQ",
      value: String(content.faqs.length),
    },
  ];

  return (
    <div className="min-h-screen bg-navy text-white lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-navy-line bg-navy-2 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-4 py-4">
          <img
            src={content.logoImage || images.logo}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full border border-navy-line bg-white object-contain p-0.5"
          />

          <div className="min-w-0">
            <p className="truncate font-display text-base tracking-[0.2em] text-white">
              {content.brandName}
            </p>

            <p className="text-[0.55rem] tracking-[0.34em] text-white/55">
              ADMIN
            </p>
          </div>
        </div>

        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.68rem] tracking-[0.12em] uppercase transition-colors",
                section === s.key
                  ? "bg-white text-navy"
                  : "text-white/75 hover:bg-navy-3",
              )}
            >
              <s.icon size={15} />
              {s.label}
            </button>
          ))}

          <button
            onClick={onLogout}
            className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[0.68rem] tracking-[0.12em] text-white/75 uppercase transition-colors hover:bg-navy-3"
          >
            <LogOut size={15} />
            Ka bax
          </button>
        </nav>
      </aside>

      <div className="p-4 pb-28 sm:p-6">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl text-white sm:text-3xl">
              {
                sections.find(
                  (s) => s.key === section,
                )?.label
              }
            </h1>

            <p className="mt-0.5 text-[0.62rem] tracking-[0.18em] text-white/55 uppercase">
              Maamulka websaydka
            </p>
          </div>

          <div className="relative shrink-0">
            <Search
              size={15}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-white/60"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Raadi..."
              aria-label="Raadi"
              className="w-32 rounded-full border border-navy-line bg-navy py-2 pr-3 pl-9 text-sm text-white outline-none focus:border-white/70 sm:w-56"
            />
          </div>
        </header>

        <div className="mt-5 space-y-5">
          {section === "dashboard" ? (
            <>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <li
                    key={s.label}
                    className={cardClass}
                  >
                    <p className="text-[0.6rem] tracking-[0.2em] text-white/60 uppercase">
                      {s.label}
                    </p>

                    <p className="mt-2 font-display text-3xl text-white">
                      {s.value}
                    </p>
                  </li>
                ))}
              </ul>

              <div className={cardClass}>
                <h2 className="font-display text-xl">
                  Dalabyada ugu dambeeyay
                </h2>

                <BookingsTable
                  bookings={bookings.slice(0, 3)}
                  setBookings={setBookings}
                />
              </div>

              <div
                className={cn(
                  cardClass,
                  "flex flex-wrap items-center gap-3",
                )}
              >
                <p className="min-w-0 text-sm text-white/70">
                  Dib u celi dhammaan qoraalada iyo
                  sawirada sida asalka ah.
                </p>

                <button
                  className={cn(btnGhost, "ml-auto")}
                  onClick={reset}
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              </div>
            </>
          ) : null}

          {section === "brand" ? (
            <>
              <Panel
                title="Astaanta & Magaca"
                hint="Logo-ga iyo magaca websaydka."
              >
                <ImageField
                  label="Logo"
                  value={content.logoImage}
                  onChange={set("logoImage")}
                  placeholder="/assets/logo.png"
                />

                <div className="grid gap-4">
                  <Field
                    label="Magaca weyn"
                    value={content.brandName}
                    onChange={set("brandName")}
                  />

                  <Field
                    label="Magaca hoose"
                    value={content.brandSub}
                    onChange={set("brandSub")}
                  />
                </div>
              </Panel>

              <Panel
                title="Menu (Navigation)"
                hint="Beddel magacyada menu-ga."
              >
                <Field
                  label="Home"
                  value={content.navHome}
                  onChange={set("navHome")}
                />

                <Field
                  label="About"
                  value={content.navAbout}
                  onChange={set("navAbout")}
                />

                <Field
                  label="Services"
                  value={content.navServices}
                  onChange={set("navServices")}
                />

                <Field
                  label="Gallery"
                  value={content.navGallery}
                  onChange={set("navGallery")}
                />

                <Field
                  label="Contact"
                  value={content.navContact}
                  onChange={set("navContact")}
                />

                <Field
                  label="Badhanka WhatsApp"
                  value={content.navCta}
                  onChange={set("navCta")}
                />
              </Panel>
            </>
          ) : null}

          {section === "home" ? (
            <>
              <Panel title="Hero (Home)">
                <Field
                  label="Eyebrow"
                  value={content.heroEyebrow}
                  onChange={set("heroEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.heroTitle}
                  onChange={set("heroTitle")}
                />

                <Field
                  label="Qeybta gold"
                  value={content.heroHighlight}
                  onChange={set("heroHighlight")}
                />

                <ImageField
                  label="Sawirka background"
                  value={content.heroImage}
                  onChange={set("heroImage")}
                />

                <div className="lg:col-span-2">
                  <Field
                    label="Qoraalka"
                    value={content.heroText}
                    onChange={set("heroText")}
                    textarea
                  />
                </div>

                <Field
                  label="Badhanka 1"
                  value={content.heroCtaPrimary}
                  onChange={set("heroCtaPrimary")}
                />

                <Field
                  label="Badhanka 2"
                  value={content.heroCtaSecondary}
                  onChange={set("heroCtaSecondary")}
                />
              </Panel>

              <Panel title="Qeybta Sawirrada (Home)">
                <Field
                  label="Eyebrow"
                  value={content.homeGalleryEyebrow}
                  onChange={set("homeGalleryEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.homeGalleryTitle}
                  onChange={set("homeGalleryTitle")}
                />

                <Field
                  label="Badhanka"
                  value={content.homeGalleryCta}
                  onChange={set("homeGalleryCta")}
                />
              </Panel>
            </>
          ) : null}

          {section === "about" ? (
            <Panel title="About Page">
              <Field
                label="Eyebrow"
                value={content.aboutEyebrow}
                onChange={set("aboutEyebrow")}
              />

              <Field
                label="Cinwaanka"
                value={content.aboutTitle}
                onChange={set("aboutTitle")}
              />

              <div className="lg:col-span-2">
                <Field
                  label="Qoraalka hero"
                  value={content.aboutText}
                  onChange={set("aboutText")}
                  textarea
                  rows={2}
                />
              </div>

              <Field
                label="Sheekada — eyebrow"
                value={content.aboutStoryEyebrow}
                onChange={set("aboutStoryEyebrow")}
              />

              <Field
                label="Sheekada — cinwaan"
                value={content.aboutStoryTitle}
                onChange={set("aboutStoryTitle")}
              />

              <div className="lg:col-span-2">
                <Field
                  label="Sheekada — qoraal (kala saar sadar cusub)"
                  value={content.aboutStoryBody}
                  onChange={set("aboutStoryBody")}
                  textarea
                  rows={6}
                />
              </div>

              <ImageField
                label="Sawirka About"
                value={content.aboutImage}
                onChange={set("aboutImage")}
              />
            </Panel>
          ) : null}

          {section === "services" ? (
            <>
              <Panel title="Qoraalka guud ee Services">
                <Field
                  label="Eyebrow"
                  value={content.servicesEyebrow}
                  onChange={set("servicesEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.servicesTitle}
                  onChange={set("servicesTitle")}
                />

                <Field
                  label="Qoraalka"
                  value={content.servicesText}
                  onChange={set("servicesText")}
                />

                <Field
                  label="Badhanka dalabka"
                  value={content.serviceOrderCta}
                  onChange={set("serviceOrderCta")}
                />

                <Field
                  label="Qoraalka Coming Soon"
                  value={content.comingSoonLabel}
                  onChange={set("comingSoonLabel")}
                />

                <ImageField
                  label="Sawirka Coming Soon"
                  value={content.comingSoonImage}
                  onChange={set("comingSoonImage")}
                  placeholder="/assets/coming-soon.png"
                />
              </Panel>

              <div className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl">
                    Adeegyada
                  </h2>

                  <button
                    className={btnPrimary}
                    onClick={addService}
                  >
                    <Plus size={14} />
                    Ku dar adeeg
                  </button>
                </div>

                <ul className="mt-4 space-y-4">
                  {content.services.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-lg border border-navy-line p-3 sm:p-4"
                    >
                      <div className="grid gap-3 lg:grid-cols-2">
                        <Field
                          label="Magaca (key WhatsApp)"
                          value={s.key}
                          onChange={(v) =>
                            updateService(s.id, {
                              key: v,
                            })
                          }
                        />

                        <Field
                          label="Cinwaanka"
                          value={s.title}
                          onChange={(v) =>
                            updateService(s.id, {
                              title: v,
                            })
                          }
                        />

                        <div className="lg:col-span-2">
                          <Field
                            label="Sharaxaad kooban"
                            value={s.short}
                            onChange={(v) =>
                              updateService(s.id, {
                                short: v,
                              })
                            }
                            textarea
                            rows={2}
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <Field
                            label="Sharaxaad dheer"
                            value={s.long}
                            onChange={(v) =>
                              updateService(s.id, {
                                long: v,
                              })
                            }
                            textarea
                            rows={3}
                          />
                        </div>
                      </div>

                      <button
                        className={cn(btnGhost, "mt-3")}
                        onClick={() =>
                          removeService(s.id)
                        }
                        aria-label={`Tirtir ${s.title}`}
                      >
                        <Trash2 size={13} />
                        Tirtir
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {section === "gallery" ? (
            <>
              <Panel title="Qoraalada Gallery">
                <Field
                  label="Eyebrow"
                  value={content.galleryEyebrow}
                  onChange={set("galleryEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.galleryTitle}
                  onChange={set("galleryTitle")}
                />

                <Field
                  label="Qoraalka"
                  value={content.galleryText}
                  onChange={set("galleryText")}
                />

                <Field
                  label='Badhanka "Dhammaan"'
                  value={content.galleryAllLabel}
                  onChange={set("galleryAllLabel")}
                />

                <Field
                  label="Qoraalka kaarka (Daawo)"
                  value={content.galleryViewLabel}
                  onChange={set("galleryViewLabel")}
                />

                <Field
                  label="Badhanka modal-ka"
                  value={content.galleryModalCta}
                  onChange={set("galleryModalCta")}
                />

                <div className="lg:col-span-2">
                  <Field
                    label="Qoraalka modal-ka"
                    value={content.galleryModalText}
                    onChange={set("galleryModalText")}
                    textarea
                    rows={2}
                  />
                </div>
              </Panel>

              <div className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {GALLERY_CATEGORIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() =>
                          setFilter(c.name)
                        }
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-[0.6rem] tracking-[0.16em] uppercase transition-colors",
                          filter === c.name
                            ? "border-white bg-white text-navy"
                            : "border-navy-line text-white/75 hover:bg-navy-3",
                        )}
                      >
                        {c.name} ·{" "}
                        {
                          content.gallery.filter(
                            (g) =>
                              g.category ===
                              c.name,
                          ).length
                        }
                        /{c.count}
                      </button>
                    ))}
                  </div>

                  <button
                    className={btnPrimary}
                    onClick={() =>
                      addItem(filter)
                    }
                  >
                    <Plus size={14} />
                    Ku dar sawir
                  </button>
                </div>

                <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGallery.map((g) => (
                    <li
                      key={g.id}
                      className="rounded-lg border border-navy-line p-3"
                    >
                      <img
                        src={
                          g.imageUrl ||
                          content.comingSoonImage
                        }
                        alt={g.label}
                        loading="lazy"
                        className="aspect-4/3 w-full rounded-md object-cover"
                      />

                      <div className="mt-3 space-y-3">
                        <Field
                          label="Magaca"
                          value={g.label}
                          onChange={(v) =>
                            updateItem(g.id, {
                              label: v,
                            })
                          }
                        />

                        <ImageField
                          label="Sawirka"
                          value={g.imageUrl}
                          onChange={(v) =>
                            updateItem(g.id, {
                              imageUrl: v,
                            })
                          }
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          className={btnGhost}
                          onClick={() =>
                            updateItem(g.id, {
                              visible: !g.visible,
                            })
                          }
                        >
                          {g.visible ? (
                            <EyeOff size={13} />
                          ) : (
                            <Eye size={13} />
                          )}

                          {g.visible
                            ? "Qari"
                            : "Muuji"}
                        </button>

                        <button
                          className={btnGhost}
                          aria-label={`Tirtir ${g.label}`}
                          onClick={() =>
                            removeItem(g.id)
                          }
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {filteredGallery.length === 0 ? (
                  <p className="mt-4 text-sm text-white/60">
                    Wax natiijo lama helin.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {section === "booking" ? (
            <Panel title="Foomka Ballanta">
              <Field
                label="Eyebrow"
                value={content.bookingEyebrow}
                onChange={set("bookingEyebrow")}
              />

              <Field
                label="Cinwaanka"
                value={content.bookingTitle}
                onChange={set("bookingTitle")}
              />

              <div className="lg:col-span-2">
                <Field
                  label="Qoraalka"
                  value={content.bookingText}
                  onChange={set("bookingText")}
                  textarea
                  rows={2}
                />
              </div>

              <Field
                label="Label magaca"
                value={content.bookingNameLabel}
                onChange={set("bookingNameLabel")}
              />

              <Field
                label="Label taleefanka"
                value={content.bookingPhoneLabel}
                onChange={set("bookingPhoneLabel")}
              />

              <Field
                label="Label nooca"
                value={content.bookingTypeLabel}
                onChange={set("bookingTypeLabel")}
              />

              <Field
                label="Label faahfaahinta"
                value={content.bookingNotesLabel}
                onChange={set("bookingNotesLabel")}
              />

              <Field
                label="Badhanka dirista"
                value={content.bookingSubmit}
                onChange={set("bookingSubmit")}
              />
            </Panel>
          ) : null}

          {section === "faq" ? (
            <>
              <Panel title="Qoraalka FAQ">
                <Field
                  label="Eyebrow"
                  value={content.faqEyebrow}
                  onChange={set("faqEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.faqTitle}
                  onChange={set("faqTitle")}
                />
              </Panel>

              <div className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl">
                    Su'aalaha
                  </h2>

                  <button
                    className={btnPrimary}
                    onClick={addFaq}
                  >
                    <Plus size={14} />
                    Ku dar su'aal
                  </button>
                </div>

                <ul className="mt-4 space-y-4">
                  {content.faqs.map((f) => (
                    <li
                      key={f.id}
                      className="rounded-lg border border-navy-line p-3 sm:p-4"
                    >
                      <Field
                        label="Su'aal"
                        value={f.q}
                        onChange={(v) =>
                          updateFaq(f.id, {
                            q: v,
                          })
                        }
                      />

                      <Field
                        label="Jawaab"
                        value={f.a}
                        onChange={(v) =>
                          updateFaq(f.id, {
                            a: v,
                          })
                        }
                        textarea
                        rows={3}
                      />

                      <button
                        className={cn(
                          btnGhost,
                          "mt-3",
                        )}
                        onClick={() =>
                          removeFaq(f.id)
                        }
                      >
                        <Trash2 size={13} />
                        Tirtir su'aashan
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {section === "contact" ? (
            <>
              <Panel title="Qeybta Xiriirka">
                <Field
                  label="Eyebrow"
                  value={content.contactEyebrow}
                  onChange={set("contactEyebrow")}
                />

                <Field
                  label="Cinwaanka"
                  value={content.contactTitle}
                  onChange={set("contactTitle")}
                />

                <div className="lg:col-span-2">
                  <Field
                    label="Qoraalka"
                    value={content.contactText}
                    onChange={set("contactText")}
                    textarea
                    rows={2}
                  />
                </div>

                <Field
                  label="Label saacadaha"
                  value={content.contactHoursLabel}
                  onChange={set("contactHoursLabel")}
                />

                <Field
                  label="CTA cinwaan"
                  value={content.contactCtaTitle}
                  onChange={set("contactCtaTitle")}
                />

                <Field
                  label="CTA qoraal"
                  value={content.contactCtaText}
                  onChange={set("contactCtaText")}
                />

                <Field
                  label="CTA badhan"
                  value={content.contactCtaButton}
                  onChange={set("contactCtaButton")}
                />

                <Field
                  label="Footer qoraal"
                  value={content.footerNote}
                  onChange={set("footerNote")}
                />
              </Panel>

              <div className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl">
                    Saacadaha Furitaanka
                  </h2>

                  <button
                    className={btnPrimary}
                    onClick={addHour}
                  >
                    <Plus size={14} />
                    Ku dar
                  </button>
                </div>

                <ul className="mt-4 space-y-3">
                  {content.hours.map((h) => (
                    <li
                      key={h.id}
                      className="grid gap-3 rounded-lg border border-navy-line p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                    >
                      <Field
                        label="Maalmaha"
                        value={h.days}
                        onChange={(v) =>
                          updateHour(h.id, {
                            days: v,
                          })
                        }
                      />

                      <Field
                        label="Saacadaha"
                        value={h.time}
                        onChange={(v) =>
                          updateHour(h.id, {
                            time: v,
                          })
                        }
                      />

                      <button
                        className={btnGhost}
                        onClick={() =>
                          removeHour(h.id)
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {section === "map" ? (
            <Panel
              title="Google Maps"
              hint="Halkan ka beddel goobta dukaanka."
            >
              <Field
                label="Cinwaanka"
                value={content.mapTitle}
                onChange={set("mapTitle")}
              />

              <Field
                label="Qoraalka"
                value={content.mapText}
                onChange={set("mapText")}
              />

              <Field
                label="Google Maps link"
                value={content.mapUrl}
                onChange={set("mapUrl")}
                placeholder="https://maps.app.goo.gl/..."
              />

              <Field
                label="Embed URL (ikhtiyaari)"
                value={content.mapEmbedUrl}
                onChange={set("mapEmbedUrl")}
                placeholder="https://www.google.com/maps?q=...&output=embed"
              />

              <Field
                label="Badhanka"
                value={content.mapButtonLabel}
                onChange={set("mapButtonLabel")}
              />
            </Panel>
          ) : null}

          {section === "backgrounds" ? (
            <Panel
              title="Sawirada Background"
              hint="URL ama upload device-kaaga."
            >
              <ImageField
                label="Home (hero)"
                value={content.heroImage}
                onChange={set("heroImage")}
              />

              <ImageField
                label="About"
                value={content.aboutImage}
                onChange={set("aboutImage")}
              />

              <ImageField
                label="Services"
                value={content.servicesImage}
                onChange={set("servicesImage")}
              />

              <ImageField
                label="Gallery"
                value={content.galleryImage}
                onChange={set("galleryImage")}
              />

              <ImageField
                label="Contact"
                value={content.contactImage}
                onChange={set("contactImage")}
              />

              <ImageField
                label="Coming Soon"
                value={content.comingSoonImage}
                onChange={set("comingSoonImage")}
                placeholder="/assets/coming-soon.png"
              />

              <ImageField
                label="Logo"
                value={content.logoImage}
                onChange={set("logoImage")}
              />
            </Panel>
          ) : null}

          {section === "links" ? (
            <Panel title="Links & Fariimaha Automatic">
              <Field
                label="WhatsApp (lambar)"
                value={content.whatsapp}
                onChange={set("whatsapp")}
                placeholder="251940744442"
              />

              <Field
                label="Telefoon"
                value={content.phone}
                onChange={set("phone")}
              />

              <Field
                label="Iimayl"
                value={content.email}
                onChange={set("email")}
              />

              <Field
                label="Facebook"
                value={content.facebook}
                onChange={set("facebook")}
              />

              <Field
                label="Instagram"
                value={content.instagram}
                onChange={set("instagram")}
              />

              <div className="lg:col-span-2">
                <Field
                  label="Fariinta guud"
                  value={content.whatsappMessage}
                  onChange={set("whatsappMessage")}
                  textarea
                  rows={2}
                />
              </div>

              <div className="lg:col-span-2">
                <Field
                  label="Fariinta dalabka — isticmaal {item}"
                  value={content.orderMessage}
                  onChange={set("orderMessage")}
                  textarea
                  rows={2}
                />
              </div>

              <div className="lg:col-span-2">
                <Field
                  label="Fariinta foomka ballanta"
                  value={content.bookingMessage}
                  onChange={set("bookingMessage")}
                  textarea
                  rows={2}
                />
              </div>
            </Panel>
          ) : null}

          {section === "bookings" ? (
            <div className={cardClass}>
              <BookingsTable
                bookings={bookings.filter(
                  (b) =>
                    b.name
                      .toLowerCase()
                      .includes(
                        query.toLowerCase(),
                      ) ||
                    b.type
                      .toLowerCase()
                      .includes(
                        query.toLowerCase(),
                      ),
                )}
                setBookings={setBookings}
              />
            </div>
          ) : null}

          {section === "messages" ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {mockMessages
                .filter((m) =>
                  m.text
                    .toLowerCase()
                    .includes(
                      query.toLowerCase(),
                    ),
                )
                .map((m) => (
                  <li
                    key={m.id}
                    className={cardClass}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate font-display text-lg">
                        {m.name}
                      </p>

                      <span className="shrink-0 rounded-full border border-navy-line px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase">
                        {m.channel}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-white/70">
                      {m.text}
                    </p>

                    <p className="mt-3 text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
                      {m.date}
                    </p>
                  </li>
                ))}
            </ul>
          ) : null}

          {section === "settings" ? (
            <SettingsPanel />
          ) : null}
        </div>
      </div>

      {/* Persistent Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-line bg-navy-2/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="min-w-0 text-xs text-white/70">
            {saveState === "saved"
              ? "Isbeddelada waa la kaydiyay — websaydku wuu cusboonaaday ✓"
              : saveState === "error"
                ? "Khalad: lama kaydin karin."
                : dirty
                  ? "Waxaa jira isbeddel aan la kaydin."
                  : "Dhammaan waa la kaydiyay."}
          </p>

          <button
            className={btnPrimary}
            onClick={async () => {
              const success = await save();

              if (!success) {
                console.error(
                  "Failed to save website content.",
                );
              }
            }}
          >
            {saveState === "saved" ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}

            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

type AdminAccount = { id: string; email: string; isCurrent: boolean; isFirst: boolean };

function SettingsPanel() {
  const listAdmins = useServerFn(listAdminAccounts);
  const createAdmin = useServerFn(createAdminAccount);
  const updateAdmin = useServerFn(updateAdminAccount);
  const deleteAdmin = useServerFn(deleteAdminAccount);

  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { email: string; password: string }>>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await listAdmins({});
      setAdmins(res.admins);
      setDrafts(
        Object.fromEntries(res.admins.map((a) => [a.id, { email: a.email, password: "" }])),
      );
    } catch (error) {
      console.error(error);
      setNote("Liiska admin-yada lama soo saarin.");
    }
  }, [listAdmins]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    setNote("");
    try {
      await fn();
      await refresh();
      setNote(ok);
    } catch (error) {
      console.error(error);
      setNote("Wax khaldan ayaa dhacay. Fadlan mar kale isku day.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className={cardClass}>
        <h2 className="font-display text-xl">Admins</h2>

        <p className="mt-1 text-sm text-white/60">
          Beddel iimaylka iyo password-ka. Password-yada waxaa lagu kaydiyaa nidaam ammaan ah
          — qofna kama arki karo websaydka. Admin-ka koowaad lama tirtiri karo.
        </p>

        <ul className="mt-4 space-y-4">
          {admins.map((a) => (
            <li key={a.id} className="rounded-lg border border-navy-line p-3 sm:p-4">
              <div className="grid gap-3 lg:grid-cols-2">
                <Field
                  label="Iimayl"
                  value={drafts[a.id]?.email ?? a.email}
                  onChange={(v) =>
                    setDrafts((d) => ({ ...d, [a.id]: { ...d[a.id], email: v } }))
                  }
                />

                <Field
                  label="Password cusub (haddii aad rabto)"
                  value={drafts[a.id]?.password ?? ""}
                  onChange={(v) =>
                    setDrafts((d) => ({ ...d, [a.id]: { ...d[a.id], password: v } }))
                  }
                  placeholder="••••••"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  className={btnPrimary}
                  onClick={() => {
                    const draft = drafts[a.id];
                    void run(
                      () =>
                        updateAdmin({
                          data: {
                            id: a.id,
                            ...(draft?.email && draft.email !== a.email
                              ? { email: draft.email.trim() }
                              : {}),
                            ...(draft?.password ? { password: draft.password } : {}),
                          },
                        }),
                      "Waa la cusboonaysiiyay ✓",
                    );
                  }}
                >
                  <Save size={13} /> Kaydi
                </button>

                {a.isFirst ? (
                  <p className="self-center text-[0.6rem] tracking-[0.18em] text-white/55 uppercase">
                    Admin-ka aasaasiga ah — lama tirtiri karo
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    className={btnGhost}
                    onClick={() =>
                      void run(() => deleteAdmin({ data: { id: a.id } }), "Waa la tirtiray ✓")
                    }
                  >
                    <Trash2 size={13} /> Tirtir admin-kan
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={cardClass}>
        <h2 className="font-display text-xl">Ku dar admin cusub</h2>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <Field
            label="Iimayl"
            value={email}
            onChange={setEmail}
            placeholder="admin@example.com"
          />

          <Field label="Password" value={password} onChange={setPassword} placeholder="••••••" />
        </div>

        <button
          type="button"
          disabled={busy}
          className={cn(btnPrimary, "mt-4")}
          onClick={() => {
            if (!email.trim() || password.length < 6) {
              setNote("Buuxi iimaylka iyo password ugu yaraan 6 xaraf.");
              return;
            }
            void run(async () => {
              await createAdmin({ data: { email: email.trim(), password } });
              setEmail("");
              setPassword("");
            }, "Admin cusub waa la daray ✓");
          }}
        >
          <UserPlus size={13} /> Ku dar admin
        </button>

        {note ? <p className="mt-3 text-xs text-white/80">{note}</p> : null}
      </div>
    </div>
  );
}


function BookingsTable({
  bookings,
  setBookings,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<
    React.SetStateAction<Booking[]>
  >;
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-160 text-left text-sm">
        <thead>
          <tr className="text-[0.58rem] tracking-[0.2em] text-white/60 uppercase">
            <th className="pb-3">Magaca</th>
            <th className="pb-3">Lambar</th>
            <th className="pb-3">Nooca</th>
            <th className="pb-3">Xaalad</th>
            <th className="pb-3">Taariikh</th>
            <th className="pb-3" />
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="text-white/75"
            >
              <td className="py-3 text-white">
                {b.name}
              </td>

              <td className="py-3">
                {b.phone}
              </td>

              <td className="py-3">
                {b.type}
              </td>

              <td className="py-3">
                <span className="rounded-full border border-navy-line px-2.5 py-1 text-[0.55rem] tracking-[0.16em] uppercase">
                  {b.status}
                </span>
              </td>

              <td className="py-3">
                {b.date}
              </td>

              <td className="py-3 text-right">
                <button
                  className={btnGhost}
                  aria-label={`Tirtir dalabka ${b.name}`}
                  onClick={() =>
                    setBookings((prev) =>
                      prev.filter(
                        (x) => x.id !== b.id,
                      ),
                    )
                  }
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bookings.length === 0 ? (
        <p className="mt-3 text-sm text-white/60">
          Wax dalab lama helin.
        </p>
      ) : null}
    </div>
  );
}

/** Upload helper kept for future use of direct logo uploads. */
export const _uploadIcon = Upload;
