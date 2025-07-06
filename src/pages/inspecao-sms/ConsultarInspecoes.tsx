import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSearch, Eye, Download, Filter, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/common/PageLoader";
import { useNavigate } from "react-router-dom";

const ConsultarInspecoes = () => {
  const navigate = useNavigate();
  const [inspecoes, setInspecoes] = useState<any[]>([]);
  const [filteredInspecoes, setFilteredInspecoes] = useState<any[]>([]);
  const [tiposInspecao, setTiposInspecao] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
    tipoInspecao: "",
    ccaId: "",
    status: "",
    temNaoConformidade: "",
    busca: ""
  });
  
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
      console.error('Erro ao carregar tipos de inspeção:', error);
    }
  };

  const loadInspecoes = async () => {
    try {
      setIsLoading(true);
      const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : [];
      
      let query = supabase
        .from('inspecoes_sms')
        .select(`
          *,
          modelos_inspecao_sms(
            nome,
            tipos_inspecao_sms(id, nome)
          ),
          profiles(nome),
          ccas(codigo, nome)
        `)
        .order('created_at', { ascending: false });

      if (ccaIds.length > 0) {
        query = query.in('cca_id', ccaIds);
      }

      const { data } = await query;

      if (data) {
        setInspecoes(data);
        setFilteredInspecoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...inspecoes];

    // Filtro por data
    if (filtros.dataInicio) {
      filtered = filtered.filter(i => 
        new Date(i.data_inspecao) >= filtros.dataInicio!
      );
    }

    if (filtros.dataFim) {
      filtered = filtered.filter(i => 
        new Date(i.data_inspecao) <= filtros.dataFim!
      );
    }

    // Filtro por tipo de inspeção
    if (filtros.tipoInspecao && filtros.tipoInspecao !== "todos") {
      filtered = filtered.filter(i => 
        i.modelos_inspecao_sms?.tipos_inspecao_sms?.id === filtros.tipoInspecao
      );
    }

    // Filtro por CCA
    if (filtros.ccaId && filtros.ccaId !== "todos") {
      filtered = filtered.filter(i => 
        i.cca_id?.toString() === filtros.ccaId
      );
    }

    // Filtro por status
    if (filtros.status && filtros.status !== "todos") {
      filtered = filtered.filter(i => i.status === filtros.status);
    }

    // Filtro por não conformidade
    if (filtros.temNaoConformidade && filtros.temNaoConformidade !== "todos") {
      const temNC = filtros.temNaoConformidade === "sim";
      filtered = filtered.filter(i => i.tem_nao_conformidade === temNC);
    }

    // Filtro por busca de texto
    if (filtros.busca.trim()) {
      const searchTerm = filtros.busca.toLowerCase();
      filtered = filtered.filter(i => 
        i.local?.toLowerCase().includes(searchTerm) ||
        i.modelos_inspecao_sms?.nome?.toLowerCase().includes(searchTerm) ||
        i.profiles?.nome?.toLowerCase().includes(searchTerm) ||
        i.ccas?.nome?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredInspecoes(filtered);
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: null,
      dataFim: null,
      tipoInspecao: "",
      ccaId: "",
      status: "",
      temNaoConformidade: "",
      busca: ""
    });
    setFilteredInspecoes(inspecoes);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'concluida': { label: 'Concluída', variant: 'default' as const },
      'em_andamento': { label: 'Em Andamento', variant: 'secondary' as const },
      'pendente': { label: 'Pendente', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
      { label: status, variant: 'outline' as const };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getConformidadeBadge = (temNaoConformidade: boolean) => {
    return (
      <Badge variant={temNaoConformidade ? "destructive" : "default"}>
        {temNaoConformidade ? "Não Conforme" : "Conforme"}
      </Badge>
    );
  };

  const handleViewInspecao = (inspecao: any) => {
    navigate(`/inspecao-sms/visualizar/${inspecao.id}`);
  };

  const handleDownloadPDF = async (inspecao: any) => {
    if (!inspecao.pdf_gerado_url) return;
    
    try {
      // Implementar download do PDF
      window.open(inspecao.pdf_gerado_url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  useEffect(() => {
    loadTiposInspecao();
  }, []);

  useEffect(() => {
    if (userCCAs.length >= 0) {
      loadInspecoes();
    }
  }, [userCCAs]);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, inspecoes]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="content-padding section-spacing">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
        <h1 className="heading-responsive">Consultar Inspeções SMS</h1>
      </div>

      {/* Filtros */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="form-grid">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Local, modelo, responsável..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Data Início</Label>
              <DatePickerWithManualInput
                value={filtros.dataInicio}
                onChange={(date) => setFiltros({...filtros, dataInicio: date})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Data Fim</Label>
              <DatePickerWithManualInput
                value={filtros.dataFim}
                onChange={(date) => setFiltros({...filtros, dataFim: date})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Tipo de Inspeção</Label>
              <Select value={filtros.tipoInspecao} onValueChange={(value) => setFiltros({...filtros, tipoInspecao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {tiposInspecao.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">CCA</Label>
              <Select value={filtros.ccaId} onValueChange={(value) => setFiltros({...filtros, ccaId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os CCAs</SelectItem>
                  {userCCAs.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Conformidade</Label>
              <Select value={filtros.temNaoConformidade} onValueChange={(value) => setFiltros({...filtros, temNaoConformidade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="sim">Não Conforme</SelectItem>
                  <SelectItem value="nao">Conforme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="button-group-end mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Inspeções Encontradas ({filteredInspecoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInspecoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-responsive">Nenhuma inspeção encontrada com os filtros aplicados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo/Modelo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Conformidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspecoes.map((inspecao) => (
                    <TableRow key={inspecao.id}>
                      <TableCell>
                        {format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {inspecao.modelos_inspecao_sms?.tipos_inspecao_sms?.nome || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {inspecao.modelos_inspecao_sms?.nome || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={inspecao.local}>
                        {inspecao.local}
                      </TableCell>
                      <TableCell>
                        {inspecao.ccas ? `${inspecao.ccas.codigo} - ${inspecao.ccas.nome}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {inspecao.profiles?.nome || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(inspecao.status)}
                      </TableCell>
                      <TableCell>
                        {getConformidadeBadge(inspecao.tem_nao_conformidade)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewInspecao(inspecao)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          {inspecao.pdf_gerado_url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(inspecao)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download PDF</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultarInspecoes;
