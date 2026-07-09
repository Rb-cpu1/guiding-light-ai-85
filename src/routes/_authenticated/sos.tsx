import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/sos")({
  component: SOS,
});

type Phase = "inhale" | "hold" | "exhale";

const PHASES: Record<Phase, number> = { inhale: 4, hold: 7, exhale: 8 };

function SOS() {
  const { lang } = useI18n();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => {
          const next: Phase = p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale";
          if (next === "inhale") setCycles((n) => n + 1);
          setCount(PHASES[next]);
          return next;
        });
        return PHASES[phase];
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, phase]);

  const label: Record<Phase, string> = {
    inhale: lang === "pt" ? "Inspire" : "Inhale",
    hold: lang === "pt" ? "Segure" : "Hold",
    exhale: lang === "pt" ? "Expire" : "Exhale",
  };

  const scale = phase === "inhale" ? "scale-110" : phase === "hold" ? "scale-110" : "scale-90";

  const prayer =
    lang === "pt"
      ? "Senhor, tu és meu refúgio. Neste momento, entrego o peso que carrego. Aquieta meu coração, ordena meus pensamentos e me lembra que Tu estás no controle. Em Cristo, amém."
      : "Lord, You are my refuge. In this moment, I surrender the weight I carry. Still my heart, order my thoughts, and remind me that You are in control. In Christ, amen.";

  return (
    <div className="app-frame flex flex-col px-6 pt-6 pb-10 min-h-dvh">
      <Link to="/home" className="text-muted-foreground mb-6">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <h1 className="font-serif text-3xl mb-2">SOS</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {lang === "pt"
          ? "Respire comigo. 4 segundos inspirando. 7 segurando. 8 expirando."
          : "Breathe with me. 4 seconds in. 7 hold. 8 out."}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className={`h-56 w-56 rounded-full bg-primary/20 border border-primary/40 grid place-items-center transition-transform duration-1000 ease-in-out ${scale}`}
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{label[phase]}</p>
            <p className="font-serif text-6xl">{count}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {lang === "pt" ? "Ciclos" : "Cycles"}: {cycles}
        </p>

        <button
          onClick={() => {
            if (running) {
              setRunning(false);
              setPhase("inhale");
              setCount(4);
              setCycles(0);
            } else {
              setPhase("inhale");
              setCount(4);
              setRunning(true);
            }
          }}
          className="rounded-full bg-primary text-primary-foreground px-8 py-3 font-medium"
        >
          {running
            ? lang === "pt"
              ? "Parar"
              : "Stop"
            : lang === "pt"
              ? "Começar"
              : "Start"}
        </button>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-widest text-primary mb-2">
          {lang === "pt" ? "Oração de refúgio" : "Prayer of refuge"}
        </p>
        <p className="font-serif text-base leading-relaxed">{prayer}</p>
      </section>
    </div>
  );
}