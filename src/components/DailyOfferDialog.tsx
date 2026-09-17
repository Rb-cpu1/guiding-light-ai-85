import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/lib/i18n";
import { Crown, X, Check } from "lucide-react";

const STORAGE_KEY = "mentor.dailyOffer.lastShown";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function DailyOfferDialog() {
  const { lang } = useI18n();
  const pt = lang === "pt";
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  const { isActive, loading } = useSubscription(userId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, []);

  useEffect(() => {
    if (!userId || loading || isActive) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === today()) return;
    const timer = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(timer);
  }, [userId, loading, isActive]);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, today());
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  const benefits = pt
    ? [
        "Conversas ilimitadas com o teu Mentor",
        "Memória completa de tudo o que já falaste",
        "Todos os modos: Pastor, Sargento, Sábio, Coach",
        "Missões diárias e streak sem limites",
      ]
    : [
        "Unlimited conversations with your Mentor",
        "Full memory of everything you've shared",
        "All modes: Pastor, Sergeant, Sage, Coach",
        "Daily missions and streak with no limits",
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-6 pt-10 sm:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-full bg-primary/15 grid place-items-center">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <button onClick={close} className="text-muted-foreground hover:text-foreground" aria-label="close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="font-serif text-2xl leading-snug mb-2">
          {pt ? "Hoje podes ter o poder total" : "Today you can have full power"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {pt
            ? "O plano grátis dá-te 5 mensagens por dia. O Premium tira todos os travões."
            : "The free plan gives you 5 messages a day. Premium removes every limit."}
        </p>

        <ul className="space-y-2.5 mb-6">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            close();
            navigate({ to: "/paywall" });
          }}
          className="w-full rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-medium hover:opacity-90 transition"
        >
          {pt ? "Desbloquear o poder total" : "Unlock full power"}
        </button>
        <button
          onClick={close}
          className="mt-2 w-full py-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {pt ? "Continuar no plano grátis hoje" : "Continue free today"}
        </button>
      </div>
    </div>
  );
}
