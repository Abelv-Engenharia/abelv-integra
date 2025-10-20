import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { 
  FileDown, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  Search,
  FileText,
  Users
} from "lucide-react";
import type { StatusColaborador, FiltrosMobilizacao } from "@/types/mobilizacao";
import StatusDocumentoBadge from "@/components/mobilizacao/StatusDocumentoBadge";
import ModalVisualizacaoDocumentos from "@/components/mobilizacao/ModalVisualizacaoDocumentos";
import GeradorZIPDocumentos from "@/components/mobilizacao/GeradorZIPDocumentos";

export default function RelatorioDocumentacaoMobilizacao() {
  const [colaboradores, setColaboradores] = useState<StatusColaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosMobilizacao>({
    obra_ids: [],
    status_doc: [],
    funcao: 'all',
    tipo_mo: 'all',
    situacao: 'all',
    validade_de: '',
    validade_ate: '',
    search: ''
  });
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<StatusColaborador | null>(null);
  const [modalDocumentosAberto, setModalDocumentosAberto] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lista de documentos conforme parametrização do checklist
  const tiposDocumentos = [
    'Contrato Experiência',
    'Ficha Registro',
    'Prorrogação Experiência',
    'Cartão SUS',
    'Carteira Vacinação',
    'Comprovante Endereço',
    'CTPS Digital',
    'Documentos Dependentes',
    'Histórico Escolar',
    'Documentos Pessoais',
    'Certificado Eletricista',
    'Certificado NR10',
    'Título Eleitor',
    'ASO',
    'Certidão Casamento'
  ];

  const colaboradoresMock: StatusColaborador[] = [
    {
      colaborador: {
        id: '1',
        nome: 'Jean Anderson Correia Sobrinho',
        re: '3910',
        cpf: '123.456.789-00',
        funcao: 'Encarregado Mecânico III',
        tipo_mo: 'MOD',
        status_funcional: 'em_mobilizacao',
        obra_id: '1',
        obra_nome: 'Nexa PDSR',
        obra_cca: 'CCA 023101',
        dt_admissao: '2025-01-15',
        dt_cadastro: '2025-01-10'
      },
      status_geral: 'com_pendencias',
      documentos: {
        'Contrato Experiência': { status: 'ok', validade: '2025-02-14', dias_restantes: 15 },
        'Ficha Registro': { status: 'ok', validade: '2025-01-21' },
        'Prorrogação Experiência': { status: 'nao_se_aplica' },
        'Cartão SUS': { status: 'ok', validade: '2025-01-18' },
        'Carteira Vacinação': { status: 'ok', validade: '2025-01-18' },
        'Comprovante Endereço': { status: 'ok', validade: '2025-01-18' },
        'CTPS Digital': { status: 'pendente' },
        'Documentos Dependentes': { status: 'ok', validade: '2025-01-18' },
        'Histórico Escolar': { status: 'ok', validade: '2025-01-18' },
        'Documentos Pessoais': { status: 'ok', validade: '2025-01-18' },
        'Certificado Eletricista': { status: 'nao_se_aplica' },
        'Certificado NR10': { status: 'nao_se_aplica' },
        'Título Eleitor': { status: 'ok', validade: '2025-01-18' },
        'ASO': { status: 'pendente', observacoes: 'Integrar com BRMED' },
        'Certidão Casamento': { status: 'ok', validade: '2025-01-18' }
      },
      total_pendencias: 2,
      total_vencidos: 0
    },
    {
      colaborador: {
        id: '2',
        nome: 'Maria Silva Santos',
        re: '4021',
        cpf: '987.654.321-00',
        funcao: 'Eletricista',
        tipo_mo: 'MOD',
        status_funcional: 'ativo',
        obra_id: '1',
        obra_nome: 'Nexa PDSR',
        obra_cca: 'CCA 023101',
        dt_admissao: '2025-02-01',
        dt_cadastro: '2025-01-28'
      },
      status_geral: 'apto',
      documentos: {
        'Contrato Experiência': { status: 'ok', validade: '2025-03-03', dias_restantes: 30 },
        'Ficha Registro': { status: 'ok', validade: '2025-02-07' },
        'Prorrogação Experiência': { status: 'nao_se_aplica' },
        'Cartão SUS': { status: 'ok', validade: '2025-02-04' },
        'Carteira Vacinação': { status: 'ok', validade: '2025-02-04' },
        'Comprovante Endereço': { status: 'ok', validade: '2025-02-04' },
        'CTPS Digital': { status: 'ok', validade: '2025-02-04' },
        'Documentos Dependentes': { status: 'nao_se_aplica' },
        'Histórico Escolar': { status: 'ok', validade: '2025-02-04' },
        'Documentos Pessoais': { status: 'ok', validade: '2025-02-04' },
        'Certificado Eletricista': { status: 'ok', validade: '2026-02-04', dias_restantes: 365 },
        'Certificado NR10': { status: 'ok', validade: '2026-02-04', dias_restantes: 365 },
        'Título Eleitor': { status: 'ok', validade: '2025-02-04' },
        'ASO': { status: 'ok', validade: '2025-02-04' },
        'Certidão Casamento': { status: 'nao_se_aplica' }
      },
      total_pendencias: 0,
      total_vencidos: 0
    },
    {
      colaborador: {
        id: '3',
        nome: 'Carlos Eduardo Mendes',
        re: '3856',
        cpf: '456.789.123-00',
        funcao: 'Técnico Segurança',
        tipo_mo: 'MOI',
        status_funcional: 'ativo',
        obra_id: '2',
        obra_nome: 'Projeto Alpha',
        obra_cca: 'CCA 024502',
        dt_admissao: '2025-01-20',
        dt_cadastro: '2025-01-15'
      },
      status_geral: 'vencido',
      documentos: {
        'Contrato Experiência': { status: 'ok', validade: '2025-02-19', dias_restantes: 20 },
        'Ficha Registro': { status: 'ok', validade: '2025-01-26' },
        'Prorrogação Experiência': { status: 'pendente', validade: '2025-03-11', observacoes: 'Prorrogação prevista' },
        'Cartão SUS': { status: 'vencido', validade: '2025-01-23', dias_restantes: -6 },
        'Carteira Vacinação': { status: 'ok', validade: '2025-01-23' },
        'Comprovante Endereço': { status: 'vencido', validade: '2025-01-23', dias_restantes: -6 },
        'CTPS Digital': { status: 'ok', validade: '2025-01-23' },
        'Documentos Dependentes': { status: 'ok', validade: '2025-01-23' },
        'Histórico Escolar': { status: 'ok', validade: '2025-01-23' },
        'Documentos Pessoais': { status: 'ok', validade: '2025-01-23' },
        'Certificado Eletricista': { status: 'nao_se_aplica' },
        'Certificado NR10': { status: 'nao_se_aplica' },
        'Título Eleitor': { status: 'ok', validade: '2025-01-23' },
        'ASO': { status: 'ok', validade: '2025-01-23' },
        'Certidão Casamento': { status: 'ok', validade: '2025-01-23' }
      },
      total_pendencias: 1,
      total_vencidos: 2
    }
  ];

  useEffect(() => {
    carregarColaboradores();
  }, [filtros, page]);

  const carregarColaboradores = async () => {
    setLoading(true);
    // Simula API call
    setTimeout(() => {
      setColaboradores(colaboradoresMock);
      setTotalPages(1);
      setLoading(false);
    }, 500);
  };

  const handleExportarZIP = async (colaborador: StatusColaborador) => {
    toast({
      title: "Gerando ZIP",
      description: `Preparando documentos de ${colaborador.colaborador.nome}...`
    });
    
    // Simula geração de ZIP
    setTimeout(() => {
      toast({
        title: "ZIP Gerado com Sucesso",
        description: `DOCS_${colaborador.colaborador.re}_${colaborador.colaborador.nome.replace(/\s+/g, '')}_${colaborador.colaborador.obra_cca}_${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}.zip`
      });
    }, 2000);
  };

  const handleVisualizarDocumentos = (colaborador: StatusColaborador) => {
    setColaboradorSelecionado(colaborador);
    setModalDocumentosAberto(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'apto': return 'bg-green-500';
      case 'com_pendencias': return 'bg-yellow-500';
      case 'vencido': return 'bg-red-500';
      case 'em_validacao': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'apto': return 'Apto';
      case 'com_pendencias': return 'Com Pendências';
      case 'vencido': return 'Vencido';
      case 'em_validacao': return 'Em Validação';
      default: return status;
    }
  };

  const totalizadores = {
    aptos: colaboradores.filter(c => c.status_geral === 'apto').length,
    pendentes: colaboradores.filter(c => c.status_geral === 'com_pendencias').length,
    vencidos: colaboradores.filter(c => c.status_geral === 'vencido').length,
    total: colaboradores.length
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col p-3 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Relatório de Documentação</h1>
            <p className="text-sm text-muted-foreground">Controle de documentos por colaborador</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{totalizadores.total}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Aptos</p>
                <p className="text-xl font-bold text-green-600">{totalizadores.aptos}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Com Pendências</p>
                <p className="text-xl font-bold text-yellow-600">{totalizadores.pendentes}</p>
              </div>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Vencidos</p>
                <p className="text-xl font-bold text-red-600">{totalizadores.vencidos}</p>
              </div>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-3">
          <div className="grid grid-cols-6 gap-2">
            <div className="space-y-1">
              <Label htmlFor="search" className="text-xs">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou RE..."
                  value={filtros.search}
                  onChange={(e) => setFiltros({...filtros, search: e.target.value})}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Obra/Projeto</Label>
              <Select value={filtros.obra_ids[0] || "all"} onValueChange={(value) => 
                setFiltros({...filtros, obra_ids: value === "all" ? [] : [value]})
              }>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Nexa PDSR</SelectItem>
                  <SelectItem value="2">Projeto Alpha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Status Geral</Label>
              <Select value={filtros.status_doc[0] || "all"} onValueChange={(value) => 
                setFiltros({...filtros, status_doc: value === "all" ? [] : [value]})
              }>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="apto">Apto</SelectItem>
                  <SelectItem value="com_pendencias">Com Pendências</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="em_validacao">Em Validação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Função</Label>
              <Select value={filtros.funcao || "all"} onValueChange={(value) => 
                setFiltros({...filtros, funcao: value === "all" ? "" : value})
              }>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Encarregado Mecânico III">Enc. Mecânico III</SelectItem>
                  <SelectItem value="Eletricista">Eletricista</SelectItem>
                  <SelectItem value="Técnico Segurança">Téc. Segurança</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tipo M.O.</Label>
              <Select value={filtros.tipo_mo || "all"} onValueChange={(value) => 
                setFiltros({...filtros, tipo_mo: value === "all" ? "" : value})
              }>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="MOD">MOD</SelectItem>
                  <SelectItem value="MOI">MOI</SelectItem>
                  <SelectItem value="terceiro">Terceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Situação</Label>
              <Select value={filtros.situacao || "all"} onValueChange={(value) => 
                setFiltros({...filtros, situacao: value === "all" ? "" : value})
              }>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="em_mobilizacao">Em Mobilização</SelectItem>
                  <SelectItem value="desmobilizado">Desmobilizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Tabela - Ocupa o resto da tela */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm">Colaboradores e Status dos Documentos</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="text-xs p-2 w-[140px]">Colaborador</TableHead>
                  <TableHead className="text-xs p-2 w-[60px]">RE</TableHead>
                  <TableHead className="text-xs p-2 w-[100px]">Obra/CCA</TableHead>
                  <TableHead className="text-xs p-2 w-[120px]">Função</TableHead>
                  <TableHead className="text-xs p-2 w-[70px]">Tipo M.O.</TableHead>
                  <TableHead className="text-xs p-2 w-[100px]">Status Geral</TableHead>
                  {tiposDocumentos.map(tipo => (
                    <TableHead key={tipo} className="text-center text-xs p-2 w-[80px]">
                      {tipo.length > 12 ? tipo.substring(0, 12) + '...' : tipo}
                    </TableHead>
                  ))}
                  <TableHead className="text-center text-xs p-2 w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tiposDocumentos.length + 7} className="text-center py-4 text-xs">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : colaboradores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tiposDocumentos.length + 7} className="text-center py-4 text-xs">
                      Nenhum colaborador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  colaboradores.map((item) => (
                    <TableRow key={item.colaborador.id} className="text-xs">
                      <TableCell className="p-2">
                        <div className="text-xs font-medium">{item.colaborador.nome}</div>
                      </TableCell>
                      <TableCell className="font-mono p-2 text-xs">{item.colaborador.re}</TableCell>
                      <TableCell className="p-2">
                        <div className="text-xs">{item.colaborador.obra_cca}</div>
                      </TableCell>
                      <TableCell className="p-2 text-xs">{item.colaborador.funcao}</TableCell>
                      <TableCell className="p-2">
                        <Badge variant="outline" className="text-xs px-1 py-0">{item.colaborador.tipo_mo}</Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge className={`${getStatusColor(item.status_geral)} text-white text-xs px-1 py-0`}>
                          {getStatusText(item.status_geral)}
                        </Badge>
                      </TableCell>
                      {tiposDocumentos.map(tipo => (
                        <TableCell key={tipo} className="text-center p-1">
                          <StatusDocumentoBadge 
                            documento={item.documentos[tipo]} 
                            tipo={tipo}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-center p-1">
                        <div className="flex justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleVisualizarDocumentos(item)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver documentos</TooltipContent>
                          </Tooltip>
                          
                          <GeradorZIPDocumentos colaborador={item} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Visualização de Documentos */}
        {colaboradorSelecionado && (
          <ModalVisualizacaoDocumentos
            colaborador={colaboradorSelecionado}
            open={modalDocumentosAberto}
            onOpenChange={setModalDocumentosAberto}
          />
        )}
      </div>
    </TooltipProvider>
  );
}