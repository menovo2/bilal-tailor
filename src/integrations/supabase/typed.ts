import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "./client";
import type { Database } from "./types";

/**
 * The generated client is created without the schema generic, so queries come
 * back as `never`. This re-exports the very same instance with the generated
 * Database types applied.
 */
export const db = supabase as unknown as SupabaseClient<Database>;
