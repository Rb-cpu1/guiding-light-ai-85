import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { buildMentorSystemPrompt, DAILY_VERSE_PROMPT, type MentorMode } from "./mentor-prompt";
import { callLovableAiChat } from "./ai-gateway.server";

const FREE_DAILY_LIMIT = 3;

const sendSchema = z.object({ message: z.string().min(1).max(4000) });

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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("role", "user")
      .gte("created_at", startOfDay.toISOString());

    if ((count ?? 0) >= FREE_DAILY_LIMIT) {
      return { limitReached: true as const };
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

    const { data: history } = await supabase
      .from("conversations")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    const priorMessages = (history ?? [])
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    await supabase.from("conversations").insert({
      user_id: userId,
      role: "user",
      content: data.message,
    });

    const reply = await callLovableAiChat({
      system,
      messages: [...priorMessages, { role: "user", content: data.message }],
    });

    await supabase.from("conversations").insert({
      user_id: userId,
      role: "assistant",
      content: reply,
    });

    return { limitReached: false as const, reply };
  });

export const listConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("conversations")
      .select("id, role, content, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
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