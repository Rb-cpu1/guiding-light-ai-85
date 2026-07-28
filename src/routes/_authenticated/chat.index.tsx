import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listThreads, createThread, deleteThread } from "@/lib/mentor.functions";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, MessageSquarePlus, Trash2, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

type Thread = { id: string; title: string; created_at: string; updated_at: string };

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
  head: () => ({
    meta: [{ title: "Suas conversas — MENTOR" }],
  }),
});

function ChatIndex() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const fetchThreads = useServerFn(listThreads);
  const createNew = useServerFn(createThread);
  const removeThread = useServerFn(deleteThread);
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchThreads().then((rows) => setThreads(rows as Thread[])).catch(() => setThreads([]));
  }, [fetchThreads]);

  const onNew = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const t = await createNew();
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm(lang === "pt" ? "Apagar esta conversa?" : "Delete this conversation?")) return;
    try {
      await removeThread({ data: { thread_id: id } });
      setThreads((prev) => (prev ?? []).filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    }
  };

  return (
    <div className="app-frame flex flex-col min-h-dvh pb-28">
      <header className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link to="/home" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-lg leading-tight">
              {lang === "pt" ? "Suas conversas" : "Your conversations"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {lang === "pt" ? "O mentor lembra de tudo o que já foi dito." : "The mentor remembers everything."}
            </p>
          </div>
        </div>
        <button
          onClick={onNew}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-2 text-xs font-medium disabled:opacity-50"
        >
          <MessageSquarePlus className="h-4 w-4" />
          {lang === "pt" ? "Nova" : "New"}
        </button>
      </header>

      <div className="flex-1 px-4 py-5 space-y-2">
        {threads === null && <p className="text-sm text-muted-foreground text-center mt-10">…</p>}
        {threads?.length === 0 && (
          <div className="text-center mt-16 px-6">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-5">
              {lang === "pt"
                ? "Nenhuma conversa ainda. Comece a primeira agora."
                : "No conversations yet. Start the first one."}
            </p>
            <button
              onClick={onNew}
              disabled={busy}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {lang === "pt" ? "Iniciar conversa" : "Start conversation"}
            </button>
          </div>
        )}
        {threads?.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition"
          >
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="flex-1 px-4 py-3 min-w-0"
            >
              <p className="text-sm font-medium truncate">{t.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {new Date(t.updated_at).toLocaleString(lang === "pt" ? "pt-PT" : "en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </Link>
            <button
              onClick={() => onDelete(t.id)}
              className="p-3 text-muted-foreground hover:text-destructive"
              aria-label="delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}