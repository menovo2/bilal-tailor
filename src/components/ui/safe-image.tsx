import { useEffect, useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  /** Shown when `src` is empty or fails to load. */
  fallbackSrc?: string;
};

/**
 * Image that never breaks the layout: an empty, missing, or failing source
 * falls back to `fallbackSrc`, and if that fails too the element is hidden
 * instead of rendering a browser "broken image" icon.
 */
export function SafeImage({ src, fallbackSrc, className, alt = "", ...rest }: SafeImageProps) {
  const initial = src || fallbackSrc || "";
  const [current, setCurrent] = useState(initial);
  const [failed, setFailed] = useState(false);

  // Admin edits can change the source at runtime; retry with the new one.
  useEffect(() => {
    setCurrent(src || fallbackSrc || "");
    setFailed(false);
  }, [src, fallbackSrc]);

  if (failed || !current) return null;

  return (
    <img
      {...rest}
      alt={alt}
      src={current}
      decoding="async"
      className={cn(className)}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
    />
  );
}
