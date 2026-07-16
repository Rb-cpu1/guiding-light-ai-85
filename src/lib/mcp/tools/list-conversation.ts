import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { NOT_AUTHENTICATED, authedUserId, supabaseForUser } from "../supabase-for-user";

export default defineTool({
  name: "list_conversation",
  title: "Listar conversa",
  description: "Devolve as últimas mensagens da conversa entre o utilizador e o mentor (ordem cronológica).",
  inputSchema: {
    limit: z.number().int().positive().max(200).optional().describe("Número máximo de mensagens (padrão 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    const userId = authedUserId(ctx);
    if (!userId) return NOT_AUTHENTICATED;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("conversations")
      .select("role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(limit ?? 50);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { messages: data ?? [] },
    };
  },
});