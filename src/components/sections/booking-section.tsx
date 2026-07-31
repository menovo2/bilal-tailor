import { useState } from "react";
import { services, site, whatsappLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";
import { Reveal } from "@/components/ui/reveal";

export function BookingSection() {
  const [form, setForm] = useState({ name: "", phone: "", type: services[0].key, notes: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      "Salaan BILAL TAILOR, waxaan rabaa inaan dalbado:",
      `Magaca: ${form.name}`,
      `Lambarka: ${form.phone}`,
      `Nooca Dharka: ${form.type}`,
      form.notes ? `Faahfaahin: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener");
  };

  const field =
    "mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-1 focus:ring-ring";
  const label = "text-[0.66rem] tracking-[0.26em] text-gold uppercase";

  return (
    <section id="booking" className="border-y border-gold/15 bg-surface/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Dalbo"
          title="Ballan Qabso Hadda"
          description="Buuxi foomka oo waxaan kula soo xiriirnaa WhatsApp gudaha daqiiqado, si aan qiyaasta iyo qiimaha aan u qorsheyno."
        />

        <Reveal className="mx-auto mt-14 max-w-3xl" delay={120}>
          <form
            onSubmit={submit}
            className="card-luxe rounded-xl p-7 sm:p-10"
            aria-label="Foomka ballanqaadka"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="name">
                  Magaca
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tusaale:- Bilal Abdalla "
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="phone">
                  Lambarka Taleefanka
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={site.phone}
                  className={field}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="type">
                  Nooca Dharka
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                  className={field}
                >
                  {services.map((s) => (
                    <option key={s.key} value={s.key} className="bg-surface">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="notes">
                  Faahfaahin Dheeraad ah
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Naqshadda, midabka, waqtiga aad u baahan tahay..."
                  className={field}
                />
              </div>
            </div>
            <div className="mt-9 flex justify-center">
              <LuxeButton type="submit" size="lg">
                Dalbo Hada
              </LuxeButton>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
