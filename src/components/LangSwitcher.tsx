import { useI18n, LANG_META, type Lang } from "@/lib/i18n";

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const next: Lang = lang === "pt" ? "en" : "pt";
  const nextMeta = LANG_META[next];
  const currentMeta = LANG_META[lang];
  return (
    <button
      onClick={() => setLang(next)}
      title={`${currentMeta.label} → ${nextMeta.label}`}
      aria-label={`Switch language to ${nextMeta.label}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition ${className}`}
    >
      <span className="text-base leading-none">{currentMeta.flag}</span>
      <span className="tracking-wider">{currentMeta.short}</span>
    </button>
  );
}