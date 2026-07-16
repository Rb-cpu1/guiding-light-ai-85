import { defineTool } from "@lovable.dev/mcp-js";
import { requireAuth, supabaseForUser } from "../supabase-for-user";

export default defineTool({
  name: "get_today_mission",
  title: "Obter missão de hoje",
  description: "Devolve a missão diária de hoje do utilizador (se existir) e se está concluída.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const err = requireAuth(ctx);
    if (err) return err;
    const supabase = supabaseForUser(ctx);
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("daily_missions")
      .select("id, title, body, completed, completed_at, mission_date")
      .eq("user_id", ctx.getUserId())
      .eq("mission_date", today)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? { message: "Sem missão para hoje." }, null, 2) }],
      structuredContent: { mission: data },
    };
  },
});