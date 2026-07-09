import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDailyVerse, getMyProfile } from "@/lib/mentor.functions";
import { getTodayMission, completeTodayMission } from "@/lib/missions.functions";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, AlertCircle, Sparkles, Flame, Check } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/home")({
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const fetchVerse = useServerFn(getDailyVerse);
  const fetchProfile = useServerFn(getMyProfile);
  const fetchMission = useServerFn(getTodayMission);
  const completeMission = useServerFn(completeTodayMission);
  const [verse, setVerse] = useState<{ ref: string; text: string; reflection: string } | null>(null);
  const [name, setName] = useState<string>("");
  const [mission, setMission] = useState<{ id: string; title: string; body: string; completed: boolean } | null>(null);
  const [streak, setStreak] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchProfile().then((p) => {
      if (p?.name) setName(p.name);
      if (p && !p.onboarded) navigate({ to: "/onboarding" });
    });
    fetchVerse({ data: { lang } }).then(setVerse).catch(() => {});
    fetchMission()
      .then((r) => {
        setMission(r.mission);
        setStreak(r.streak);
      })
      .catch(() => {});
  }, [fetchProfile, fetchVerse, lang, navigate]);

  const onComplete = async () => {
    if (!mission || mission.completed || completing) return;
    setCompleting(true);
    try {
      const r = await completeMission({ data: { mission_id: mission.id } });
      setMission({ ...mission, completed: true });
      setStreak(r.streak);
    } finally {
      setCompleting(false);
    }
  };

  const hour = new Date().getHours();
  const greet =
    hour < 12 ? t("home.greet.morning") : hour < 18 ? t("home.greet.afternoon") : t("home.greet.evening");

  return (
    <div className="app-frame flex flex-col px-6 pt-10 pb-28 min-h-dvh">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{greet}</p>
          <h1 className="font-serif text-2xl mt-1">{name || t("app.name")}</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5">
          <Flame className={`h-4 w-4 ${streak > 0 ? "text-primary" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium tabular-nums">{streak}</span>
        </div>
      </header>

      <section className="rounded-2xl bg-card border border-border p-5 mb-5">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">{t("home.word")}</p>
        {verse ? (
          <>
            <p className="font-serif text-lg leading-snug mb-2">"{verse.text}"</p>
            <p className="text-xs text-muted-foreground mb-3">{verse.ref}</p>
            {verse.reflection && (
              <p className="text-sm text-muted-foreground leading-relaxed">{verse.reflection}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">…</p>
        )}
      </section>

      <Link
        to="/chat"
        className="rounded-2xl bg-primary text-primary-foreground p-5 flex items-center justify-between mb-4 hover:opacity-90 transition"
      >
        <div>
          <p className="font-serif text-lg">{t("cta.talkmentor")}</p>
          <p className="text-xs opacity-80 mt-1">
            {lang === "pt" ? "Diga o que está pesando." : "Say what weighs on you."}
          </p>
        </div>
        <MessageCircle className="h-6 w-6" />
      </Link>

      <Link
        to="/sos"
        className="rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive p-4 flex items-center gap-3 mb-6 hover:bg-destructive/15 transition"
      >
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {lang === "pt" ? "SOS — Estou em crise" : "SOS — I'm in crisis"}
        </span>
      </Link>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-widest text-primary">{t("home.mission")}</p>
          {mission?.completed && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary">
              <Check className="h-3 w-3" /> {lang === "pt" ? "Concluída" : "Done"}
            </span>
          )}
        </div>
        {mission ? (
          <>
            <p className="font-serif text-base mb-1.5">{mission.title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">{mission.body}</p>
            <button
              onClick={onComplete}
              disabled={mission.completed || completing}
              className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {mission.completed
                ? lang === "pt"
                  ? "Missão concluída"
                  : "Mission complete"
                : completing
                  ? "…"
                  : lang === "pt"
                    ? "Marcar como concluída"
                    : "Mark as done"}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">…</p>
        )}
      </section>

      <BottomNav />
    </div>
  );
}