import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Upload, Eye, Send, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EspelhoMedicaoTransporte from "@/components/controle-transporte/EspelhoMedicaoTransporte";

interface ItemMedicao {
  id: string;
  tipo_servico: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
  centro_custo: string;
  observacoes: string;
  anexos: string[];
}

interface MedicaoTransporte {
  id: string;
  obra: string;
  obra_nome: string;
  adm_responsavel: string;
  empresa_transportadora: string;
  cnpj: string;
  competencia: string;
  periodo_inicio: string;
  periodo_fim: string;
  contrato_pedido: string;
  observacoes_gerais: string;
  itens: ItemMedicao[];
  subtotal_itens: number;
  descontos_glosas: number;
  retencoes_impostos: number;
  total_geral: number;
  status: string;
  data_criacao: string;
  data_alteracao: string;
  usuario_alteracao: string;
}

const mockMedicoes: MedicaoTransporte[] = [
  {
    id: "1",
    obra: "24023",
    obra_nome: "BRAINFARMA - ITA",
    adm_responsavel: "Lucio Pirandel",
    empresa_transportadora: "TRANSPORTE 1",
    cnpj: "12.345.678/0001-90",
    competencia: "09/2024",
    periodo_inicio: "2024-09-01",
    periodo_fim: "2024-09-15",
    contrato_pedido: "CTR-2024-001",
    observacoes_gerais: "Medição mensal de setembro",
    itens: [
      {
        id: "1",
        tipo_servico: "Trajeto",
        descricao: "Fábrica → Hotel",
        unidade: "UN",
        quantidade: 20,
        valor_unitario: 150.00,
        subtotal: 3000.00,
        centro_custo: "CC001",
        observacoes: "Transporte regular",
        anexos: ["romaneio.pdf"]
      }
    ],
    subtotal_itens: 3000.00,
    descontos_glosas: 0,
    retencoes_impostos: 450.00,
    total_geral: 2550.00,
    status: "rascunho",
    data_criacao: "2024-09-20",
    data_alteracao: "2024-09-20",
    usuario_alteracao: "admin"
  }
];

