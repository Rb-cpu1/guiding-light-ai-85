import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile, updateProfile } from "@/lib/mentor.functions";
import { useI18n, type Lang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

const modes = ["pastor", "sargento", "sabio", "coach"] as const;

function Profile() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const load = useServerFn(getMyProfile);
  const save = useServerFn(updateProfile);
  const [profile, setProfile] = useState<{ name?: string | null; mentor_mode?: string | null } | null>(null);

  useEffect(() => {
    load().then(setProfile);
  }, [load]);

  async function updateMode(mode: (typeof modes)[number]) {
    setProfile((p) => ({ ...p, mentor_mode: mode }));
    try {
      await save({ data: { mentor_mode: mode } });
      toast.success("✓");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  }

  async function updateLang(l: Lang) {
    setLang(l);
    try {
      await save({ data: { language: l } });
    } catch {
      /* ignore */
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="app-frame flex flex-col px-6 pt-10 pb-28 min-h-dvh">
      <h1 className="font-serif text-3xl mb-8">{t("profile.title")}</h1>

      <section className="rounded-2xl bg-card border border-border p-5 mb-4">
        <p className="text-xs uppercase tracking-widest text-primary mb-3">{t("profile.mode")}</p>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => updateMode(m)}
              className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                profile?.mentor_mode === m
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {t(`onb.mode.${m}`).split(" — ")[0]}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-card border border-border p-5 mb-4">
        <p className="text-xs uppercase tracking-widest text-primary mb-3">{t("profile.language")}</p>
        <div className="grid grid-cols-2 gap-2">
          {(["pt", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => updateLang(l)}
              className={`rounded-xl border px-3 py-2.5 text-sm ${
                lang === l ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              {l === "pt" ? "Português" : "English"}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={signOut}
        className="mt-4 rounded-full border border-border py-3 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/40 transition"
      >
        {t("cta.signout")}
      </button>

      <BottomNav />
    </div>
  );
}