
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
  const [itensInspecao, setItensInspecao] = useState<any[]>([]);
  
  const { profile } = useProfile();
  const { data: userCCAs = [] } = useUserCCAs();


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
    
    // Carregar itens de avaliação do checklist selecionado
    const itensAvaliacao = Array.isArray(modelo.itens_avaliacao) ? modelo.itens_avaliacao : [];
    const secoes = Array.isArray(modelo.secoes) ? modelo.secoes : [];
    
    // Organizar itens por seção ou criar uma lista simples
    let itensOrganizados = [];
    
    if (secoes.length > 0) {
      // Se há seções, organizar itens por seção
      secoes.forEach((secao: any, secaoIndex: number) => {
        itensOrganizados.push({
          id: `secao_${secaoIndex}`,
          nome: secao.nome,
          tipo: 'secao',
          isSection: true
        });
        
        itensAvaliacao.forEach((item: any, itemIndex: number) => {
          if (item.secao === secao.nome || (!item.secao && secaoIndex === 0)) {
            itensOrganizados.push({
              id: `item_${itemIndex}`,
              nome: item.texto || item.nome,
              tipo: 'item',
              status: 'nao_se_aplica',
              secao: secao.nome
            });
          }
        });
      });
    } else {
      // Se não há seções, mostrar todos os itens em sequência
      itensAvaliacao.forEach((item: any, index: number) => {
        itensOrganizados.push({
          id: `item_${index}`,
          nome: item.texto || item.nome,
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
                <Label className="text-sm sm:text-base">CCA</Label>
                <Select 
                  value={dadosInspecao.cca_id} 
                  onValueChange={(value) => 
                    setDadosInspecao({...dadosInspecao, cca_id: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CCA" />
                  </SelectTrigger>
                  <SelectContent>
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
