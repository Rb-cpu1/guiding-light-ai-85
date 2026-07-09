import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Preços — MENTOR" },
      { name: "description", content: "Planos Mensal, Anual e Vitalício da MENTOR. Cancela quando quiseres." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Preços — MENTOR" },
      { property: "og:description", content: "Planos Mensal, Anual e Vitalício. Cancela quando quiseres." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Mensal",
    price: "$8.99",
    suffix: "/mês",
    desc: "Flexibilidade total, cancela quando quiseres.",
  },
  {
    name: "Anual",
    price: "$69.99",
    suffix: "/ano",
    desc: "Poupa 35% em relação ao plano mensal.",
    highlight: true,
  },
  {
    name: "Vitalício",
    price: "$187.99",
    suffix: " uma vez",
    desc: "Paga uma vez, acesso para sempre.",
  },
];

const benefits = [
  "Mensagens ilimitadas com o mentor",
  "Biblioteca completa (desenvolvimento pessoal, vendas, negócios, bilionários)",
  "Bíblia integrada com sabedoria dos maiores autores",
  "Missões diárias ilimitadas",
  "Journaling guiado + áudio personalizado",
];

function PricingPage() {
  return (
    <div className="app-frame px-6 py-10 min-h-dvh">
      <Link to="/" className="text-primary text-sm">← Voltar</Link>
      <header className="mt-6 mb-10 text-center">
        <p className="text-primary text-xs uppercase tracking-[0.3em] mb-3">Preços</p>
        <h1 className="font-serif text-4xl mb-3">Escolhe o teu caminho</h1>
        <p className="text-muted-foreground text-sm">
          Grátis: 5 mensagens/dia + 1 missão + prévia dos livros. Premium: tudo sem limites.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Preços em USD. Mostramos a tua moeda local no checkout.
        </p>
      </header>

      <ul className="space-y-2 mb-8">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-5 ${
              p.highlight ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">{p.name}</h2>
              <p className="text-lg">
                <span className="font-serif">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.suffix}</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      <Link
        to="/auth"
        className="mt-8 block rounded-full bg-primary text-primary-foreground text-center py-4 font-medium"
      >
        Começar agora
      </Link>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Cancela quando quiseres. Manténs o acesso até ao fim do período pago.{" "}
        <Link to="/refund" className="underline">Garantia de reembolso de 30 dias.</Link>
      </p>

      <footer className="mt-10 flex justify-center gap-4 text-xs text-muted-foreground">
        <Link to="/terms" className="hover:text-primary">Termos</Link>
        <Link to="/privacy" className="hover:text-primary">Privacidade</Link>
        <Link to="/refund" className="hover:text-primary">Reembolso</Link>
      </footer>
    </div>
  );
}
