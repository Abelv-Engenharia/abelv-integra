import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSearch, Eye, Download, Filter, Search, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/common/PageLoader";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { PermissionGuard } from "@/components/security/PermissionGuard";
import { AccessDenied } from "@/components/security/AccessDenied";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ConsultaInspecoesExtintores = () => {
  const navigate = useNavigate();
  const [inspecoes, setInspecoes] = useState<any[]>([]);
  const [filteredInspecoes, setFilteredInspecoes] = useState<any[]>([]);
  const [extintores, setExtintores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    dataInicio: null as Date | null,
    dataFim: null as Date | null,
    extintorId: "",
    status: "",
    temNaoConformidade: "",
    busca: ""
  });

  const loadInspecoes = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('inspecoes_extintores')
        .select(`
          *,
          extintores(codigo, tipo, localizacao),
          checklists_avaliacao(nome),
          profiles(nome)
        `)
        .order('created_at', { ascending: false });

      // Log para debug
      console.log('Query result:', { data, error });

      if (error) {
        console.error('Erro na query:', error);
        throw error;
      }

      // Validação defensiva
      if (data && Array.isArray(data)) {
        console.log(`${data.length} inspeções carregadas`);
        setInspecoes(data);
        setFilteredInspecoes(data);
      } else {
        console.warn('Dados inválidos retornados:', data);
        setInspecoes([]);
        setFilteredInspecoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de inspeções. Por favor, tente novamente.",
        variant: "destructive"
      });
      // Garantir que os estados fiquem vazios em caso de erro
      setInspecoes([]);
      setFilteredInspecoes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExtintores = async () => {
    try {
      const { data } = await supabase
        .from('extintores')
        .select('*')
        .eq('ativo', true)
        .order('codigo');
      
      if (data) {
        setExtintores(data);
      }
    } catch (error) {
      console.error('Erro ao carregar extintores:', error);
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

    // Filtro por extintor
    if (filtros.extintorId && filtros.extintorId !== "todos") {
      filtered = filtered.filter(i => 
        i.extintor_id === filtros.extintorId
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

    // Filtro por busca
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      filtered = filtered.filter(i => 
        i.extintores?.codigo?.toLowerCase().includes(termoBusca) ||
        i.extintores?.tipo?.toLowerCase().includes(termoBusca) ||
        i.extintores?.localizacao?.toLowerCase().includes(termoBusca) ||
        i.profiles?.nome?.toLowerCase().includes(termoBusca) ||
        i.observacoes?.toLowerCase().includes(termoBusca)
      );
    }

    setFilteredInspecoes(filtered);
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: null,
      dataFim: null,
      extintorId: "",
      status: "",
      temNaoConformidade: "",
      busca: ""
    });
    setFilteredInspecoes(inspecoes);
  };

  const excluirInspecao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inspecoes_extintores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Inspeção excluída com sucesso.",
      });

      // Recarregar lista
      loadInspecoes();
    } catch (error: any) {
      console.error('Erro ao excluir inspeção:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir a inspeção.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'concluida': 'default',
      'pendente': 'secondary',
      'cancelada': 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'outline'} className={status === 'concluida' ? 'bg-green-600 hover:bg-green-700' : ''}>
        {status === 'concluida' ? 'Concluída' : 
         status === 'pendente' ? 'Pendente' : 
         status === 'cancelada' ? 'Cancelada' : status}
      </Badge>
    );
  };

  const getConformidadeBadge = (temNaoConformidade: boolean) => {
    return (
      <Badge variant={temNaoConformidade ? 'destructive' : 'default'} className={!temNaoConformidade ? 'bg-green-600 hover:bg-green-700' : ''}>
        {temNaoConformidade ? 'Não Conforme' : 'Conforme'}
      </Badge>
    );
  };

  useEffect(() => {
    loadInspecoes();
    loadExtintores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, inspecoes]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PermissionGuard 
      requiredPermissions={['prevencao_incendio_consulta_inspecoes']}
      requireAdmin={false}
      fallback={<AccessDenied title="Acesso Negado" description="Você não tem permissão para consultar inspeções de extintores." />}
    >
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Consultar Inspeções de Extintores</h1>
          </div>
          <p className="text-muted-foreground">
            Consulte e gerencie as inspeções de extintores realizadas
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <DatePickerWithManualInput
                  value={filtros.dataInicio}
                  onChange={(date) => setFiltros(prev => ({ ...prev, dataInicio: date }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Fim</Label>
                <DatePickerWithManualInput
                  value={filtros.dataFim}
                  onChange={(date) => setFiltros(prev => ({ ...prev, dataFim: date }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Extintor</Label>
                <Select 
                  value={filtros.extintorId} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, extintorId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os extintores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os extintores</SelectItem>
                    {extintores.map((extintor) => (
                      <SelectItem key={extintor.id} value={extintor.id}>
                        {extintor.codigo} - {extintor.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={filtros.status} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conformidade</Label>
                <Select 
                  value={filtros.temNaoConformidade} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, temNaoConformidade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="nao">Conforme</SelectItem>
                    <SelectItem value="sim">Não Conforme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Busca</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, tipo, local..."
                    className="pl-8"
                    value={filtros.busca}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={aplicarFiltros}>
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>
              Inspeções Encontradas ({filteredInspecoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInspecoes.length === 0 ? (
              <div className="text-center py-8">
                <FileSearch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma inspeção encontrada</h3>
                <p className="text-muted-foreground">
                  Não há inspeções que correspondam aos filtros aplicados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Extintor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Localização</TableHead>
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
                          {format(new Date(inspecao.data_inspecao + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {inspecao.extintores?.codigo}
                        </TableCell>
                        <TableCell>
                          {inspecao.extintores?.tipo}
                        </TableCell>
                        <TableCell>
                          {inspecao.extintores?.localizacao}
                        </TableCell>
                        <TableCell>
                          {inspecao.profiles?.nome}
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
                              onClick={() => navigate(`/prevencao-incendio/inspecoes/${inspecao.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implementar download do relatório
                                toast({
                                  title: "Em desenvolvimento",
                                  description: "Funcionalidade de download em desenvolvimento.",
                                });
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta inspeção? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => excluirInspecao(inspecao.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
    </PermissionGuard>
  );
};

export default ConsultaInspecoesExtintores;