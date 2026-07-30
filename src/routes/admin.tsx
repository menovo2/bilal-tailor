import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  Github,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Info,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Scissors,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { LuxeButton } from "@/components/ui/luxe-button";
import { cn } from "@/lib/utils";
import { images, faqs as siteFaqs, services, site } from "@/lib/site";
import {
  mockBookings,
  mockGallery,
  mockMessages,
  mockStats,
  type AdminRecord,
  type Booking,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BILAL TAILOR" },
      { name: "description", content: "Maamulka mock-ka ah ee BILAL TAILOR." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — BILAL TAILOR" },
      { property: "og:description", content: "Maamulka mock-ka ah ee BILAL TAILOR." },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const sections = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "home", label: "Home Page", icon: Home },
  { key: "about", label: "About", icon: Info },
  { key: "services", label: "Services", icon: Scissors },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "faq", label: "FAQ", icon: HelpCircle },
  { key: "bookings", label: "Bookings", icon: CalendarCheck },
  { key: "messages", label: "Messages", icon: MessageSquare },
] as const;

type SectionKey = (typeof sections)[number]["key"];

const inputClass =
  "mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold";
const labelClass = "text-[0.64rem] tracking-[0.26em] text-gold uppercase";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  return authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onLogin={() => setAuthed(true)} />;
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-16">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        className="card-luxe w-full max-w-md rounded-xl p-8 sm:p-10"
      >
        <img
          src={images.logo}
          alt={`Astaanta ${site.name}`}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-full border border-gold/40 object-cover"
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
            <input id="email" type="email" required defaultValue={site.email} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <input id="password" type="password" required defaultValue="demo1234" className={inputClass} />
          </div>
        </div>
        <LuxeButton type="submit" size="lg" className="mt-8 w-full">
          Gal
        </LuxeButton>
        <p className="mt-5 text-center text-[0.68rem] text-muted-foreground">
          Demo mock ah — ma jiro backend ama xog dhab ah.
        </p>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [query, setQuery] = useState("");
  const [gallery, setGallery] = useState<AdminRecord[]>(mockGallery);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filter, setFilter] = useState("Dhammaan");

  const filteredGallery = useMemo(
    () =>
      gallery.filter(
        (g) =>
          (filter === "Dhammaan" || g.category === filter) &&
          g.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [gallery, query, filter],
  );

  const addGalleryItem = () =>
    setGallery((prev) => [
      {
        id: `g${Date.now()}`,
        title: "Sawir cusub",
        category: services[0].key,
        status: "Qarsoon",
        imageUrl: "",
        updatedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-gold/15 bg-surface/50 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-6 py-6">
          <img
            src={images.logo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-gold/40 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-base tracking-[0.2em] text-gold-soft">BILAL</p>
            <p className="text-[0.55rem] tracking-[0.38em] text-muted-foreground">ADMIN</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
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
              Maamul mock ah
            </p>
          </div>
          <div className="relative shrink-0">
            <Search size={15} className="absolute top-1/2 left-4 -translate-y-1/2 text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Raadi..."
              aria-label="Raadi"
              className="w-40 rounded-full border border-input bg-background/60 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-gold sm:w-64"
            />
          </div>
        </header>

        <div className="mt-8">
          {section === "dashboard" ? (
            <>
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {mockStats.map((s) => (
                  <li key={s.label} className="card-luxe rounded-lg p-6">
                    <p className="eyebrow">{s.label}</p>
                    <p className="mt-4 font-display text-4xl text-foreground">{s.value}</p>
                    <p className="mt-2 text-xs text-gold">{s.delta}</p>
                  </li>
                ))}
              </ul>
              <div className="card-luxe mt-6 rounded-lg p-6">
                <h2 className="text-xl">Dalabyada ugu dambeeyay</h2>
                <BookingsTable bookings={bookings.slice(0, 3)} setBookings={setBookings} />
              </div>
            </>
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
                <LuxeButton size="sm" onClick={addGalleryItem}>
                  <Plus size={14} /> Ku dar
                </LuxeButton>
              </div>

              <div className="card-luxe mt-6 rounded-lg p-6">
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-gold/35 p-5">
                  <Github size={18} className="shrink-0 text-gold" />
                  <p className="text-xs text-muted-foreground">
                    GitHub integration (dhawaan): halkan waxaad ka soo geli kartaa, bedeli kartaa ama
                    tirtiri kartaa sawirada repo-ga. UI-ga waa diyaar, backend-ka lama xirin.
                  </p>
                  <LuxeButton variant="outline" size="sm" className="ml-auto shrink-0" disabled>
                    <Upload size={14} /> Upload
                  </LuxeButton>
                </div>

                <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGallery.map((g) => (
                    <li key={g.id} className="rounded-lg border border-gold/20 p-4">
                      <div className="placeholder-luxe grid aspect-4/3 place-items-center rounded-md">
                        <span className="relative z-10 font-display text-xl text-gold-soft">
                          Coming Soon
                        </span>
                      </div>
                      <p className="mt-4 truncate font-display text-lg">{g.title}</p>
                      <p className="mt-1 text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">
                        {g.category} · {g.status} · {g.updatedAt}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <LuxeButton
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setGallery((prev) =>
                              prev.map((x) =>
                                x.id === g.id
                                  ? {
                                      ...x,
                                      status: x.status === "Firfircoon" ? "Qarsoon" : "Firfircoon",
                                    }
                                  : x,
                              ),
                            )
                          }
                        >
                          <Pencil size={13} /> Edit
                        </LuxeButton>
                        <LuxeButton variant="dark" size="sm" disabled>
                          <Upload size={13} /> Replace
                        </LuxeButton>
                        <LuxeButton
                          variant="ghost"
                          size="sm"
                          aria-label={`Tirtir ${g.title}`}
                          onClick={() => setGallery((prev) => prev.filter((x) => x.id !== g.id))}
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
            <div className="card-luxe rounded-lg p-6">
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
                      <p className="font-display text-lg">{m.name}</p>
                      <span className="rounded-full border border-gold/35 px-3 py-1 text-[0.58rem] tracking-[0.2em] text-gold uppercase">
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
            <div className="card-luxe rounded-lg p-6">
              <ul className="divide-y divide-gold/10">
                {siteFaqs.map((f) => (
                  <li key={f.q} className="flex items-start gap-4 py-5">
                    <div className="min-w-0">
                      <p className="font-display text-lg">{f.q}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                    </div>
                    <div className="ml-auto flex shrink-0 gap-2">
                      <LuxeButton variant="outline" size="sm">
                        <Pencil size={13} /> Edit
                      </LuxeButton>
                      <LuxeButton variant="ghost" size="sm" aria-label="Tirtir su'aal">
                        <Trash2 size={13} />
                      </LuxeButton>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {section === "home" || section === "about" || section === "services" ? (
            <ContentEditor section={section} />
          ) : null}
        </div>
      </div>
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

function ContentEditor({ section }: { section: "home" | "about" | "services" }) {
  const titles = {
    home: "Qoraalka Home Page",
    about: "Qoraalka About Page",
    services: "Adeegyada",
  };
  return (
    <div className="card-luxe rounded-lg p-6 sm:p-8">
      <h2 className="text-xl">{titles[section]}</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Cinwaanka</label>
          <input className={inputClass} defaultValue="Luxury Tailoring for Modern Gentlemen" />
        </div>
        <div>
          <label className={labelClass}>Sawirka (URL)</label>
          <input className={inputClass} placeholder="https://raw.githubusercontent.com/..." />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Qoraalka</label>
          <textarea rows={5} className={inputClass} defaultValue="Qoraal Soomaali ah oo la beddeli karo." />
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <LuxeButton size="sm">Update</LuxeButton>
        <LuxeButton variant="outline" size="sm">
          <Upload size={13} /> Replace Image
        </LuxeButton>
        <LuxeButton variant="dark" size="sm" disabled>
          <Github size={13} /> Sync GitHub
        </LuxeButton>
      </div>
    </div>
  );
}
