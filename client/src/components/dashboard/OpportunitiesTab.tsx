import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const C = {
  bg2: '#061A2D', card: 'rgba(3,18,32,0.92)', surface: '#0A1929',
  cyan: '#00BFFF', blue: '#00AEEF', green: '#5BF5A0', amber: '#F59E0B',
  ink: '#F4FAFF', ink2: '#91A9BD', ink3: '#607A91',
  border: 'rgba(0,174,255,0.18)', borderHot: 'rgba(0,220,255,0.4)',
};

interface Opportunity {
  id: string;
  userId: number;
  userName: string;
  descricao: string;
  categoria: string;
  cidade?: string;
  createdAt: string;
  recomendacoes: Array<{ profId: number; profName: string; byUserName: string }>;
  interessados: Array<{ profId: number; profName: string; timestamp: string }>;
}

interface Props {
  user: any;
}

export default function OpportunitiesTab({ user }: Props) {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/opportunities')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOpps(data);
          const already = new Set<string>();
          data.forEach((o: Opportunity) => {
            if (o.interessados?.some(i => i.profId === user?.id)) already.add(o.id);
          });
          setSentIds(already);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const expressInterest = async (opp: Opportunity) => {
    if (!user?.id || sentIds.has(opp.id)) return;
    setSending(opp.id);
    try {
      const r = await fetch(`/api/opportunities/${opp.id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profId: user.id,
          profName: user.username || user.fullName || 'Profissional',
          profAvatar: user.profileImage,
          profTitle: user.title || '',
        }),
      });
      if (r.ok) {
        setSentIds(prev => new Set(prev).add(opp.id));
      }
    } catch {}
    setSending(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: C.ink3 }}>
        Carregando oportunidades...
      </div>
    );
  }

  if (opps.length === 0) {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, textAlign: 'center' }}>
        <Search size={32} color={C.ink3} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Nenhuma oportunidade aberta</div>
        <div style={{ color: C.ink2, fontSize: 13, lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
          Quando alguém da rede publicar uma necessidade, ela aparece aqui. Você pode demonstrar interesse e o solicitante escolhe com quem conectar.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 13, color: C.ink2, marginBottom: 4 }}>
        {opps.length} oportunidade{opps.length !== 1 ? 's' : ''} aberta{opps.length !== 1 ? 's' : ''} na rede
      </div>

      {opps.map(o => {
        const isSent = sentIds.has(o.id);
        const isSending = sending === o.id;
        const isOwn = o.userId === user?.id;

        return (
          <div key={o.id} style={{
            background: C.card,
            border: `1px solid ${isSent ? `${C.green}44` : C.border}`,
            borderRadius: 14,
            padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `${C.blue}33`, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.cyan, fontWeight: 700, fontSize: 15, flexShrink: 0,
              }}>
                {o.userName?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{o.userName}</span>
                  <span style={{ fontSize: 11, color: C.ink3, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={10} /> {tempoAtras(o.createdAt)}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5, marginBottom: 8 }}>
                  {o.descricao}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {o.categoria && (
                    <span style={{ fontSize: 11, color: C.cyan, background: `${C.cyan}15`, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                      {o.categoria}
                    </span>
                  )}
                  {o.cidade && (
                    <span style={{ fontSize: 11, color: C.ink3, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={10} /> {o.cidade}
                    </span>
                  )}
                  {o.interessados?.length > 0 && (
                    <span style={{ fontSize: 11, color: C.amber }}>
                      {o.interessados.length} interessado{o.interessados.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {o.recomendacoes?.length > 0 && (
                    <span style={{ fontSize: 11, color: C.green }}>
                      {o.recomendacoes.length} recomendaç{o.recomendacoes.length === 1 ? 'ão' : 'ões'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isOwn && (
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => expressInterest(o)}
                  disabled={isSent || isSending}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 10, border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: isSent ? 'default' : 'pointer',
                    background: isSent
                      ? `${C.green}20`
                      : isSending
                        ? C.ink3
                        : `linear-gradient(135deg, ${C.cyan}, ${C.blue})`,
                    color: isSent ? C.green : '#012',
                  }}
                >
                  {isSent ? (
                    <><CheckCircle size={14} /> Interesse enviado</>
                  ) : isSending ? (
                    'Enviando...'
                  ) : (
                    <><Send size={14} /> Tenho interesse</>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background: `${C.blue}0a`, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginTop: 4 }}>
        <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.6 }}>
          <strong style={{ color: C.cyan }}>Como funciona:</strong> Pessoas da rede publicam o que precisam resolver. Você demonstra interesse e o solicitante escolhe com base no contexto — sem leilão, sem corrida, sem pay-to-win.
        </div>
      </div>
    </div>
  );
}

function tempoAtras(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
