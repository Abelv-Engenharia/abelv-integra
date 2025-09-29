
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Filter, Printer, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { exportDesviosToExcel } from "@/services/desvios/exportService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DesviosTable from "@/components/desvios/DesviosTable";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

// Mock data
const currentYear = new Date().getFullYear();

const DesviosConsulta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: userCCAs = [] } = useUserCCAs();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    month: "",
    cca: "",
    company: "",
    status: "",
    risk: "",
    disciplina: "",
    empresa: "",
    classificacao: "",
    tipo: "",
    evento: "",
    processo: "",
    baseLegal: "",
  });
  
  // Estados para dados dinâmicos da base de dados
  const [ccas, setCcas] = useState<Array<{codigo: string, nome: string, id: number}>>([]);
  const [empresas, setEmpresas] = useState<Array<{nome: string}>>([]);
  const [riskOptions, setRiskOptions] = useState<Array<{classificacao_risco: string}>>([]);
  const [disciplinas, setDisciplinas] = useState<Array<{nome: string}>>([]);
  const [tiposRegistro, setTiposRegistro] = useState<Array<{nome: string}>>([]);
  const [eventosIdentificados, setEventosIdentificados] = useState<Array<{nome: string}>>([]);
  const [processos, setProcessos] = useState<Array<{nome: string}>>([]);
  const [basesLegais, setBasesLegais] = useState<Array<{nome: string}>>([]);

  // Opções fixas de status padronizadas
  const statusOptions = [
    { status: "CONCLUÍDO" },
    { status: "EM ANDAMENTO" },
    { status: "PENDENTE" }
  ];

  // Aplicar filtros da URL quando a página carregar
  useEffect(() => {
    const applyUrlFilters = () => {
      const newFilters = { ...filters };
      
      // Aplicar filtros básicos da URL
      if (searchParams.get("year")) newFilters.year = searchParams.get("year")!;
      if (searchParams.get("month")) newFilters.month = searchParams.get("month")!;
      if (searchParams.get("cca")) newFilters.cca = searchParams.get("cca")!;
      
      // Aplicar filtros específicos dos gráficos
      if (searchParams.get("disciplina")) newFilters.disciplina = searchParams.get("disciplina")!;
      if (searchParams.get("empresa")) newFilters.empresa = searchParams.get("empresa")!;
      if (searchParams.get("classificacao")) newFilters.classificacao = searchParams.get("classificacao")!;
      if (searchParams.get("tipo")) newFilters.tipo = searchParams.get("tipo")!;
      if (searchParams.get("evento")) newFilters.evento = searchParams.get("evento")!;
      if (searchParams.get("processo")) newFilters.processo = searchParams.get("processo")!;
      if (searchParams.get("baseLegal")) newFilters.baseLegal = searchParams.get("baseLegal")!;
      
      setFilters(newFilters);
    };
    
    applyUrlFilters();
  }, [searchParams]);

  // Carregar dados da base de dados apenas com CCAs permitidos
  useEffect(() => {
    const loadFilterData = async () => {
      if (userCCAs.length === 0) return;
      
      try {
        // Buscar apenas CCAs que o usuário tem acesso
        const allowedCcaIds = userCCAs.map(cca => cca.id);
        
        // Usar os CCAs do usuário diretamente
        const userCcasFormatted = userCCAs.map(cca => ({
          codigo: cca.codigo,
          nome: cca.nome,
          id: cca.id
        }));
        setCcas(userCcasFormatted.sort((a, b) => a.codigo.localeCompare(b.codigo)));
        
        // Buscar empresas únicas apenas de desvios dos CCAs permitidos
        const { data: empresasData } = await supabase
          .from('desvios_completos')
          .select(`
            empresas!inner(nome)
          `)
          .in('cca_id', allowedCcaIds)
          .not('empresas.nome', 'is', null);
        
        // Buscar classificações de risco únicas apenas de desvios dos CCAs permitidos
        const { data: riskData } = await supabase
          .from('desvios_completos')
          .select('classificacao_risco')
          .in('cca_id', allowedCcaIds)
          .not('classificacao_risco', 'is', null);

        // Buscar disciplinas ativas
        const { data: disciplinasData } = await supabase
          .from('disciplinas')
          .select('nome')
          .eq('ativo', true);

        // Buscar tipos de registro ativos
        const { data: tiposData } = await supabase
          .from('tipos_registro')
          .select('nome')
          .eq('ativo', true);

        // Buscar eventos identificados ativos
        const { data: eventosData } = await supabase
          .from('eventos_identificados')
          .select('nome')
          .eq('ativo', true);

        // Buscar processos ativos
        const { data: processosData } = await supabase
          .from('processos')
          .select('nome')
          .eq('ativo', true);

        // Buscar bases legais ativas
        const { data: basesData } = await supabase
          .from('base_legal_opcoes')
          .select('nome')
          .eq('ativo', true);

        // Processar dados únicos
        if (empresasData) {
          const uniqueEmpresas = Array.from(new Set(
            empresasData.map((item: any) => item.empresas.nome)
          )).map(nome => ({ nome }));
          setEmpresas(uniqueEmpresas.sort((a, b) => a.nome.localeCompare(b.nome)));
        }

        if (riskData) {
          const uniqueRisk = Array.from(new Set(
            riskData.map((item: any) => item.classificacao_risco)
          )).map(classificacao_risco => ({ classificacao_risco }));
          setRiskOptions(uniqueRisk.sort((a, b) => a.classificacao_risco.localeCompare(b.classificacao_risco)));
        }

        // Processar disciplinas
        if (disciplinasData) {
          setDisciplinas(disciplinasData.sort((a, b) => a.nome.localeCompare(b.nome)));
        }

        // Processar tipos de registro
        if (tiposData) {
          setTiposRegistro(tiposData.sort((a, b) => a.nome.localeCompare(b.nome)));
        }

        // Processar eventos identificados
        if (eventosData) {
          setEventosIdentificados(eventosData.sort((a, b) => a.nome.localeCompare(b.nome)));
        }

        // Processar processos
        if (processosData) {
          setProcessos(processosData.sort((a, b) => a.nome.localeCompare(b.nome)));
        }

        // Processar bases legais
        if (basesData) {
          setBasesLegais(basesData.sort((a, b) => a.nome.localeCompare(b.nome)));
        }
      } catch (error) {
        console.error('Erro ao carregar dados dos filtros:', error);
      }
    };

    loadFilterData();
  }, [userCCAs]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      year: currentYear.toString(),
      month: "",
      cca: "",
      company: "",
      status: "",
      risk: "",
      disciplina: "",
      empresa: "",
      classificacao: "",
      tipo: "",
      evento: "",
      processo: "",
      baseLegal: "",
    };
    setFilters(clearedFilters);
    setSearchTerm("");
    // Limpar também os parâmetros da URL
    navigate("/desvios/consulta", { replace: true });
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  const handleExport = async () => {
    try {
      // Preparar filtros para exportação
      const exportFilters: any = {};
      
      // Aplicar filtros de data se selecionados
      if (filters.year) {
        if (filters.month && filters.month !== "todos") {
          // Mês específico
          const month = filters.month.padStart(2, '0');
          exportFilters.dataInicial = `${filters.year}-${month}-01`;
          const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
          const nextYear = parseInt(month) === 12 ? parseInt(filters.year) + 1 : parseInt(filters.year);
          exportFilters.dataFinal = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;
        } else {
          // Ano inteiro
          exportFilters.dataInicial = `${filters.year}-01-01`;
          exportFilters.dataFinal = `${parseInt(filters.year) + 1}-01-01`;
        }
      }
      
      // Aplicar filtro de CCA se selecionado
      if (filters.cca && filters.cca !== "todos") {
        const selectedCca = ccas.find(c => c.codigo === filters.cca);
        if (selectedCca) {
          exportFilters.ccaId = selectedCca.id.toString();
        }
      }
      
      // Aplicar restrições de CCAs do usuário
      const allowedCcaIds = userCCAs.map(cca => cca.id);
      exportFilters.allowedCcaIds = allowedCcaIds;
      
      // Aplicar outros filtros
      if (filters.company && filters.company !== "todas") {
        exportFilters.empresa = filters.company;
      }
      if (filters.status && filters.status !== "todos") {
        exportFilters.status = filters.status;
      }
      if (filters.risk && filters.risk !== "todos") {
        exportFilters.classificacaoRisco = filters.risk;
      }
      if (filters.disciplina && filters.disciplina !== "todas") {
        exportFilters.disciplina = filters.disciplina;
      }
      if (filters.tipo && filters.tipo !== "todos") {
        exportFilters.tipo = filters.tipo;
      }
      if (filters.evento && filters.evento !== "todos") {
        exportFilters.evento = filters.evento;
      }
      if (filters.processo && filters.processo !== "todos") {
        exportFilters.processo = filters.processo;
      }
      if (filters.baseLegal && filters.baseLegal !== "todas") {
        exportFilters.baseLegal = filters.baseLegal;
      }
      if (searchTerm) {
        exportFilters.searchTerm = searchTerm;
      }
      
      await exportDesviosToExcel(exportFilters);
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados para Excel com sucesso.",
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate("/desvios/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Dashboard
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Consulta de Desvios</h1>
        <p className="text-muted-foreground">
          Visualize, filtre e gerencie os desvios registrados no sistema.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar desvio..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={() => toast({ title: "Relatório gerado", description: "O relatório foi gerado com sucesso." })}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Filtros Avançados</CardTitle>
          <CardDescription>
            Refine sua busca por desvios utilizando vários critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="filter-year" className="text-sm font-medium">
                Ano
              </label>
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger id="filter-year">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 2).toString()}>{currentYear - 2}</SelectItem>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-month" className="text-sm font-medium">
                Mês
              </label>
              <Select
                value={filters.month}
                onValueChange={(value) => handleFilterChange("month", value)}
              >
                <SelectTrigger id="filter-month">
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-cca" className="text-sm font-medium">
                CCA
              </label>
              <Select
                value={filters.cca}
                onValueChange={(value) => handleFilterChange("cca", value)}
              >
                <SelectTrigger id="filter-cca">
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.codigo}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-company" className="text-sm font-medium">
                Empresa
              </label>
              <Select
                value={filters.company}
                onValueChange={(value) => handleFilterChange("company", value)}
              >
                <SelectTrigger id="filter-company">
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.nome} value={empresa.nome}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-status" className="text-sm font-medium">
                Status da Ação
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.status} value={status.status}>
                      {status.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-risk" className="text-sm font-medium">
                Nível de Risco
              </label>
              <Select
                value={filters.risk}
                onValueChange={(value) => handleFilterChange("risk", value)}
              >
                <SelectTrigger id="filter-risk">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {riskOptions.map((risk) => (
                    <SelectItem key={risk.classificacao_risco} value={risk.classificacao_risco}>
                      {risk.classificacao_risco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-disciplina" className="text-sm font-medium">
                Disciplina
              </label>
              <Select
                value={filters.disciplina}
                onValueChange={(value) => handleFilterChange("disciplina", value)}
              >
                <SelectTrigger id="filter-disciplina">
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.nome} value={disciplina.nome}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-tipo" className="text-sm font-medium">
                Tipo de Registro
              </label>
              <Select
                value={filters.tipo}
                onValueChange={(value) => handleFilterChange("tipo", value)}
              >
                <SelectTrigger id="filter-tipo">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {tiposRegistro.map((tipo) => (
                    <SelectItem key={tipo.nome} value={tipo.nome}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-evento" className="text-sm font-medium">
                Evento Identificado
              </label>
              <Select
                value={filters.evento}
                onValueChange={(value) => handleFilterChange("evento", value)}
              >
                <SelectTrigger id="filter-evento">
                  <SelectValue placeholder="Todos os eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {eventosIdentificados.map((evento) => (
                    <SelectItem key={evento.nome} value={evento.nome}>
                      {evento.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-processo" className="text-sm font-medium">
                Processo
              </label>
              <Select
                value={filters.processo}
                onValueChange={(value) => handleFilterChange("processo", value)}
              >
                <SelectTrigger id="filter-processo">
                  <SelectValue placeholder="Todos os processos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {processos.map((processo) => (
                    <SelectItem key={processo.nome} value={processo.nome}>
                      {processo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-base-legal" className="text-sm font-medium">
                Base Legal
              </label>
              <Select
                value={filters.baseLegal}
                onValueChange={(value) => handleFilterChange("baseLegal", value)}
              >
                <SelectTrigger id="filter-base-legal">
                  <SelectValue placeholder="Todas as bases legais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {basesLegais.map((base) => (
                    <SelectItem key={base.nome} value={base.nome}>
                      {base.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </CardFooter>
      </Card>

      {/* Deviations Table */}
      <DesviosTable filters={filters} searchTerm={searchTerm} />
    </div>
  );
};

export default DesviosConsulta;
