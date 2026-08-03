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
  logo: "/assets/logo.png",
  hero: "/assets/suits-rack.jpg",
  workshop: "/assets/cutting.jpg",
  detail: "/assets/pinning.jpg",
  measure: "/assets/tape-dark.jpg",
  measureLight: "/assets/tape-light.jpg",
  heroTailor: "/assets/tailor-measuring.png",
  aboutRack: "/assets/suit-rack-about.jpg",
  comingSoon: "/assets/coming-soon.png",
  whatsapp: "/assets/whatsapp-gold.png",
} as const;
