import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listConversation, sendMentorMessage } from "@/lib/mentor.functions";
import { useI18n } from "@/lib/i18n";
import { Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const { t } = useI18n();
  const list = useServerFn(listConversation);
  const send = useServerFn(sendMentorMessage);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([]);
    list({ data: { thread_id: threadId } }).then((rows) => {
      setMessages(rows.map((r) => ({ role: r.role as "user" | "assistant", content: r.content })));
    });
    inputRef.current?.focus();
  }, [list, threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setSending(true);
    try {
      const result = await send({ data: { message: msg, thread_id: threadId } });
      if (result.limitReached) {
        setLimitReached(true);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: result.reply }]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("chat.error"));
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="app-frame flex flex-col h-dvh">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Link to="/chat" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-lg leading-tight">MENTOR</h1>
          <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 pb-32 space-y-4">
        {messages.length === 0 && !sending && (
          <p className="text-center text-sm text-muted-foreground mt-16 px-6">{t("chat.empty")}</p>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} />
        ))}
        {sending && <Bubble role="assistant" content="…" />}
        {limitReached && (
          <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm">
            <p className="mb-3">{t("chat.limit")}</p>
            <Link
              to="/paywall"
              className="inline-block rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-medium"
            >
              {t("chat.limit.cta")}
            </Link>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 pt-3 bg-background border-t border-border"
      >
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            rows={1}
            className="flex-1 resize-none rounded-2xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e as unknown as React.FormEvent);
              }
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        }`}
      >
        {content}
      </div>
    </div>
  );
}