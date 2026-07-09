import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPaddleEnvironment } from "@/lib/paddle";

export type SubscriptionRow = {
  id: string;
  paddle_subscription_id: string;
  paddle_customer_id: string;
  product_id: string;
  price_id: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  environment: string;
};

function computeIsActive(sub: SubscriptionRow | null): boolean {
  if (!sub) return false;
  const now = Date.now();
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  if (["active", "trialing", "past_due"].includes(sub.status)) {
    return end === null || end > now;
  }
  if (sub.status === "canceled" && end && end > now) return true;
  return false;
}

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const env = getPaddleEnvironment();
    let mounted = true;

    async function fetchSub() {
      const { data } = await supabase
        .from("subscriptions")
        .select("id, paddle_subscription_id, paddle_customer_id, product_id, price_id, status, current_period_end, cancel_at_period_end, environment")
        .eq("user_id", userId!)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (mounted) {
        setSubscription((data as SubscriptionRow | null) ?? null);
        setLoading(false);
      }
    }

    fetchSub();
    const channel = supabase
      .channel(`subscriptions:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${userId}` },
        () => fetchSub(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    subscription,
    loading,
    isActive: computeIsActive(subscription),
  };
}