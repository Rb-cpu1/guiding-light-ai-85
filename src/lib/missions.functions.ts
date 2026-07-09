import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { callLovableAiChat } from "./ai-gateway.server";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function generateMissionAI(opts: {
  lang: "pt" | "en";
  struggle?: string | null;
  faith?: string | null;
}): Promise<{ title: string; body: string }> {
  const prompt =
    opts.lang === "pt"
      ? `Gere UMA missão espiritual e prática de 1 dia para alguém cuja luta é: ${opts.struggle ?? "propósito"} (fé: ${opts.faith ?? "buscando"}).
Retorne JSON válido: {"title":"máx 6 palavras","body":"descrição de 2-3 frases com AÇÃO clara para hoje + versículo curto no fim"}. Sem markdown.`
      : `Generate ONE 1-day practical spiritual mission for someone whose main struggle is: ${opts.struggle ?? "purpose"} (faith: ${opts.faith ?? "seeking"}).
Return valid JSON: {"title":"max 6 words","body":"2-3 sentence description with clear ACTION for today + short Bible verse at end"}. No markdown.`;
  try {
    const raw = await callLovableAiChat({
      system:
        opts.lang === "pt"
          ? "Retorne apenas JSON válido em português."
          : "Return only valid JSON in English.",
      messages: [{ role: "user", content: prompt }],
      responseFormat: "json_object",
    });
    const parsed = JSON.parse(raw) as { title?: string; body?: string };
    if (parsed.title && parsed.body) return { title: parsed.title, body: parsed.body };
  } catch {
    /* fallback below */
  }
  return opts.lang === "pt"
    ? {
        title: "5 minutos em silêncio",
        body: "Ore 5 minutos em silêncio. Escreva uma coisa pela qual você é grato hoje. 'Aquietai-vos e sabei que eu sou Deus.' (Salmos 46:10)",
      }
    : {
        title: "5 minutes of silence",
        body: "Pray 5 minutes in silence. Write down one thing you are grateful for today. 'Be still and know that I am God.' (Psalm 46:10)",
      };
}

export const getTodayMission = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = todayISO();

    const { data: existing } = await supabase
      .from("daily_missions")
      .select("id, title, body, completed, completed_at, mission_date")
      .eq("user_id", userId)
      .eq("mission_date", today)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("language, main_struggle, faith_level, streak_count, longest_streak, last_mission_date")
      .eq("id", userId)
      .maybeSingle();

    if (existing) {
      return {
        mission: existing,
        streak: profile?.streak_count ?? 0,
        longest: profile?.longest_streak ?? 0,
      };
    }

    const generated = await generateMissionAI({
      lang: (profile?.language as "pt" | "en") ?? "pt",
      struggle: profile?.main_struggle,
      faith: profile?.faith_level,
    });

    const { data: created, error } = await supabase
      .from("daily_missions")
      .insert({
        user_id: userId,
        mission_date: today,
        title: generated.title,
        body: generated.body,
      })
      .select("id, title, body, completed, completed_at, mission_date")
      .single();
    if (error) throw new Error(error.message);

    return {
      mission: created,
      streak: profile?.streak_count ?? 0,
      longest: profile?.longest_streak ?? 0,
    };
  });

const completeSchema = z.object({ mission_id: z.string().uuid() });

export const completeTodayMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => completeSchema.parse(v))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const today = todayISO();
    const yesterday = yesterdayISO();

    const { data: mission, error: mErr } = await supabase
      .from("daily_missions")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", data.mission_id)
      .eq("user_id", userId)
      .eq("mission_date", today)
      .select("id, completed, completed_at")
      .maybeSingle();
    if (mErr) throw new Error(mErr.message);
    if (!mission) throw new Error("Mission not found");

    const { data: profile } = await supabase
      .from("profiles")
      .select("streak_count, longest_streak, last_mission_date")
      .eq("id", userId)
      .maybeSingle();

    const last = profile?.last_mission_date ?? null;
    let streak = profile?.streak_count ?? 0;
    if (last === today) {
      // already counted today
    } else if (last === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
    const longest = Math.max(profile?.longest_streak ?? 0, streak);

    await supabase
      .from("profiles")
      .update({ streak_count: streak, longest_streak: longest, last_mission_date: today })
      .eq("id", userId);

    return { ok: true, streak, longest };
  });