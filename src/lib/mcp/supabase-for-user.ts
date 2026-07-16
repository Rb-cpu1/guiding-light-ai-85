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

export const NOT_AUTHENTICATED = {
  content: [{ type: "text" as const, text: "Não autenticado." }],
  isError: true as const,
};

export function authedUserId(ctx: ToolContext): string | null {
  const userId = ctx.getUserId();
  if (!ctx.isAuthenticated() || !userId) return null;
  return userId;
}