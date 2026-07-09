import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/home`,
          },
        });
        if (error) throw error;
        toast.success(t("cta.signup"));
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/home" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home" });
  }

  return (
    <div className="app-frame flex flex-col px-6 py-10 min-h-dvh">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-serif tracking-wide">MENTOR</span>
      </Link>

      <h1 className="font-serif text-3xl mb-2">
        {mode === "signin" ? t("cta.signin") : t("cta.signup")}
      </h1>
      <p className="text-muted-foreground text-sm mb-8">{t("app.tagline")}</p>

      <button
        onClick={handleGoogle}
        className="w-full rounded-xl border border-border bg-card py-3.5 text-sm font-medium hover:border-primary/50 transition"
      >
        {t("cta.google")}
      </button>

      <div className="flex items-center gap-3 my-6 text-xs text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        <span>or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <input
            className="rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder={t("auth.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          required
          className="rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          className="rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder={t("auth.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="mt-2 rounded-full bg-primary text-primary-foreground py-3.5 font-medium disabled:opacity-60"
        >
          {loading ? "..." : mode === "signin" ? t("cta.signin") : t("cta.signup")}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-sm text-muted-foreground hover:text-primary transition"
      >
        {mode === "signin" ? t("auth.no") : t("auth.have")}{" "}
        <span className="text-primary">
          {mode === "signin" ? t("cta.signup") : t("cta.signin")}
        </span>
      </button>
    </div>
  );
}