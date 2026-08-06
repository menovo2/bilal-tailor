import { images } from "@/lib/site";
import { SafeImage } from "@/components/ui/safe-image";
import { useContent } from "@/lib/content-store";

/** Floating gold WhatsApp button with a soft outer glow. */
export function WhatsappFloat() {
  const { content } = useContent();
  const href = `https://wa.me/${content.whatsapp}?text=${encodeURIComponent(
    "Salaan, waxaan rabaa inaan dalbado adeeg tolid.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Nala soo xiriir WhatsApp"
      className="wa-glow fixed right-4 bottom-4 z-90 block h-14 w-14 transition-transform duration-500 hover:scale-110 sm:right-7 sm:bottom-7 sm:h-16 sm:w-16"
    >
      <SafeImage
        src={images.whatsapp}
        alt=""
        loading="lazy"
        width={128}
        height={128}
        className="h-full w-full object-contain drop-shadow-[0_0_18px_var(--gold)]"
      />
    </a>
  );
}
