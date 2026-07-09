import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDailyVerse, getMyProfile } from "@/lib/mentor.functions";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, AlertCircle, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/home")({
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const fetchVerse = useServerFn(getDailyVerse);
  const fetchProfile = useServerFn(getMyProfile);
  const [verse, setVerse] = useState<{ ref: string; text: string; reflection: string } | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    fetchProfile().then((p) => {
      if (p?.name) setName(p.name);
      if (p && !p.onboarded) navigate({ to: "/onboarding" });
    });
    fetchVerse({ data: { lang } }).then(setVerse).catch(() => {});
  }, [fetchProfile, fetchVerse, lang, navigate]);

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
        <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center">
          <Sparkles className="h-4 w-4 text-primary" />
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

      <button className="rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive p-4 flex items-center gap-3 mb-6">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {lang === "pt" ? "SOS — Estou em crise" : "SOS — I'm in crisis"}
        </span>
      </button>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">{t("home.mission")}</p>
        <p className="text-sm leading-relaxed">{t("home.mission.body")}</p>
      </section>

      <BottomNav />
    </div>
  );
}