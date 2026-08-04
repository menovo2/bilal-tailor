import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X, ZoomIn } from "lucide-react";

import { cropToDataUrl, loadImage, type CropRect } from "@/lib/image-tools";
import { cn } from "@/lib/utils";

/**
 * Simple, dependency-free crop tool: drag to move, slider to zoom.
 * The visible frame keeps a fixed aspect ratio and everything inside it is
 * exported at the requested aspect ratio.
 */
export function CropModal({
  src,
  aspect = 3 / 4,
  onCancel,
  onDone,
}: {
  src: string;
  aspect?: number;
  onCancel: () => void;
  onDone: (dataUrl: string) => void;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadImage(src).then((img) => {
      if (!cancelled) {
        setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  /** Size of the "cover" box in natural pixels at the current zoom. */
  const cropRect = useCallback((): CropRect => {
    const { w, h } = natural;
    if (!w || !h) return { x: 0, y: 0, width: 1, height: 1 };

    // Largest rect with the target aspect that fits the image, shrunk by zoom.
    let cw = w;
    let ch = w / aspect;
    if (ch > h) {
      ch = h;
      cw = h * aspect;
    }
    cw /= zoom;
    ch /= zoom;

    const maxX = w - cw;
    const maxY = h - ch;
    const x = Math.min(Math.max(maxX / 2 + offset.x * maxX, 0), Math.max(maxX, 0));
    const y = Math.min(Math.max(maxY / 2 + offset.y * maxY, 0), Math.max(maxY, 0));
    return { x, y, width: cw, height: ch };
  }, [aspect, natural, offset, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const frame = frameRef.current;
    if (!d || !frame) return;
    const dx = (e.clientX - d.x) / frame.clientWidth;
    const dy = (e.clientY - d.y) / frame.clientHeight;
    setOffset({
      x: Math.min(Math.max(d.ox - dx, -0.5), 0.5),
      y: Math.min(Math.max(d.oy - dy, -0.5), 0.5),
    });
  };

  const confirm = async () => {
    setBusy(true);
    try {
      onDone(await cropToDataUrl(src, cropRect()));
    } finally {
      setBusy(false);
    }
  };

  const rect = cropRect();
  const bgSize = natural.w
    ? `${(natural.w / rect.width) * 100}% ${(natural.h / rect.height) * 100}%`
    : "cover";
  const bgPos = natural.w
    ? `${(rect.x / Math.max(natural.w - rect.width, 1)) * 100}% ${
        (rect.y / Math.max(natural.h - rect.height, 1)) * 100
      }%`
    : "center";

  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-xl border border-navy-line bg-navy-2 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Qas & Habee Sawirka</h3>
          <button type="button" onClick={onCancel} aria-label="Xir" className="text-white/70">
            <X size={18} />
          </button>
        </div>

        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          style={{
            aspectRatio: String(aspect),
            backgroundImage: `url(${src})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPos,
            backgroundRepeat: "no-repeat",
          }}
          className="mt-4 w-full cursor-grab touch-none overflow-hidden rounded-lg border border-navy-line bg-navy active:cursor-grabbing"
        />

        <label className="mt-4 flex items-center gap-3 text-xs text-white/70">
          <ZoomIn size={14} />
          <input
            type="range"
            min={1}
            max={4}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-white"
          />
        </label>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={confirm}
            disabled={busy || !natural.w}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-navy uppercase disabled:opacity-50",
            )}
          >
            <Check size={14} /> {busy ? "..." : "Kaydi"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-navy-line px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase"
          >
            Jooji
          </button>
        </div>
      </div>
    </div>
  );
}
