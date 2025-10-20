import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, CheckCircle, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumoCCRObra from "@/components/ResumoCCRObra";

interface MedicaoAprovada {
  id: string;
  obra: string;
  obra_nome: string;
  empresa_transportadora: string;
  cnpj: string;
  competencia: string;
  periodo_inicio: string;
  periodo_fim: string;
  contrato_pedido: string;
  valor_base: number;
  descontos_glosas: number;
  valor_liquido: number;
  data_aprovacao: string;
}

interface LancamentoNF {
  id: string;
  medicao_id: string;
  fornecedor: string;
  cnpj: string;
  contrato_pedido: string;
  obra: string;
  natureza_conta: string;
  municipio_prestacao: string;
  periodo_inicio: string;
  periodo_fim: string;
  competencia: string;
  valor_base: number;
  descontos_glosas: number;
  valor_liquido: number;
  // Parâmetros Fiscais
  tipo_documento: string;
  cfop_codigo_servico: string;
  cst_csosn: string;
  aliquota_iss: number;
  retencao_iss: boolean;
  local_servico: string;
  observacoes_nf: string;
  // Checklist
  medicao_aprovada: boolean;
  anexos_presentes: boolean;
  parametrizacao_fiscal: boolean;
  cca_natureza: boolean;
  periodo_competencia: boolean;
  // Status
  situacao: string;
  data_criacao: string;
  usuario_criacao: string;
}

const mockMedicoesAprovadas: MedicaoAprovada[] = [
  {
    id: "1",
    obra: "24023",
    obra_nome: "BRAINFARMA - ITA",
    empresa_transportadora: "TRANSPORTE 1",
    cnpj: "12.345.678/0001-90",
    competencia: "09/2024",
    periodo_inicio: "2024-09-01",
    periodo_fim: "2024-09-15",
    contrato_pedido: "CTR-2024-001",
    valor_base: 3000.00,
    descontos_glosas: 0,
    valor_liquido: 2550.00,
    data_aprovacao: "2024-09-25"
  }
];

