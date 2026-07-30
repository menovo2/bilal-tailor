/**
 * Mock admin data. Frontend-only — no backend, no persistence beyond the session.
 * Image fields hold plain URLs so they can later be swapped for GitHub raw URLs
 * (e.g. https://raw.githubusercontent.com/<user>/<repo>/main/gallery/suit-01.jpg).
 */
export type AdminRecord = {
  id: string;
  title: string;
  category: string;
  status: "Firfircoon" | "Qarsoon";
  imageUrl: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  type: string;
  status: "Cusub" | "La xaqiijiyay" | "Dhammaystiran";
  date: string;
};

export type Message = {
  id: string;
  name: string;
  channel: "WhatsApp" | "Iimayl";
  text: string;
  date: string;
};

export const mockGallery: AdminRecord[] = [
  { id: "g1", title: "Suit madow rasmi ah", category: "Suit", status: "Firfircoon", imageUrl: "", updatedAt: "2026-07-24" },
  { id: "g2", title: "Safari cawlan", category: "Safari", status: "Firfircoon", imageUrl: "", updatedAt: "2026-07-22" },
  { id: "g3", title: "Qamiis cad", category: "Qamiis", status: "Qarsoon", imageUrl: "", updatedAt: "2026-07-19" },
  { id: "g4", title: "Surwaal buluug ah", category: "Surwaal", status: "Firfircoon", imageUrl: "", updatedAt: "2026-07-15" },
  { id: "g5", title: "Shaar casri ah", category: "Shaar", status: "Firfircoon", imageUrl: "", updatedAt: "2026-07-11" },
];

export const mockBookings: Booking[] = [
  { id: "b1", name: "Cabdi Xasan", phone: "+251911223344", type: "Suit", status: "Cusub", date: "2026-07-29" },
  { id: "b2", name: "Maxamed Nuur", phone: "+251922334455", type: "Qamiis", status: "La xaqiijiyay", date: "2026-07-28" },
  { id: "b3", name: "Yuusuf Cali", phone: "+251933445566", type: "Safari", status: "Dhammaystiran", date: "2026-07-25" },
  { id: "b4", name: "Ismaaciil Faarax", phone: "+251944556677", type: "Surwaal", status: "Cusub", date: "2026-07-24" },
];

export const mockMessages: Message[] = [
  { id: "m1", name: "Cabdiraxmaan", channel: "WhatsApp", text: "Ma jiraa suit cad oo diyaar ah?", date: "2026-07-29" },
  { id: "m2", name: "Khaalid", channel: "Iimayl", text: "Qiimaha safari-ga waa immisa?", date: "2026-07-27" },
  { id: "m3", name: "Saleebaan", channel: "WhatsApp", text: "Waxaan rabaa qiyaas Sabtida.", date: "2026-07-26" },
];

export const mockStats = [
  { label: "Dalabyada bishaan", value: "48", delta: "+12%" },
  { label: "Fariimo cusub", value: "17", delta: "+5%" },
  { label: "Sawirada Gallery", value: "5", delta: "0%" },
  { label: "Macmiil soo noqday", value: "82%", delta: "+3%" },
];
