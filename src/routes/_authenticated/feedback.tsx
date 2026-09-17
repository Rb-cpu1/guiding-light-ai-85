import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Star, Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/feedback")({
  component: FeedbackPage;
});

type Row = { id: string; kind: string; rating: number | null; message: string; created_at: string };

const KINDS = ["improvement", "bug", "praise"] as const;
type Kind = (typeof KINDS)[number];

function FeedbackPage() {
  const { lang } = useI18n();
  const pt = lang === "pt";
  const [kind, setKind] = useState<Kind>("improvement");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  const kindLabel: Record<Kind, string> = {
    improvement: pt ? "Melhoria" : "Improvement",
    bug: pt ? "Problema" : "Problem",
    praise: pt ? "Elogio" : "Praise",
  };

  async function load() {
    const { data } = await supabase
      .from("feedback")
      .select("id, kind, rating, message, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setRows((data as Row[] | null) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (message.trim().length < 3 || sending) return;
    setSending(true);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      setSending(false);
      toast.error(pt ? "Sessão expirou." : "Session expired.");
      return;
    }
    const { error } = await supabase.from("feedback").insert({
      user_id: uid,
      kind,
      rating: rating || null,
      message: message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setMessage("");
    setRating(0);
    toast.success(pt ? "Obrigado! Recebemos a tua ideia." : "Thank you! We got your idea.");
    load();
  }

  return (
    <div className="app-frame flex flex-col px-6 pt-10 pb-28 min-h-dvh">
      <header className="flex items-center gap-3 mb-6">
        <Link to="/profile" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-2xl">{pt ? "Sugestões e feedback" : "Suggestions & feedback"}</h1>
      </header>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {pt
          ? "Diz-nos o que queres ver melhorado no MENTOR. Lemos tudo — as melhores ideias entram na app."
          : "Tell us what you want improved in MENTOR. We read everything — the best ideas ship."}
      </p>

      <section className="rounded-2xl bg-card border border-border p-5 mb-6">
        <p className="text-xs uppercase tracking-widest text-primary mb-3">{pt ? "Tipo" : "Type"}</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-xl border px-2 py-2 text-sm transition ${
                kind === k ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
              }`}
            >
              {kindLabel[k]}
            </button>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-primary mb-3">
          {pt ? "Nota da experiência" : "Experience rating"}
        </p>
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n}`}>
              <Star
                className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder={pt ? "Escreve aqui a tua sugestão..." : "Write your suggestion here..."}
          className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />

        <button
          onClick={submit}
          disabled={sending || message.trim().length < 3}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {pt ? "Enviar" : "Send"}
        </button>
      </section>

      {rows.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {pt ? "O que já enviaste" : "What you've sent"}
          </p>
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-primary">
                    {kindLabel[(r.kind as Kind) in kindLabel ? (r.kind as Kind) : "improvement"]}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString(pt ? "pt-PT" : "en-US")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{r.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <BottomNav />
    </div>
  );
}
