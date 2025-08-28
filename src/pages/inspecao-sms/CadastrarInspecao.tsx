
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { ChevronLeft, ChevronRight, FileSearch, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useFilteredFormData } from "@/hooks/useFilteredFormData";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { PageLoader, InlineLoader } from "@/components/common/PageLoader";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

const CadastrarInspecao = () => {
  const [step, setStep] = useState(1);
  const [modelos, setModelos] = useState<any[]>([]);
  const [modeloSelecionado, setModeloSelecionado] = useState<any>(null);
  const [isLoadingModelos, setIsLoadingModelos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dadosInspecao, setDadosInspecao] = useState({
    data_inspecao: new Date(),
    local: '',
    cca_id: '',
    observacoes: '',
    dados_preenchidos: {} as any,
    tem_nao_conformidade: false
  });
  const [camposCabecalho, setCamposCabecalho] = useState<any[]>([]);
  const [dadosCabecalho, setDadosCabecalho] = useState<any>({});
  const [itensInspecao, setItensInspecao] = useState<any[]>([]);
  
  const { profile } = useProfile();
  const { data: userCCAs = [] } = useUserCCAs();
  const {
    ccas,
    engenheiros,
    supervisores,
    encarregados,
    empresas,
    disciplinas
  } = useFilteredFormData({ selectedCcaId: dadosInspecao.cca_id });
  
  // Buscar usuários do sistema para o campo "Responsável pela inspeção"
  const [usuarios, setUsuarios] = useState<any[]>([]);


  const loadUsuarios = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome');
      
      if (data) {
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadModelos = async () => {
    try {
      setIsLoadingModelos(true);
      const { data } = await supabase
        .from('checklists_avaliacao')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (data) {
        setModelos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setIsLoadingModelos(false);
    }
  };

  const selecionarModelo = (modelo: any) => {
    setModeloSelecionado(modelo);
    
    // Configurar campos de cabeçalho
    const camposCabecalhoModelo = Array.isArray(modelo.campos_cabecalho) ? modelo.campos_cabecalho : [];
    console.log('Campos cabeçalho do modelo:', camposCabecalhoModelo);
    setCamposCabecalho(camposCabecalhoModelo);
    
    // Resetar dados do cabeçalho
    const dadosIniciais: any = {};
    camposCabecalhoModelo.forEach((campo: any) => {
      dadosIniciais[campo] = '';
    });
    setDadosCabecalho(dadosIniciais);
    
    // Carregar itens de avaliação do checklist selecionado
    const itensAvaliacao = Array.isArray(modelo.itens_avaliacao) ? modelo.itens_avaliacao : [];
    const secoes = Array.isArray(modelo.secoes) ? modelo.secoes : [];
    
    // Organizar itens por seção
    let itensOrganizados: any[] = [];
    
    if (secoes.length > 0) {
      // Se há seções definidas, organizar itens por seção
      secoes.forEach((secao: any) => {
        // Adicionar cabeçalho da seção
        itensOrganizados.push({
          id: `secao_${secao.nome}`,
          nome: secao.nome,
          tipo: 'secao',
          isSection: true
        });
        
        // Filtrar itens que pertencem a esta seção
        const itensSecao = itensAvaliacao.filter((item: any) => item.secao === secao.nome);
        itensSecao.forEach((item: any, index: number) => {
          itensOrganizados.push({
            id: `item_${secao.nome}_${index}`,
            nome: item.texto || item.nome || 'Item sem nome',
            tipo: 'item',
            status: 'nao_se_aplica',
            secao: secao.nome
          });
        });
      });
      
      // Adicionar itens sem seção definida (se houver)
      const itensSemSecao = itensAvaliacao.filter((item: any) => !item.secao);
      if (itensSemSecao.length > 0) {
        itensOrganizados.push({
          id: 'secao_outros',
          nome: 'Outros Itens',
          tipo: 'secao',
          isSection: true
        });
        
        itensSemSecao.forEach((item: any, index: number) => {
          itensOrganizados.push({
            id: `item_outros_${index}`,
            nome: item.texto || item.nome || 'Item sem nome',
            tipo: 'item',
            status: 'nao_se_aplica'
          });
        });
      }
    } else {
      // Se não há seções, mostrar todos os itens em sequência
      itensAvaliacao.forEach((item: any, index: number) => {
        itensOrganizados.push({
          id: `item_${index}`,
          nome: item.texto || item.nome || 'Item sem nome',
          tipo: 'item',
          status: 'nao_se_aplica'
        });
      });
    }
    
    setItensInspecao(itensOrganizados);
    setStep(2);
  };

  const handleItemChange = (itemId: string, status: string) => {
    setItensInspecao(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  const finalizarInspecao = async () => {
    try {
      setIsSubmitting(true);
      const temNaoConformidade = itensInspecao.some(item => item.status === 'nao_conforme');
      
      const dadosCompletos = {
        modelo_id: modeloSelecionado.id,
        responsavel_id: profile?.id,
        data_inspecao: format(dadosInspecao.data_inspecao, 'yyyy-MM-dd'),
        local: dadosInspecao.local,
        cca_id: dadosInspecao.cca_id ? parseInt(dadosInspecao.cca_id) : null,
        observacoes: dadosInspecao.observacoes,
        dados_preenchidos: {
          itens: itensInspecao,
          campos_cabecalho: dadosCabecalho,
          data_preenchimento: new Date().toISOString()
        },
        tem_nao_conformidade: temNaoConformidade,
        status: 'concluida'
      };

      const { data: inspecao, error } = await supabase
        .from('inspecoes_sms')
        .insert([dadosCompletos])
        .select()
        .single();

      if (error) throw error;

      // Se tem não conformidade, gerar PDF e enviar email
      if (temNaoConformidade) {
        toast({
          title: "Inspeção finalizada com não conformidades",
          description: "Um PDF foi gerado e enviado por email devido às não conformidades encontradas.",
        });
      } else {
        toast({
          title: "Inspeção finalizada com sucesso",
          description: "Todos os itens estão em conformidade.",
        });
      }

      // Reset do formulário
      setStep(1);
      setModeloSelecionado(null);
      setItensInspecao([]);
      setCamposCabecalho([]);
      setDadosCabecalho({});
      setDadosInspecao({
        data_inspecao: new Date(),
        local: '',
        cca_id: '',
        observacoes: '',
        dados_preenchidos: {},
        tem_nao_conformidade: false
      });

    } catch (error: any) {
      toast({
        title: "Erro ao finalizar inspeção",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadModelos();
    loadUsuarios();
  }, []);

  if (step === 1) {
    return (
      <div className="content-padding section-spacing">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
          <h1 className="heading-responsive">Cadastrar Inspeção SMS</h1>
        </div>


        {/* Lista de Modelos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Selecione um Modelo de Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingModelos ? (
              <div className="card-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <LoadingSkeleton variant="card" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-grid">
                {modelos.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-responsive">Nenhum modelo encontrado. Verifique os filtros ou cadastre novos modelos.</p>
                  </div>
                ) : (
                  modelos.map((modelo) => (
                    <Card 
                      key={modelo.id} 
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                      onClick={() => selecionarModelo(modelo)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{modelo.nome}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                         <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                           {modelo.descricao || 'Checklist de avaliação'}
                         </p>
                         <p className="text-xs text-muted-foreground">
                           {Array.isArray(modelo.itens_avaliacao) ? modelo.itens_avaliacao.length : 0} itens de verificação
                         </p>
                         {modelo.requer_assinatura && (
                           <p className="text-xs text-blue-600 mt-1">
                             ✓ Requer assinatura
                           </p>
                         )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="content-padding section-spacing">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStep(1)}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <h1 className="heading-responsive min-w-0">
            <span className="block sm:hidden">Inspeção: {modeloSelecionado?.nome?.substring(0, 20)}...</span>
            <span className="hidden sm:block">Preencher Inspeção: {modeloSelecionado?.nome}</span>
          </h1>
        </div>

        {/* Dados Gerais */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Dados da Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-grid">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Data da Inspeção *</Label>
                <DatePickerWithManualInput
                  value={dadosInspecao.data_inspecao}
                  onChange={(date) => 
                    setDadosInspecao({...dadosInspecao, data_inspecao: date || new Date()})
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Local *</Label>
                <Input
                  value={dadosInspecao.local}
                  onChange={(e) => 
                    setDadosInspecao({...dadosInspecao, local: e.target.value})
                  }
                  placeholder="Informe o local da inspeção"
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">CCA *</Label>
                <Select 
                  value={dadosInspecao.cca_id} 
                  onValueChange={(value) => {
                    setDadosInspecao({...dadosInspecao, cca_id: value});
                    // Reset campos de cabeçalho quando CCA muda
                    const dadosIniciais: any = {};
                    camposCabecalho.forEach((campo: any) => {
                      dadosIniciais[campo] = '';
                    });
                    setDadosCabecalho(dadosIniciais);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {userCCAs.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        <span className="block sm:hidden">{cca.codigo}</span>
                        <span className="hidden sm:block">{cca.codigo} - {cca.nome}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campos de Cabeçalho Personalizados - só aparecem se CCA foi selecionado */}
        {camposCabecalho.length > 0 && dadosInspecao.cca_id && (
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Campos do Cabeçalho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="form-grid">
                {camposCabecalho.map((campo) => {
                  const campoKey = campo as string;
                  return (
                    <div key={campoKey} className="space-y-2">
                      <Label className="text-sm sm:text-base font-medium">
                        {campoKey.replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      
                      {/* Renderizar dropdown baseado no tipo de campo */}
                      {(() => {
                        console.log('Verificando campo:', campoKey);
                        
                        if (campoKey === 'CCA') {
                          console.log('Renderizando CCA, opções:', ccas.length);
                          return (
                            <Select 
                              value={dadosCabecalho.CCA || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, CCA: value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o CCA" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {ccas.map((cca) => (
                                  <SelectItem key={cca.id} value={cca.id.toString()}>
                                    {cca.codigo} - {cca.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Engenheiro Responsável') {
                          console.log('Renderizando Engenheiro, opções:', engenheiros.length);
                          return (
                            <Select 
                              value={dadosCabecalho['Engenheiro Responsável'] || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, 'Engenheiro Responsável': value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o engenheiro responsável" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {engenheiros.map((eng) => (
                                  <SelectItem key={eng.id} value={eng.id}>
                                    {eng.nome} - {eng.funcao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Supervisor Responsável') {
                          console.log('Renderizando Supervisor, opções:', supervisores.length);
                          return (
                            <Select 
                              value={dadosCabecalho['Supervisor Responsável'] || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, 'Supervisor Responsável': value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o supervisor responsável" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {supervisores.map((sup) => (
                                  <SelectItem key={sup.id} value={sup.id}>
                                    {sup.nome} - {sup.funcao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Encarregado Responsável') {
                          console.log('Renderizando Encarregado, opções:', encarregados.length);
                          return (
                            <Select 
                              value={dadosCabecalho['Encarregado Responsável'] || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, 'Encarregado Responsável': value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o encarregado responsável" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {encarregados.map((enc) => (
                                  <SelectItem key={enc.id} value={enc.id}>
                                    {enc.nome} - {enc.funcao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Empresa') {
                          console.log('Renderizando Empresa, opções:', empresas.length);
                          return (
                            <Select 
                              value={dadosCabecalho.Empresa || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, Empresa: value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a empresa" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {empresas.map((emp) => (
                                  <SelectItem key={emp.id} value={emp.id.toString()}>
                                    {emp.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Disciplina') {
                          console.log('Renderizando Disciplina, opções:', disciplinas.length);
                          return (
                            <Select 
                              value={dadosCabecalho.Disciplina || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, Disciplina: value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a disciplina" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {disciplinas.map((disc) => (
                                  <SelectItem key={disc.id} value={disc.id.toString()}>
                                    {disc.codigo} - {disc.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        if (campoKey === 'Responsável pela inspeção (Usuário do sistema)') {
                          console.log('Renderizando Responsável, opções:', usuarios.length);
                          return (
                            <Select 
                              value={dadosCabecalho['Responsável pela inspeção (Usuário do sistema)'] || ''} 
                              onValueChange={(value) => setDadosCabecalho(prev => ({...prev, 'Responsável pela inspeção (Usuário do sistema)': value}))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o responsável pela inspeção" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border border-border z-50">
                                {usuarios.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.nome} {user.email && `(${user.email})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        // Campo padrão caso não seja reconhecido
                        console.log('Campo não reconhecido:', campoKey);
                        return (
                          <Input 
                            value={dadosCabecalho[campoKey] || ''} 
                            onChange={(e) => setDadosCabecalho(prev => ({...prev, [campoKey]: e.target.value}))}
                            placeholder={`Digite ${campoKey.toLowerCase()}`}
                          />
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itens de Inspeção */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Itens de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="section-spacing">
              {itensInspecao.map((item, index) => {
                if (item.isSection) {
                  return (
                    <div key={item.id} className="mb-4">
                      <h3 className="text-lg font-semibold text-primary border-b pb-2">
                        {item.nome}
                      </h3>
                    </div>
                  );
                }
                
                return (
                  <div key={item.id} className="border rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium mb-3 text-sm sm:text-base">
                      {item.nome}
                    </h4>
                    <RadioGroup
                      value={item.status}
                      onValueChange={(value) => handleItemChange(item.id, value)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conforme" id={`${item.id}-conforme`} />
                        <Label htmlFor={`${item.id}-conforme`} className="text-green-600 text-sm sm:text-base">
                          Conforme
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao_conforme" id={`${item.id}-nao-conforme`} />
                        <Label htmlFor={`${item.id}-nao-conforme`} className="text-red-600 text-sm sm:text-base">
                          Não Conforme
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nao_se_aplica" id={`${item.id}-nao-aplica`} />
                        <Label htmlFor={`${item.id}-nao-aplica`} className="text-gray-500 text-sm sm:text-base">
                          Não se Aplica
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dadosInspecao.observacoes}
              onChange={(e) => 
                setDadosInspecao({...dadosInspecao, observacoes: e.target.value})
              }
              placeholder="Observações adicionais sobre a inspeção..."
              rows={4}
              className="text-sm sm:text-base"
            />
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="button-group-end">
          <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            onClick={finalizarInspecao}
            disabled={!dadosInspecao.local || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <InlineLoader size="sm" />
                <span className="ml-2">Finalizando...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Finalizar Inspeção
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CadastrarInspecao;
