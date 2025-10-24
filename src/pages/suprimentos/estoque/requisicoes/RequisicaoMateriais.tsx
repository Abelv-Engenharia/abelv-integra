import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CalendarIcon, Search, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCCAs } from "@/hooks/useCCAs";
import { almoxarifadoService, type Almoxarifado } from "@/services/almoxarifadoService";
import { eapService, type EAPItem } from "@/services/eapService";
import { estoqueMovimentacoesSaidasService, type EstoqueMovimentacaoSaida } from "@/services/estoqueMovimentacoesSaidasService";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";

interface FiltrosState {
  cca: string;
  requisitante: string;
  dateRange: DateRange | undefined;
  almoxarifado: string;
  apropriacao: string;
  observacao: string;
}

export default function RequisicaoMateriais() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  
  // Estados dos filtros
  const [filtros, setFiltros] = useState<FiltrosState>({
    cca: "",
    requisitante: "",
    dateRange: undefined,
    almoxarifado: "",
    apropriacao: "",
    observacao: ""
  });

  // Estados para dados dinâmicos
  const [almoxarifados, setAlmoxarifados] = useState<Almoxarifado[]>([]);
  const [apropriacoes, setApropriacoes] = useState<EAPItem[]>([]);
  const [requisicoes, setRequisicoes] = useState<EstoqueMovimentacaoSaida[]>([]);
  const [isLoadingAlmoxarifados, setIsLoadingAlmoxarifados] = useState(false);
  const [isLoadingApropriacoes, setIsLoadingApropriacoes] = useState(false);
  const [isLoadingRequisicoes, setIsLoadingRequisicoes] = useState(false);

  // Carregar almoxarifados quando CCA for selecionado
  useEffect(() => {
    if (filtros.cca) {
      carregarAlmoxarifados(parseInt(filtros.cca));
      carregarApropriacoes(parseInt(filtros.cca));
    } else {
      setAlmoxarifados([]);
      setApropriacoes([]);
    }
    // Limpar seleções quando CCA mudar
    setFiltros(prev => ({ ...prev, almoxarifado: "", apropriacao: "" }));
  }, [filtros.cca]);

  const carregarAlmoxarifados = async (ccaId: number) => {
    setIsLoadingAlmoxarifados(true);
    try {
      const data = await almoxarifadoService.getByCCA(ccaId);
      setAlmoxarifados(data.filter(a => a.ativo));
    } catch (error) {
      console.error("Erro ao carregar almoxarifados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar almoxarifados"
      });
    } finally {
      setIsLoadingAlmoxarifados(false);
    }
  };

  const carregarApropriacoes = async (ccaId: number) => {
    setIsLoadingApropriacoes(true);
    try {
      const data = await eapService.getItemsByCCA(ccaId);
      setApropriacoes(data);
    } catch (error) {
      console.error("Erro ao carregar apropriações:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar apropriações (EAP)"
      });
    } finally {
      setIsLoadingApropriacoes(false);
    }
  };

  const filtrarRequisicoes = async () => {
    if (!filtros.almoxarifado) {
      toast({
        variant: "destructive",
        title: "Atenção",
        description: "Selecione um almoxarifado para buscar requisições"
      });
      return;
    }

    setIsLoadingRequisicoes(true);
    try {
      const data = await estoqueMovimentacoesSaidasService.getByAlmoxarifado(filtros.almoxarifado);
      
      // Aplicar filtros adicionais
      let dadosFiltrados = data;

      if (filtros.requisitante) {
        dadosFiltrados = dadosFiltrados.filter(r => 
          r.requisitante.toLowerCase().includes(filtros.requisitante.toLowerCase())
        );
      }

      if (filtros.dateRange?.from) {
        dadosFiltrados = dadosFiltrados.filter(r => {
          const dataMovimento = new Date(r.data_movimento);
          const dataInicio = filtros.dateRange!.from!;
          const dataFim = filtros.dateRange?.to || dataInicio;
          
          return dataMovimento >= dataInicio && dataMovimento <= dataFim;
        });
      }

      if (filtros.apropriacao) {
        dadosFiltrados = dadosFiltrados.filter(r => r.apropriacao_id === filtros.apropriacao);
      }

      if (filtros.observacao) {
        dadosFiltrados = dadosFiltrados.filter(r => 
          r.observacao?.toLowerCase().includes(filtros.observacao.toLowerCase())
        );
      }

      setRequisicoes(dadosFiltrados);
    } catch (error) {
      console.error("Erro ao buscar requisições:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar requisições"
      });
    } finally {
      setIsLoadingRequisicoes(false);
    }
  };

  const editarRequisicao = (id: string) => {
    navigate(`/suprimentos/estoque/requisicoes/editar/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Requisição de Materiais</h1>
          <p className="text-muted-foreground">
            Solicitação de materiais do estoque
          </p>
        </div>
        <Button onClick={() => navigate("/suprimentos/estoque/requisicoes/nova-requisicao")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Requisição
        </Button>
      </div>

      {/* Card de Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CCA */}
            <div className="space-y-2">
              <Label htmlFor="cca">
                CCA
              </Label>
              <Select value={filtros.cca} onValueChange={(value) => setFiltros({...filtros, cca: value})} disabled={isLoadingCcas}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas?.map((ccaItem) => (
                    <SelectItem key={ccaItem.id} value={ccaItem.id.toString()}>
                      {ccaItem.codigo} - {ccaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Requisitante */}
            <div className="space-y-2">
              <Label htmlFor="requisitante">
                Requisitante
              </Label>
              <Input
                id="requisitante"
                value={filtros.requisitante}
                onChange={(e) => setFiltros({...filtros, requisitante: e.target.value})}
                placeholder="Digite o nome do requisitante"
              />
            </div>

            {/* Data do Movimento - Range */}
            <div className="space-y-2">
              <Label>
                Data do movimento
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filtros.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.dateRange?.from ? (
                      filtros.dateRange.to ? (
                        <>
                          {format(filtros.dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(filtros.dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(filtros.dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      "Selecione o período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filtros.dateRange}
                    onSelect={(range) => setFiltros({...filtros, dateRange: range})}
                    numberOfMonths={2}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Almoxarifado */}
            <div className="space-y-2">
              <Label htmlFor="almoxarifado">
                Almoxarifado
              </Label>
              <Select 
                value={filtros.almoxarifado} 
                onValueChange={(value) => setFiltros({...filtros, almoxarifado: value})}
                disabled={!filtros.cca || isLoadingAlmoxarifados}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !filtros.cca ? "Selecione primeiro um CCA" :
                    isLoadingAlmoxarifados ? "Carregando..." :
                    almoxarifados.length === 0 ? "Nenhum almoxarifado encontrado" :
                    "Selecione o almoxarifado"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {almoxarifados.map((almox) => (
                    <SelectItem key={almox.id} value={almox.id}>
                      {almox.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Apropriação */}
            <div className="space-y-2">
              <Label htmlFor="apropriacao">
                Apropriação
              </Label>
              <Select 
                value={filtros.apropriacao} 
                onValueChange={(value) => setFiltros({...filtros, apropriacao: value})}
                disabled={!filtros.cca || isLoadingApropriacoes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !filtros.cca ? "Selecione primeiro um CCA" :
                    isLoadingApropriacoes ? "Carregando..." :
                    apropriacoes.length === 0 ? "Nenhuma apropriação encontrada" :
                    "Selecione a apropriação"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {apropriacoes.map((eap) => (
                    <SelectItem key={eap.id} value={eap.id}>
                      {eap.codigo} - {eap.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observação */}
            <div className="space-y-2">
              <Label htmlFor="observacao">
                Observação
              </Label>
              <Input
                id="observacao"
                value={filtros.observacao}
                onChange={(e) => setFiltros({...filtros, observacao: e.target.value})}
                placeholder="Digite a observação"
              />
            </div>

            {/* Botão Filtrar */}
            <div className="flex items-end">
              <Button 
                onClick={filtrarRequisicoes} 
                className="w-full"
                disabled={isLoadingRequisicoes}
              >
                <Search className="mr-2 h-4 w-4" />
                {isLoadingRequisicoes ? "Buscando..." : "Filtrar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card da Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Requisições Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Requisitante</TableHead>
                  <TableHead>Data movimento</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {isLoadingRequisicoes ? "Carregando..." : "Nenhuma requisição encontrada. Use os filtros acima para buscar."}
                    </TableCell>
                  </TableRow>
                ) : (
                  requisicoes.map((requisicao) => (
                    <TableRow key={requisicao.id}>
                      <TableCell className="font-medium">{requisicao.numero}</TableCell>
                      <TableCell>{requisicao.requisitante}</TableCell>
                      <TableCell>{format(new Date(requisicao.data_movimento), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{requisicao.observacao || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editarRequisicao(requisicao.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
