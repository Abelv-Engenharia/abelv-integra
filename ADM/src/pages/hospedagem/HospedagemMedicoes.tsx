import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Users, FileText, Send, Save, Calculator, Upload, Search, Plus, UserPlus, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';

// Mock data para fornecedores sem contrato
const mockFornecedores = [
  {
    id: 'FORN-001',
    nome: 'João Carlos Silva',
    cpfCnpj: '123.456.789-00',
    endereco: 'Rua das Flores, 456',
    telefone: '(11) 98765-4321',
    tipo: 'pessoa_fisica'
  },
  {
    id: 'FORN-002', 
    nome: 'Pousada Central Ltda',
    cpfCnpj: '98.765.432/0001-10',
    endereco: 'Av. Principal, 123',
    telefone: '(11) 3456-7890',
    tipo: 'pessoa_juridica'
  }
];

const mockColaboradores = [
  { id: '001', nome: 'Pedro Silva', funcao: 'Soldador', periodoInicio: '2025-01-01', periodoFim: '2025-01-31', empresa: 'Construtora ABC' },
  { id: '002', nome: 'Maria Costa', funcao: 'Auxiliar', periodoInicio: '2025-01-15', periodoFim: '2025-01-31', empresa: 'Terceirizada XYZ' },
  { id: '003', nome: 'José Santos', funcao: 'Técnico', periodoInicio: '2025-01-01', periodoFim: '2025-01-20', empresa: 'Construtora ABC' },
  { id: '004', nome: 'Ana Silva', funcao: 'Engenheira Civil', periodoInicio: '2025-01-10', periodoFim: '2025-01-25', empresa: 'Engenharia DEF' },
  { id: '005', nome: 'Carlos Oliveira', funcao: 'Eletricista', periodoInicio: '2025-01-05', periodoFim: '2025-01-30', empresa: 'Terceirizada XYZ' }
];

// Mock data para empresas
const mockEmpresas = [
  'Construtora ABC',
  'Terceirizada XYZ', 
  'Engenharia DEF',
  'Serviços GHI',
  'Consultoria JKL'
];

