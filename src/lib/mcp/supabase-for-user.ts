import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

export function supabaseForUser(ctx: ToolContext) {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function requireAuth(ctx: ToolContext): { error: { content: { type: "text"; text: string }[]; isError: true } } | { userId: string } {
  const userId = ctx.getUserId();
  if (!ctx.isAuthenticated() || !userId) {
    return { error: { content: [{ type: "text" as const, text: "Não autenticado." }], isError: true } };
  }
  return { userId };
}