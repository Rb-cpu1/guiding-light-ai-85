import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — MENTOR" },
      { name: "description", content: "Como a MENTOR LTDA recolhe, usa e protege os teus dados." },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="app-frame px-6 py-10 min-h-dvh">
      <Link to="/" className="text-primary text-sm">← Voltar</Link>
      <h1 className="font-serif text-3xl mt-6 mb-2">Política de Privacidade</h1>
      <p className="text-xs text-muted-foreground mb-8">Última atualização: 9 de julho de 2026</p>

      <div className="prose prose-invert text-sm space-y-5 leading-relaxed text-foreground/90">
        <p>
          Esta Política descreve como a <strong>MENTOR LTDA</strong> ("MENTOR", "nós") recolhe, usa e
          protege os teus dados pessoais quando usas a aplicação MENTOR (o "Serviço"). A MENTOR LTDA
          atua como responsável pelo tratamento (data controller) dos teus dados.
        </p>

        <h2 className="font-serif text-xl mt-8">1. Dados que recolhemos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Conta:</strong> nome, e-mail, credenciais de autenticação.</li>
          <li><strong>Uso do Serviço:</strong> mensagens trocadas com o mentor, missões, respostas de onboarding, preferências de estilo.</li>
          <li><strong>Técnicos:</strong> endereço IP, tipo de dispositivo, navegador, identificadores anónimos.</li>
          <li><strong>Suporte:</strong> mensagens enviadas ao suporte.</li>
        </ul>

        <h2 className="font-serif text-xl mt-8">2. Finalidades e bases legais</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Prestar o Serviço e cumprir o contrato contigo (execução contratual).</li>
          <li>Segurança, prevenção de fraude e cumprimento legal (interesse legítimo / obrigação legal).</li>
          <li>Melhorar o Serviço e análises agregadas (interesse legítimo).</li>
          <li>Comunicações essenciais sobre a tua conta.</li>
        </ul>

        <h2 className="font-serif text-xl mt-8">3. Partilha de dados</h2>
        <p>Partilhamos dados com categorias de destinatários necessárias à operação:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Merchant of Record — Paddle.com Market Ltd:</strong> processa pagamentos, subscrições, faturação e conformidade fiscal.</li>
          <li><strong>Fornecedores de infraestrutura:</strong> alojamento cloud, base de dados, autenticação.</li>
          <li><strong>Fornecedores de IA:</strong> processamento das tuas mensagens para gerar respostas do mentor.</li>
          <li><strong>Autoridades:</strong> quando exigido por lei.</li>
        </ul>

        <h2 className="font-serif text-xl mt-8">4. Retenção</h2>
        <p>Guardamos os teus dados enquanto a tua conta estiver ativa e pelo tempo necessário para cumprir obrigações legais e fiscais. Podes pedir a eliminação a qualquer momento.</p>

        <h2 className="font-serif text-xl mt-8">5. Os teus direitos</h2>
        <p>Tens direito de acesso, retificação, apagamento, limitação, portabilidade, oposição e retirada de consentimento. Podes reclamar junto da autoridade de proteção de dados competente. Contacta-nos em <a href="mailto:suporte@mentor.app" className="text-primary underline">suporte@mentor.app</a>.</p>

        <h2 className="font-serif text-xl mt-8">6. Transferências internacionais</h2>
        <p>Alguns fornecedores podem processar dados fora do EEE/UK. Nesses casos, usamos salvaguardas adequadas, como Cláusulas Contratuais Padrão.</p>

        <h2 className="font-serif text-xl mt-8">7. Segurança</h2>
        <p>Aplicamos medidas técnicas e organizacionais adequadas: cifra em trânsito, controlo de acessos e isolamento por utilizador (RLS na base de dados).</p>

        <h2 className="font-serif text-xl mt-8">8. Cookies</h2>
        <p>Usamos apenas cookies essenciais à autenticação e ao funcionamento da app. Não usamos cookies de marketing.</p>

        <h2 className="font-serif text-xl mt-8">9. Contacto</h2>
        <p>MENTOR LTDA · <a href="mailto:suporte@mentor.app" className="text-primary underline">suporte@mentor.app</a></p>
      </div>
    </div>
  );
}
