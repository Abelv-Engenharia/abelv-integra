import { ArrowLeft, Shield, Search, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const InspecaoExtintores = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [step, setStep] = useState(1);
  const [extintores, setExtintores] = useState<any[]>([]);
  const [extintorSelecionado, setExtintorSelecionado] = useState<any>(null);
  const [checklistExtintor, setChecklistExtintor] = useState<any>(null);
  const [itensInspecao, setItensInspecao] = useState<any[]>([]);
  const [inspecaoData, setInspecaoData] = useState({
    dataInspecao: new Date(),
    observacoes: '',
    assinatura_responsavel: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar extintores cadastrados
  const loadExtintores = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('extintores')
        .select('*')
        .eq('ativo', true)
        .order('codigo');
      
      if (error) throw error;
      setExtintores(data || []);
    } catch (error) {
      console.error('Erro ao carregar extintores:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de extintores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar checklist de inspeção de extintores
  const loadChecklistExtintor = async () => {
    try {
      const { data, error } = await supabase
        .from('checklists_avaliacao')
        .select('*')
        .ilike('nome', '%EXTINTOR%')
        .eq('ativo', true)
        .single();
      
      if (error) throw error;
      setChecklistExtintor(data);
    } catch (error) {
      console.error('Erro ao carregar checklist:', error);
      toast({
        title: "Erro",
        description: "Checklist de inspeção de extintores não encontrado.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadExtintores();
    loadChecklistExtintor();
  }, []);

  const selecionarExtintor = (extintorId: string) => {
    const extintor = extintores.find(e => e.id === extintorId);
    setExtintorSelecionado(extintor);
    
    if (extintor && checklistExtintor) {
      // Organizar itens por seção
      let itensOrganizados: any[] = [];
      const itensAvaliacao = Array.isArray(checklistExtintor.itens_avaliacao) ? checklistExtintor.itens_avaliacao : [];
      const secoes = Array.isArray(checklistExtintor.secoes) ? checklistExtintor.secoes : [];
      
      if (secoes.length > 0) {
        // Organizar por seções
        secoes.forEach((secao: any) => {
          // Adicionar cabeçalho da seção
          itensOrganizados.push({
            id: `secao_${secao.nome || secao.id}`,
            nome: secao.nome || secao.titulo || 'Seção sem nome',
            tipo: 'secao',
            isSection: true
          });

          // Filtrar itens que pertencem a esta seção
          const nomeSecao = secao.nome || secao.titulo;
          const itensSecao = itensAvaliacao.filter((item: any) => {
            return item.secao === nomeSecao || 
                   item.secao_nome === nomeSecao ||
                   item.categoria === nomeSecao ||
                   item.grupo === nomeSecao ||
                   (item.secao_id && secao.id && item.secao_id === secao.id);
          });
          
          itensSecao.forEach((item: any, index: number) => {
            itensOrganizados.push({
              id: `item_${nomeSecao}_${index}`,
              nome: item.texto || item.nome || item.pergunta || item.descricao || 'Item sem nome',
              tipo: 'item',
              status: 'nao_se_aplica',
              secao: nomeSecao,
              observacao_nc: ''
            });
          });
        });
      } else {
        // Se não há seções, mostrar todos os itens
        itensAvaliacao.forEach((item: any, index: number) => {
          itensOrganizados.push({
            id: `item_${index}`,
            nome: item.texto || item.nome || item.pergunta || item.descricao || 'Item sem nome',
            tipo: 'item',
            status: 'nao_se_aplica',
            observacao_nc: ''
          });
        });
      }
      
      setItensInspecao(itensOrganizados);
      setStep(2);
    }
  };

  const handleItemChange = (itemId: string, status: string) => {
    setItensInspecao(prev => prev.map(item => 
      item.id === itemId ? { ...item, status } : item
    ));
  };

  const handleObservacaoChange = (itemId: string, observacao: string) => {
    setItensInspecao(prev => prev.map(item => 
      item.id === itemId ? { ...item, observacao_nc: observacao } : item
    ));
  };

  const finalizarInspecao = async () => {
    if (!extintorSelecionado || !checklistExtintor || !profile) {
      toast({
        title: "Erro",
        description: "Dados incompletos para finalizar a inspeção.",
        variant: "destructive"
      });
      return;
    }

    // Validar assinatura se requerida
    if (checklistExtintor?.requer_assinatura && !inspecaoData.assinatura_responsavel?.trim()) {
      toast({
        title: "Assinatura obrigatória",
        description: "Por favor, assine digitalmente a inspeção.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const temNaoConformidade = itensInspecao.some(item => item.status === 'nao_conforme');
      
      const dadosCompletos = {
        extintor_id: extintorSelecionado.id,
        checklist_id: checklistExtintor.id,
        responsavel_id: profile.id,
        data_inspecao: format(inspecaoData.dataInspecao, 'yyyy-MM-dd'),
        observacoes: inspecaoData.observacoes || '',
        dados_preenchidos: {
          extintor: {
            codigo: extintorSelecionado.codigo,
            tipo: extintorSelecionado.tipo,
            localizacao: extintorSelecionado.localizacao
          },
          itens: itensInspecao,
          assinatura_responsavel: inspecaoData.assinatura_responsavel,
          data_assinatura: new Date().toISOString(),
          data_preenchimento: new Date().toISOString()
        },
        tem_nao_conformidade: temNaoConformidade,
        status: 'concluida'
      };
      
      const { data, error } = await supabase
        .from('inspecoes_extintores')
        .insert([dadosCompletos])
        .select()
        .single();
      
      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Inspeção de extintor registrada com sucesso.",
      });

      // Reset do formulário
      setTimeout(() => {
        setStep(1);
        setExtintorSelecionado(null);
        setItensInspecao([]);
        setInspecaoData({
          dataInspecao: new Date(),
          observacoes: '',
          assinatura_responsavel: ''
        });
      }, 1500);

    } catch (error: any) {
      console.error('Erro ao salvar inspeção:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a inspeção de extintor.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGuard 
      requiredPermissions={['prevencao_incendio_inspecao_extintores', 'prevencao_incendio']}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para realizar inspeções de extintores." />}
    >
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Inspeção de Extintores</h1>
          <p className="text-muted-foreground">
            Realize inspeções periódicas nos extintores usando o checklist padronizado
          </p>
        </div>

        {/* Seleção do Extintor */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Selecionar Extintor
              </CardTitle>
              <CardDescription>
                Escolha o extintor que será inspecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="extintor">Extintor Cadastrado</Label>
                <Select onValueChange={selecionarExtintor} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um extintor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {extintores.map((extintor) => (
                      <SelectItem key={extintor.id} value={extintor.id}>
                        {extintor.codigo} - {extintor.tipo} ({extintor.localizacao})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {extintores.length === 0 && !isLoading && (
                <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-md">
                  <p className="text-sm text-orange-600">
                    Nenhum extintor cadastrado encontrado. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-orange-600"
                      onClick={() => navigate('/prevencao-incendio/cadastro-extintores')}
                    >
                      Cadastre um extintor primeiro.
                    </Button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulário de Inspeção com Checklist */}
        {step === 2 && extintorSelecionado && (
          <>
            {/* Dados do Extintor Selecionado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Extintor Selecionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label className="text-sm font-medium">Código</Label>
                    <p className="text-sm">{extintorSelecionado.codigo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tipo</Label>
                    <p className="text-sm">{extintorSelecionado.tipo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Localização</Label>
                    <p className="text-sm">{extintorSelecionado.localizacao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados da Inspeção */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados da Inspeção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dataInspecao">Data da Inspeção *</Label>
                    <Input
                      id="dataInspecao"
                      type="date"
                      value={format(inspecaoData.dataInspecao, 'yyyy-MM-dd')}
                      onChange={(e) => setInspecaoData(prev => ({
                        ...prev,
                        dataInspecao: new Date(e.target.value)
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      value={profile?.nome || ''}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checklist de Inspeção */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Checklist de Inspeção
                </CardTitle>
                <CardDescription>
                  {checklistExtintor?.nome || 'Checklist de Inspeção de Extintores'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {itensInspecao.map((item) => (
                    <div key={item.id}>
                      {item.isSection ? (
                        <div className="border-b border-gray-200 pb-2 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">{item.nome}</h3>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                          <p className="font-medium text-gray-900">{item.nome}</p>
                          
                          <RadioGroup 
                            value={item.status} 
                            onValueChange={(value) => handleItemChange(item.id, value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="conforme" id={`${item.id}_conforme`} />
                              <Label htmlFor={`${item.id}_conforme`} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Conforme
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao_conforme" id={`${item.id}_nao_conforme`} />
                              <Label htmlFor={`${item.id}_nao_conforme`} className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                Não Conforme
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao_se_aplica" id={`${item.id}_na`} />
                              <Label htmlFor={`${item.id}_na`} className="text-gray-500">
                                Não se Aplica
                              </Label>
                            </div>
                          </RadioGroup>

                          {item.status === 'nao_conforme' && (
                            <div className="mt-3">
                              <Label htmlFor={`obs_${item.id}`} className="text-sm">
                                Observações da Não Conformidade
                              </Label>
                              <Textarea
                                id={`obs_${item.id}`}
                                placeholder="Descreva a não conformidade encontrada..."
                                value={item.observacao_nc}
                                onChange={(e) => handleObservacaoChange(item.id, e.target.value)}
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="observacoes">Observações Gerais</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações gerais sobre a inspeção..."
                    value={inspecaoData.observacoes}
                    onChange={(e) => setInspecaoData(prev => ({
                      ...prev,
                      observacoes: e.target.value
                    }))}
                    rows={3}
                  />
                </div>

                {checklistExtintor?.requer_assinatura && (
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="assinatura" className="flex items-center gap-1">
                      Assinatura do Responsável
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="assinatura"
                      type="text"
                      placeholder="Digite seu nome completo para assinar"
                      value={inspecaoData.assinatura_responsavel}
                      onChange={(e) => setInspecaoData(prev => ({
                        ...prev,
                        assinatura_responsavel: e.target.value
                      }))}
                      required={checklistExtintor?.requer_assinatura}
                      className={!inspecaoData.assinatura_responsavel && checklistExtintor?.requer_assinatura ? 'border-red-500' : ''}
                    />
                    <p className="text-sm text-muted-foreground">
                      Ao assinar, você confirma que realizou esta inspeção
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={finalizarInspecao} 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Salvando...' : 'Finalizar Inspeção'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PermissionGuard>
  );
};

export default InspecaoExtintores;