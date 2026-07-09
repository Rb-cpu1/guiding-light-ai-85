import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useSubscription } from "@/hooks/useSubscription";
import { initializePaddle } from "@/lib/paddle";
import { openCustomerPortal } from "@/lib/payments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/paywall")({
  component: Paywall,
});

type PlanId = "premium_monthly" | "premium_yearly" | "lifetime_access";

const FALLBACK_PRICES: Record<PlanId, string> = {
  premium_monthly: "$8.99",
  premium_yearly: "$69.99",
  lifetime_access: "$187.99",
};

function Paywall() {
  const { lang } = useI18n();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [userId, setUserId] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [prices, setPrices] = useState<Record<PlanId, string>>(FALLBACK_PRICES);
  const { subscription, isActive } = useSubscription(userId);
  const [portalLoading, setPortalLoading] = useState(false);
  const [selected, setSelected] = useState<PlanId | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
      setEmail(data.user?.email ?? undefined);
    });
  }, []);

  // Fetch localized prices from Paddle.
  useEffect(() => {
    let cancelled = false;
    async function loadPrices() {
      try {
        await initializePaddle();
        const { resolvePaddlePrice } = await import("@/lib/payments.functions");
        const { getPaddleEnvironment } = await import("@/lib/paddle");
        const env = getPaddleEnvironment();
        const ids = await Promise.all(
          (Object.keys(FALLBACK_PRICES) as PlanId[]).map(async (pid) => ({
            key: pid,
            id: await resolvePaddlePrice({ data: { priceId: pid, environment: env } }),
          })),
        );
        const preview = await window.Paddle.PricePreview({
          items: ids.map((x) => ({ priceId: x.id, quantity: 1 })),
        });
        if (cancelled) return;
        const map = { ...FALLBACK_PRICES };
        preview.data.details.lineItems.forEach((li: any, idx: number) => {
          map[ids[idx].key] = li.formattedTotals?.subtotal ?? map[ids[idx].key];
        });
        setPrices(map);
      } catch (e) {
        console.warn("PricePreview failed, using fallback", e);
      }
    }
    loadPrices();
    return () => { cancelled = true; };
  }, []);

  async function handleBuy(priceId: PlanId) {
    if (!userId) {
      toast.error(lang === "pt" ? "Sessão expirou. Entra de novo." : "Session expired.");
      return;
    }
    setSelected(priceId);
    try {
      await openCheckout({
        priceId,
        customerEmail: email,
        customData: { userId },
        successUrl: `${window.location.origin}/home?checkout=success`,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Checkout failed");
    } finally {
      setSelected(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const { url } = await openCustomerPortal({});
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Portal failed");
    } finally {
      setPortalLoading(false);
    }
  }

  const benefits =
    lang === "pt"
      ? [
          "Mensagens ilimitadas com o mentor",
          "Biblioteca completa (desenvolvimento pessoal, vendas, negócios, bilionários)",
          "Bíblia integrada com sabedoria dos maiores autores",
          "Missões diárias ilimitadas",
          "Journaling guiado + áudio personalizado",
        ]
      : [
          "Unlimited mentor conversations",
          "Full library (personal development, sales, business, billionaire mindset)",
          "Bible integrated with the greatest authors' wisdom",
          "Unlimited daily missions",
          "Guided journaling + personalized audio",
        ];

  return (
    <div className="app-frame flex flex-col px-6 pt-6 pb-10 min-h-dvh">
      <Link to="/home" className="text-muted-foreground mb-6">
        <ArrowLeft className="h-5 w-5" />
      </Link>

      {isActive ? (
        <>
          <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3">
            {lang === "pt" ? "Premium ativo" : "Premium active"}
          </p>
          <h1 className="font-serif text-3xl mb-3">
            {lang === "pt" ? "Estás dentro." : "You're in."}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {lang === "pt"
              ? `Plano: ${planLabel(subscription?.price_id, lang)}. Aproveita tudo sem limites.`
              : `Plan: ${planLabel(subscription?.price_id, lang)}. Enjoy everything unlimited.`}
          </p>
          {subscription?.price_id !== "lifetime_access" && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="rounded-full border border-border py-3 font-medium text-sm"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : lang === "pt" ? (
                "Gerir subscrição"
              ) : (
                "Manage subscription"
              )}
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3">
            {lang === "pt" ? "Escolhe o teu caminho" : "Choose your path"}
          </p>
          <h1 className="font-serif text-3xl mb-3">
            {lang === "pt" ? "Vencer todos os dias" : "Win every day"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {lang === "pt"
              ? "Grátis: 5 mensagens/dia + 1 missão + prévia dos livros. Premium: tudo, sem limites."
              : "Free: 5 messages/day + 1 mission + book previews. Premium: everything, unlimited."}
          </p>

          <ul className="space-y-2 mb-8">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <PlanCard
              title={lang === "pt" ? "Anual" : "Yearly"}
              price={prices.premium_yearly}
              suffix={lang === "pt" ? "/ano" : "/yr"}
              badge={lang === "pt" ? "Poupa 35%" : "Save 35%"}
              highlight
              loading={selected === "premium_yearly" && checkoutLoading}
              onClick={() => handleBuy("premium_yearly")}
            />
            <PlanCard
              title={lang === "pt" ? "Mensal" : "Monthly"}
              price={prices.premium_monthly}
              suffix={lang === "pt" ? "/mês" : "/mo"}
              loading={selected === "premium_monthly" && checkoutLoading}
              onClick={() => handleBuy("premium_monthly")}
            />
            <PlanCard
              title={lang === "pt" ? "Vitalício" : "Lifetime"}
              price={prices.lifetime_access}
              suffix={lang === "pt" ? " uma vez" : " once"}
              badge={lang === "pt" ? "Paga 1 vez" : "One-time"}
              loading={selected === "lifetime_access" && checkoutLoading}
              onClick={() => handleBuy("lifetime_access")}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            {lang === "pt"
              ? "Cancela quando quiseres. Mantém o acesso até ao fim do período pago."
              : "Cancel anytime. Access continues until the end of the paid period."}
          </p>
        </>
      )}
    </div>
  );
}

function planLabel(priceId: string | undefined, lang: string) {
  if (priceId === "premium_monthly") return lang === "pt" ? "Mensal" : "Monthly";
  if (priceId === "premium_yearly") return lang === "pt" ? "Anual" : "Yearly";
  if (priceId === "lifetime_access") return lang === "pt" ? "Vitalício" : "Lifetime";
  return "Premium";
}

function PlanCard({
  title,
  price,
  suffix,
  badge,
  highlight,
  loading,
  onClick,
}: {
  title: string;
  price: string;
  suffix?: string;
  badge?: string;
  highlight?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full rounded-2xl border p-4 flex items-center justify-between transition ${
        highlight
          ? "border-primary bg-primary/10 hover:bg-primary/15"
          : "border-border bg-card hover:border-primary/40"
      } disabled:opacity-60`}
    >
      <div className="text-left">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {price}
          {suffix}
        </p>
      </div>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className="text-primary text-sm font-medium">→</span>
      )}
    </button>
  );
}