import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Users, FileText, Send, Save, Calculator, Upload, Search, Plus, UserPlus, X, Eye, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { calcularIR, type DadosIR } from '@/components/alojamento/CalculadoraIR';
import { Alert, AlertDescription } from '@/components/ui/alert';

const mockColaboradores = [
  { id: '001', nome: 'Pedro Silva', funcao: 'Soldador', periodoInicio: '2025-01-01', periodoFim: '2025-01-31', empresa: 'Construtora ABC' },
  { id: '002', nome: 'Maria Costa', funcao: 'Auxiliar', periodoInicio: '2025-01-15', periodoFim: '2025-01-31', empresa: 'Terceirizada XYZ' },
  { id: '003', nome: 'José Santos', funcao: 'Técnico', periodoInicio: '2025-01-01', periodoFim: '2025-01-20', empresa: 'Construtora ABC' },
  { id: '004', nome: 'Ana Silva', funcao: 'Engenheira Civil', periodoInicio: '2025-01-10', periodoFim: '2025-01-25', empresa: 'Engenharia DEF' },
  { id: '005', nome: 'Carlos Oliveira', funcao: 'Eletricista', periodoInicio: '2025-01-05', periodoFim: '2025-01-30', empresa: 'Terceirizada XYZ' }
];

const mockEmpresas = [
  'Construtora ABC',
  'Terceirizada XYZ',
  'Engenharia DEF',
  'Serviços GHI',
  'Consultoria JKL'
];

