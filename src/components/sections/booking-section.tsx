import { useState } from "react";
import { useContent, useLinks } from "@/lib/content-store";
import { SectionHeading } from "@/components/ui/section-heading";
import { LuxeButton } from "@/components/ui/luxe-button";
import { Reveal } from "@/components/ui/reveal";

export function BookingSection() {
  const { content } = useContent();
  const { wa } = useLinks();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: content.services[0]?.key ?? "",
    notes: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      content.bookingMessage,
      `Magacaygu waa : ${form.name}`,
      `Lambarkayguna waa : ${form.phone}`,
      `Nooca Dharka : ${form.type || content.services[0]?.key}`,
      form.notes ? `Faahfaahita Dalabkayga: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(wa(message), "_blank", "noopener");
  };

  const field =
    "mt-2 w-full rounded-lg border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-1 focus:ring-ring";
  const label = "text-[0.66rem] tracking-[0.26em] text-gold uppercase";

  return (
    <section id="booking" className="border-y border-gold/15 bg-surface/30 py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow={content.bookingEyebrow}
          title={content.bookingTitle}
          description={content.bookingText}
        />

        <Reveal className="mx-auto mt-6 max-w-3xl" delay={100}>
          <form
            onSubmit={submit}
            className="card-luxe rounded-xl p-5 sm:p-8"
            aria-label="Foomka ballanta"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label className={label} htmlFor="name">
                  {content.bookingNameLabel}
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                />
              </div>
              <div className="min-w-0">
                <label className={label} htmlFor="phone">
                  {content.bookingPhoneLabel}
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={content.phone}
                  className={field}
                />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <label className={label} htmlFor="type">
                  {content.bookingTypeLabel}
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={field}
                >
                  {content.services.map((s) => (
                    <option key={s.id} value={s.key} className="bg-surface">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <label className={label} htmlFor="notes">
                  {content.bookingNotesLabel}
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={field}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <LuxeButton type="submit" size="lg">
                {content.bookingSubmit}
              </LuxeButton>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