export default function EspelhoDespesas() {
  const [medicoes] = useState<MedicaoTransporte[]>(mockMedicoes);
  const [filtros, setFiltros] = useState({
    obra: "all",
    periodo_inicio: "",
    periodo_fim: "",
    fornecedor: "all",
    situacao: "all"
  });
  
  const [medicaoAtual, setMedicaoAtual] = useState<MedicaoTransporte>({
    id: "",
    obra: "",
    obra_nome: "",
    adm_responsavel: "",
    empresa_transportadora: "",
    cnpj: "",
    competencia: "",
    periodo_inicio: "",
    periodo_fim: "",
    contrato_pedido: "",
    observacoes_gerais: "",
    itens: [
      {
        id: "1",
        tipo_servico: "",
        descricao: "",
        unidade: "UN",
        quantidade: 0,
        valor_unitario: 0,
        subtotal: 0,
        centro_custo: "",
        observacoes: "",
        anexos: []
      }
    ],
    subtotal_itens: 0,
    descontos_glosas: 0,
    retencoes_impostos: 0,
    total_geral: 0,
    status: "rascunho",
    data_criacao: new Date().toISOString().split('T')[0],
    data_alteracao: new Date().toISOString().split('T')[0],
    usuario_alteracao: "admin"
  });

  const [espelhoModalOpen, setEspelhoModalOpen] = useState(false);
  const [dadosEspelhoSelecionado, setDadosEspelhoSelecionado] = useState<any>(null);

  const { toast } = useToast();

  const tiposServico = [
    "Trajeto", 
    "Diária", 
    "Km Rodado", 
    "Hora Parada", 
    "Embarque/Desembarque", 
    "Pedágio", 
    "Estacionamento", 
    "Outros"
  ];

  const unidades = ["UN", "KM", "H", "DIÁRIA", "VALOR"];

  const calcularSubtotal = (quantidade: number, valorUnitario: number) => {
    return quantidade * valorUnitario;
  };

  const calcularTotalGeral = () => {
    const subtotal = medicaoAtual.itens.reduce((sum, item) => sum + item.subtotal, 0);
    return subtotal - medicaoAtual.descontos_glosas;
  };

  const handleItemChange = (index: number, field: keyof ItemMedicao, value: any) => {
    setMedicaoAtual(prev => {
      const novosItens = [...prev.itens];
      novosItens[index] = { ...novosItens[index], [field]: value };
      
      // Recalcular subtotal se quantidade ou valor unitário mudou
      if (field === 'quantidade' || field === 'valor_unitario') {
        novosItens[index].subtotal = calcularSubtotal(
          novosItens[index].quantidade,
          novosItens[index].valor_unitario
        );
      }
      
      const subtotal_itens = novosItens.reduce((sum, item) => sum + item.subtotal, 0);
      const total_geral = subtotal_itens - prev.descontos_glosas;
      
      return {
        ...prev,
        itens: novosItens,
        subtotal_itens,
        total_geral
      };
    });
  };

  const adicionarItem = () => {
    const novoIndex = medicaoAtual.itens.length + 1;
    setMedicaoAtual(prev => ({
      ...prev,
      itens: [...prev.itens, {
        id: novoIndex.toString(),
        tipo_servico: "",
        descricao: "",
        unidade: "UN",
        quantidade: 0,
        valor_unitario: 0,
        subtotal: 0,
        centro_custo: "",
        observacoes: "",
        anexos: []
      }]
    }));
  };

  const removerItem = (index: number) => {
    setMedicaoAtual(prev => {
      const novosItens = prev.itens.filter((_, i) => i !== index);
      const subtotal_itens = novosItens.reduce((sum, item) => sum + item.subtotal, 0);
      const total_geral = subtotal_itens - prev.descontos_glosas;
      
      return {
        ...prev,
        itens: novosItens,
        subtotal_itens,
        total_geral
      };
    });
  };

  const handleEnviarValidacao = () => {
    // Validações
    if (!medicaoAtual.obra || !medicaoAtual.empresa_transportadora || !medicaoAtual.competencia) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios do cabeçalho",
        variant: "destructive"
      });
      return;
    }

    const itensIncompletos = medicaoAtual.itens.some(item => 
      !item.tipo_servico || !item.descricao || item.quantidade <= 0 || item.valor_unitario <= 0
    );

    if (itensIncompletos) {
      toast({
        title: "Erro",
        description: "Todos os itens devem ter tipo de serviço, descrição, quantidade e valor unitário preenchidos",
        variant: "destructive"
      });
      return;
    }

    setMedicaoAtual(prev => ({ ...prev, status: "enviado" }));
    toast({
      title: "Sucesso",
      description: "Medição enviada para validação"
    });
  };

  const handleVisualizarEspelho = (medicao?: MedicaoTransporte) => {
    const dados = medicao || medicaoAtual;
    const dadosEspelho = {
      codigo_medicao: `T24.M${dados.id.padStart(2, '0')}`,
      obra: dados.obra,
      obra_nome: dados.obra_nome || "BRAINFARMA - ITA",
      adm_responsavel: dados.adm_responsavel,
      data: dados.data_alteracao,
      empresa: dados.empresa_transportadora,
      cnpj: dados.cnpj,
      periodo_inicio: dados.periodo_inicio,
      periodo_fim: dados.periodo_fim,
      trajetos: dados.itens.map(item => ({
        id: item.id,
        item: item.descricao,
        qtde: item.quantidade,
        unit: item.valor_unitario,
        total: item.subtotal,
        comentarios: item.observacoes
      }))
    };
    
    setDadosEspelhoSelecionado(dadosEspelho);
    setEspelhoModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rascunho":
        return <Badge variant="secondary">Rascunho</Badge>;
      case "enviado":
        return <Badge className="bg-yellow-600">Enviado</Badge>;
      case "aprovado":
        return <Badge variant="default">Aprovado</Badge>;
      case "reprovado":
        return <Badge variant="destructive">Reprovado</Badge>;
      case "fechado":
        return <Badge className="bg-gray-600">Fechado</Badge>;
      default:
        return <Badge variant="secondary">Rascunho</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espelho de Despesas - Medição de Transporte</h1>
          <p className="text-muted-foreground">Registrar e validar todas as despesas de transporte por obra/período</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Obra / Projeto (CCA) *</Label>
              <Select value={filtros.obra} onValueChange={(value) => setFiltros({...filtros, obra: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as obras</SelectItem>
                  <SelectItem value="24023">24023 - BRAINFARMA - ITA</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período Início *</Label>
              <Input 
                type="date" 
                value={filtros.periodo_inicio}
                onChange={(e) => setFiltros({...filtros, periodo_inicio: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Período Fim *</Label>
              <Input 
                type="date" 
                value={filtros.periodo_fim}
                onChange={(e) => setFiltros({...filtros, periodo_fim: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Fornecedor *</Label>
              <Select value={filtros.fornecedor} onValueChange={(value) => setFiltros({...filtros, fornecedor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  <SelectItem value="transporte1">TRANSPORTE 1</SelectItem>
                  <SelectItem value="van-express">Van Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Situação</Label>
              <Select value={filtros.situacao} onValueChange={(value) => setFiltros({...filtros, situacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="reprovado">Reprovado</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabeçalho do Espelho */}
      <Card>
        <CardHeader>
          <CardTitle>Cabeçalho da Medição de Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Obra / Projeto (CCA) *</Label>
              <Select value={medicaoAtual.obra} onValueChange={(value) => setMedicaoAtual({...medicaoAtual, obra: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24023">24023 - BRAINFARMA - ITA</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ADM Responsável *</Label>
              <Input 
                value={medicaoAtual.adm_responsavel}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, adm_responsavel: e.target.value})}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label>Empresa Transportadora *</Label>
              <Select value={medicaoAtual.empresa_transportadora} onValueChange={(value) => setMedicaoAtual({...medicaoAtual, empresa_transportadora: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar transportadora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSPORTE 1">TRANSPORTE 1</SelectItem>
                  <SelectItem value="Van Express">Van Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>CNPJ *</Label>
              <Input 
                value={medicaoAtual.cnpj}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <Label>Competência (MM/AAAA) *</Label>
              <Input 
                value={medicaoAtual.competencia}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, competencia: e.target.value})}
                placeholder="09/2024"
              />
            </div>

            <div className="space-y-2">
              <Label>Nº Contrato / Pedido</Label>
              <Input 
                value={medicaoAtual.contrato_pedido}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, contrato_pedido: e.target.value})}
                placeholder="CTR-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Período Início *</Label>
              <Input 
                type="date"
                value={medicaoAtual.periodo_inicio}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, periodo_inicio: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Período Fim *</Label>
              <Input 
                type="date"
                value={medicaoAtual.periodo_fim}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, periodo_fim: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Observações Gerais</Label>
              <Textarea 
                value={medicaoAtual.observacoes_gerais}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, observacoes_gerais: e.target.value})}
                placeholder="Observações sobre a medição"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Medição */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medição de Transporte</CardTitle>
            <Button onClick={adicionarItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Item</TableHead>
                  <TableHead>Tipo de Serviço *</TableHead>
                  <TableHead>Descrição *</TableHead>
                  <TableHead>Unid *</TableHead>
                  <TableHead>Qtde *</TableHead>
                  <TableHead>Valor Unit (R$) *</TableHead>
                  <TableHead>Subtotal (R$)</TableHead>
                  <TableHead>C.Custo</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Anexos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicaoAtual.itens.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell>
                      <Select value={item.tipo_servico} onValueChange={(value) => handleItemChange(index, 'tipo_servico', value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposServico.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.descricao}
                        onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                        placeholder="Ex: Fábrica → Hotel"
                        className="w-48"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={item.unidade} onValueChange={(value) => handleItemChange(index, 'unidade', value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {unidades.map(unidade => (
                            <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => handleItemChange(index, 'quantidade', Number(e.target.value))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number"
                        step="0.01"
                        value={item.valor_unitario}
                        onChange={(e) => handleItemChange(index, 'valor_unitario', Number(e.target.value))}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell className="font-bold">
                      R$ {item.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.centro_custo}
                        onChange={(e) => handleItemChange(index, 'centro_custo', e.target.value)}
                        placeholder="CC001"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={item.observacoes}
                        onChange={(e) => handleItemChange(index, 'observacoes', e.target.value)}
                        placeholder="Observações"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => removerItem(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totais e Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Totais e Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Subtotal Itens (R$)</Label>
              <Input value={`R$ ${medicaoAtual.subtotal_itens.toFixed(2)}`} disabled />
            </div>
            <div className="space-y-2">
              <Label>Descontos/Glosas (R$)</Label>
              <Input 
                type="number"
                step="0.01"
                value={medicaoAtual.descontos_glosas}
                onChange={(e) => setMedicaoAtual({...medicaoAtual, descontos_glosas: Number(e.target.value), total_geral: calcularTotalGeral()})}
              />
            </div>
            <div className="space-y-2">
              <Label>Retenções/Impostos (informativo)</Label>
              <Input value={`R$ ${medicaoAtual.retencoes_impostos.toFixed(2)}`} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Total Geral (R$)</Label>
              <Input value={`R$ ${medicaoAtual.total_geral.toFixed(2)}`} disabled className="font-bold" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              {getStatusBadge(medicaoAtual.status)}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleVisualizarEspelho()}>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar Espelho
              </Button>
              {medicaoAtual.status === "rascunho" && (
                <Button onClick={handleEnviarValidacao}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar para Validação
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Medições */}
      <Card>
        <CardHeader>
          <CardTitle>Medições Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Transportadora</TableHead>
                <TableHead>Competência</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Total (R$)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicoes.map((medicao) => (
                <TableRow key={medicao.id}>
                  <TableCell>{medicao.obra} - {medicao.obra_nome}</TableCell>
                  <TableCell>{medicao.empresa_transportadora}</TableCell>
                  <TableCell>{medicao.competencia}</TableCell>
                  <TableCell>{medicao.periodo_inicio} - {medicao.periodo_fim}</TableCell>
                  <TableCell>R$ {medicao.total_geral.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(medicao.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleVisualizarEspelho(medicao)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal do Espelho de Medição */}
      {dadosEspelhoSelecionado && (
        <EspelhoMedicaoTransporte
          isOpen={espelhoModalOpen}
          onClose={() => setEspelhoModalOpen(false)}
          dados={dadosEspelhoSelecionado}
        />
      )}
    </div>
  );
}