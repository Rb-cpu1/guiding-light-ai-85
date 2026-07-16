import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const goNext = () => {
    if (safeNext) window.location.href = safeNext;
    else navigate({ to: "/home" });
  };
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Verifica o teu e-mail para redefinir a password.");
        setMode("signin");
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("As passwords não coincidem.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}${safeNext ?? "/home"}`,
          },
        });
        if (error) throw error;
        toast.success(t("cta.signup"));
        if (safeNext) goNext();
        else navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        goNext();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: safeNext ? `${window.location.origin}${safeNext}` : window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    goNext();
  }

  return (
    <div className="app-frame flex flex-col px-6 py-10 min-h-dvh">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-serif tracking-wide">MENTOR</span>
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2">
          {mode === "signin" && t("cta.signin")}
          {mode === "signup" && t("cta.signup")}
          {mode === "forgot" && "Recuperar password"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {mode === "forgot"
            ? "Enviamos-te um link para redefinir a tua password."
            : t("app.tagline")}
        </p>
      </div>

      {mode !== "forgot" && (
        <>
          <button
            onClick={handleGoogle}
            className="w-full rounded-xl border border-border bg-card py-3.5 text-sm font-medium hover:border-primary/50 hover:bg-card/70 transition flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.8 9.6-9.3 0-.6 0-1.1-.1-1.6H12z" />
            </svg>
            {t("cta.google")}
          </button>

          <div className="flex items-center gap-3 my-6 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span>ou com e-mail</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full rounded-xl bg-input border border-border pl-10 pr-4 py-3.5 text-sm outline-none focus:border-primary transition"
              placeholder={t("auth.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl bg-input border border-border pl-10 pr-4 py-3.5 text-sm outline-none focus:border-primary transition"
            placeholder={t("auth.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mode !== "forgot" && (
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-xl bg-input border border-border pl-10 pr-11 py-3.5 text-sm outline-none focus:border-primary transition"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition"
              aria-label={showPassword ? "Esconder password" : "Mostrar password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}

        {mode === "signup" && (
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl bg-input border border-border pl-10 pr-4 py-3.5 text-sm outline-none focus:border-primary transition"
              placeholder="Confirmar password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {mode === "signin" && (
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="self-end text-xs text-muted-foreground hover:text-primary transition -mt-1"
          >
            Esqueci a minha password
          </button>
        )}

        <button
          disabled={loading}
          className="mt-2 rounded-full bg-primary text-primary-foreground py-3.5 font-medium disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-95 transition"
        >
          {loading
            ? "..."
            : mode === "signin"
            ? t("cta.signin")
            : mode === "signup"
            ? t("cta.signup")
            : "Enviar link"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      {mode === "forgot" ? (
        <button
          onClick={() => setMode("signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-primary transition"
        >
          Voltar ao <span className="text-primary">{t("cta.signin")}</span>
        </button>
      ) : (
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-primary transition"
        >
          {mode === "signin" ? t("auth.no") : t("auth.have")}{" "}
          <span className="text-primary">
            {mode === "signin" ? t("cta.signup") : t("cta.signin")}
          </span>
        </button>
      )}
    </div>
  );
}