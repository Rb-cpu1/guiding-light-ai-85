import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/home", icon: Home, label: t("nav.home") },
    { to: "/chat", icon: MessageCircle, label: t("nav.chat") },
    { to: "/profile", icon: User, label: t("nav.profile") },
  ] as const;
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-border bg-background/95 backdrop-blur">
      <div className="flex justify-around py-2 pb-4">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 text-[11px] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}