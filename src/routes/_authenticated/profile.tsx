import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile, updateProfile } from "@/lib/mentor.functions";
import { useI18n, type Lang, LANG_META } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { openCustomerPortal } from "@/lib/payments.functions";
import { Loader2 } from "lucide-react";

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
  const [tab, setTab] = useState<"profile" | "plans">("profile");
  const [userId, setUserId] = useState<string | undefined>();
  const { subscription, isActive } = useSubscription(userId);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    load().then(setProfile);
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
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

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const { url } = await openCustomerPortal({});
      window.open(url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setPortalLoading(false);
    }
  }

  const planName = (() => {
    const id = subscription?.price_id;
    if (id === "premium_monthly") return lang === "pt" ? "Mensal" : "Monthly";
    if (id === "premium_yearly") return lang === "pt" ? "Anual" : "Yearly";
    if (id === "lifetime_access") return lang === "pt" ? "Vitalício" : "Lifetime";
    return lang === "pt" ? "Grátis" : "Free";
  })();

  return (
    <div className="app-frame flex flex-col px-6 pt-10 pb-28 min-h-dvh">
      <h1 className="font-serif text-3xl mb-8">{t("profile.title")}</h1>

      <div className="flex gap-1 mb-6 p-1 rounded-full bg-card border border-border">
        <button
          onClick={() => setTab("profile")}
          className={`flex-1 rounded-full py-2 text-sm transition ${
            tab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {lang === "pt" ? "Perfil" : "Profile"}
        </button>
        <button
          onClick={() => setTab("plans")}
          className={`flex-1 rounded-full py-2 text-sm transition ${
            tab === "plans" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {lang === "pt" ? "Planos" : "Plans"}
        </button>
      </div>

      {tab === "profile" ? (
        <>
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
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                lang === l ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              <span className="text-base leading-none">{LANG_META[l].flag}</span>
              <span>{LANG_META[l].label}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={() => navigate({ to: "/feedback" })}
        className="rounded-2xl bg-card border border-border p-5 text-left hover:border-primary/40 transition"
      >
        <p className="text-xs uppercase tracking-widest text-primary mb-1">
          {lang === "pt" ? "Sugestões e feedback" : "Suggestions & feedback"}
        </p>
        <p className="text-sm text-muted-foreground">
          {lang === "pt"
            ? "Diz-nos o que melhorar. Lemos todas as ideias."
            : "Tell us what to improve. We read every idea."}
        </p>
      </button>

      <button
        onClick={signOut}
        className="mt-4 rounded-full border border-border py-3 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/40 transition"
      >
        {t("cta.signout")}
      </button>
        </>
      ) : (
        <>
          <section className="rounded-2xl bg-card border border-border p-5 mb-4">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">
              {lang === "pt" ? "Plano atual" : "Current plan"}
            </p>
            <p className="font-serif text-2xl mb-1">{planName}</p>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? lang === "pt"
                  ? "Acesso Premium ativo. Tudo sem limites."
                  : "Premium access active. Everything unlimited."
                : lang === "pt"
                  ? "5 mensagens/dia + 1 missão diária + prévia dos livros."
                  : "5 messages/day + 1 daily mission + book previews."}
            </p>
            {isActive && subscription?.current_period_end && subscription?.price_id !== "lifetime_access" && (
              <p className="text-xs text-muted-foreground mt-2">
                {lang === "pt" ? "Renova em " : "Renews on "}
                {new Date(subscription.current_period_end).toLocaleDateString(lang === "pt" ? "pt-PT" : "en-US")}
              </p>
            )}
          </section>

          {isActive ? (
            subscription?.price_id !== "lifetime_access" && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="rounded-full border border-border py-3 text-sm"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : lang === "pt" ? (
                  "Gerir subscrição"
                ) : (
                  "Manage subscription"
                )}
              </button>
            )
          ) : (
            <button
              onClick={() => navigate({ to: "/paywall" })}
              className="rounded-full bg-primary text-primary-foreground py-3 font-medium text-sm"
            >
              {lang === "pt" ? "Ver planos Premium" : "See Premium plans"}
            </button>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}