export default function BaseLancamentoNF() {
  const [medicoesAprovadas] = useState<MedicaoAprovada[]>(mockMedicoesAprovadas);
  const [filtros, setFiltros] = useState({
    obra: "all",
    competencia: "",
    fornecedor: "all",
    situacao: "all"
  });

  const [lancamento, setLancamento] = useState<Partial<LancamentoNF>>({
    medicao_id: "",
    fornecedor: "",
    cnpj: "",
    contrato_pedido: "",
    obra: "",
    natureza_conta: "",
    municipio_prestacao: "",
    periodo_inicio: "",
    periodo_fim: "",
    competencia: "",
    valor_base: 0,
    descontos_glosas: 0,
    valor_liquido: 0,
    tipo_documento: "",
    cfop_codigo_servico: "",
    cst_csosn: "",
    aliquota_iss: 0,
    retencao_iss: false,
    local_servico: "",
    observacoes_nf: "",
    medicao_aprovada: false,
    anexos_presentes: false,
    parametrizacao_fiscal: false,
    cca_natureza: false,
    periodo_competencia: false,
    situacao: "pendente"
  });

  const { toast } = useToast();

  const handleSelecionarMedicao = (medicao: MedicaoAprovada) => {
    setLancamento({
      ...lancamento,
      medicao_id: medicao.id,
      fornecedor: medicao.empresa_transportadora,
      cnpj: medicao.cnpj,
      contrato_pedido: medicao.contrato_pedido,
      obra: medicao.obra,
      periodo_inicio: medicao.periodo_inicio,
      periodo_fim: medicao.periodo_fim,
      competencia: medicao.competencia,
      valor_base: medicao.valor_base,
      descontos_glosas: medicao.descontos_glosas,
      valor_liquido: medicao.valor_liquido,
      medicao_aprovada: true
    });

    toast({
      title: "Medição Selecionada",
      description: `Dados da medição ${medicao.id} carregados com sucesso`
    });
  };

  const calcularRetencoes = () => {
    const valorBase = lancamento.valor_base || 0;
    return {
      inss: valorBase * 0.11, // 11%
      iss: valorBase * (lancamento.aliquota_iss || 0) / 100,
      irrf: valorBase * 0.015, // 1.5%
      pis_cofins_csll: valorBase * 0.0465 // 4.65%
    };
  };

  const validarChecklist = () => {
    return (
      lancamento.medicao_aprovada &&
      lancamento.anexos_presentes &&
      lancamento.parametrizacao_fiscal &&
      lancamento.cca_natureza &&
      lancamento.periodo_competencia
    );
  };

  const handleProntoParaLancar = () => {
    if (!validarChecklist()) {
      toast({
        title: "Erro",
        description: "Complete todos os itens do checklist antes de marcar como 'Pronto para Lançar'",
        variant: "destructive"
      });
      return;
    }

    setLancamento(prev => ({ ...prev, situacao: "pronto" }));
    toast({
      title: "Sucesso",
      description: "Base marcada como 'Pronta para Lançar'"
    });
  };

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>;
      case "pronto":
        return <Badge variant="default">Pronto para Lançar</Badge>;
      case "lancado":
        return <Badge className="bg-green-600">Lançado</Badge>;
      case "ajuste":
        return <Badge variant="destructive">Com Ajuste</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const retencoes = calcularRetencoes();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle Transporte - Gestão Matricial</h1>
          <p className="text-muted-foreground">Lançamentos NF e Resumo CCR da Obra</p>
        </div>
      </div>

      <Tabs defaultValue="lancamentos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lancamentos">Lançamentos – Integração Sienge</TabsTrigger>
          <TabsTrigger value="resumo-ccr">Resumo CCR da Obra</TabsTrigger>
        </TabsList>

        <TabsContent value="lancamentos" className="space-y-6">

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label>Competência (MM/AAAA) *</Label>
              <Input 
                value={filtros.competencia}
                onChange={(e) => setFiltros({...filtros, competencia: e.target.value})}
                placeholder="09/2024"
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
              <Label>Situação de Lançamento</Label>
              <Select value={filtros.situacao} onValueChange={(value) => setFiltros({...filtros, situacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pronto">Pronto para Lançar</SelectItem>
                  <SelectItem value="lancado">Lançado</SelectItem>
                  <SelectItem value="ajuste">Com Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medições Aprovadas Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Medições Aprovadas Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Transportadora</TableHead>
                <TableHead>Competência</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor Líquido</TableHead>
                <TableHead>Data Aprovação</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicoesAprovadas.map((medicao) => (
                <TableRow key={medicao.id}>
                  <TableCell>{medicao.obra} - {medicao.obra_nome}</TableCell>
                  <TableCell>{medicao.empresa_transportadora}</TableCell>
                  <TableCell>{medicao.competencia}</TableCell>
                  <TableCell>{medicao.periodo_inicio} - {medicao.periodo_fim}</TableCell>
                  <TableCell>R$ {medicao.valor_liquido.toFixed(2)}</TableCell>
                  <TableCell>{medicao.data_aprovacao}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleSelecionarMedicao(medicao)}>
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cabeçalho do Lançamento */}
      {lancamento.medicao_id && (
        <Card>
          <CardHeader>
            <CardTitle>Cabeçalho do Lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fornecedor / Transportadora *</Label>
                <Input value={lancamento.fornecedor} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>CNPJ *</Label>
                <Input value={lancamento.cnpj} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Nº Contrato / Pedido</Label>
                <Input value={lancamento.contrato_pedido} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Obra / CCA *</Label>
                <Input value={lancamento.obra} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Natureza/Conta de Despesa *</Label>
                <Select value={lancamento.natureza_conta} onValueChange={(value) => setLancamento({...lancamento, natureza_conta: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar natureza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5.1.2.01.001">5.1.2.01.001 - Transporte de Colaboradores</SelectItem>
                    <SelectItem value="5.1.2.01.002">5.1.2.01.002 - Transporte de Materiais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Município da Prestação *</Label>
                <Input 
                  value={lancamento.municipio_prestacao}
                  onChange={(e) => setLancamento({...lancamento, municipio_prestacao: e.target.value})}
                  placeholder="São Paulo/SP"
                />
              </div>

              <div className="space-y-2">
                <Label>Período de Prestação - Início *</Label>
                <Input value={lancamento.periodo_inicio} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Período de Prestação - Fim *</Label>
                <Input value={lancamento.periodo_fim} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Competência (MM/AAAA) *</Label>
                <Input value={lancamento.competencia} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consolidação de Valores */}
      {lancamento.medicao_id && (
        <Card>
          <CardHeader>
            <CardTitle>Consolidação de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Valor Base (R$)</Label>
                  <Input value={`R$ ${(lancamento.valor_base || 0).toFixed(2)}`} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Descontos/Glosas (R$)</Label>
                  <Input value={`R$ ${(lancamento.descontos_glosas || 0).toFixed(2)}`} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Valor Líquido (R$)</Label>
                  <Input value={`R$ ${(lancamento.valor_liquido || 0).toFixed(2)}`} disabled className="bg-muted font-bold" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Retenções Estimadas (informativo):</Label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">INSS (11%):</span>
                    <span className="text-sm">R$ {retencoes.inss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ISS:</span>
                    <span className="text-sm">R$ {retencoes.iss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">IRRF (1,5%):</span>
                    <span className="text-sm">R$ {retencoes.irrf.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">PIS/COFINS/CSLL (4,65%):</span>
                    <span className="text-sm">R$ {retencoes.pis_cofins_csll.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parâmetros Fiscais */}
      {lancamento.medicao_id && (
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros Fiscais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento *</Label>
                <Select value={lancamento.tipo_documento} onValueChange={(value) => setLancamento({...lancamento, tipo_documento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfe">NF-e</SelectItem>
                    <SelectItem value="nfse">NFS-e</SelectItem>
                    <SelectItem value="rps">RPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>CFOP / Código do Serviço *</Label>
                <Input 
                  value={lancamento.cfop_codigo_servico}
                  onChange={(e) => setLancamento({...lancamento, cfop_codigo_servico: e.target.value})}
                  placeholder="5.933"
                />
              </div>

              <div className="space-y-2">
                <Label>CST/CSOSN</Label>
                <Input 
                  value={lancamento.cst_csosn}
                  onChange={(e) => setLancamento({...lancamento, cst_csosn: e.target.value})}
                  placeholder="00"
                />
              </div>

              <div className="space-y-2">
                <Label>Alíquota ISS (%)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={lancamento.aliquota_iss}
                  onChange={(e) => setLancamento({...lancamento, aliquota_iss: Number(e.target.value)})}
                  placeholder="5.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Local do Serviço (Município/UF)</Label>
                <Input 
                  value={lancamento.local_servico}
                  onChange={(e) => setLancamento({...lancamento, local_servico: e.target.value})}
                  placeholder="São Paulo/SP"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="retencao_iss"
                  checked={lancamento.retencao_iss}
                  onCheckedChange={(checked) => setLancamento({...lancamento, retencao_iss: !!checked})}
                />
                <Label htmlFor="retencao_iss">Retenção ISS</Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Observações para a NF</Label>
                <Textarea 
                  value={lancamento.observacoes_nf}
                  onChange={(e) => setLancamento({...lancamento, observacoes_nf: e.target.value})}
                  placeholder="Observações que aparecerão na nota fiscal"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {lancamento.medicao_id && (
        <Card>
          <CardHeader>
            <CardTitle>Checklist antes do lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medicao_aprovada"
                  checked={lancamento.medicao_aprovada}
                  onCheckedChange={(checked) => setLancamento({...lancamento, medicao_aprovada: !!checked})}
                />
                <Label htmlFor="medicao_aprovada">✅ Medição Aprovada vinculada</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="anexos_presentes"
                  checked={lancamento.anexos_presentes}
                  onCheckedChange={(checked) => setLancamento({...lancamento, anexos_presentes: !!checked})}
                />
                <Label htmlFor="anexos_presentes">✅ Anexos obrigatórios presentes</Label>
                <Button variant="outline" size="sm" className="ml-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="parametrizacao_fiscal"
                  checked={lancamento.parametrizacao_fiscal}
                  onCheckedChange={(checked) => setLancamento({...lancamento, parametrizacao_fiscal: !!checked})}
                />
                <Label htmlFor="parametrizacao_fiscal">✅ Parametrização fiscal preenchida</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cca_natureza"
                  checked={lancamento.cca_natureza}
                  onCheckedChange={(checked) => setLancamento({...lancamento, cca_natureza: !!checked})}
                />
                <Label htmlFor="cca_natureza">✅ CCA/Natureza conferidos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="periodo_competencia"
                  checked={lancamento.periodo_competencia}
                  onCheckedChange={(checked) => setLancamento({...lancamento, periodo_competencia: !!checked})}
                />
                <Label htmlFor="periodo_competencia">✅ Período dentro da competência</Label>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div>{getSituacaoBadge(lancamento.situacao || "pendente")}</div>
              <div className="flex gap-2">
                {!validarChecklist() && (
                  <div className="flex items-center text-orange-600">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Complete o checklist</span>
                  </div>
                )}
                 {lancamento.situacao === "pendente" && (
                   <Button onClick={handleProntoParaLancar} disabled={!validarChecklist()}>
                     <CheckCircle className="w-4 h-4 mr-2" />
                     Marcar como Pronto
                   </Button>
                 )}
               </div>
             </div>
           </CardContent>
         </Card>
       )}
        </TabsContent>

        <TabsContent value="resumo-ccr">
          <ResumoCCRObra />
        </TabsContent>
      </Tabs>
    </div>
  );
}