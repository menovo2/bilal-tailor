import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Info,
  LogOut,
  MessageSquare,
  Plus,
  RotateCcw,
  Scissors,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { LuxeButton } from "@/components/ui/luxe-button";
import { cn } from "@/lib/utils";
import { images, faqs as siteFaqs, services, site } from "@/lib/site";
import { useContent, type SiteContent } from "@/lib/content-store";
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
  { key: "logo", label: "Logo", icon: Upload },
  { key: "home", label: "Home Page", icon: Home },
  { key: "about", label: "About", icon: Info },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "contact", label: "Contact", icon: Scissors },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "messages", label: "Messages", icon: MessageSquare },
] as const;

type SectionKey = (typeof sections)[number]["key"];

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold";
const labelClass = "text-[0.64rem] tracking-[0.26em] text-gold uppercase";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  return authed ? (
    <Dashboard onLogout={() => setAuthed(false)} />
  ) : (
    <Login onLogin={() => setAuthed(true)} />
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        className="card-luxe w-full max-w-md rounded-xl p-6 sm:p-10"
      >
        <img
          src={images.logo}
          alt={`Astaanta ${site.name}`}
          width={88}
          height={88}
          className="mx-auto h-20 w-20 rounded-full border border-gold/40 bg-white object-contain p-0.5"
        />

        <h1 className="mt-6 text-center text-3xl">Admin Panel</h1>
        <p className="mt-3 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
          BILAL TAILOR
        </p>
        <div className="mt-8 space-y-5">
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              defaultValue={site.email}
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
              defaultValue="demo1234"
              className={inputClass}
            />
          </div>
        </div>
        <LuxeButton type="submit" size="lg" className="mt-8 w-full">
          Gal
        </LuxeButton>
        <p className="mt-5 text-center text-[0.68rem] text-muted-foreground">
          Beddelada waxaa lagu kaydiyaa browser-kaaga (frontend only).
        </p>
      </form>
    </div>
  );
}

