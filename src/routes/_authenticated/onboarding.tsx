import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { updateProfile } from "@/lib/mentor.functions";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const save = useServerFn(updateProfile);
  const [step, setStep] = useState(0);
  const [struggle, setStruggle] = useState<string>("");
  const [mode, setMode] = useState<string>("pastor");
  const [faith, setFaith] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const struggles: string[][] = [
    ["finances", t("onb.struggle.finances")],
    ["relationship", t("onb.struggle.relationship")],
    ["faith", t("onb.struggle.faith")],
    ["discipline", t("onb.struggle.discipline")],
    ["purpose", t("onb.struggle.purpose")],
    ["anxiety", t("onb.struggle.anxiety")],
  ];
  const modes: string[][] = [
    ["pastor", t("onb.mode.pastor")],
    ["sargento", t("onb.mode.sargento")],
    ["sabio", t("onb.mode.sabio")],
    ["coach", t("onb.mode.coach")],
  ];
  const faiths: string[][] = [
    ["firm", t("onb.faith.firm")],
    ["seeking", t("onb.faith.seeking")],
    ["questioning", t("onb.faith.questioning")],
    ["curious", t("onb.faith.curious")],
  ];

  async function finish() {
    setSaving(true);
    try {
      await save({
        data: {
          language: lang,
          main_struggle: struggle,
          mentor_mode: mode as "pastor" | "sargento" | "sabio" | "coach",
          faith_level: faith,
          onboarded: true,
        },
      });
      navigate({ to: "/home" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  const totalSteps = 4;

  return (
    <div className="app-frame flex flex-col px-6 py-10 min-h-dvh">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <button
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          {lang === "pt" ? "EN" : "PT"}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 0 && (
          <div className="text-center">
            <p className="text-primary text-xs uppercase tracking-[0.3em] mb-6">{t("app.tagline")}</p>
            <h1 className="font-serif text-3xl leading-tight mb-4">
              {lang === "pt" ? "Vamos calibrar seu mentor." : "Let's calibrate your mentor."}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {lang === "pt" ? "Três perguntas rápidas para te conhecer melhor." : "Three quick questions so I know you better."}
            </p>
          </div>
        )}
        {step === 1 && <QuestionStep title={t("onb.q1")} options={struggles} value={struggle} onChange={setStruggle} />}
        {step === 2 && <QuestionStep title={t("onb.q2")} options={modes} value={mode} onChange={setMode} />}
        {step === 3 && <QuestionStep title={t("onb.q3")} options={faiths} value={faith} onChange={setFaith} />}
      </div>

      <button
        disabled={saving || (step === 1 && !struggle) || (step === 2 && !mode) || (step === 3 && !faith)}
        onClick={() => (step < totalSteps - 1 ? setStep(step + 1) : finish())}
        className="rounded-full bg-primary text-primary-foreground py-4 font-medium disabled:opacity-40"
      >
        {step < totalSteps - 1 ? t("cta.continue") : saving ? "..." : t("cta.finish")}
      </button>
    </div>
  );
}

function QuestionStep({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">{title}</h2>
      <div className="flex flex-col gap-2">
        {options.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-xl border px-4 py-3.5 text-left text-sm transition ${
              value === key
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}