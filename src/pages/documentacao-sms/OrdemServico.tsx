import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeletorCCAFuncionarios } from "@/components/documentacao/SeletorCCAFuncionarios";
import { useModelosPorTipo } from "@/hooks/useModelosPorTipo";
import { useRiscosPorFuncao } from "@/hooks/useRiscosPorFuncao";
import { useFuncionariosByCCA } from "@/hooks/useFuncionariosByCCA";
import { substituirCodigos, gerarPreviewDocumento } from "@/services/documentacao/substituicaoCodigosService";
import { supabase } from "@/integrations/supabase/client";

export default function OrdemServico() {
  const { toast } = useToast();
  const [selectedCcaId, setSelectedCcaId] = useState<number>();
  const [selectedFuncionarioIds, setSelectedFuncionarioIds] = useState<string[]>([]);
  const [selectedModeloId, setSelectedModeloId] = useState<string>();
  
  const [formData, setFormData] = useState({
    numero_os: `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
    local_trabalho: "",
    descricao_servico: "",
    data_inicio: new Date().toISOString().split('T')[0],
    prazo_execucao: "",
    responsavel_os: "",
    medidas_protecao: "",
    procedimentos_seguranca: "",
    observacoes: "",
  });

  const [riscosData, setRiscosData] = useState<{
    fisicos: string[];
    quimicos: string[];
    biologicos: string[];
    ergonomicos: string[];
    acidentes: string[];
  }>({
    fisicos: [],
    quimicos: [],
    biologicos: [],
    ergonomicos: [],
    acidentes: [],
  });

  const [episSelecionados, setEpisSelecionados] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState("");

  const { data: modelos = [], isLoading: loadingModelos } = useModelosPorTipo("OS");
  const { data: funcionarios = [] } = useFuncionariosByCCA(selectedCcaId);

  // Buscar riscos quando funcionários forem selecionados
  const primeiroFuncionario = funcionarios.find(f => selectedFuncionarioIds.includes(f.id));
  const { data: riscosEncontrados } = useRiscosPorFuncao(
    selectedCcaId,
    primeiroFuncionario?.funcao
  );

  // Preencher riscos automaticamente
  useEffect(() => {
    if (riscosEncontrados) {
      setRiscosData({
        fisicos: (riscosEncontrados.riscos_fisicos as string[]) || [],
        quimicos: (riscosEncontrados.riscos_quimicos as string[]) || [],
        biologicos: (riscosEncontrados.riscos_biologicos as string[]) || [],
        ergonomicos: (riscosEncontrados.riscos_ergonomicos as string[]) || [],
        acidentes: (riscosEncontrados.riscos_acidentes as string[]) || [],
      });
      setEpisSelecionados((riscosEncontrados.epis_requeridos as string[]) || []);
    }
  }, [riscosEncontrados]);

  // Atualizar preview em tempo real
  useEffect(() => {
    if (selectedModeloId && selectedFuncionarioIds.length > 0 && selectedCcaId) {
      const modelo = modelos.find(m => m.id === selectedModeloId);
      const funcionario = funcionarios.find(f => f.id === selectedFuncionarioIds[0]);
      
      if (modelo && funcionario) {
        // Simulação do template - em produção viria do arquivo
        const templateSimulado = `
ORDEM DE SERVIÇO N° ${formData.numero_os}

DADOS DO FUNCIONÁRIO:
Nome: {{FUNCIONARIO_NOME}}
Matrícula: {{FUNCIONARIO_MATRICULA}}
Função: {{FUNCIONARIO_FUNCAO}}
CPF: {{FUNCIONARIO_CPF}}

DADOS DA OBRA:
CCA: {{CCA_CODIGO}} - {{CCA_NOME}}
Local de Trabalho: ${formData.local_trabalho}

DESCRIÇÃO DO SERVIÇO:
${formData.descricao_servico}

RISCOS IDENTIFICADOS:
Riscos Físicos: {{RISCOS_FISICOS}}
Riscos Químicos: {{RISCOS_QUIMICOS}}
Riscos Biológicos: {{RISCOS_BIOLOGICOS}}
Riscos Ergonômicos: {{RISCOS_ERGONOMICOS}}
Riscos de Acidentes: {{RISCOS_ACIDENTES}}

EPIs OBRIGATÓRIOS:
{{EPIS_OBRIGATORIOS}}

MEDIDAS DE PROTEÇÃO COLETIVA:
${formData.medidas_protecao}

PROCEDIMENTOS DE SEGURANÇA:
${formData.procedimentos_seguranca}

RESPONSÁVEL PELA OS: ${formData.responsavel_os}
DATA DE INÍCIO: ${formData.data_inicio}
PRAZO DE EXECUÇÃO: ${formData.prazo_execucao}

Data de Emissão: {{DATA_EMISSAO}}
`;

        const preview = gerarPreviewDocumento(templateSimulado, {
          funcionario: {
            id: funcionario.id,
            nome: funcionario.nome,
            matricula: funcionario.matricula || "",
            cpf: funcionario.cpf || "",
            funcao: funcionario.funcao || "",
            data_admissao: funcionario.data_admissao || "",
          },
          cca: {
            id: selectedCcaId,
            codigo: funcionario.ccas?.codigo || "",
            nome: funcionario.ccas?.nome || "",
            tipo: funcionario.ccas?.tipo || "",
          },
          riscos: riscosData,
          epis: episSelecionados,
        });

        setPreviewContent(preview);
      }
    }
  }, [selectedModeloId, selectedFuncionarioIds, selectedCcaId, formData, riscosData, episSelecionados, modelos, funcionarios]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleRisco = (categoria: keyof typeof riscosData, risco: string) => {
    setRiscosData(prev => ({
      ...prev,
      [categoria]: prev[categoria].includes(risco)
        ? prev[categoria].filter(r => r !== risco)
        : [...prev[categoria], risco]
    }));
  };

  const toggleEpi = (epi: string) => {
    setEpisSelecionados(prev =>
      prev.includes(epi) ? prev.filter(e => e !== epi) : [...prev, epi]
    );
  };

  const validarFormulario = () => {
    if (!selectedModeloId) {
      toast({ title: "Erro", description: "Selecione um modelo de OS", variant: "destructive" });
      return false;
    }
    if (!selectedCcaId) {
      toast({ title: "Erro", description: "Selecione um CCA", variant: "destructive" });
      return false;
    }
    if (selectedFuncionarioIds.length === 0) {
      toast({ title: "Erro", description: "Selecione ao menos um funcionário", variant: "destructive" });
      return false;
    }
    if (!formData.descricao_servico) {
      toast({ title: "Erro", description: "Preencha a descrição do serviço", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleGerarOS = async () => {
    if (!validarFormulario()) return;

    try {
      const funcionariosSelecionados = funcionarios.filter(f =>
        selectedFuncionarioIds.includes(f.id)
      );

      for (const funcionario of funcionariosSelecionados) {
        const nomeArquivo = `OS-${formData.numero_os}-${funcionario.nome.replace(/\s+/g, '-')}.txt`;
        
        await supabase.from('documentacao_gerada').insert({
          tipo: 'OS',
          modelo_id: selectedModeloId,
          funcionario_id: funcionario.id,
          cca_id: selectedCcaId,
          arquivo_url: `temp/${nomeArquivo}`,
          arquivo_nome: nomeArquivo,
          dados_preenchidos: {
            ...formData,
            riscos: riscosData,
            epis: episSelecionados,
          },
        });
      }

      toast({
        title: "Sucesso!",
        description: `${funcionariosSelecionados.length} ordem(ns) de serviço gerada(s)`,
      });

      // Limpar formulário
      setSelectedFuncionarioIds([]);
      setFormData({
        numero_os: `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
        local_trabalho: "",
        descricao_servico: "",
        data_inicio: new Date().toISOString().split('T')[0],
        prazo_execucao: "",
        responsavel_os: "",
        medidas_protecao: "",
        procedimentos_seguranca: "",
        observacoes: "",
      });
    } catch (error) {
      console.error('Erro ao gerar OS:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar ordens de serviço",
        variant: "destructive",
      });
    }
  };

  const camposObrigatoriosVazios = !selectedModeloId || !selectedCcaId || 
    selectedFuncionarioIds.length === 0 || !formData.descricao_servico;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordem De Serviço</h1>
          <p className="text-muted-foreground">
            Emissão de ordens de serviço com substituição automática de dados
          </p>
        </div>
      </div>

      {/* Seção 1: Seleção de Modelo */}
      <Card>
        <CardHeader>
          <CardTitle>Modelo De Documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Modelo De Os
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select value={selectedModeloId} onValueChange={setSelectedModeloId}>
              <SelectTrigger className={!selectedModeloId ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecione um modelo de OS" />
              </SelectTrigger>
              <SelectContent>
                {loadingModelos ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : modelos.length === 0 ? (
                  <SelectItem value="empty" disabled>Nenhum modelo cadastrado</SelectItem>
                ) : (
                  modelos.map((modelo) => (
                    <SelectItem key={modelo.id} value={modelo.id}>
                      {modelo.nome} (v{modelo.versao})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Seleção de CCA e Funcionários */}
      <SeletorCCAFuncionarios
        selectedCcaId={selectedCcaId}
        onCcaChange={setSelectedCcaId}
        selectedFuncionarioIds={selectedFuncionarioIds}
        onFuncionariosChange={setSelectedFuncionarioIds}
        multiSelect={true}
        required={true}
        label="Seleção De Funcionários Para A Os"
      />

      {/* Seção 3: Dados da OS */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Da Ordem De Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número Da Os</Label>
              <Input
                value={formData.numero_os}
                onChange={(e) => handleInputChange('numero_os', e.target.value)}
                placeholder="OS-2025-0001"
              />
            </div>

            <div className="space-y-2">
              <Label>Local De Trabalho</Label>
              <Input
                value={formData.local_trabalho}
                onChange={(e) => handleInputChange('local_trabalho', e.target.value)}
                placeholder="Ex: Pavimento 3, Área Externa"
              />
            </div>

            <div className="space-y-2">
              <Label>Data De Início</Label>
              <Input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Prazo De Execução</Label>
              <Input
                type="date"
                value={formData.prazo_execucao}
                onChange={(e) => handleInputChange('prazo_execucao', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Responsável Pela Os</Label>
              <Input
                value={formData.responsavel_os}
                onChange={(e) => handleInputChange('responsavel_os', e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Descrição Do Serviço
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              value={formData.descricao_servico}
              onChange={(e) => handleInputChange('descricao_servico', e.target.value)}
              placeholder="Descreva detalhadamente o serviço a ser executado"
              rows={4}
              className={!formData.descricao_servico ? "border-destructive" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção 4: Riscos */}
      {riscosEncontrados && (
        <Card>
          <CardHeader>
            <CardTitle>Riscos Da Atividade</CardTitle>
            <p className="text-sm text-muted-foreground">
              Riscos identificados automaticamente para a função: {primeiroFuncionario?.funcao}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(riscosData).map(([categoria, riscos]) => (
              riscos.length > 0 && (
                <div key={categoria} className="space-y-2">
                  <Label className="capitalize">
                    Riscos {categoria === 'acidentes' ? 'De Acidentes' : categoria}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {riscos.map((risco) => (
                      <div key={risco} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risco-${categoria}-${risco}`}
                          checked={riscosData[categoria as keyof typeof riscosData].includes(risco)}
                          onCheckedChange={() => toggleRisco(categoria as keyof typeof riscosData, risco)}
                        />
                        <label
                          htmlFor={`risco-${categoria}-${risco}`}
                          className="text-sm cursor-pointer"
                        >
                          {risco}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </CardContent>
        </Card>
      )}

      {/* Seção 5: Medidas de Controle e EPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Medidas De Controle E Epis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Medidas De Proteção Coletiva</Label>
            <Textarea
              value={formData.medidas_protecao}
              onChange={(e) => handleInputChange('medidas_protecao', e.target.value)}
              placeholder="Ex: Guarda-corpo, sinalização, isolamento de área"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Procedimentos De Segurança</Label>
            <Textarea
              value={formData.procedimentos_seguranca}
              onChange={(e) => handleInputChange('procedimentos_seguranca', e.target.value)}
              placeholder="Ex: Verificar EPIs antes do início, manter área limpa e organizada"
              rows={3}
            />
          </div>

          {episSelecionados.length > 0 && (
            <div className="space-y-2">
              <Label>Epis Obrigatórios</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {episSelecionados.map((epi) => (
                  <div key={epi} className="flex items-center space-x-2">
                    <Checkbox
                      id={`epi-${epi}`}
                      checked={episSelecionados.includes(epi)}
                      onCheckedChange={() => toggleEpi(epi)}
                    />
                    <label htmlFor={`epi-${epi}`} className="text-sm cursor-pointer">
                      {epi}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seção 6: Preview */}
      {previewContent && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Do Documento</CardTitle>
            <p className="text-sm text-muted-foreground">
              Visualização com dados do primeiro funcionário selecionado
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap font-mono">{previewContent}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleGerarOS}
          disabled={camposObrigatoriosVazios}
          size="lg"
        >
          <Save className="mr-2 h-4 w-4" />
          Gerar Ordem De Serviço ({selectedFuncionarioIds.length})
        </Button>
      </div>
    </div>
  );
}
