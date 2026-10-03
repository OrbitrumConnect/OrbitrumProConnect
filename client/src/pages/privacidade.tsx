import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

const C = {
  bg: '#000915', cyan: '#00BFFF', ink: '#F4FAFF', ink2: '#91A9BD', ink3: '#607A91',
  border: 'rgba(0,174,255,0.18)', card: 'rgba(3,18,32,0.9)',
};

export default function Privacidade() {
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
          Política de Privacidade
        </h1>
        <p className="text-center mb-8" style={{ color: C.ink3, fontSize: 14 }}>
          Orbitrum — Privacidade por contexto: quem precisa saber?
        </p>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }} className="space-y-8">

          <Section n="1" title="Introdução">
            <p>O <strong>Orbitrum</strong> trata dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018). Esta política descreve quais dados coletamos, por que, como protegemos e quais são seus direitos.</p>
            <p>Nosso princípio: <strong>privacidade por contexto</strong> — coletamos e expomos apenas o que é necessário para a finalidade da conexão. O Trust Graph (rede de fatos relacionais) não autoriza exposição ilimitada.</p>
          </Section>

          <Section n="2" title="Dados coletados">
            <div style={{ background: 'rgba(0,191,255,0.06)', border: `1px solid rgba(0,191,255,0.2)`, borderRadius: 12, padding: 16 }} className="mb-4">
              <h4 style={{ color: C.cyan, fontWeight: 600, marginBottom: 8 }}>Cliente</h4>
              <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
                <li>Nome, email, senha (criptografada via Supabase Auth)</li>
                <li>Foto de perfil (opcional)</li>
                <li>Localização aproximada (quando autorizada, para busca de profissionais)</li>
                <li>Histórico de conexões e experiências na rede</li>
                <li>Mensagens trocadas com profissionais</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(91,245,160,0.06)', border: '1px solid rgba(91,245,160,0.2)', borderRadius: 12, padding: 16 }} className="mb-4">
              <h4 style={{ color: '#5BF5A0', fontWeight: 600, marginBottom: 8 }}>Profissional</h4>
              <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
                <li>Nome completo, email, telefone</li>
                <li>CPF (verificação de identidade)</li>
                <li>CEP e endereço (área de atuação)</li>
                <li>Chave PIX (recebimentos)</li>
                <li>Foto do rosto (identificação e segurança)</li>
                <li>Comprovante de residência (verificação)</li>
                <li>Portfólio, certificados, qualificações (voluntários)</li>
                <li>Experiências e fatos relacionais validados pela rede</li>
              </ul>
              <p className="mt-3 text-sm" style={{ color: '#5BF5A0' }}>
                <strong>Justificativa:</strong> dados obrigatórios do profissional garantem segurança para clientes e rastreabilidade em caso de incidentes, conforme legislação aplicável.
              </p>
            </div>

            <div style={{ background: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: 12, padding: 16 }}>
              <h4 style={{ color: '#FFD166', fontWeight: 600, marginBottom: 8 }}>Fatos relacionais</h4>
              <p style={{ color: C.ink2 }}>Experiências, indicações, conexões e validações são registradas como fatos na rede. Esses fatos têm nível de confiança (declarado &lt; indicado &lt; validado &lt; verificado) e podem ter validade temporal. O sistema nunca expõe o grafo completo — apenas explica conexões relevantes (§35).</p>
            </div>
          </Section>

          <Section n="3" title="Finalidade e base legal">
            <ul className="space-y-2 list-disc list-inside" style={{ color: C.ink2 }}>
              <li><strong style={{ color: C.ink }}>Conexão entre pessoas</strong> — base: execução contratual + consentimento</li>
              <li><strong style={{ color: C.ink }}>Registro de experiências</strong> — base: legítimo interesse (melhoria da rede)</li>
              <li><strong style={{ color: C.ink }}>Verificação de identidade do profissional</strong> — base: obrigação legal + segurança</li>
              <li><strong style={{ color: C.ink }}>Localização</strong> — base: consentimento explícito (pode ser revogado)</li>
              <li><strong style={{ color: C.ink }}>Prevenção de fraude</strong> — base: legítimo interesse</li>
              <li><strong style={{ color: C.ink }}>Cumprimento legal</strong> — base: obrigação legal (Marco Civil, LGPD, Decretos 12.975/12.976 de 2026)</li>
            </ul>
          </Section>

          <Section n="4" title="Localização e GPS">
            <ul className="space-y-2 list-disc list-inside" style={{ color: C.ink2 }}>
              <li>Localização é <strong>opcional</strong> e requer consentimento explícito</li>
              <li>Usada para contexto suficiente (profissionais próximos), <strong>não vigilância</strong></li>
              <li>Estado de presença: explícito, autorizado e temporário</li>
              <li>Pode ser desativada a qualquer momento</li>
              <li>Dados de localização não são vendidos ou cedidos a terceiros</li>
            </ul>
            <p className="mt-3" style={{ fontSize: 13, color: C.ink3 }}>Tecnologias: Leaflet.js (BSD-2), OpenStreetMap (ODbL), HTML5 Geolocation (W3C) — todas licenciadas para uso comercial.</p>
          </Section>

          <Section n="5" title="Agentes e IA">
            <p>O Orbitrum pode disponibilizar interfaces para agentes de IA externos consultarem contexto da rede. Nesses casos:</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li>Agentes recebem apenas o contexto necessário, nunca o grafo completo</li>
              <li>Acesso autenticado com escopo, rate-limit e auditoria</li>
              <li>IA não é fonte de verdade — o Orbitrum é</li>
              <li>Ações de agentes passam por validação antes de gravar dados</li>
            </ul>
          </Section>

          <Section n="6" title="Segurança">
            <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
              <li>Autenticação via Supabase Auth (Google OAuth + email/senha)</li>
              <li>Senhas criptografadas (nunca armazenadas em texto)</li>
              <li>Row Level Security (RLS) no banco de dados</li>
              <li>Dados sensíveis (CPF, PIX) com acesso restrito</li>
              <li>Auditoria de acessos e modificações</li>
            </ul>
          </Section>

          <Section n="7" title="Compartilhamento">
            <p><strong>Nunca vendemos seus dados.</strong> Compartilhamos apenas quando necessário:</p>
            <ul className="space-y-1 list-disc list-inside mt-3" style={{ color: C.ink2 }}>
              <li>Com provedor de pagamento (PSP) — dados mínimos para processamento</li>
              <li>Com autoridades legais — quando exigido por lei</li>
              <li>Entre usuários — apenas informações de perfil público e contexto da conexão</li>
              <li>Com agentes de IA autorizados — contexto mínimo necessário, com auditoria</li>
            </ul>
          </Section>

          <Section n="8" title="Seus direitos (LGPD)">
            <ul className="space-y-2 list-disc list-inside" style={{ color: C.ink2 }}>
              <li><strong style={{ color: C.ink }}>Acesso</strong> — saber quais dados temos sobre você</li>
              <li><strong style={{ color: C.ink }}>Correção</strong> — corrigir dados inexatos ou desatualizados</li>
              <li><strong style={{ color: C.ink }}>Exclusão</strong> — solicitar exclusão de dados desnecessários</li>
              <li><strong style={{ color: C.ink }}>Portabilidade</strong> — solicitar seus dados em formato estruturado</li>
              <li><strong style={{ color: C.ink }}>Oposição</strong> — opor-se a tratamento baseado em legítimo interesse</li>
              <li><strong style={{ color: C.ink }}>Revogação</strong> — revogar consentimento a qualquer momento</li>
            </ul>
            <p className="mt-3" style={{ color: C.ink2 }}>Para exercer seus direitos, entre em contato pelos canais oficiais. Prazo de resposta: até 15 dias úteis.</p>
          </Section>

          <Section n="9" title="Retenção">
            <ul className="space-y-1 list-disc list-inside" style={{ color: C.ink2 }}>
              <li>Dados mantidos enquanto necessários para a finalidade ou por obrigação legal</li>
              <li>Fatos relacionais são preservados (não apagados), pois são evidência histórica da rede</li>
              <li>Conta inativa por mais de 2 anos: dados removidos, salvo obrigações legais</li>
            </ul>
          </Section>

          <Section n="10" title="Alterações">
            <p style={{ color: C.ink2 }}>Esta política pode ser atualizada. Mudanças significativas serão comunicadas pela plataforma. A legislação pode alterar a implementação, não a tese de privacidade do produto.</p>
          </Section>

          <Section n="11" title="Contato">
            <p style={{ color: C.ink2 }}>Para questões sobre privacidade ou exercício de direitos LGPD, entre em contato pelos canais oficiais da plataforma. Prazo de resposta: até 15 dias úteis.</p>
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