export default function AluguelMedicoes() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contratoSelecionado, setContratoSelecionado] = useState('');
  const [obra, setObra] = useState('');
  const [competencia, setCompetencia] = useState('2025-01');
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [valorAluguel, setValorAluguel] = useState('');
  const [diasAluguel, setDiasAluguel] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  const [dadosIR, setDadosIR] = useState<DadosIR | null>(null);
  
  // Novos estados
  const [buscaColaborador, setBuscaColaborador] = useState('');
  const [colaboradorSelecionadoBusca, setColaboradorSelecionadoBusca] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [diasCalculados, setDiasCalculados] = useState('');
  
  // Estados para colaboradores manuais
  const [nomeColaboradorManual, setNomeColaboradorManual] = useState('');
  const [funcaoColaboradorManual, setFuncaoColaboradorManual] = useState('');
  const [empresaColaboradorManual, setEmpresaColaboradorManual] = useState('');
  const [colaboradoresManuais, setColaboradoresManuais] = useState<any[]>([]);
  
  // Estado para períodos editáveis de cada colaborador
  const [periodosEditaveis, setPeriodosEditaveis] = useState<{[key: string]: {inicio: string, fim: string}}>({});
  
  // Estados para anexos
  const [anexos, setAnexos] = useState<Array<{nome: string, url: string, tamanho: number}>>([]);
  const [uploadingAnexo, setUploadingAnexo] = useState(false);

  // Buscar contratos do banco de dados
  const { data: contratosDb, isLoading: loadingContratos } = useQuery({
    queryKey: ['contratos_alojamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos_alojamento')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Mapear contratos do banco para formato usado no componente
  const contratos = (contratosDb || []).map(c => ({
    id: c.id,
    codigo: c.codigo,
    obra: c.nome,
    fornecedor: c.proprietario,
    cpfCnpj: c.cpf_cnpj_proprietario,
    endereco: `${c.logradouro}, ${c.bairro}, ${c.municipio}/${c.uf}`,
    telefone: '(00) 00000-0000',
    valorMensal: Number(c.valor_aluguel),
    tipo: c.tipo_proprietario,
    ccaCodigo: c.cca_codigo
  }));

  const contratoAtual = contratos.find(c => c.id === contratoSelecionado);

  // Buscar dados do contrato detalhado incluindo IR
  const { data: contratoDetalhado } = useQuery({
    queryKey: ['contrato_detalhado', contratoSelecionado],
    queryFn: async () => {
      if (!contratoSelecionado) return null;
      
      const { data, error } = await supabase
        .from('contratos_alojamento')
        .select('*')
        .eq('id', contratoSelecionado)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contratoSelecionado
  });

  // Atualizar automaticamente o valor do aluguel e dados de IR quando selecionar um contrato
  useEffect(() => {
    if (contratoAtual && contratoDetalhado) {
      setValorAluguel(contratoAtual.valorMensal.toFixed(2));
      if (contratoAtual.ccaCodigo) {
        setObra(contratoAtual.ccaCodigo);
      }
      
      // Puxar dados de IR do contrato se existirem
      if (contratoDetalhado.tem_ir && contratoDetalhado.valor_ir) {
        setDadosIR({
          baseCalculo: Number(contratoAtual.valorMensal),
          faixaDescricao: 'Conforme contrato',
          aliquota: 0,
          parcelaADeduzir: 0,
          valorIR: Number(contratoDetalhado.valor_ir),
          valorLiquido: Number(contratoAtual.valorMensal) - Number(contratoDetalhado.valor_ir),
          isento: false
        });
      } else {
        setDadosIR(null);
      }
    }
  }, [contratoAtual, contratoDetalhado]);

  // Filtrar colaboradores para busca
  const colaboradoresFiltrados = mockColaboradores.filter(colab => 
    colab.nome.toLowerCase().includes(buscaColaborador.toLowerCase()) ||
    colab.funcao.toLowerCase().includes(buscaColaborador.toLowerCase()) ||
    colab.empresa.toLowerCase().includes(buscaColaborador.toLowerCase())
  );

  // Calcular dias de aluguel automaticamente
  useEffect(() => {
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      if (fim >= inicio) {
        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDiasCalculados(diffDays.toString());
        setDiasAluguel(diffDays.toString());
      }
    }
  }, [dataInicio, dataFim]);

  const calcularValorTotal = () => {
    if (contratoAtual?.valorMensal) {
      // Se tem contrato, usar valor mensal proporcional
      const dias = parseInt(diasAluguel) || 31;
      return (contratoAtual.valorMensal * dias) / 31;
    } else {
      // Se não tem contrato, calcular por diária
      const dias = parseInt(diasAluguel) || 0;
      const diaria = parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const totalColaboradores = colaboradoresSelecionados.length;
      return dias * diaria * totalColaboradores;
    }
  };

  const handleColaboradorChange = (colaboradorId: string, checked: boolean) => {
    if (checked) {
      setColaboradoresSelecionados([...colaboradoresSelecionados, colaboradorId]);
    } else {
      setColaboradoresSelecionados(colaboradoresSelecionados.filter(id => id !== colaboradorId));
    }
  };

  const handleAdicionarColaboradorBusca = () => {
    if (colaboradorSelecionadoBusca && !colaboradoresSelecionados.includes(colaboradorSelecionadoBusca)) {
      setColaboradoresSelecionados([...colaboradoresSelecionados, colaboradorSelecionadoBusca]);
      setBuscaColaborador('');
      setColaboradorSelecionadoBusca('');
      
      toast({
        title: "Colaborador Adicionado",
        description: "Colaborador incluído na lista de alocados"
      });
    }
  };

  const handleAdicionarColaboradorManual = () => {
    if (nomeColaboradorManual.trim()) {
      const novoId = `manual-${Date.now()}`;
      const novoColaborador = {
        id: novoId,
        nome: nomeColaboradorManual.trim(),
        funcao: funcaoColaboradorManual.trim() || 'Não informado',
        empresa: empresaColaboradorManual.trim() || nomeEmpresa || 'Não informado',
        periodoInicio: dataInicio || '2025-01-01',
        periodoFim: dataFim || '2025-01-31',
        manual: true
      };
      
      setColaboradoresManuais([...colaboradoresManuais, novoColaborador]);
      setColaboradoresSelecionados([...colaboradoresSelecionados, novoId]);
      
      // Limpar campos
      setNomeColaboradorManual('');
      setFuncaoColaboradorManual('');
      setEmpresaColaboradorManual('');
      
      toast({
        title: "Colaborador Incluído",
        description: "Colaborador adicionado manualmente à lista"
      });
    }
  };

  const handleAdicionarVagaAberta = () => {
    const novoId = `vaga-aberta-${Date.now()}`;
    const vagaAberta = {
      id: novoId,
      nome: 'VAGA EM ABERTO',
      funcao: 'N/A',
      empresa: 'N/A',
      periodoInicio: dataInicio || '2025-01-01',
      periodoFim: dataFim || '2025-01-31',
      vagaAberta: true
    };
    
    setColaboradoresManuais([...colaboradoresManuais, vagaAberta]);
    setColaboradoresSelecionados([...colaboradoresSelecionados, novoId]);
    
    toast({
      title: "Vaga em Aberto Adicionada",
      description: "Vaga sem colaborador incluída na lista"
    });
  };

  const handleRemoverColaborador = (colaboradorId: string) => {
    setColaboradoresSelecionados(colaboradoresSelecionados.filter(id => id !== colaboradorId));
    if (colaboradorId.startsWith('manual-')) {
      setColaboradoresManuais(colaboradoresManuais.filter(colab => colab.id !== colaboradorId));
    }
    // Remove também do estado de períodos editáveis
    const novosPeriodos = { ...periodosEditaveis };
    delete novosPeriodos[colaboradorId];
    setPeriodosEditaveis(novosPeriodos);
  };

  // Função para atualizar período específico de um colaborador
  const handlePeriodoChange = (colaboradorId: string, tipo: 'inicio' | 'fim', valor: string) => {
    setPeriodosEditaveis(prev => ({
      ...prev,
      [colaboradorId]: {
        ...prev[colaboradorId],
        [tipo]: valor
      }
    }));
  };

  // Função para obter o período atual de um colaborador (editável ou original)
  const getPeriodoColaborador = (colaborador: any) => {
    const periodoEditavel = periodosEditaveis[colaborador.id];
    return {
      inicio: periodoEditavel?.inicio || colaborador.periodoInicio,
      fim: periodoEditavel?.fim || colaborador.periodoFim
    };
  };

  const handleSalvarRascunho = async () => {
    if (!contratoSelecionado || !obra) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha o contrato e a obra antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const numeroMedicao = `MED-${Date.now().toString().slice(-6)}`;
      
      const medicao = {
        contrato_id: contratoSelecionado,
        numero_medicao: numeroMedicao,
        obra: obra,
        competencia: competencia,
        empresa: nomeEmpresa,
        data_inicio: dataInicio || null,
        data_fim: dataFim || null,
        dias_aluguel: parseInt(diasAluguel) || 0,
        valor_total: calcularValorTotal(),
        valor_diaria: valorDiaria ? parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) : null,
        colaboradores: colaboradoresParaExibir.map(c => ({
          id: c.id,
          nome: c.nome,
          funcao: c.funcao,
          empresa: c.empresa,
          periodoInicio: getPeriodoColaborador(c).inicio,
          periodoFim: getPeriodoColaborador(c).fim
        })),
        observacoes: observacoes,
        anexos: anexos,
        status: 'rascunho'
      };

      const { error } = await supabase
        .from('medicoes_aluguel')
        .insert(medicao);

      if (error) throw error;

      toast({
        title: "Rascunho Salvo",
        description: `Medição ${numeroMedicao} salva como rascunho com sucesso`
      });
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o rascunho",
        variant: "destructive"
      });
    }
  };

  const handleEnviarValidacao = async () => {
    if (!contratoSelecionado || !obra || colaboradoresSelecionados.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos obrigatórios antes de enviar",
        variant: "destructive"
      });
      return;
    }

    try {
      const numeroMedicao = `MED-${Date.now().toString().slice(-6)}`;
      
      const medicao = {
        contrato_id: contratoSelecionado,
        numero_medicao: numeroMedicao,
        obra: obra,
        competencia: competencia,
        empresa: nomeEmpresa,
        data_inicio: dataInicio || null,
        data_fim: dataFim || null,
        dias_aluguel: parseInt(diasAluguel) || 0,
        valor_total: dadosIR ? dadosIR.valorLiquido : calcularValorTotal(),
        valor_diaria: valorDiaria ? parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) : null,
        colaboradores: colaboradoresParaExibir.map(c => ({
          id: c.id,
          nome: c.nome,
          funcao: c.funcao,
          empresa: c.empresa,
          periodoInicio: getPeriodoColaborador(c).inicio,
          periodoFim: getPeriodoColaborador(c).fim
        })),
        observacoes: observacoes,
        anexos: anexos,
        status: 'recebida_obra',
        data_envio: new Date().toISOString(),
        dados_sienge: dadosIR ? {
          valor_bruto: dadosIR.baseCalculo,
          ir_retido: dadosIR.valorIR,
          valor_liquido: dadosIR.valorLiquido,
          aliquota_ir: dadosIR.aliquota,
          parcela_deduzir: dadosIR.parcelaADeduzir
        } : null
      };

      const { error } = await supabase
        .from('medicoes_aluguel')
        .insert(medicao);

      if (error) throw error;

      toast({
        title: "Medição Enviada",
        description: `Medição ${numeroMedicao} enviada para validação matricial com sucesso`
      });

      // Limpar formulário após envio
      setContratoSelecionado('');
      setObra('');
      setColaboradoresSelecionados([]);
      setColaboradoresManuais([]);
      setAnexos([]);
      setObservacoes('');
      setDataInicio('');
      setDataFim('');
      setDiasAluguel('');
      setValorDiaria('');
    } catch (error) {
      console.error('Erro ao enviar medição:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Não foi possível enviar a medição",
        variant: "destructive"
      });
    }
  };

  const handleUploadAnexo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingAnexo(true);

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `aluguel/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('hospedagem-anexos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hospedagem-anexos')
          .getPublicUrl(filePath);

        setAnexos(prev => [...prev, {
          nome: file.name,
          url: publicUrl,
          tamanho: file.size
        }]);

        toast({
          title: "Anexo Adicionado",
          description: `${file.name} foi anexado com sucesso`
        });
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        toast({
          title: "Erro no Upload",
          description: `Não foi possível anexar ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setUploadingAnexo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoverAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Anexo Removido",
      description: "Arquivo removido da lista"
    });
  };

  // Combinar colaboradores do sistema e manuais
  const todosColaboradores = [...mockColaboradores, ...colaboradoresManuais];
  const colaboradoresParaExibir = todosColaboradores.filter(c => 
    colaboradoresSelecionados.includes(c.id)
  );

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aluguel - Medições</h1>
          <p className="text-muted-foreground">Controle mensal de aluguel de alojamentos por contrato</p>
        </div>

        {/* Dados do Aluguel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados do Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contrato <span className="text-red-500">*</span></label>
                <Select value={contratoSelecionado} onValueChange={setContratoSelecionado} disabled={loadingContratos}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingContratos ? "Carregando..." : "Selecione o contrato"} />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos.map(contrato => (
                      <SelectItem key={contrato.id} value={contrato.id}>
                        {contrato.codigo} - {contrato.fornecedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Obra/CCA <span className="text-red-500">*</span></label>
                <Select value={obra} onValueChange={setObra}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a obra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CCA25051">CCA 25051</SelectItem>
                    <SelectItem value="CCA25052">CCA 25052</SelectItem>
                    <SelectItem value="CCA25053">CCA 25053</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Competência <span className="text-red-500">*</span></label>
                <Input 
                  type="month" 
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                <Select value={nomeEmpresa} onValueChange={setNomeEmpresa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione ou digite a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmpresas.map(empresa => (
                      <SelectItem key={empresa} value={empresa}>
                        {empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {contratoAtual && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <Input value={contratoAtual.endereco} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <Input value={contratoAtual.telefone} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <Badge variant={contratoAtual.tipo === 'pessoa_fisica' ? 'default' : 'secondary'}>
                    {contratoAtual.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cálculo do IR (se Pessoa Física) */}
        {contratoAtual && contratoAtual.tipo === 'pf' && dadosIR && (
          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Calculator className="h-5 w-5" />
                Cálculo do Imposto de Renda (Pessoa Física)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Base de Cálculo</label>
                  <div className="text-lg font-semibold">R$ {dadosIR.baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Faixa</label>
                  <div className="text-sm font-medium">{dadosIR.faixaDescricao}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Alíquota</label>
                  <div className="text-lg font-semibold">{dadosIR.aliquota}%</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Parcela a Deduzir</label>
                  <div className="text-lg">R$ {dadosIR.parcelaADeduzir.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor do IR</label>
                  <div className="text-lg font-bold text-red-600">R$ {dadosIR.valorIR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Líquido a Pagar</label>
                  <div className="text-lg font-bold text-green-600">R$ {dadosIR.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
              {dadosIR.isento && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Valor isento de Imposto de Renda
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Período de Aluguel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período de Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data Início</label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Fim</label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantidade de Dias</label>
                <Input
                  type="number"
                  placeholder="Calculado automaticamente"
                  value={diasCalculados}
                  onChange={(e) => {
                    setDiasCalculados(e.target.value);
                    setDiasAluguel(e.target.value);
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Calculado automaticamente, mas editável
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status do Período</label>
                <div className="p-3 bg-muted rounded-lg">
                  {dataInicio && dataFim ? (
                    <Badge variant="default">Período Definido</Badge>
                  ) : (
                    <Badge variant="outline">Em Aberto</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cálculo de Valor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cálculo de Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {contratoAtual?.valorMensal ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor Mensal (Contrato)</label>
                    <div className="p-3 bg-muted rounded-lg">
                      R$ {contratoAtual.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dias do Período <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={diasAluguel}
                      onChange={(e) => setDiasAluguel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nº Colaboradores</label>
                    <div className="p-3 bg-muted rounded-lg">
                      {colaboradoresSelecionados.length}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Valor Proporcional Calculado</label>
                    <div className="p-3 bg-primary/10 rounded-lg font-semibold">
                      R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor da Diária <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="R$ 0,00"
                      value={valorDiaria}
                      onChange={(e) => setValorDiaria(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dias de Aluguel <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={diasAluguel}
                      onChange={(e) => setDiasAluguel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nº Colaboradores</label>
                    <div className="p-3 bg-muted rounded-lg">
                      {colaboradoresSelecionados.length}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Valor Total Calculado</label>
                    <div className="p-3 bg-primary/10 rounded-lg font-semibold">
                      R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <strong>Memória de Cálculo:</strong>{' '}
              {contratoAtual?.valorMensal ? (
                <>R$ {contratoAtual.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} × {diasAluguel || '0'} dias ÷ 31 dias = R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
              ) : (
                <>R$ {valorDiaria || '0,00'} × {diasAluguel || '0'} dias × {colaboradoresSelecionados.length} colaboradores = R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Buscar e Adicionar Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Buscar e Adicionar Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Busca no Sistema */}
              <div>
                <h4 className="font-medium mb-3">Buscar no Sistema (Nydus + PJ)</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Digite nome, função ou empresa do colaborador..."
                      value={buscaColaborador}
                      onChange={(e) => setBuscaColaborador(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={handleAdicionarColaboradorBusca}
                    disabled={!colaboradorSelecionadoBusca}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>

                {buscaColaborador && colaboradoresFiltrados.length > 0 && (
                  <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                    {colaboradoresFiltrados.map((colab) => (
                      <div
                        key={colab.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setColaboradorSelecionadoBusca(colab.id);
                          setBuscaColaborador(`${colab.nome} - ${colab.funcao}`);
                        }}
                      >
                        <div className="font-medium">{colab.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {colab.funcao} • {colab.empresa}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulário Manual */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">Adicionar Manualmente (Não Integrado)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Nome do Colaborador"
                    value={nomeColaboradorManual}
                    onChange={(e) => setNomeColaboradorManual(e.target.value)}
                  />
                  <Input
                    placeholder="Função"
                    value={funcaoColaboradorManual}
                    onChange={(e) => setFuncaoColaboradorManual(e.target.value)}
                  />
                  <Input
                    placeholder="Empresa (opcional)"
                    value={empresaColaboradorManual}
                    onChange={(e) => setEmpresaColaboradorManual(e.target.value)}
                  />
                  <Button 
                    onClick={handleAdicionarColaboradorManual}
                    disabled={!nomeColaboradorManual.trim()}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Incluir
                  </Button>
                </div>
              </div>

              {/* Tabela de Colaboradores Selecionados */}
              {colaboradoresParaExibir.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-3">Colaboradores Adicionados:</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Data Início</TableHead>
                        <TableHead>Data Fim</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colaboradoresParaExibir.map(colaborador => {
                        const periodo = getPeriodoColaborador(colaborador);
                        const isVagaAberta = colaborador.vagaAberta || colaborador.nome === 'VAGA EM ABERTO';
                        
                        return (
                          <TableRow key={colaborador.id} className={isVagaAberta ? 'bg-orange-50' : ''}>
                            <TableCell className="font-medium">
                              {colaborador.nome}
                              {isVagaAberta && (
                                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                                  Vaga Aberta
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{colaborador.funcao}</TableCell>
                            <TableCell>{colaborador.empresa}</TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={periodo.inicio}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'inicio', e.target.value)}
                                className="w-36"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={periodo.fim}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'fim', e.target.value)}
                                className="w-36"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoverColaborador(colaborador.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Colaboradores Alocados <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {colaboradoresParaExibir.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum colaborador adicionado ainda
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Data Fim</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colaboradoresParaExibir.map((colaborador) => {
                      const periodo = getPeriodoColaborador(colaborador);
                      return (
                        <TableRow key={colaborador.id}>
                          <TableCell className="font-medium">
                            {colaborador.nome}
                            {colaborador.manual && (
                              <Badge variant="outline" className="ml-2 text-xs">Manual</Badge>
                            )}
                          </TableCell>
                          <TableCell>{colaborador.funcao}</TableCell>
                          <TableCell>{colaborador.empresa}</TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={periodo.inicio}
                              onChange={(e) => handlePeriodoChange(colaborador.id, 'inicio', e.target.value)}
                              className="w-36"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={periodo.fim}
                              onChange={(e) => handlePeriodoChange(colaborador.id, 'fim', e.target.value)}
                              className="w-36"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoverColaborador(colaborador.id)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {colaboradoresSelecionados.length > 0 && (
                <Badge variant="outline" className="mt-2">
                  {colaboradoresSelecionados.length} colaborador(es) selecionado(s)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <Textarea
                placeholder="Informações adicionais sobre a medição..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleSalvarRascunho}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button onClick={handleEnviarValidacao}>
            <Send className="h-4 w-4 mr-2" />
            Enviar para Validação Matricial
          </Button>
        </div>
      </div>
    </div>
  );
}