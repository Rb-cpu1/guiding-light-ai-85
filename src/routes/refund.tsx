import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso — MENTOR" },
      { name: "description", content: "Garantia de reembolso de 30 dias." },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="app-frame px-6 py-10 min-h-dvh">
      <Link to="/" className="text-primary text-sm">← Voltar</Link>
      <h1 className="font-serif text-3xl mt-6 mb-2">Política de Reembolso</h1>
      <p className="text-xs text-muted-foreground mb-8">Última atualização: 9 de julho de 2026</p>

      <div className="text-sm space-y-5 leading-relaxed text-foreground/90">
        <p>
          Oferecemos uma <strong>garantia de reembolso de 30 dias</strong>. Se não ficares
          satisfeita(o) com a tua compra, podes pedir o reembolso total no prazo de 30 dias a
          contar da data da encomenda.
        </p>

        <h2 className="font-serif text-xl mt-6">Como pedir</h2>
        <p>
          Os reembolsos são processados pelo nosso Merchant of Record, a <strong>Paddle</strong>.
          Podes pedir o reembolso diretamente no portal do cliente em{" "}
          <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">paddle.net</a>{" "}
          ou contactar o nosso suporte em{" "}
          <a href="mailto:suporte@mentor.app" className="text-primary underline">suporte@mentor.app</a>.
        </p>

        <h2 className="font-serif text-xl mt-6">Cancelamento</h2>
        <p>
          Podes cancelar a tua subscrição a qualquer momento. Após o cancelamento, manténs
          o acesso Premium até ao fim do período já pago — não emitimos reembolso pró-rata
          do tempo não utilizado além da janela de 30 dias.
        </p>

        <h2 className="font-serif text-xl mt-6">Contacto</h2>
        <p>MENTOR LTDA · <a href="mailto:suporte@mentor.app" className="text-primary underline">suporte@mentor.app</a></p>
      </div>
    </div>
  );
}
