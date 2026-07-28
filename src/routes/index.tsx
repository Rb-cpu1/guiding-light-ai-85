import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Sparkles, Compass, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { t, lang } = useI18n();
  return (
    <div className="app-frame flex flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/15 grid place-items-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-serif text-lg tracking-wide">{t("app.name")}</span>
        </div>
        <LangSwitcher />
      </header>

      <main className="flex-1 flex flex-col justify-center py-16">
        <p className="text-primary text-xs uppercase tracking-[0.3em] mb-6">{t("app.tagline")}</p>
        <h1 className="font-serif text-4xl leading-tight mb-6">{t("landing.headline")}</h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-10">{t("landing.sub")}</p>

        <Link
          to="/auth"
          className="rounded-full bg-primary text-primary-foreground text-center py-4 font-medium hover:opacity-90 transition"
        >
          {t("landing.cta")}
        </Link>

        <div className="mt-14 space-y-5">
          <Feature icon={<BookOpen className="h-4 w-4" />} title={lang === "pt" ? "Sabedoria fundamentada" : "Grounded wisdom"} body={lang === "pt" ? "Cada resposta cita a Bíblia, filósofos e autores clássicos." : "Every reply cites Scripture, philosophers and classic authors."} />
          <Feature icon={<Compass className="h-4 w-4" />} title={lang === "pt" ? "Direção prática" : "Practical direction"} body={lang === "pt" ? "Ações concretas para as próximas 24 horas — não teoria vazia." : "Concrete actions for the next 24 hours — no empty theory."} />
          <Feature icon={<Sparkles className="h-4 w-4" />} title={lang === "pt" ? "Mentor 24/7" : "24/7 mentor"} body={lang === "pt" ? "Um amigo sábio que lembra do seu contexto e cobra você." : "A wise friend who remembers your context and holds you accountable."} />
        </div>
      </main>

      <footer className="pt-6 text-center text-xs text-muted-foreground space-y-2">
        <div className="flex justify-center gap-4">
          <Link to="/pricing" className="hover:text-primary">Preços</Link>
          <Link to="/terms" className="hover:text-primary">Termos</Link>
          <Link to="/privacy" className="hover:text-primary">Privacidade</Link>
          <Link to="/refund" className="hover:text-primary">Reembolso</Link>
        </div>
        <p>© MENTOR LTDA · 2026</p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
