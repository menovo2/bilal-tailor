import logoAsset from "@/assets/logo.png.asset.json";
import suitsRack from "@/assets/suits-rack.jpg.asset.json";
import cutting from "@/assets/cutting.jpg.asset.json";
import pinning from "@/assets/pinning.jpg.asset.json";
import tapeDark from "@/assets/tape-dark.jpg.asset.json";
import tapeLight from "@/assets/tape-light.jpg.asset.json";

/**
 * Central site configuration.
 * Swap any `url` below with a GitHub raw image URL later — nothing else changes.
 */
export const site = {
  name: "BILAL TAILOR",
  tagline: "Tailored to Perfection",
  phone: "+251940744442",
  whatsapp: "251940744442",
  email: "Billaalyare88@gmail.com",
  facebook: "https://facebook.com",
  hours: [
    { days: "Sabti – Khamiis", time: "8:00 AM – 9:00 PM" },
    { days: "Jimce", time: "Xiran" },
  ],
} as const;

export const images = {
  logo: logoAsset.url,
  hero: suitsRack.url,
  workshop: cutting.url,
  detail: pinning.url,
  measure: tapeDark.url,
  measureLight: tapeLight.url,
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export type ServiceKey = "Suit" | "Safari" | "Qamiis" | "Surwaal" | "Shaar";

export const services: {
  key: ServiceKey;
  title: string;
  short: string;
  long: string;
  icon: string;
}[] = [
  {
    key: "Suit",
    title: "Suit",
    short: "Suit rasmi ah oo si gaar ah loo qiyaasay, dhar tayo sare leh iyo qaab casri ah.",
    long: "Suit-yada aan tolno waxaa lagu dhisay qiyaas gaar ah oo jirkaaga ku habboon. Waxaan isticmaalnaa maro tayada ugu sarreysa, garabka la qaabeeyay, iyo tolid gacan ah oo muddo dheer adkaysata — ku habboon aroos, shaqo iyo munaasabado rasmi ah.",
    icon: "suit",
  },
  {
    key: "Safari",
    title: "Safari",
    short: "Safari qurux badan oo raaxo leh, ku habboon maalinta iyo munaasabadaha.",
    long: "Safari-ga waa astaan sharaf. Waxaan tolnaa qaab toosan, jeebab si fiican loo qaabeeyay, iyo maro dabiici ah oo neefsata — quruxda dhaqanka iyo qaabka casriga ah oo isku dhafan.",
    icon: "safari",
  },
  {
    key: "Qamiis",
    title: "Qamiis",
    short: "Qamiis nadiif ah oo qiyaas gaar ah, tolid nagaan ah oo raaxo leh.",
    long: "Qamiisyadeena waxaa lagu tolay xariiq toosan iyo faahfaahin nadiif ah. Doorasho ballaaran oo maro, badhamo, iyo qoor-qaabeyn ah, si aad u hesho qamiis kaa muuqda oo aad ku raaxaysato maalinta oo dhan.",
    icon: "qamiis",
  },
  {
    key: "Surwaal",
    title: "Surwaal",
    short: "Surwaal qiyaas sax ah, dheerar iyo qaab si gaar ah loo qorsheeyay.",
    long: "Surwaalka waa halka qiyaasta sax ah lagu muuqato. Waxaan diyaarinnaa dhererka, ballaca iyo qaabka si ay ula socdaan jirkaaga, iyadoo tolid xoogan iyo maro adkaysi leh la isticmaalayo.",
    icon: "surwaal",
  },
  {
    key: "Shaar",
    title: "Shaar",
    short: "Shaar casri ah oo tayo leh, ku habboon shaqada iyo maalinta.",
    long: "Shaarar la tolay si ay kuu habboonaadaan — garab sax ah, gacmo cabbir leh, iyo maro fudud oo neefsata. Waxaan xoogga saarnaa faahfaahinta yar ee wax weyn ka beddesha.",
    icon: "shaar",
  },
];

export const galleryCategories = services.map((s) => s.key);

export const faqs = [
  {
    q: "Muddo intee le'eg ayay qaadataa tolidda?",
    a: "Inta badan tolidda waxay qaadataa 3 – 7 maalmood, iyadoo ku xiran nooca dharka iyo culeyska shaqada. Adeeg degdeg ah oo 48 saac ah ayaa sidoo kale la heli karaa.",
  },
  {
    q: "Qiimaha sidee loo ogaadaa?",
    a: "Qiimaha wuxuu ku xiran yahay nooca dharka, maradda aad dooratay iyo faahfaahinta naqshadda. Noo soo dir WhatsApp macluumaadkaaga oo waxaan ku siin doonnaa qiime cad oo aan qarsoodi lahayn.",
  },
  {
    q: "Ma keeni karaa naqshad aan rabo?",
    a: "Haa. Waad keeni kartaa sawir, sanaad ama fikrad, waxaanan si dhow kuula shaqaynaynaa ilaa naqshadda si sax ah loo gaadho.",
  },
  {
    q: "Miyaad samaysaan suits rasmi ah?",
    a: "Haa. Waxaan ku takhasusnay suits rasmi ah oo arooska, shaqada iyo munaasabadaha waaweyn loogu talagalay, oo dhammaan lagu qiyaasay jirkaaga.",
  },
  {
    q: "Ma qiyaasi kartaa dharka ka hor dhammaystirka?",
    a: "Haa. Waxaan bixinnaa hal ama laba isku-day (fitting) si aan u hubinno in dharkaagu si sax ah kuu habboon yahay.",
  },
];

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(category: string) {
  return `Salaan, waxaan rabaa inaan dalbado adeegga ${category}.`;
}
