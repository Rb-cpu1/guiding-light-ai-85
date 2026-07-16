import { defineTool } from "@lovable.dev/mcp-js";
import { requireAuth, supabaseForUser } from "../supabase-for-user";

export default defineTool({
  name: "get_profile",
  title: "Obter perfil",
  description: "Devolve o perfil do utilizador autenticado (nome, idioma, modo do mentor, nível de fé, principal dificuldade, streak de missões).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const err = requireAuth(ctx);
    if (err) return err;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("name, language, mentor_mode, faith_level, main_struggle, streak_count, longest_streak, onboarded")
      .eq("id", ctx.getUserId())
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? {}, null, 2) }],
      structuredContent: { profile: data },
    };
  },
});