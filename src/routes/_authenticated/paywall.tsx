import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/paywall")({
  component: Paywall,
});

function Paywall() {
  const { t, lang } = useI18n();
  const benefits =
    lang === "pt"
      ? [
          "Conversas ilimitadas",
          "Todos os 4 modos de mentor",
          "Áudio diário personalizado",
          "Missões completas",
          "Journaling guiado",
        ]
      : [
          "Unlimited conversations",
          "All 4 mentor modes",
          "Daily personalized audio",
          "Full missions library",
          "Guided journaling",
        ];

  return (
    <div className="app-frame flex flex-col px-6 pt-6 pb-10 min-h-dvh">
      <Link to="/home" className="text-muted-foreground mb-6">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3">{t("paywall.trial")}</p>
      <h1 className="font-serif text-3xl mb-3">{t("paywall.title")}</h1>
      <p className="text-muted-foreground text-sm mb-8">{t("paywall.sub")}</p>

      <ul className="space-y-3 mb-10">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3 mb-8">
        <PlanCard title={t("paywall.yearly")} price="$79/yr" badge={lang === "pt" ? "Economize 34%" : "Save 34%"} highlight />
        <PlanCard title={t("paywall.monthly")} price="$9.99/mo" />
        <PlanCard title={t("paywall.plus")} price="$19.99/mo" />
      </div>

      <button
        disabled
        className="rounded-full bg-primary text-primary-foreground py-4 font-medium opacity-70 cursor-not-allowed"
      >
        {t("paywall.notice")}
      </button>
    </div>
  );
}

function PlanCard({
  title,
  price,
  badge,
  highlight,
}: {
  title: string;
  price: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 flex items-center justify-between ${
        highlight ? "border-primary bg-primary/10" : "border-border bg-card"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{price}</p>
      </div>
    </div>
  );
}