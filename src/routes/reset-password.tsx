import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As passwords não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password atualizada.");
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-frame flex flex-col px-6 py-10 min-h-dvh">
      <div className="flex items-center gap-2 mb-10">
        <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-serif tracking-wide">MENTOR</span>
      </div>
      <h1 className="font-serif text-3xl mb-2">Nova password</h1>
      <p className="text-muted-foreground text-sm mb-8">Define uma password nova para a tua conta.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-xl bg-input border border-border pl-10 pr-11 py-3.5 text-sm outline-none focus:border-primary transition"
            placeholder="Nova password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition"
            aria-label={show ? "Esconder" : "Mostrar"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-xl bg-input border border-border pl-10 pr-4 py-3.5 text-sm outline-none focus:border-primary transition"
            placeholder="Confirmar password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          className="mt-2 rounded-full bg-primary text-primary-foreground py-3.5 font-medium disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-95 transition"
        >
          {loading ? "..." : "Atualizar password"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}