import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/**
 * Public, unauthenticated read of the shared website content.
 * Runs on the server so the very first HTML already contains the latest
 * database content — on Lovable preview and on Netlify alike.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;

  const supabasePublic = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers, cache: "no-store" });
      },
    },
  });

  const { data, error } = await supabasePublic
    .from("site_content")
    .select("content")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error("[site-content] public read failed:", error.message);
    return null;
  }
  return (data?.content ?? null) as Record<string, unknown> | null;
});
