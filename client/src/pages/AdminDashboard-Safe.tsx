import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Activity, Home, Network, FolderOpen, Shield, Lock, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user: authUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const ehAdmin = (authUser as any)?.isAdmin === true
    || ((authUser as any)?.admin_level ?? 0) >= 1
    || (authUser as any)?.user_type === 'admin';

  useEffect(() => {
    if (!isAuthenticated || !ehAdmin) {
      setLocation('/');
    }
  }, [isAuthenticated, ehAdmin, setLocation]);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, email, user_type, admin_level, created_at, is_online")
        .order("id");
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && ehAdmin,
  });

  const { data: prosData, isLoading: prosLoading } = useQuery({
    queryKey: ["admin-professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("id, name, title, category_id, available, is_demo, orbit_ring, created_at, user_id")
        .order("id");
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && ehAdmin,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professional_categories")
        .select("id, name, icon")
        .eq("active", true)
        .order("id");
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && ehAdmin,
  });

  const { data: factsData, isLoading: factsLoading } = useQuery({
    queryKey: ["admin-facts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relational_facts")
        .select("id, subject_id, predicate, object_id, confidence, context, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && ehAdmin,
  });

  if (!isAuthenticated || !authUser || !ehAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000915' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-white">Verificando permissões...</div>
        </div>
      </div>
    );
  }

  const isLoading = usersLoading || prosLoading || factsLoading;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000915' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-white">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  const users = usersData || [];
  const pros = prosData || [];
  const categories = categoriesData || [];
  const facts = factsData || [];

  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.is_online).length;
  const totalPros = pros.length;
  const demoPros = pros.filter(p => p.is_demo).length;
  const realPros = totalPros - demoPros;
  const totalFacts = facts.length;

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const filteredUsers = searchTerm
    ? users.filter(u =>
        (u.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const filteredPros = searchTerm
    ? pros.filter(p =>
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pros;

  return (
    <div className="min-h-screen text-white flex" style={{ background: '#000915' }}>
      <Sidebar />
      <div className="flex-1 min-w-0 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cyan-400">Administração</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Stats Cards — dados reais do Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="glassmorphism border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Usuários</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-gray-400">{onlineUsers} online agora</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Profissionais</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalPros}</div>
              <p className="text-xs text-gray-400">{realPros} reais · {demoPros} demo</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Categorias</CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{categories.length}</div>
              <p className="text-xs text-gray-400">Ativas na plataforma</p>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Fatos Relacionais</CardTitle>
              <Network className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalFacts}</div>
              <p className="text-xs text-gray-400">Conexões na rede</p>
            </CardContent>
          </Card>
        </div>

        {/* Busca global */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#061A2D]/60 border border-cyan-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex w-full overflow-x-auto bg-[#061A2D]/50" style={{ display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: 2 }}>
            <TabsTrigger value="overview" className="text-cyan-400 text-xs">Visão Geral</TabsTrigger>
            <TabsTrigger value="users" className="text-green-400 text-xs">Usuários</TabsTrigger>
            <TabsTrigger value="professionals" className="text-blue-400 text-xs">Profissionais</TabsTrigger>
            <TabsTrigger value="facts" className="text-yellow-400 text-xs">Fatos</TabsTrigger>
            <TabsTrigger value="moderation" className="text-red-400 text-xs">Moderação</TabsTrigger>
            <TabsTrigger value="economy" className="text-purple-400 text-xs">Economia</TabsTrigger>
          </TabsList>

          {/* ═══ VISÃO GERAL ═══ */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-cyan-400">Resumo da Rede</CardTitle>
                <CardDescription>Dados em tempo real do Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#061A2D]/50 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-400">{totalUsers}</div>
                    <div className="text-sm text-gray-300 mt-1">Usuários cadastrados</div>
                  </div>
                  <div className="text-center p-4 bg-[#061A2D]/50 rounded-lg">
                    <div className="text-3xl font-bold text-green-400">{totalPros}</div>
                    <div className="text-sm text-gray-300 mt-1">Profissionais ({demoPros} demo)</div>
                  </div>
                  <div className="text-center p-4 bg-[#061A2D]/50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400">{totalFacts}</div>
                    <div className="text-sm text-gray-300 mt-1">Fatos relacionais</div>
                  </div>
                </div>

                <div className="p-4 bg-[#061A2D]/30 rounded-lg">
                  <h5 className="text-white font-semibold mb-3">Categorias ativas</h5>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => {
                      const count = pros.filter(p => p.category_id === cat.id).length;
                      return (
                        <Badge key={cat.id} variant="outline" className="text-cyan-300 border-cyan-500/30 py-1 px-3">
                          {cat.icon || "📁"} {cat.name} ({count})
                        </Badge>
                      );
                    })}
                    {categories.length === 0 && (
                      <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ USUÁRIOS ═══ */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-green-400">Usuários ({filteredUsers.length})</CardTitle>
                <CardDescription>Dados carregados do Supabase em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredUsers.map(u => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 bg-[#061A2D]/50 rounded-lg border border-cyan-500/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.is_online ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <div className="min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {u.username || "Sem nome"}
                          </div>
                          <div className="text-gray-400 text-xs truncate">{u.email || "—"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={
                            (u.admin_level ?? 0) >= 1
                              ? "text-red-400 border-red-500/30"
                              : u.user_type === "professional"
                                ? "text-blue-400 border-blue-500/30"
                                : "text-gray-400 border-gray-500/30"
                          }
                        >
                          {(u.admin_level ?? 0) >= 1 ? "Admin" : u.user_type || "client"}
                        </Badge>
                        <span className="text-gray-500 text-xs">#{u.id}</span>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {searchTerm ? "Nenhum usuário encontrado para essa busca." : "Nenhum usuário cadastrado."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ PROFISSIONAIS ═══ */}
          <TabsContent value="professionals" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-blue-400">Profissionais ({filteredPros.length})</CardTitle>
                <CardDescription>Cadastrados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredPros.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[#061A2D]/50 rounded-lg border border-cyan-500/10"
                    >
                      <div className="min-w-0">
                        <div className="text-white text-sm font-medium truncate">{p.name}</div>
                        <div className="text-gray-400 text-xs truncate">
                          {p.title || "—"} · {categoryMap.get(p.category_id) || "Sem categoria"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.is_demo && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 text-xs">Demo</Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={p.available ? "text-green-400 border-green-500/30 text-xs" : "text-gray-500 border-gray-500/30 text-xs"}
                        >
                          {p.available ? "Disponível" : "Indisponível"}
                        </Badge>
                        <span className="text-gray-500 text-xs">Ring {p.orbit_ring}</span>
                      </div>
                    </div>
                  ))}
                  {filteredPros.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {searchTerm ? "Nenhum profissional encontrado." : "Nenhum profissional cadastrado."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ FATOS RELACIONAIS ═══ */}
          <TabsContent value="facts" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-yellow-400">Fatos Relacionais ({facts.length})</CardTitle>
                <CardDescription>Últimas conexões registradas na rede</CardDescription>
              </CardHeader>
              <CardContent>
                {facts.length > 0 ? (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {facts.map(f => (
                      <div
                        key={f.id}
                        className="p-3 bg-[#061A2D]/50 rounded-lg border border-cyan-500/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 text-sm font-mono">#{f.subject_id}</span>
                            <span className="text-gray-500">→</span>
                            <Badge variant="outline" className="text-yellow-300 border-yellow-500/30">
                              {f.predicate}
                            </Badge>
                            <span className="text-gray-500">→</span>
                            <span className="text-cyan-400 text-sm font-mono">#{f.object_id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              confiança: {typeof f.confidence === 'number' ? `${(f.confidence * 100).toFixed(0)}%` : '—'}
                            </span>
                          </div>
                        </div>
                        {f.context && (
                          <div className="text-xs text-gray-500 mt-1 truncate">Contexto: {f.context}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Network className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Nenhum fato relacional registrado ainda.</p>
                    <p className="text-gray-500 text-sm mt-1">Fatos surgem quando usuários indicam, validam ou trabalham juntos.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ MODERAÇÃO ═══ */}
          <TabsContent value="moderation" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-red-400">Moderação</CardTitle>
                <CardDescription>Controle e segurança da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-green-400 font-semibold mb-2">Usuários Cadastrados</div>
                    <div className="text-3xl font-bold text-white">{totalUsers}</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <div className="text-yellow-400 font-semibold mb-2">Profissionais Demo</div>
                    <div className="text-3xl font-bold text-white">{demoPros}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-blue-400 font-semibold mb-2">Profissionais Reais</div>
                    <div className="text-3xl font-bold text-white">{realPros}</div>
                  </div>
                </div>

                <div className="p-4 bg-[#061A2D]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">Status de Segurança</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300">RLS (Row Level Security): ativo</p>
                      <p className="text-gray-300">Autoconfirm: habilitado</p>
                      <p className="text-gray-300">Auth: Supabase (Google + email)</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Denúncias pendentes: 0</p>
                      <p className="text-gray-300">Contas bloqueadas: 0</p>
                      <p className="text-gray-300">Incidentes: nenhum</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ ECONOMIA — CONGELADA ═══ */}
          <TabsContent value="economy" className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Economia da Rede
                </CardTitle>
                <CardDescription>Bloco C — aguardando spec jurídica para ativação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 text-purple-400/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Economia Congelada</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    O sistema econômico (créditos, rewards, planos, saques) está
                    congelado até a revisão por advogado e contador. Nenhuma
                    transação financeira está ativa.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-purple-300 font-medium text-sm mb-2">Orbit Credits</div>
                      <p className="text-gray-400 text-xs">Uso interno (não sacável). Futuro: farm via jogo para impulsionar perfil.</p>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-purple-300 font-medium text-sm mb-2">Orbit Rewards</div>
                      <p className="text-gray-400 text-xs">Resultado elegível a saque. Spec jurídica define regras e limites.</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs mt-8">
                    Quando ativado, este painel mostrará: receita, transações, pool de saques, planos ativos e métricas financeiras.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