function LogoManager({
  current,
  onSave,
  onReset,
}: {
  current: string;
  onSave: (v: string) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const preview = draft || current;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(String(reader.result));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card-luxe rounded-lg p-5 sm:p-8">
      <h2 className="text-xl">Astaanta websaydka (Logo)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Beddel astaanta — waxay isbeddeshaa navbar-ka, footer-ka iyo meel walba oo logo-ga ka
        muuqdo.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className={labelClass}>Hadda</p>
            <img
              src={current}
              alt="Astaanta hadda"
              className="mt-3 h-24 w-24 rounded-full border border-gold/40 bg-white object-contain p-1"
            />
          </div>
          <div className="text-center">
            <p className={labelClass}>Horudhac</p>
            <img
              src={preview}
              alt="Horudhaca astaanta cusub"
              className="mt-3 h-24 w-24 rounded-full border border-gold/40 bg-white object-contain p-1"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div>
            <label className={labelClass}>Soo geli fayl (upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0])}
              className={cn(inputClass, "file:mr-4 file:rounded file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:text-gold")}
            />
          </div>
          <Field
            label="Ama isticmaal URL / path"
            value={draft}
            onChange={(v) => {
              setDraft(v);
              setSaved(false);
            }}
            placeholder="/assets/logo.png"
          />
          <div className="flex flex-wrap items-center gap-3">
            <LuxeButton
              size="sm"
              onClick={() => {
                if (!draft) return;
                onSave(draft);
                setSaved(true);
              }}
            >
              <Upload size={13} /> Kaydi astaanta
            </LuxeButton>
            <LuxeButton variant="outline" size="sm" onClick={() => setDraft("")}>
              Jooji
            </LuxeButton>
            <LuxeButton
              variant="outline"
              size="sm"
              onClick={() => {
                onReset();
                setDraft("");
                setSaved(false);
              }}
            >
              <RotateCcw size={13} /> Astaanta asalka
            </LuxeButton>
            {saved ? <span className="text-xs text-gold">Waa la kaydiyay ✓</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({

  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {textarea ? (
        <textarea
          rows={5}
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

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, update, updateItem, addItem, removeItem, reset } = useContent();
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filter, setFilter] = useState("Dhammaan");

  const set = (key: keyof SiteContent) => (v: string) => update({ [key]: v } as Partial<SiteContent>);

  const filteredGallery = useMemo(
    () =>
      content.gallery.filter(
        (g) =>
          (filter === "Dhammaan" || g.category === filter) &&
          g.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [content.gallery, query, filter],
  );

  const stats = [
    { label: "Sawirada Gallery", value: String(content.gallery.length) },
    {
      label: "Sawiro dhab ah",
      value: String(content.gallery.filter((g) => g.imageUrl).length),
    },
    { label: "Dalabyada", value: String(bookings.length) },
    { label: "Fariimo", value: String(mockMessages.length) },
  ];

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-gold/15 bg-surface/50 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-5 py-6 sm:px-6">
          <img
            src={content.logoImage || images.logo}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border border-gold/40 bg-white object-contain p-0.5"
          />

          <div className="min-w-0">
            <p className="truncate font-display text-base tracking-[0.2em] text-gold-soft">BILAL</p>
            <p className="text-[0.55rem] tracking-[0.38em] text-muted-foreground">ADMIN</p>
          </div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-xs tracking-[0.16em] uppercase transition-colors",
                section === s.key
                  ? "bg-gold/12 text-gold"
                  : "text-muted-foreground hover:bg-gold/5 hover:text-gold",
              )}
            >
              <s.icon size={16} /> {s.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-xs tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-destructive"
          >
            <LogOut size={16} /> Ka bax
          </button>
        </nav>
      </aside>

      <div className="p-5 sm:p-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl sm:text-3xl">
              {sections.find((s) => s.key === section)?.label}
            </h1>
            <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Maamulka websaydka
            </p>
          </div>
          <div className="relative shrink-0">
            <Search size={15} className="absolute top-1/2 left-4 -translate-y-1/2 text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Raadi..."
              aria-label="Raadi"
              className="w-36 rounded-full border border-input bg-background/60 py-2.5 pr-4 pl-10 text-sm text-foreground outline-none focus:border-gold sm:w-64"
            />
          </div>
        </header>

        <div className="mt-8">
          {section === "dashboard" ? (
            <>
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <li key={s.label} className="card-luxe rounded-lg p-6">
                    <p className="eyebrow">{s.label}</p>
                    <p className="mt-4 font-display text-4xl text-foreground">{s.value}</p>
                  </li>
                ))}
              </ul>
              <div className="card-luxe mt-6 rounded-lg p-5 sm:p-6">
                <h2 className="text-xl">Dalabyada ugu dambeeyay</h2>
                <BookingsTable bookings={bookings.slice(0, 3)} setBookings={setBookings} />
              </div>
              <div className="card-luxe mt-6 flex flex-wrap items-center gap-4 rounded-lg p-5 sm:p-6">
                <p className="min-w-0 text-sm text-muted-foreground">
                  Dib u celi dhammaan qoraalada iyo sawirada sida asalka ah.
                </p>
                <LuxeButton variant="outline" size="sm" className="ml-auto" onClick={reset}>
                  <RotateCcw size={13} /> Reset
                </LuxeButton>
              </div>
            </>
          ) : null}

          {section === "logo" ? (
            <LogoManager
              current={content.logoImage || images.logo}
              onSave={(v) => update({ logoImage: v })}
              onReset={() => update({ logoImage: images.logo })}
            />
          ) : null}



          {section === "home" ? (
            <div className="card-luxe rounded-lg p-5 sm:p-8">
              <h2 className="text-xl">Qoraalka & Sawirka Home Page</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Field label="Eyebrow" value={content.heroEyebrow} onChange={set("heroEyebrow")} />
                <Field label="Cinwaanka" value={content.heroTitle} onChange={set("heroTitle")} />
                <Field
                  label="Qeybta gold"
                  value={content.heroHighlight}
                  onChange={set("heroHighlight")}
                />
                <Field
                  label="Sawirka background (URL)"
                  value={content.heroImage}
                  onChange={set("heroImage")}
                  placeholder="https://..."
                />
                <div className="lg:col-span-2">
                  <Field label="Qoraalka" value={content.heroText} onChange={set("heroText")} textarea />
                </div>
              </div>
              <Preview src={content.heroImage} />
            </div>
          ) : null}

          {section === "about" ? (
            <div className="card-luxe rounded-lg p-5 sm:p-8">
              <h2 className="text-xl">Qoraalka & Sawirka About</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Field label="Cinwaanka" value={content.aboutTitle} onChange={set("aboutTitle")} />
                <Field
                  label="Sawirka background (URL)"
                  value={content.aboutImage}
                  onChange={set("aboutImage")}
                  placeholder="https://..."
                />
                <div className="lg:col-span-2">
                  <Field
                    label="Qoraalka"
                    value={content.aboutText}
                    onChange={set("aboutText")}
                    textarea
                  />
                </div>
              </div>
              <Preview src={content.aboutImage} />
            </div>
          ) : null}

          {section === "contact" ? (
            <div className="card-luxe rounded-lg p-5 sm:p-8">
              <h2 className="text-xl">Xiriirka</h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Field label="WhatsApp (lambar)" value={content.whatsapp} onChange={set("whatsapp")} />
                <Field label="Telefoon" value={content.phone} onChange={set("phone")} />
                <Field label="Iimayl" value={content.email} onChange={set("email")} />
              </div>
            </div>
          ) : null}

          {section === "gallery" ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {["Dhammaan", ...services.map((s) => s.key)].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors",
                        filter === c
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-gold/30 text-muted-foreground hover:text-gold",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <LuxeButton
                  size="sm"
                  onClick={() => addItem(filter === "Dhammaan" ? services[0].key : filter)}
                >
                  <Plus size={14} /> Ku dar
                </LuxeButton>
              </div>

              <div className="card-luxe mt-6 rounded-lg p-5 sm:p-6">
                <div className="rounded-lg border border-dashed border-gold/35 p-4 sm:p-5">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Ku dheji URL sawir kasta (tusaale: link GitHub raw ama Instagram CDN) si aad
                    ku beddesho "Coming Soon". Haddii URL-ka banaan yahay, sawirka Coming Soon ayaa
                    la tusayaa. Sidoo kale beddel magaca lambarka leh (Suit 1, Surwaal 4, iwm).
                  </p>
                  <div className="mt-4">
                    <Field
                      label="Sawirka Coming Soon (URL)"
                      value={content.comingSoonImage}
                      onChange={set("comingSoonImage")}
                    />
                  </div>
                </div>

                <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGallery.map((g) => (
                    <li key={g.id} className="rounded-lg border border-gold/20 p-4">
                      <img
                        src={g.imageUrl || content.comingSoonImage}
                        alt={g.label}
                        loading="lazy"
                        className="aspect-4/3 w-full rounded-md object-cover"
                      />
                      <div className="mt-4 space-y-4">
                        <Field
                          label="Magaca"
                          value={g.label}
                          onChange={(v) => updateItem(g.id, { label: v })}
                        />
                        <Field
                          label="Sawirka (URL)"
                          value={g.imageUrl}
                          onChange={(v) => updateItem(g.id, { imageUrl: v })}
                          placeholder="https://raw.githubusercontent.com/..."
                        />
                      </div>
                      <p className="mt-3 text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">
                        {g.category} · {g.visible ? "Firfircoon" : "Qarsoon"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <LuxeButton
                          variant="outline"
                          size="sm"
                          onClick={() => updateItem(g.id, { visible: !g.visible })}
                        >
                          {g.visible ? <EyeOff size={13} /> : <Eye size={13} />}
                          {g.visible ? "Qari" : "Muuji"}
                        </LuxeButton>
                        <LuxeButton
                          variant="ghost"
                          size="sm"
                          aria-label={`Tirtir ${g.label}`}
                          onClick={() => removeItem(g.id)}
                        >
                          <Trash2 size={13} />
                        </LuxeButton>
                      </div>
                    </li>
                  ))}
                </ul>
                {filteredGallery.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">Wax natiijo lama helin.</p>
                ) : null}
              </div>
            </>
          ) : null}

          {section === "bookings" ? (
            <div className="card-luxe rounded-lg p-5 sm:p-6">
              <BookingsTable
                bookings={bookings.filter(
                  (b) =>
                    b.name.toLowerCase().includes(query.toLowerCase()) ||
                    b.type.toLowerCase().includes(query.toLowerCase()),
                )}
                setBookings={setBookings}
              />
            </div>
          ) : null}

          {section === "messages" ? (
            <ul className="grid gap-5 sm:grid-cols-2">
              {mockMessages
                .filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
                .map((m) => (
                  <li key={m.id} className="card-luxe rounded-lg p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate font-display text-lg">{m.name}</p>
                      <span className="shrink-0 rounded-full border border-gold/35 px-3 py-1 text-[0.58rem] tracking-[0.2em] text-gold uppercase">
                        {m.channel}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{m.text}</p>
                    <p className="mt-4 text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">
                      {m.date}
                    </p>
                  </li>
                ))}
            </ul>
          ) : null}

          {section === "faq" ? (
            <div className="card-luxe rounded-lg p-5 sm:p-6">
              <ul className="divide-y divide-gold/10">
                {siteFaqs.map((f) => (
                  <li key={f.q} className="py-5">
                    <p className="font-display text-lg">{f.q}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Preview({ src }: { src: string }) {
  if (!src) return null;
  return (
    <div className="mt-7">
      <p className={labelClass}>Preview</p>
      <img
        src={src}
        alt="Preview sawirka"
        loading="lazy"
        className="mt-3 max-h-72 w-full rounded-lg border border-gold/25 object-cover"
      />
    </div>
  );
}

function BookingsTable({
  bookings,
  setBookings,
}: {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-160 text-left text-sm">
        <thead>
          <tr className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">
            <th className="pb-4">Magaca</th>
            <th className="pb-4">Lambar</th>
            <th className="pb-4">Nooca</th>
            <th className="pb-4">Xaalad</th>
            <th className="pb-4">Taariikh</th>
            <th className="pb-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/10">
          {bookings.map((b) => (
            <tr key={b.id} className="text-muted-foreground">
              <td className="py-4 text-foreground">{b.name}</td>
              <td className="py-4">{b.phone}</td>
              <td className="py-4">{b.type}</td>
              <td className="py-4">
                <span className="rounded-full border border-gold/35 px-3 py-1 text-[0.58rem] tracking-[0.18em] text-gold uppercase">
                  {b.status}
                </span>
              </td>
              <td className="py-4">{b.date}</td>
              <td className="py-4 text-right">
                <LuxeButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Tirtir dalabka ${b.name}`}
                  onClick={() => setBookings((prev) => prev.filter((x) => x.id !== b.id))}
                >
                  <Trash2 size={13} />
                </LuxeButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Wax dalab lama helin.</p>
      ) : null}
    </div>
  );
}
