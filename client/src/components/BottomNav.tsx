import { useLocation } from 'wouter';
import { Home, Globe, MapPin, LayoutDashboard } from 'lucide-react';

const C = {
  bg: '#000915', border: 'rgba(0,191,255,0.16)',
  cyan: '#00BFFF', ink3: '#5b7a90',
};

const ITEMS: Array<{ route: string; icon: typeof Home; label: string; match?: string[] }> = [
  { route: '/', icon: Home, label: 'Início', match: ['/', '/inicio', '/home'] },
  { route: '/rede', icon: Globe, label: 'Rede' },
  { route: '/mapa', icon: MapPin, label: 'Mapa' },
  { route: '/dashboard-selector', icon: LayoutDashboard, label: 'Painel' },
];

export default function BottomNav() {
  const [loc, setLocation] = useLocation();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center',
      background: C.bg, borderTop: `1px solid ${C.border}`, padding: '4px 8px env(safe-area-inset-bottom, 0)', zIndex: 1100 }}>
      {ITEMS.map(({ route, icon: Icon, label, match }) => {
        const ativo = match ? match.includes(loc) : loc.startsWith(route);
        return (
          <button key={route} onClick={() => setLocation(route)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0', color: ativo ? C.cyan : C.ink3 }}>
            <Icon size={18} strokeWidth={ativo ? 2.2 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: ativo ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
