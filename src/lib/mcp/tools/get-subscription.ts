import { defineTool } from "@lovable.dev/mcp-js";
import { NOT_AUTHENTICATED, authedUserId, supabaseForUser } from "../supabase-for-user";

export default defineTool({
  name: "get_subscription",
  title: "Obter subscrição",
  description: "Devolve o estado da subscrição Premium do utilizador (plano, status, data de renovação).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const userId = authedUserId(ctx);
    if (!userId) return NOT_AUTHENTICATED;
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, price_id, product_id, current_period_end, cancel_at_period_end, environment")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const now = Date.now();
    const end = data?.current_period_end ? new Date(data.current_period_end).getTime() : null;
    const isPremium = !!data && (
      (["active", "trialing", "past_due"].includes(data.status) && (end === null || end > now)) ||
      (data.status === "canceled" && end !== null && end > now)
    );
    return {
      content: [{ type: "text", text: JSON.stringify({ isPremium, subscription: data }, null, 2) }],
      structuredContent: { isPremium, subscription: data },
    };
  },
});