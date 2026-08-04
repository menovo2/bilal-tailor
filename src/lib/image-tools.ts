/**
 * Client-side image tools for the admin panel: crop + downscale so uploaded
 * photos stay small enough to live in the shared content record.
 */
export type CropRect = { x: number; y: number; width: number; height: number };

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Sawirka lama furin."));
    img.src = src;
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Faylka lama akhriyin."));
    reader.readAsDataURL(file);
  });
}

/** Crop (in natural pixels) then downscale to `maxSize` and encode as JPEG. */
export async function cropToDataUrl(
  src: string,
  crop: CropRect,
  maxSize = 1600,
  quality = 0.85,
): Promise<string> {
  const img = await loadImage(src);
  const scale = Math.min(1, maxSize / Math.max(crop.width, crop.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(crop.width * scale));
  canvas.height = Math.max(1, Math.round(crop.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas lama heli karo.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", quality);
}
