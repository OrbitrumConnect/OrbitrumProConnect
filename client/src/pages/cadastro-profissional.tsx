import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Loader2, Star, Home, Sparkles, Monitor, BookOpen, Heart, Truck, Music, ChefHat, Scale, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

const iconMap = {
  Home,
  Sparkles,
  Monitor,
  BookOpen,
  Heart,
  Truck,
  Music,
  ChefHat,
  Scale,
};

export default function CadastroProfissional() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    address: '',
    pixKey: '',
    hourlyRate: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || user.full_name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['professional-categories-supabase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professional_categories')
        .select('*')
        .eq('active', true)
        .order('id');
      if (error) throw error;
      return data;
    },
  });

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setSelectedSkills([]);
    setCustomSkill('');
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, selecione uma categoria profissional",
        variant: "destructive",
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast({
        title: "Especialidades obrigatórias",
        description: "Selecione pelo menos uma especialidade",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Termos obrigatórios",
        description: "Você deve aceitar os Termos de Uso e a Política de Privacidade",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Autenticação necessária",
          description: "Faça login antes de se cadastrar como profissional",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const supabaseUid = session.user.id;

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('supabase_id', supabaseUid)
        .maybeSingle();

      let userId: number;

      if (existingUser) {
        userId = existingUser.id;
        await supabase
          .from('users')
          .update({ user_type: 'professional' })
          .eq('id', userId);
      } else {
        const { data: newUser, error: userErr } = await supabase
          .from('users')
          .insert({
            username: formData.name.toLowerCase().replace(/\s+/g, '.'),
            email: formData.email,
            supabase_id: supabaseUid,
            user_type: 'professional',
          })
          .select('id')
          .single();
        if (userErr) throw userErr;
        userId = newUser.id;
      }

      const { data: alreadyPro } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (alreadyPro) {
        toast({
          title: "Cadastro já existe",
          description: "Você já possui um cadastro profissional ativo",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: lastPro } = await supabase
        .from('professionals')
        .select('orbit_position')
        .order('orbit_position', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextPosition = (lastPro?.orbit_position ?? 0) + 1;

      const { error: proErr } = await supabase
        .from('professionals')
        .insert({
          user_id: userId,
          name: formData.name,
          title: formData.title,
          email: formData.email,
          phone: formData.phone || null,
          cpf: formData.cpf,
          cep: formData.cep,
          pix_key: formData.pixKey,
          hourly_rate: parseInt(formData.hourlyRate) || 50,
          address: formData.address || null,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
          orbit_ring: 3,
          orbit_position: nextPosition,
          services: selectedSkills,
          category_id: selectedCategory.id,
          available: true,
          is_demo: false,
        });

      if (proErr) throw proErr;

      setSubmitted(true);
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo à rede Orbitrum Connect",
      });

      setTimeout(() => setLocation('/dashboard-professional'), 3000);
    } catch (err: any) {
      toast({
        title: "Erro no cadastro",
        description: err?.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000915' }}>
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#000915' }}>
        <div className="text-center space-y-6 p-8 max-w-lg">
          <CheckCircle className="w-20 h-20 text-cyan-400 mx-auto animate-pulse" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Cadastro Realizado!
          </h1>
          <p className="text-gray-400 text-lg">
            Bem-vindo à rede Orbitrum Connect.
          </p>
          <div style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.25)', borderRadius: 14, padding: '16px 20px', textAlign: 'left' }}>
            <p style={{ color: '#00BFFF', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Próximos passos:</p>
            <ul style={{ color: '#91A9BD', fontSize: 13, lineHeight: 1.8, listStyle: 'none', padding: 0 }}>
              <li>→ No seu <strong style={{ color: '#F4FAFF' }}>Painel Profissional</strong>, acesse a aba <strong style={{ color: '#F4FAFF' }}>Documentos</strong> para enviar certificados e comprovantes</li>
              <li>→ Complete seu <strong style={{ color: '#F4FAFF' }}>Perfil</strong> com foto e apresentação profissional</li>
              <li>→ Adicione fotos de trabalhos no <strong style={{ color: '#F4FAFF' }}>Portfólio</strong></li>
              <li>→ Ative sua <strong style={{ color: '#F4FAFF' }}>presença</strong> na tela inicial para aparecer no mapa</li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm">
            Redirecionando para seu painel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 pb-32" style={{ background: '#000915' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Cadastro Profissional
          </h1>
          <p className="text-gray-400 text-lg">
            Junte-se ao Orbitrum e faça parte da rede de profissionais
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seleção de Categoria */}
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Escolha sua Categoria Profissional</CardTitle>
              <CardDescription>
                Selecione a categoria que melhor representa seus serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(categories as any[])?.map((category: any) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Home;
                  const isSelected = selectedCategory?.id === category.id;
                  
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                          : 'bg-[#061A2D]/50 border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardContent className="p-4 text-center">
                        <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
                          isSelected ? 'text-cyan-400' : 'text-gray-400'
                        }`} />
                        <h3 className="font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Especialidades */}
          {selectedCategory && (
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Suas Especialidades</CardTitle>
                <CardDescription>
                  Selecione os serviços que você oferece em {selectedCategory.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(selectedCategory as any).skills?.map((skill: any) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <Badge
                        key={skill}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer p-3 text-center justify-center transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                            : 'text-gray-300 hover:text-white hover:border-gray-400'
                        }`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Não encontrou? Adicione sua especialidade:</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Instalação de portões"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      className="bg-[#061A2D] border-gray-600 flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const trimmed = customSkill.trim();
                          if (trimmed && !selectedSkills.includes(trimmed)) {
                            setSelectedSkills(prev => [...prev, trimmed]);
                            setCustomSkill('');
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => {
                        const trimmed = customSkill.trim();
                        if (trimmed && !selectedSkills.includes(trimmed)) {
                          setSelectedSkills(prev => [...prev, trimmed]);
                          setCustomSkill('');
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                  {selectedSkills.filter(s => !(selectedCategory as any).skills?.includes(s)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedSkills.filter(s => !(selectedCategory as any).skills?.includes(s)).map(skill => (
                        <Badge key={skill} className="bg-cyan-500 text-black cursor-pointer p-2" onClick={() => handleSkillToggle(skill)}>
                          {skill} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dados Pessoais */}
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Dados Pessoais</CardTitle>
              <CardDescription>
                Informações necessárias para seu cadastro profissional
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título Profissional *</Label>
                <Input
                  id="title"
                  placeholder="ex: Eletricista Residencial"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Valor por Hora (R$) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="45"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave PIX *</Label>
                <Input
                  id="pixKey"
                  placeholder="CPF, email ou telefone"
                  value={formData.pixKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, pixKey: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro, cidade"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Apresentação Profissional</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre sua experiência e diferenciais..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-[#061A2D] border-gray-600 min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Aceite de Termos */}
          <Card className="border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <input id="acceptTermsPro" type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-cyan-400 border-gray-600 rounded focus:ring-cyan-400 focus:ring-2 flex-shrink-0" />
                <label htmlFor="acceptTermsPro" className="text-sm cursor-pointer text-gray-300 leading-relaxed">
                  Li e aceito os{' '}
                  <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Termos de Uso</a>
                  {' '}e a{' '}
                  <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Política de Privacidade</a>
                  {' '}do Orbitrum. Entendo que sou responsável pelos serviços que presto e que o Orbitrum conecta oportunidades, não administra a execução do trabalho.
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-12 py-3"
              disabled={!selectedCategory || selectedSkills.length === 0 || !acceptTerms || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Star className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Cadastro Profissional'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}