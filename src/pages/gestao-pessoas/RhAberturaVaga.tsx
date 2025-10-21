import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, FileText, User, Building, Clock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MotivoAbertura, TipoContrato, StatusAprovacao } from "@/types/gestao-pessoas/vaga";
import { mockCargos, mockAreas, mockSetores } from "@/data/gestao-pessoas/mockVagas";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
interface FormData {
  // Bloco 1 - Identificação
  cargo: string;
  area: string;
  setor: string;
  ccaId: number | null;
  localTrabalho: string;
  gestorResponsavel: string;

  // Bloco 2 - Justificativa
  motivoAbertura: MotivoAbertura | '';
  nomeColaboradorSubstituido: string;
  prazoMobilizacao: string;

  // Bloco 3 - Detalhes da Contratação
  tipoContrato: TipoContrato | '';
  jornadaTrabalho: string;
  faixaSalarial: string;
  beneficios: string;

  // Bloco 4 - Perfil do Candidato
  experienciaDesejada: string;
  hardSkills: string[];
  softSkills: string[];

  // Bloco 5 - Aprovação
  aprovador: string;
}
const hardSkillsOptions = ['AutoCAD', 'MS Project', 'Excel Avançado', 'PowerBI', 'SAP', 'Pacote Office', 'NR-10', 'NR-35', 'Primeiros Socorros', 'Normas ABNT', 'Gestão de Projetos', 'Análise de Dados', 'Atendimento ao Cliente', 'Organização'];
const softSkillsOptions = ['Comunicação', 'Liderança', 'Trabalho em Equipe', 'Proatividade', 'Organização', 'Atenção aos Detalhes', 'Resolução de Problemas', 'Flexibilidade', 'Criatividade', 'Negociação'];
export default function RhAberturaVaga() {
  const navigate = useNavigate();
  
  // Buscar CCAs da tabela
  const { data: ccas, isLoading: isLoadingCcas } = useQuery({
    queryKey: ['ccas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      
      if (error) throw error;
      return data;
    }
  });
  
  const [formData, setFormData] = useState<FormData>({
    cargo: '',
    area: '',
    setor: '',
    ccaId: null,
    localTrabalho: '',
    gestorResponsavel: '',
    motivoAbertura: '',
    nomeColaboradorSubstituido: '',
    prazoMobilizacao: '',
    tipoContrato: '',
    jornadaTrabalho: '',
    faixaSalarial: '',
    beneficios: '',
    experienciaDesejada: '',
    hardSkills: [],
    softSkills: [],
    aprovador: ''
  });

  // Buscar aprovadores baseado no CCA selecionado
  const { data: aprovadores, isLoading: isLoadingAprovadores } = useQuery({
    queryKey: ['aprovadores-recrutamento', formData.ccaId],
    queryFn: async () => {
      if (!formData.ccaId) return [];
      
      // Cargos permitidos para aprovação
      const cargosAprovadores = [
        'supervisor',
        'coordenador', 
        'gerente',
        'superintendente',
        'diretor'
      ];
      
      // Buscar usuários vinculados ao CCA com os cargos especificados
      const { data: usuariosCca, error } = await supabase
        .from('usuario_ccas')
        .select(`
          usuario_id,
          profiles!inner (
            id,
            nome,
            cargo
          )
        `)
        .eq('cca_id', formData.ccaId)
        .eq('ativo', true);
      
      if (error) throw error;
      
      // Filtrar por cargo
      const aprovadoresFiltrados = usuariosCca
        ?.filter((uc: any) => {
          const cargo = uc.profiles?.cargo?.toLowerCase() || '';
          return cargosAprovadores.some(cargoPermitido => 
            cargo.includes(cargoPermitido)
          );
        })
        .map((uc: any) => ({
          id: uc.profiles.id,
          nome: uc.profiles.nome,
          cargo: uc.profiles.cargo
        })) || [];
      
      // Remover duplicados
      const aprovadoresUnicos = aprovadoresFiltrados.filter(
        (aprovador: any, index: number, self: any[]) => 
          index === self.findIndex(a => a.id === aprovador.id)
      );
      
      return aprovadoresUnicos;
    },
    enabled: !!formData.ccaId
  });
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSkillChange = (skill: string, type: 'hardSkills' | 'softSkills', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [type]: checked ? [...prev[type], skill] : prev[type].filter(s => s !== skill)
    }));
  };
  const validateAllFields = () => {
    const requiredFields = [
      formData.cargo, 
      formData.area, 
      formData.setor, 
      formData.ccaId,
      formData.localTrabalho, 
      formData.gestorResponsavel, 
      formData.motivoAbertura, 
      formData.prazoMobilizacao, 
      formData.tipoContrato, 
      formData.jornadaTrabalho, 
      formData.faixaSalarial, 
      formData.experienciaDesejada, 
      formData.aprovador
    ];
    return requiredFields.every(field => field !== '' && field !== null && field !== undefined);
  };
  const handleSubmit = () => {
    if (!validateAllFields()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você enviaria os dados para o backend
    toast.success("Vaga criada e enviada para aprovação!");
    navigate('/rh-dashboard');
  };

  // Gerar número da vaga automaticamente
  const numeroVaga = `VAG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  return <div className="container mx-auto p-6 max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/rh-dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Abertura de Vaga</h1>
            <p className="text-muted-foreground">
              Nº da Vaga: <Badge variant="outline">{numeroVaga}</Badge>
            </p>
          </div>
        </div>
      </div>

      {/* Formulário em Cards */}
      <div className="space-y-6">
        {/* Card 1 - Identificação da Vaga */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Identificação da Vaga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo *</Label>
                <Select value={formData.cargo} onValueChange={value => handleInputChange('cargo', value)}>
                  <SelectTrigger className={!formData.cargo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCargos.map(cargo => <SelectItem key={cargo} value={cargo}>
                        {cargo}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="setor">Setor *</Label>
                <Select value={formData.setor} onValueChange={value => handleInputChange('setor', value)}>
                  <SelectTrigger className={!formData.setor ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSetores.map(setor => <SelectItem key={setor} value={setor}>
                        {setor}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ccaId">CCA *</Label>
                <Select 
                  value={formData.ccaId?.toString() || ''} 
                  onValueChange={value => handleInputChange('ccaId', parseInt(value))}
                  disabled={isLoadingCcas}
                >
                  <SelectTrigger className={!formData.ccaId ? "border-red-500" : ""}>
                    <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas?.map(cca => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gestorResponsavel">Gestor Responsável *</Label>
                <Input id="gestorResponsavel" placeholder="Digite o nome do gestor" value={formData.gestorResponsavel} onChange={e => handleInputChange('gestorResponsavel', e.target.value)} className={!formData.gestorResponsavel ? "border-red-500" : ""} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Justificativa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Justificativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motivoAbertura">Motivo da Abertura *</Label>
                <Select value={formData.motivoAbertura} onValueChange={value => handleInputChange('motivoAbertura', value)}>
                  <SelectTrigger className={!formData.motivoAbertura ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MotivoAbertura.SUBSTITUICAO}>Substituição</SelectItem>
                    <SelectItem value={MotivoAbertura.NOVA_OBRA}>Nova Obra</SelectItem>
                    <SelectItem value={MotivoAbertura.AUMENTO_EQUIPE}>Aumento de Equipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.motivoAbertura === MotivoAbertura.SUBSTITUICAO && <div className="space-y-2">
                  <Label htmlFor="nomeColaboradorSubstituido">Nome do Colaborador Substituído</Label>
                  <Input id="nomeColaboradorSubstituido" placeholder="Digite o nome do colaborador" value={formData.nomeColaboradorSubstituido} onChange={e => handleInputChange('nomeColaboradorSubstituido', e.target.value)} />
                </div>}

              <div className="space-y-2">
                <Label htmlFor="prazoMobilizacao">Prazo de Mobilização *</Label>
                <Input id="prazoMobilizacao" type="date" value={formData.prazoMobilizacao} onChange={e => handleInputChange('prazoMobilizacao', e.target.value)} className={!formData.prazoMobilizacao ? "border-red-500" : ""} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Detalhes da Contratação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detalhes da Contratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoContrato">Tipo de Contrato *</Label>
                <Select value={formData.tipoContrato} onValueChange={value => handleInputChange('tipoContrato', value)}>
                  <SelectTrigger className={!formData.tipoContrato ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TipoContrato.CLT}>CLT</SelectItem>
                    <SelectItem value={TipoContrato.PJ}>PJ</SelectItem>
                    <SelectItem value={TipoContrato.APRENDIZ}>Aprendiz</SelectItem>
                    <SelectItem value={TipoContrato.ESTAGIO}>Estágio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="faixaSalarial">Faixa Salarial *</Label>
                <Input id="faixaSalarial" placeholder="Ex: R$ 5.000 - R$ 7.000" value={formData.faixaSalarial} onChange={e => handleInputChange('faixaSalarial', e.target.value)} className={!formData.faixaSalarial ? "border-red-500" : ""} />
              </div>

              
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Perfil do Candidato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Candidato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experienciaDesejada">Experiência Desejada *</Label>
                <Textarea id="experienciaDesejada" placeholder="Ex: Mínimo 2 anos em obras de infraestrutura" value={formData.experienciaDesejada} onChange={e => handleInputChange('experienciaDesejada', e.target.value)} className={!formData.experienciaDesejada ? "border-red-500" : ""} />
              </div>

              

              
            </div>
          </CardContent>
        </Card>

        {/* Card 5 - Aprovação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aprovador">Selecione o Aprovador *</Label>
                <Select 
                  value={formData.aprovador} 
                  onValueChange={value => handleInputChange('aprovador', value)}
                  disabled={!formData.ccaId || isLoadingAprovadores}
                >
                  <SelectTrigger className={!formData.aprovador ? "border-red-500" : ""}>
                    <SelectValue placeholder={
                      !formData.ccaId 
                        ? "Selecione um CCA primeiro" 
                        : isLoadingAprovadores 
                          ? "Carregando..." 
                          : aprovadores && aprovadores.length > 0
                            ? "Selecione o aprovador"
                            : "Nenhum aprovador disponível"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {aprovadores?.map((aprovador: any) => (
                      <SelectItem key={aprovador.id} value={aprovador.id}>
                        {aprovador.nome} - {aprovador.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.ccaId && aprovadores && aprovadores.length === 0 && !isLoadingAprovadores && (
                  <p className="text-xs text-muted-foreground">
                    Nenhum aprovador (Supervisor, Coordenador, Gerente, Superintendente ou Diretor) vinculado a este CCA.
                  </p>
                )}
              </div>

              <div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Status da Aprovação:</strong> Pendente
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    A vaga será enviada para aprovação após o preenchimento completo do formulário.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Enviar para Aprovação */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} className="gap-2" size="lg">
          <Send className="h-4 w-4" />
          Enviar para Aprovação
        </Button>
      </div>
    </div>;
}