import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { buildMentorSystemPrompt, DAILY_VERSE_PROMPT, type MentorMode } from "./mentor-prompt";
import { callLovableAiChat } from "./ai-gateway.server";

const FREE_DAILY_LIMIT = 5;

const sendSchema = z.object({
  message: z.string().min(1).max(4000),
  thread_id: z.string().uuid().optional(),
});

export const sendMentorMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => sendSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, language, mentor_mode, faith_level, main_struggle")
      .eq("id", userId)
      .maybeSingle();

    // Premium/lifetime subscribers bypass the daily limit.
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

      if ((count ?? 0) >= FREE_DAILY_LIMIT) {
        return { limitReached: true as const, threadId: data.thread_id ?? null };
      }
    }

    const lang = (profile?.language as "pt" | "en") ?? "pt";
    const mode = (profile?.mentor_mode as MentorMode) ?? "pastor";
    const system = buildMentorSystemPrompt({
      lang,
      mode,
      name: profile?.name,
      faithLevel: profile?.faith_level,
      mainStruggle: profile?.main_struggle,
    });

    // Resolve/create thread
    let threadId = data.thread_id ?? null;
    let isNewThread = false;
    if (threadId) {
      const { data: t } = await supabase
        .from("chat_threads")
        .select("id")
        .eq("id", threadId)
        .eq("user_id", userId)
        .maybeSingle();
      if (!t) threadId = null;
    }
    if (!threadId) {
      const provisionalTitle = data.message.slice(0, 60);
      const { data: created, error: threadErr } = await supabase
        .from("chat_threads")
        .insert({ user_id: userId, title: provisionalTitle })
        .select("id")
        .single();
      if (threadErr || !created) throw new Error(threadErr?.message ?? "Failed to create thread");
      threadId = created.id;
      isNewThread = true;
    }

    const { data: history } = await supabase
      .from("conversations")
      .select("role, content")
      .eq("user_id", userId)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(200);
    const priorMessages = (history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    await supabase.from("conversations").insert({
      user_id: userId,
      thread_id: threadId,
      role: "user",
      content: data.message,
    });

    const reply = await callLovableAiChat({
      system,
      messages: [...priorMessages, { role: "user", content: data.message }],
    });

    await supabase.from("conversations").insert({
      user_id: userId,
      thread_id: threadId,
      role: "assistant",
      content: reply,
    });

    // Touch thread updated_at (and set proper title on first message)
    if (isNewThread) {
      await supabase
        .from("chat_threads")
        .update({ title: data.message.slice(0, 60), updated_at: new Date().toISOString() })
        .eq("id", threadId);
    } else {
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", threadId);
    }

    return { limitReached: false as const, reply, threadId };
  });

const listConvSchema = z.object({ thread_id: z.string().uuid().optional() });

export const listConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => listConvSchema.parse(v ?? {}))
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("conversations")
      .select("id, role, content, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (data.thread_id) q = q.eq("thread_id", data.thread_id);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ---------- Threads ----------
export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, created_at, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: "Nova conversa" })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Failed");
    return { id: data.id };
  });

const threadIdSchema = z.object({ thread_id: z.string().uuid() });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => threadIdSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .delete()
      .eq("id", data.thread_id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const renameSchema = z.object({
  thread_id: z.string().uuid(),
  title: z.string().min(1).max(120),
});

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => renameSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .update({ title: data.title })
      .eq("id", data.thread_id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const dailyVerseSchema = z.object({ lang: z.enum(["pt", "en"]) });

export const getDailyVerse = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => dailyVerseSchema.parse(v))
  .handler(async ({ data }) => {
    try {
      const raw = await callLovableAiChat({
        system:
          data.lang === "pt"
            ? "Você é um assistente que retorna apenas JSON válido em português."
            : "You are an assistant that returns only valid JSON in English.",
        messages: [{ role: "user", content: DAILY_VERSE_PROMPT[data.lang] }],
        responseFormat: "json_object",
      });
      const parsed = JSON.parse(raw) as { ref?: string; text?: string; reflection?: string };
      return {
        ref: parsed.ref ?? "Provérbios 3:5-6",
        text:
          parsed.text ??
          (data.lang === "pt"
            ? "Confie no Senhor de todo o seu coração."
            : "Trust in the Lord with all your heart."),
        reflection: parsed.reflection ?? "",
      };
    } catch {
      return {
        ref: data.lang === "pt" ? "Provérbios 3:5" : "Proverbs 3:5",
        text:
          data.lang === "pt"
            ? "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento."
            : "Trust in the Lord with all your heart and lean not on your own understanding.",
        reflection:
          data.lang === "pt"
            ? "Sua clareza não vem de controlar tudo. Vem de entregar o que você não controla."
            : "Your clarity does not come from controlling everything. It comes from surrendering what you cannot.",
      };
    }
  });

const updateProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  language: z.enum(["pt", "en"]).optional(),
  mentor_mode: z.enum(["pastor", "sargento", "sabio", "coach"]).optional(),
  faith_level: z.string().max(40).optional(),
  main_struggle: z.string().max(40).optional(),
  onboarded: z.boolean().optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => updateProfileSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });