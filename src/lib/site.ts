/**
 * Static, non-editable site constants.
 * All visual assets live in `public/assets/` so they are served directly by the
 * host (GitHub -> Netlify) with no dependency on any external asset service.
 * Every piece of *text* lives in the admin content store, not here.
 */
export const site = {
  name: "BILAL TAILOR",
  tagline: "Tailored to Perfection",
} as const;

export const images = {
  logo: "/assets/drive/logo/logo.jpg",
  hero: "/assets/drive/backgrounds/home-background.png",
  homeBackground: "/assets/drive/backgrounds/home-background.png",
  aboutBackground: "/assets/drive/backgrounds/about-background.jpg",
  servicesBackground: "/assets/drive/backgrounds/services-background.jpg",
  galleryBackground: "/assets/drive/backgrounds/gallery-background.jpg",
  contactBackground: "/assets/drive/backgrounds/contact-background.jpg",
  workshop: "/assets/drive/backgrounds/services-background.jpg",
  detail: "/assets/drive/backgrounds/gallery-background.jpg",
  measure: "/assets/drive/backgrounds/contact-background.jpg",
  measureLight: "/assets/drive/backgrounds/contact-background.jpg",
  heroTailor: "/assets/drive/backgrounds/home-background.png",
  aboutRack: "/assets/drive/backgrounds/about-background.jpg",
  whatsapp: "/assets/whatsapp-gold.png",
} as const;
