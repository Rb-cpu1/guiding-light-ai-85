import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { NOT_AUTHENTICATED, authedUserId, supabaseForUser } from "../supabase-for-user";

export default defineTool({
  name: "send_mentor_message",
  title: "Enviar mensagem ao mentor",
  description: "Envia uma mensagem ao mentor pessoal do utilizador e devolve a resposta. Respeita o limite diário do plano gratuito (5 mensagens/dia).",
  inputSchema: {
    message: z.string().min(1).max(4000).describe("Mensagem para o mentor."),
  },
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ message }, ctx) => {
    const userId = authedUserId(ctx);
    if (!userId) return NOT_AUTHENTICATED;
    const supabase = supabaseForUser(ctx);

    const { buildMentorSystemPrompt } = await import("@/lib/mentor-prompt");
    const { callLovableAiChat } = await import("@/lib/ai-gateway.server");

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, language, mentor_mode, faith_level, main_struggle")
      .eq("id", userId)
      .maybeSingle();

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const now = Date.now();
    const end = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : null;
    const isPremium = !!sub && (
      (["active", "trialing", "past_due"].includes(sub.status) && (end === null || end > now)) ||
      (sub.status === "canceled" && end !== null && end > now)
    );

    if (!isPremium) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "user")
        .gte("created_at", startOfDay.toISOString());
      if ((count ?? 0) >= 5) {
        return {
          content: [{ type: "text", text: "Limite diário do plano grátis atingido (5 mensagens/dia). Faça upgrade para Premium para continuar." }],
          isError: true,
        };
      }
    }

    const lang = ((profile?.language as "pt" | "en") ?? "pt");
    const mode = ((profile?.mentor_mode as "pastor" | "sargento" | "sabio" | "coach") ?? "pastor");
    const system = buildMentorSystemPrompt({
      lang,
      mode,
      name: profile?.name ?? undefined,
      faithLevel: profile?.faith_level ?? undefined,
      mainStruggle: profile?.main_struggle ?? undefined,
    });

    const { data: history } = await supabase
      .from("conversations")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    const priorMessages = (history ?? [])
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    // Resolve a thread: reuse the most recent one or create a new one.
    let threadId: string | null = null;
    const { data: latestThread } = await supabase
      .from("chat_threads")
      .select("id")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    threadId = latestThread?.id ?? null;
    if (!threadId) {
      const { data: created } = await supabase
        .from("chat_threads")
        .insert({ user_id: userId, title: message.slice(0, 60) })
        .select("id")
        .single();
      threadId = created?.id ?? null;
    }
    if (!threadId) {
      return { content: [{ type: "text", text: "Failed to resolve thread" }], isError: true };
    }

    await supabase.from("conversations").insert({ user_id: userId, thread_id: threadId, role: "user", content: message });

    const reply = await callLovableAiChat({
      system,
      messages: [...priorMessages, { role: "user", content: message }],
    });

    await supabase.from("conversations").insert({ user_id: userId, thread_id: threadId, role: "assistant", content: reply });
    await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);

    return {
      content: [{ type: "text", text: reply }],
      structuredContent: { reply },
    };
  },
});