export default function HospedagemMedicoes() {
  const { toast } = useToast();
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [obra, setObra] = useState('');
  const [competencia, setCompetencia] = useState('2025-01');
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [valorHospedagem, setValorHospedagem] = useState('');
  const [diasHospedagem, setDiasHospedagem] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  
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
  const [anexos, setAnexos] = useState<{name: string, url: string, path: string}[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Visualização de PDF
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>('');

  const fornecedorAtual = mockFornecedores.find(f => f.id === fornecedorSelecionado);

  // Filtrar colaboradores para busca
  const colaboradoresFiltrados = mockColaboradores.filter(colab => 
    colab.nome.toLowerCase().includes(buscaColaborador.toLowerCase()) ||
    colab.funcao.toLowerCase().includes(buscaColaborador.toLowerCase()) ||
    colab.empresa.toLowerCase().includes(buscaColaborador.toLowerCase())
  );

  // Calcular dias de hospedagem automaticamente
  useEffect(() => {
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      if (fim >= inicio) {
        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDiasCalculados(diffDays.toString());
        setDiasHospedagem(diffDays.toString());
      }
    }
  }, [dataInicio, dataFim]);

  const calcularValorTotal = () => {
    const dias = parseInt(diasHospedagem) || 0;
    const diaria = parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const totalColaboradores = colaboradoresSelecionados.length;
    return dias * diaria * totalColaboradores;
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
        description: "Colaborador incluído na lista de hospedados"
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

  // Função para fazer upload de anexos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('hospedagem-anexos')
          .upload(filePath, file);

        if (error) {
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('hospedagem-anexos')
          .getPublicUrl(filePath);

        setAnexos(prev => [...prev, {
          name: file.name,
          url: publicUrl,
          path: filePath
        }]);
      }

      toast({
        title: "Anexo Adicionado",
        description: "Arquivo enviado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no Upload",
        description: "Não foi possível fazer upload do arquivo",
        variant: "destructive"
      });
    } finally {
      setUploadingFile(false);
      // Reset input
      event.target.value = '';
    }
  };

  // Função para remover anexo
  const handleRemoverAnexo = async (index: number) => {
    const anexo = anexos[index];
    
    try {
      const { error } = await supabase.storage
        .from('hospedagem-anexos')
        .remove([anexo.path]);

      if (error) throw error;

      setAnexos(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "Anexo Removido",
        description: "Arquivo removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover anexo:', error);
      toast({
        title: "Erro ao Remover",
        description: "Não foi possível remover o arquivo",
        variant: "destructive"
      });
    }
  };

  // Função para visualizar anexo
  const handleVisualizarAnexo = async (anexo: {name: string, url: string, path: string}) => {
    try {
      let blob: Blob;
      if (anexo.path) {
        const { data, error } = await supabase.storage
          .from('hospedagem-anexos')
          .download(anexo.path);
        if (error) throw error;
        blob = data as Blob;
      } else {
        const resp = await fetch(anexo.url);
        blob = await resp.blob();
      }

      const ab = await blob.arrayBuffer();
      setPdfData(new Uint8Array(ab));
      setPdfTitle(anexo.name);
      setPdfOpen(true);
    } catch (e) {
      console.error('Erro ao carregar anexo:', e);
      toast({
        title: 'Erro ao carregar PDF',
        description: 'Não foi possível abrir o anexo. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleSalvarRascunho = async () => {
    if (anexos.length === 0) {
      toast({
        title: "Atenção",
        description: "É obrigatório anexar pelo menos um documento (nota, recibo ou comprovante)",
        variant: "destructive"
      });
      return;
    }

    if (!fornecedorSelecionado || !obra || colaboradoresSelecionados.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos obrigatórios antes de salvar",
        variant: "destructive"
      });
      return;
    }

    try {
      const fornecedor = mockFornecedores.find(f => f.id === fornecedorSelecionado);
      if (!fornecedor) return;

      // Preparar dados dos colaboradores
      const todosColaboradores = [...mockColaboradores, ...colaboradoresManuais];
      const colaboradoresData = colaboradoresSelecionados.map(id => {
        const colab = todosColaboradores.find(c => c.id === id);
        if (!colab) return null;
        const periodo = getPeriodoColaborador(colab);
        return {
          id: colab.id,
          nome: colab.nome,
          funcao: colab.funcao,
          empresa: colab.empresa,
          periodoInicio: periodo.inicio,
          periodoFim: periodo.fim
        };
      }).filter(Boolean);

      const numeroMedicao = `HOSP-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase
        .from('medicoes_hospedagem')
        .insert({
          numero_medicao: numeroMedicao,
          fornecedor_nome: fornecedor.nome,
          fornecedor_cpf_cnpj: fornecedor.cpfCnpj,
          fornecedor_tipo: fornecedor.tipo,
          fornecedor_endereco: fornecedor.endereco,
          fornecedor_telefone: fornecedor.telefone,
          obra,
          competencia,
          empresa: nomeEmpresa,
          data_inicio: dataInicio || null,
          data_fim: dataFim || null,
          dias_hospedagem: parseInt(diasHospedagem) || 0,
          valor_diaria: parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
          valor_total: calcularValorTotal(),
          colaboradores: colaboradoresData,
          anexos: anexos,
          observacoes: observacoes,
          status: 'rascunho'
        });

      if (error) throw error;

      toast({
        title: "Rascunho Salvo",
        description: `Medição ${numeroMedicao} salva como rascunho com sucesso`
      });

      // Limpar formulário
      setFornecedorSelecionado('');
      setObra('');
      setColaboradoresSelecionados([]);
      setColaboradoresManuais([]);
      setAnexos([]);
      setObservacoes('');
      setValorHospedagem('');
      setDiasHospedagem('');
      setValorDiaria('');
      setDataInicio('');
      setDataFim('');
      setNomeEmpresa('');
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
    if (!fornecedorSelecionado || !obra || colaboradoresSelecionados.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos obrigatórios antes de enviar",
        variant: "destructive"
      });
      return;
    }

    if (anexos.length === 0) {
      toast({
        title: "Erro de Validação",
        description: "É obrigatório anexar pelo menos um documento (nota, recibo ou comprovante)",
        variant: "destructive"
      });
      return;
    }

    try {
      const fornecedor = mockFornecedores.find(f => f.id === fornecedorSelecionado);
      if (!fornecedor) return;

      // Preparar dados dos colaboradores
      const todosColaboradores = [...mockColaboradores, ...colaboradoresManuais];
      const colaboradoresData = colaboradoresSelecionados.map(id => {
        const colab = todosColaboradores.find(c => c.id === id);
        if (!colab) return null;
        const periodo = getPeriodoColaborador(colab);
        return {
          id: colab.id,
          nome: colab.nome,
          funcao: colab.funcao,
          empresa: colab.empresa,
          periodoInicio: periodo.inicio,
          periodoFim: periodo.fim
        };
      }).filter(Boolean);

      const numeroMedicao = `HOSP-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase
        .from('medicoes_hospedagem')
        .insert({
          numero_medicao: numeroMedicao,
          fornecedor_nome: fornecedor.nome,
          fornecedor_cpf_cnpj: fornecedor.cpfCnpj,
          fornecedor_tipo: fornecedor.tipo,
          fornecedor_endereco: fornecedor.endereco,
          fornecedor_telefone: fornecedor.telefone,
          obra,
          competencia,
          empresa: nomeEmpresa,
          data_inicio: dataInicio || null,
          data_fim: dataFim || null,
          dias_hospedagem: parseInt(diasHospedagem) || 0,
          valor_diaria: parseFloat(valorDiaria.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
          valor_total: calcularValorTotal(),
          colaboradores: colaboradoresData,
          anexos: anexos,
          observacoes: observacoes,
          status: 'recebida_obra',
          data_envio: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Medição Enviada",
        description: `Medição ${numeroMedicao} enviada para validação matricial`
      });

      // Limpar formulário
      setFornecedorSelecionado('');
      setObra('');
      setColaboradoresSelecionados([]);
      setColaboradoresManuais([]);
      setAnexos([]);
      setObservacoes('');
      setValorHospedagem('');
      setDiasHospedagem('');
      setValorDiaria('');
      setDataInicio('');
      setDataFim('');
      setNomeEmpresa('');
    } catch (error) {
      console.error('Erro ao enviar medição:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Não foi possível enviar a medição",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospedagem - Medições</h1>
          <p className="text-muted-foreground">Controle de hospedagem sem vínculo contratual</p>
        </div>

        {/* Dados da Hospedagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados da Hospedagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fornecedor <span className="text-red-500">*</span></label>
                <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFornecedores.map(fornecedor => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome} - {fornecedor.cpfCnpj}
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

            {fornecedorAtual && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <Input value={fornecedorAtual.endereco} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <Input value={fornecedorAtual.telefone} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <Badge variant={fornecedorAtual.tipo === 'pessoa_fisica' ? 'default' : 'secondary'}>
                    {fornecedorAtual.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Período de Hospedagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período de Hospedagem
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
                    setDiasHospedagem(e.target.value);
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
              Cálculo de Hospedagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valor da Diária <span className="text-red-500">*</span></label>
                <Input
                  placeholder="R$ 0,00"
                  value={valorDiaria}
                  onChange={(e) => setValorDiaria(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dias de Hospedagem <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  placeholder="0"
                  value={diasHospedagem}
                  onChange={(e) => setDiasHospedagem(e.target.value)}
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
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <strong>Memória de Cálculo:</strong> R$ {valorDiaria || '0,00'} × {diasHospedagem || '0'} dias × {colaboradoresSelecionados.length} colaboradores = R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  <div className="border rounded-lg max-h-48 overflow-y-auto mt-2">
                    {colaboradoresFiltrados.map((colaborador) => (
                      <div 
                        key={colaborador.id}
                        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                          colaboradorSelecionadoBusca === colaborador.id ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => setColaboradorSelecionadoBusca(colaborador.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{colaborador.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {colaborador.funcao} • {colaborador.empresa}
                            </div>
                          </div>
                          {colaboradoresSelecionados.includes(colaborador.id) && (
                            <Badge variant="secondary">Já Adicionado</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Adicionar Manualmente */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Adicionar Manualmente</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Para colaboradores que não estão cadastrados no sistema
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                    <Input
                      placeholder="Digite o nome"
                      value={nomeColaboradorManual}
                      onChange={(e) => setNomeColaboradorManual(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Função</label>
                    <Input
                      placeholder="Ex: Soldador, Técnico..."
                      value={funcaoColaboradorManual}
                      onChange={(e) => setFuncaoColaboradorManual(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Empresa</label>
                    <Input
                      placeholder="Nome da empresa"
                      value={empresaColaboradorManual}
                      onChange={(e) => setEmpresaColaboradorManual(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAdicionarColaboradorManual}
                      disabled={!nomeColaboradorManual.trim()}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Incluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alocação de Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Colaboradores Hospedados <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione os colaboradores que utilizaram a hospedagem durante a competência
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Incluir</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Período na Hospedagem</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="w-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Colaboradores do sistema */}
                  {mockColaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id}>
                      <TableCell>
                        <Checkbox
                          checked={colaboradoresSelecionados.includes(colaborador.id)}
                          onCheckedChange={(checked) => 
                            handleColaboradorChange(colaborador.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{colaborador.nome}</TableCell>
                      <TableCell>{colaborador.funcao}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {colaborador.empresa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <label className="text-xs font-medium">Data Início</label>
                              <Input
                                type="date"
                                value={getPeriodoColaborador(colaborador).inicio}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'inicio', e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <label className="text-xs font-medium">Data Fim</label>
                              <Input
                                type="date"
                                value={getPeriodoColaborador(colaborador).fim}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'fim', e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">Sistema</Badge>
                      </TableCell>
                      <TableCell>
                        {colaboradoresSelecionados.includes(colaborador.id) && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleRemoverColaborador(colaborador.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            ×
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Colaboradores manuais */}
                  {colaboradoresManuais.map((colaborador) => (
                    <TableRow key={colaborador.id} className="bg-blue-50">
                      <TableCell>
                        <Checkbox
                          checked={colaboradoresSelecionados.includes(colaborador.id)}
                          onCheckedChange={(checked) => 
                            handleColaboradorChange(colaborador.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{colaborador.nome}</TableCell>
                      <TableCell>{colaborador.funcao}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {colaborador.empresa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <label className="text-xs font-medium">Data Início</label>
                              <Input
                                type="date"
                                value={getPeriodoColaborador(colaborador).inicio}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'inicio', e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                              <label className="text-xs font-medium">Data Fim</label>
                              <Input
                                type="date"
                                value={getPeriodoColaborador(colaborador).fim}
                                onChange={(e) => handlePeriodoChange(colaborador.id, 'fim', e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs">Manual</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoverColaborador(colaborador.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {colaboradoresSelecionados.length > 0 && (
                <Badge variant="outline" className="mt-2">
                  {colaboradoresSelecionados.length} colaborador(es) selecionado(s)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações e Anexos */}
        <Card>
          <CardHeader>
            <CardTitle>Observações e Anexos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <Textarea
                  placeholder="Informações adicionais sobre a hospedagem..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Anexos (Notas, Recibos, etc.) <span className="text-red-500">*</span>
                </label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingFile}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingFile ? 'Enviando arquivo...' : 'Clique para adicionar documentos ou arraste arquivos aqui'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG, DOC, DOCX (máx. 10MB por arquivo)
                    </p>
                  </label>
                </div>

                {/* Lista de Anexos */}
                {anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Arquivos Anexados:</p>
                    {anexos.map((anexo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm truncate">{anexo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVisualizarAnexo(anexo)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoverAnexo(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Badge variant="outline" className="mt-2">
                      {anexos.length} arquivo(s) anexado(s)
                    </Badge>
                  </div>
                )}

                {anexos.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    * Pelo menos um documento deve ser anexado
                  </p>
                )}
              </div>
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

        {/* Visualizador de PDF */}
        <PdfViewerModal 
          open={pdfOpen} 
          setOpen={setPdfOpen} 
          data={pdfData} 
          title={`Visualizar Anexo - ${pdfTitle}`} 
        />
      </div>
    </div>
  );
}