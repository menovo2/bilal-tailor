import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** Does at least one admin account already exist? Used to gate first-time setup. */
export const adminAccountExists = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw error;
  return { exists: (count ?? 0) > 0 };
});

/** One-time bootstrap: creates the very first admin account. */
export const bootstrapFirstAdmin = createServerFn({ method: "POST" })
  .inputValidator((input) => credentials.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countError) throw countError;
    if ((count ?? 0) > 0) throw new Error("Admin account already exists.");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw error;

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user!.id, role: "admin" });
    if (roleError) throw roleError;

    return { ok: true };
  });

async function assertAdmin(supabase: {
  rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => Promise<{ data: unknown }>;
}, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden");
}

/** All admin accounts (admins only). */
export const listAdminAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (error) throw error;

    const admins: { id: string; email: string; isCurrent: boolean; isFirst: boolean }[] = [];
    for (const [index, row] of (roles ?? []).entries()) {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
      admins.push({
        id: row.user_id,
        email: user?.user?.email ?? "(unknown)",
        isCurrent: row.user_id === context.userId,
        isFirst: index === 0,
      });
    }
    return { admins };
  });

/** Add another admin account (admins only). */
export const createAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => credentials.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw error;

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user!.id, role: "admin" });
    if (roleError) throw roleError;

    return { ok: true };
  });

/** Change an admin's email and/or password (admins only). */
export const updateAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const patch: { email?: string; password?: string } = {};
    if (data.email) patch.email = data.email;
    if (data.password) patch.password = data.password;
    if (!Object.keys(patch).length) return { ok: true };

    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.id, patch);
    if (error) throw error;
    return { ok: true };
  });

/** Remove an admin account. The very first admin can never be removed. */
export const deleteAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .order("created_at", { ascending: true });
    if (error) throw error;

    const first = roles?.[0]?.user_id;
    if (data.id === first) throw new Error("The default admin cannot be deleted.");

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (deleteError) throw deleteError;
    return { ok: true };
  });
