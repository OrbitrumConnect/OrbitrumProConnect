import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

const C = {
  bg: '#000915', cyan: '#00BFFF', ink: '#F4FAFF', ink2: '#91A9BD', ink3: '#607A91',
  border: 'rgba(0,174,255,0.18)', card: 'rgba(3,18,32,0.9)',
};

export default function Termos() {
  return (
    <div className="min-h-screen text-white" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto p-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" style={{ color: C.cyan }}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" style={{ color: C.cyan }}>
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: C.cyan }}>
          Termos de Uso
        </h1>
        <p className="text-center mb-8" style={{ color: C.ink3, fontSize: 14 }}>
          Orbitrum — Sua rede aprende com o que acontece nela.
        </p>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }} className="space-y-8">

          <Section n="1" title="O que é o Orbitrum">
            <p>O <strong>Orbitrum</strong> é uma rede inteligente que conecta pessoas a profissionais através de relações e experiências acumuladas pela própria rede. Não somos um marketplace de estrelas — somos uma infraestrutura de fatos relacionais.</p>
            <p>O Orbitrum registra, organiza e contextualiza relações. Não substitui a responsabilidade das pessoas, não absolve condutas e não atua como árbitro universal de conflitos.</p>
          </Section>

          <Section n="2" title="O que o Orbitrum faz e o que não faz">
            <div style={{ background: 'rgba(0,191,255,0.06)', border: `1px solid rgba(0,191,255,0.2)`, borderRadius: 12, padding: 16 }} className="mb-4">
              <h4 style={{ color: C.cyan, fontWeight: 600, marginBottom: 8 }}>O Orbitrum CONECTA:</h4>
              <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
                <li>Conecta clientes e profissionais com base em contexto relacional</li>
                <li>Registra experiências e fatos validados bilateralmente</li>
                <li>Organiza oportunidades e indicações dentro da rede</li>
                <li>Oferece ferramentas (Portfólio, Agenda, Impulsionar, Equipes)</li>
                <li>Protege dados conforme LGPD (Lei 13.709/2018)</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(255,122,122,0.06)', border: '1px solid rgba(255,74,74,0.2)', borderRadius: 12, padding: 16 }}>
              <h4 style={{ color: '#FF7A7A', fontWeight: 600, marginBottom: 8 }}>O Orbitrum NÃO:</h4>
              <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
                <li>Não executa os serviços profissionais</li>
                <li>Não escala, não determina jornada, não dá ordens ao profissional</li>
                <li>Não exige exclusividade — o profissional é livre para aceitar ou recusar</li>
                <li>Não define preço do serviço — isso é entre cliente e profissional</li>
                <li>Não garante resultado — registra evidência, não promete qualidade</li>
                <li>Não é tribunal, não controla relações, não vende confiança</li>
              </ul>
            </div>
          </Section>

          <Section n="3" title="Responsabilidade">
            <p><strong>Responsabilidade permanece com as pessoas.</strong> O que prejudica não é compactuado. A utilidade real pode ser retribuída.</p>
            <ul className="space-y-2 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li><strong style={{ color: C.ink }}>Profissional</strong> — responde pelo serviço que presta (qualidade, prazo, conduta)</li>
              <li><strong style={{ color: C.ink }}>Cliente</strong> — responde pelas próprias decisões e condutas</li>
              <li><strong style={{ color: C.ink }}>Indicador</strong> — responde pela própria indicação</li>
              <li><strong style={{ color: C.ink }}>Orbitrum</strong> — responde pela plataforma, segurança dos dados, regras, publicidade e deveres legais</li>
            </ul>
          </Section>

          <Section n="4" title="Confiança e avaliação">
            <p>O Orbitrum <strong>não usa sistema de estrelas ou notas numéricas</strong>. A confiança na rede é construída por sinais contextuais e factuais:</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li>Disponibilidade, taxa de resposta, experiências concluídas</li>
              <li>Validação bilateral (cliente e profissional confirmam a experiência)</li>
              <li>Indicações de outros membros da rede</li>
              <li>Consistência ao longo do tempo</li>
            </ul>
            <p className="mt-3"><strong>Pagamento compra ferramentas, não confiança.</strong> Planos Pro/Empresa não fazem de alguém um profissional "melhor" — apenas desbloqueiam capacidades adicionais.</p>
          </Section>

          <Section n="5" title="Planos e Orbit Credits">
            <p>Os planos do Orbitrum compram <strong>capacidades</strong>, não confiança:</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li><strong style={{ color: C.ink }}>Free (R$0)</strong> — perfil, busca limitada, conexão, conversa limitada, confirmação</li>
              <li><strong style={{ color: C.ink }}>Indicador (R$9,90)</strong> — busca ilimitada, indicar, participar de Orbit Reward</li>
              <li><strong style={{ color: C.ink }}>Pro (R$14,90)</strong> — gestão, calendário, IA, conversas ilimitadas, prioridade no match</li>
              <li><strong style={{ color: C.ink }}>Empresa (R$29,90)</strong> — equipes, B2B, painel operacional</li>
            </ul>
            <p className="mt-3" style={{ color: C.ink2, fontSize: 13 }}>*Valores são hipóteses de teste e podem ser ajustados. Conexão, experiência e validação nunca terão paywall.</p>

            <div style={{ background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.25)', borderRadius: 12, padding: 16, marginTop: 16 }}>
              <h4 style={{ color: '#FFD166', fontWeight: 600, marginBottom: 8 }}>Orbit Credits</h4>
              <p style={{ color: C.ink2 }}>Créditos internos para uso de ferramentas na plataforma. <strong>NÃO são</strong> criptomoedas, investimento, ativo financeiro ou sacáveis. São créditos de uso exclusivo dentro do Orbitrum.</p>
            </div>
          </Section>

          <Section n="6" title="Orbit Reward">
            <p>O Orbit Reward é um <strong>reconhecimento por utilidade real</strong>, não aposta, loteria ou promessa de ganho.</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li>A indicação cria o caminho. O resultado elegível cria o Reward.</li>
              <li>Critérios objetivos, eventos verificáveis, regras transparentes, sem aleatoriedade</li>
              <li>Autoindicação NÃO gera Reward</li>
              <li>Quem é divulgado NÃO recebe por ser divulgado</li>
              <li>Reward é financiado pela plataforma, NÃO é comissão cobrada do profissional</li>
              <li>Saque mediante resultado elegível, via provedor de pagamento (PSP), não-custodial</li>
            </ul>
            <p className="mt-3" style={{ fontSize: 13, color: C.ink3 }}>O programa pode ser alterado, suspenso ou encerrado. Regras específicas serão publicadas antes da ativação.</p>
          </Section>

          <Section n="7" title="Localização e GPS">
            <ul className="space-y-2 list-disc list-inside" style={{ color: C.ink2 }}>
              <li>O uso de localização é <strong>opcional</strong> e requer consentimento explícito</li>
              <li>Localização é usada para contexto suficiente (profissionais próximos), <strong>não vigilância</strong></li>
              <li>Estado de presença é explícito, autorizado e temporário</li>
              <li>Você pode desativar a qualquer momento sem perder funcionalidades essenciais</li>
              <li>Tecnologias: Leaflet.js (BSD-2), OpenStreetMap (ODbL), HTML5 Geolocation (W3C)</li>
            </ul>
          </Section>

          <Section n="8" title="Dados e privacidade (LGPD)">
            <p>Tratamento conforme finalidade e necessidade. Privacidade por contexto: "quem precisa saber?"</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li>Dados coletados para a finalidade de conexão e registro de experiências</li>
              <li>Localização minimizada — contexto suficiente, não exposição total</li>
              <li>Fatos relacionais registram evidência, não expõem o grafo completo</li>
              <li>Você pode solicitar acesso, correção ou exclusão dos seus dados</li>
            </ul>
            <p className="mt-3">Detalhes completos na <a href="/privacidade" style={{ color: C.cyan, textDecoration: 'underline' }}>Política de Privacidade</a>.</p>
          </Section>

          <Section n="9" title="Condutas proibidas">
            <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
              <li>Fraude, autoindicação, experiências falsas, manipulação de dados</li>
              <li>Criação de múltiplas contas com intenção fraudulenta</li>
              <li>Spam, abuso, comportamento discriminatório ou inadequado</li>
              <li>Bots ou automações não autorizadas</li>
              <li>Tentativa de burlar controles do sistema</li>
            </ul>
            <p className="mt-3">Violações podem resultar em suspensão ou encerramento da conta, cancelamento de Rewards pendentes e, quando aplicável, auditoria.</p>
          </Section>

          <Section n="10" title="Profissões reguladas">
            <p style={{ color: C.ink2 }}>Profissões com regulação específica (médicos, advogados, engenheiros, etc.) seguem as regras de seus respectivos conselhos e órgãos reguladores. O Orbitrum não substitui habilitações, autorizações ou licenças exigidas por lei.</p>
          </Section>

          <Section n="11" title="Alterações nos termos">
            <p style={{ color: C.ink2 }}>Estes termos podem ser alterados. Mudanças significativas serão comunicadas pela plataforma. O uso continuado após a alteração constitui aceitação. A legislação pode alterar a implementação, não a tese do produto.</p>
          </Section>

          <Section n="12" title="Contato">
            <p style={{ color: C.ink2 }}>Para dúvidas sobre estes termos, entre em contato pelos canais oficiais disponíveis na plataforma.</p>
          </Section>

          <div className="text-center text-sm mt-8 pt-4" style={{ borderTop: `1px solid ${C.border}`, color: C.ink3 }}>
            <p>Última atualização: 03 de Outubro de 2026</p>
            <p>Orbitrum — Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#00BFFF' }}>{n}. {title}</h2>
      <div style={{ color: '#B8CDE0', lineHeight: 1.7, fontSize: 14 }} className="space-y-3">{children}</div>
    </section>
  );
}
