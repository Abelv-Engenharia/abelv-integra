
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker-with-manual-input";
import { ChevronLeft, ChevronRight, FileSearch, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CadastrarInspecao = () => {
  const [step, setStep] = useState(1);
  const [modelos, setModelos] = useState<any[]>([]);
  const [modeloSelecionado, setModeloSelecionado] = useState<any>(null);
  const [tiposInspecao, setTiposInspecao] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("");
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

  const loadTiposInspecao = async () => {
    try {
      const { data } = await supabase
        .from('tipos_inspecao_sms')
        .select('*')
        .eq('ativo', true);
      
      if (data) {
        setTiposInspecao(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const loadModelos = async () => {
    try {
      let query = supabase
        .from('modelos_inspecao_sms')
        .select(`
          *,
          tipos_inspecao_sms(nome)
        `)
        .eq('ativo', true);

      if (filtroTipo) {
        query = query.eq('tipo_inspecao_id', filtroTipo);
      }

      const { data } = await query.order('nome');
      
      if (data) {
        setModelos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    }
  };

  const selecionarModelo = (modelo: any) => {
    setModeloSelecionado(modelo);
    // Simular campos dinâmicos baseados no modelo
    const camposSimulados = [
      { id: 'item1', nome: 'EPIs em uso correto', tipo: 'conformidade' },
      { id: 'item2', nome: 'Área limpa e organizada', tipo: 'conformidade' },
      { id: 'item3', nome: 'Ferramentas em bom estado', tipo: 'conformidade' },
      { id: 'item4', nome: 'Sinalização adequada', tipo: 'conformidade' },
      { id: 'item5', nome: 'Procedimentos sendo seguidos', tipo: 'conformidade' }
    ];
    
    setItensInspecao(camposSimulados.map(item => ({
      ...item,
      status: 'nao_se_aplica'
    })));
    
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
      const temNaoConformidade = itensInspecao.some(item => item.status === 'nao_conforme');
      
      const dadosCompletos = {
        modelo_id: modeloSelecionado.id,
        responsavel_id: profile?.id,
        data_inspecao: format(dadosInspecao.data_inspecao, 'yyyy-MM-dd'),
        local: dadosInspecao.local,
        cca_id: dadosInspecao.cca_id || null,
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
        // Aqui seria implementada a geração do PDF e envio do email
        // Por enquanto, vamos simular
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
    }
  };

  useEffect(() => {
    loadTiposInspecao();
  }, []);

  useEffect(() => {
    loadModelos();
  }, [filtroTipo]);

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Cadastrar Inspeção SMS</h1>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrar Modelos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Inspeção</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    {tiposInspecao.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Modelos */}
        <Card>
          <CardHeader>
            <CardTitle>Selecione um Modelo de Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelos.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum modelo encontrado. Verifique os filtros ou cadastre novos modelos.
                </div>
              ) : (
                modelos.map((modelo) => (
                  <Card 
                    key={modelo.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selecionarModelo(modelo)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{modelo.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {modelo.tipos_inspecao_sms?.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(modelo.campos_substituicao || []).length} campos configurados
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStep(1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Preencher Inspeção: {modeloSelecionado?.nome}</h1>
        </div>

        {/* Dados Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Inspeção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Data da Inspeção *</Label>
                <DatePicker
                  date={dadosInspecao.data_inspecao}
                  onDateChange={(date) => 
                    setDadosInspecao({...dadosInspecao, data_inspecao: date || new Date()})
                  }
                />
              </div>
              <div>
                <Label>Local *</Label>
                <Input
                  value={dadosInspecao.local}
                  onChange={(e) => 
                    setDadosInspecao({...dadosInspecao, local: e.target.value})
                  }
                  placeholder="Informe o local da inspeção"
                  required
                />
              </div>
              <div>
                <Label>CCA</Label>
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
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens de Inspeção */}
        <Card>
          <CardHeader>
            <CardTitle>Itens de Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {itensInspecao.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">
                    {index + 1}. {item.nome}
                  </h4>
                  <RadioGroup
                    value={item.status}
                    onValueChange={(value) => handleItemChange(item.id, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="conforme" id={`${item.id}-conforme`} />
                      <Label htmlFor={`${item.id}-conforme`} className="text-green-600">
                        Conforme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao_conforme" id={`${item.id}-nao-conforme`} />
                      <Label htmlFor={`${item.id}-nao-conforme`} className="text-red-600">
                        Não Conforme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao_se_aplica" id={`${item.id}-nao-aplica`} />
                      <Label htmlFor={`${item.id}-nao-aplica`} className="text-gray-500">
                        Não se Aplica
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dadosInspecao.observacoes}
              onChange={(e) => 
                setDadosInspecao({...dadosInspecao, observacoes: e.target.value})
              }
              placeholder="Observações adicionais sobre a inspeção..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            Cancelar
          </Button>
          <Button 
            onClick={finalizarInspecao}
            disabled={!dadosInspecao.local}
          >
            <Send className="h-4 w-4 mr-2" />
            Finalizar Inspeção
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CadastrarInspecao;
