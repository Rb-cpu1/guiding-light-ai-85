import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — MENTOR" },
      { name: "description", content: "Termos de utilização do serviço MENTOR." },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="app-frame px-6 py-10 min-h-dvh">
      <Link to="/" className="text-primary text-sm">← Voltar</Link>
      <h1 className="font-serif text-3xl mt-6 mb-2">Termos e Condições</h1>
      <p className="text-xs text-muted-foreground mb-8">Última atualização: 9 de julho de 2026</p>

      <div className="text-sm space-y-5 leading-relaxed text-foreground/90">
        <p>Estes Termos regem o uso do serviço MENTOR, prestado pela <strong>MENTOR LTDA</strong> ("MENTOR", "nós"). Ao usar o Serviço, aceitas estes Termos.</p>

        <h2 className="font-serif text-xl mt-8">1. Serviço</h2>
        <p>A MENTOR fornece um mentor pessoal com IA que combina sabedoria bíblica, filosofia e psicologia para dar conselhos práticos, missões diárias, journaling e uma biblioteca de conteúdos.</p>

        <h2 className="font-serif text-xl mt-8">2. Conta</h2>
        <p>Deves ter capacidade legal (ou autorização parental) para criar uma conta. És responsável por manter as tuas credenciais confidenciais e por toda a atividade na tua conta. Deves fornecer informação verdadeira e mantê-la atualizada.</p>

        <h2 className="font-serif text-xl mt-8">3. Uso aceitável</h2>
        <p>Não podes usar o Serviço para: (a) fins ilegais, fraude ou spam; (b) violar propriedade intelectual de terceiros; (c) interferir com segurança (malware, scraping abusivo, engenharia inversa); (d) gerar conteúdo ilegal, discurso de ódio, exploração de menores ou desinformação; (e) contornar limites técnicos ou revender o Serviço.</p>
        <p>És responsável pelos teus prompts e pelo modo como usas os resultados. Deves verificar a exatidão das respostas antes de agir. As respostas <strong>não</strong> substituem aconselhamento médico, psicológico, jurídico, financeiro ou pastoral profissional.</p>

        <h2 className="font-serif text-xl mt-8">4. Propriedade intelectual</h2>
        <p>Todos os direitos sobre o software, marca, conteúdos e documentação pertencem à MENTOR LTDA. Concedemos-te uma licença limitada, não exclusiva e intransmissível para usar o Serviço de acordo com o teu plano.</p>

        <h2 className="font-serif text-xl mt-8">5. Pagamentos e subscrições</h2>
        <p className="rounded-md border border-border p-3 bg-muted/30">
          O processo de encomenda é conduzido pelo nosso revendedor online <strong>Paddle.com</strong>.
          A Paddle.com é o Merchant of Record de todas as encomendas. A Paddle presta o suporte a clientes
          para questões de pagamento e trata devoluções.
        </p>
        <p>Para condições de pagamento, faturação, impostos, cancelamento e reembolso, consulta os <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Buyer Terms da Paddle</a> e a nossa <Link to="/refund" className="text-primary underline">Política de Reembolso</Link>.</p>
        <p>As subscrições renovam-se automaticamente no fim de cada período até seres cancelada(o). O cancelamento mantém o acesso até ao fim do período pago.</p>

        <h2 className="font-serif text-xl mt-8">6. Nível de serviço</h2>
        <p>Fazemos o razoável para manter o Serviço disponível, mas não garantimos operação ininterrupta ou isenta de erros.</p>

        <h2 className="font-serif text-xl mt-8">7. Suspensão e cessação</h2>
        <p>Podemos suspender ou terminar o acesso em caso de: violação material destes Termos, não pagamento, risco de fraude ou segurança, ou violações graves/repetidas das políticas. Após a cessação, o teu direito de uso termina; podes exportar os teus dados dentro de um período razoável antes da eliminação.</p>

        <h2 className="font-serif text-xl mt-8">8. Garantias e responsabilidade</h2>
        <p>Na medida máxima permitida por lei, o Serviço é fornecido "tal como está". Renunciamos a garantias implícitas de comerciabilidade e adequação a fim específico. A nossa responsabilidade agregada está limitada ao total pago por ti nos 12 meses anteriores ao evento. Não somos responsáveis por danos indiretos, consequenciais, perda de lucros, dados ou reputação. Nada exclui responsabilidade por dolo ou por danos que a lei não permita excluir.</p>

        <h2 className="font-serif text-xl mt-8">9. Indemnização</h2>
        <p>Concordas indemnizar a MENTOR LTDA por reclamações resultantes do teu conteúdo, uso ilícito ou violação destes Termos.</p>

        <h2 className="font-serif text-xl mt-8">10. Lei e foro</h2>
        <p>Estes Termos regem-se pela lei aplicável ao domicílio da MENTOR LTDA. Qualquer litígio será submetido aos tribunais competentes dessa jurisdição, sem prejuízo dos direitos de consumo aplicáveis.</p>

        <h2 className="font-serif text-xl mt-8">11. Contacto</h2>
        <p>MENTOR LTDA · <a href="mailto:suporte@mentor.app" className="text-primary underline">suporte@mentor.app</a></p>
      </div>
    </div>
  );
}
