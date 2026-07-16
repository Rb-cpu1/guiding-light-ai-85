import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

type OAuthClient = { name?: string; client_id?: string; redirect_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};

type SupabaseOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauthClient(): SupabaseOAuth {
  return (supabase.auth as unknown as { oauth: SupabaseOAuth }).oauth;
}

function isSameOriginPath(next: string): boolean {
  return next.startsWith("/") && !next.startsWith("//");
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthClient().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="app-frame flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <h1 className="font-serif text-2xl mb-2">Não foi possível carregar</h1>
      <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "esta aplicação";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthClient().approveAuthorization(authorization_id)
      : await oauthClient().denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("Nenhum redirecionamento devolvido."); return; }
    window.location.href = target;
  }

  return (
    <main className="app-frame flex flex-col justify-center min-h-dvh px-6 py-10">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-serif tracking-wide">MENTOR</span>
      </div>

      <h1 className="font-serif text-2xl mb-3">Ligar <span className="text-primary">{clientName}</span> à tua conta</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Isto permite que <strong>{clientName}</strong> use o MENTOR como tu — ler o teu perfil, conversas, missões e enviar mensagens ao mentor em teu nome.
      </p>

      {details?.scopes && details.scopes.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 text-xs text-muted-foreground">
          <p className="mb-2 text-foreground font-medium">Permissões pedidas</p>
          <ul className="list-disc pl-5 space-y-1">
            {details.scopes.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-6">
        As políticas de acesso da aplicação continuam a aplicar-se. Podes revogar o acesso a qualquer momento.
      </p>

      {error && <p role="alert" className="text-sm text-destructive mb-4">{error}</p>}

      <div className="flex flex-col gap-3">
        <button
          disabled={busy}
          onClick={() => decide(true)}
          className="rounded-full bg-primary text-primary-foreground py-3.5 font-medium disabled:opacity-60 hover:opacity-95 transition"
        >
          {busy ? "..." : "Aprovar e ligar"}
        </button>
        <button
          disabled={busy}
          onClick={() => decide(false)}
          className="rounded-full border border-border py-3.5 text-sm disabled:opacity-60 hover:bg-card transition"
        >
          Recusar
        </button>
      </div>
    </main>
  );
}

export { isSameOriginPath };