import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Bell, Eye, CheckCircle, Search, Calendar, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import type { AlertaMobilizacao } from "@/types/mobilizacao";

export default function AlertasMobilizacao() {
  const [alertas, setAlertas] = useState<AlertaMobilizacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroGravidade, setFiltroGravidade] = useState("all");
  const [filtroSituacao, setFiltroSituacao] = useState("all");
  const [filtroObra, setFiltroObra] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    carregarAlertas();
  }, [filtroGravidade, filtroSituacao, filtroObra]);

  const carregarAlertas = async () => {
    setLoading(true);
    
    // Mock data - simula carregamento de alertas
    setTimeout(() => {
      const alertasMock: AlertaMobilizacao[] = [
        {
          id: '1',
          colaborador_id: '1',
          colaborador_nome: 'Jean Anderson Correia',
          colaborador_re: '3910',
          obra_nome: 'Nexa PDSR',
          tipo_documento: 'CTPS Digital',
          situacao: 'pendente',
          gravidade: 'alta',
          dt_criacao: '2025-01-15'
        },
        {
          id: '2',
          colaborador_id: '2',
          colaborador_nome: 'Carlos Silva Santos',
          colaborador_re: '4521',
          obra_nome: 'Kinross Paracatu',
          tipo_documento: 'ASO',
          situacao: 'a_vencer',
          dias_para_vencimento: 3,
          validade: '2025-02-01',
          gravidade: 'critica',
          dt_criacao: '2025-01-16'
        },
        {
          id: '3',
          colaborador_id: '3',
          colaborador_nome: 'Marcos Antônio Lima',
          colaborador_re: '5632',
          obra_nome: 'Vale S11D',
          tipo_documento: 'Certificado NR10',
          situacao: 'vencido',
          validade: '2025-01-10',
          gravidade: 'critica',
          dt_criacao: '2025-01-17'
        },
        {
          id: '4',
          colaborador_id: '4',
          colaborador_nome: 'Roberto Costa Oliveira',
          colaborador_re: '6743',
          obra_nome: 'CSN UPV',
          tipo_documento: 'Carteira Vacinação',
          situacao: 'a_vencer',
          dias_para_vencimento: 5,
          validade: '2025-02-03',
          gravidade: 'media',
          dt_criacao: '2025-01-18'
        },
        {
          id: '5',
          colaborador_id: '5',
          colaborador_nome: 'Paulo Henrique Souza',
          colaborador_re: '7854',
          obra_nome: 'Nexa PDSR',
          tipo_documento: 'Contrato Experiência',
          situacao: 'a_vencer',
          dias_para_vencimento: 10,
          validade: '2025-02-08',
          gravidade: 'alta',
          dt_criacao: '2025-01-19'
        },
        {
          id: '6',
          colaborador_id: '6',
          colaborador_nome: 'Ana Paula Martins',
          colaborador_re: '8965',
          obra_nome: 'Vale S11D',
          tipo_documento: 'Comprovante Endereço',
          situacao: 'vencido',
          validade: '2025-01-20',
          gravidade: 'media',
          dt_criacao: '2025-01-20'
        }
      ];

      let filtrados = alertasMock;

      if (filtroGravidade !== "all") {
        filtrados = filtrados.filter(a => a.gravidade === filtroGravidade);
      }

      if (filtroSituacao !== "all") {
        filtrados = filtrados.filter(a => a.situacao === filtroSituacao);
      }

      if (filtroObra !== "all") {
        filtrados = filtrados.filter(a => a.obra_nome === filtroObra);
      }

      setAlertas(filtrados);
      setLoading(false);
    }, 800);
  };

  const handleEnviarNotificacao = (alertaId: string) => {
    toast.success("Notificação enviada com sucesso!");
  };

  const handleMarcarComoLido = (alertaId: string) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
    toast.success("Alerta marcado como resolvido!");
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'critica': return 'bg-red-600 text-white';
      case 'alta': return 'bg-red-500 text-white';
      case 'media': return 'bg-yellow-500 text-white';
      case 'baixa': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'vencido': return 'bg-red-600 text-white';
      case 'a_vencer': return 'bg-yellow-500 text-white';
      case 'pendente': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSituacaoText = (alerta: AlertaMobilizacao) => {
    switch (alerta.situacao) {
      case 'vencido':
        return `Vencido há ${Math.abs(Math.ceil((new Date().getTime() - new Date(alerta.validade!).getTime()) / (1000 * 60 * 60 * 24)))} dias`;
      case 'a_vencer':
        return `Vence em ${alerta.dias_para_vencimento} dias`;
      case 'pendente':
        return 'Pendente de envio';
      default:
        return alerta.situacao;
    }
  };

  const alertasFiltrados = alertas.filter(alerta => 
    searchTerm === "" || 
    alerta.colaborador_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alerta.colaborador_re.includes(searchTerm) ||
    alerta.tipo_documento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas de mobilização</h1>
          <p className="text-muted-foreground">
            Monitore documentos vencidos, a vencer e pendências críticas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, RE ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gravidade</label>
              <Select value={filtroGravidade} onValueChange={setFiltroGravidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as gravidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as gravidades</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Situação</label>
              <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as situações</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="a_vencer">A vencer</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Obra</label>
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as obras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as obras</SelectItem>
                  <SelectItem value="Nexa PDSR">Nexa PDSR</SelectItem>
                  <SelectItem value="Kinross Paracatu">Kinross Paracatu</SelectItem>
                  <SelectItem value="Vale S11D">Vale S11D</SelectItem>
                  <SelectItem value="CSN UPV">CSN UPV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasFiltrados.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertasFiltrados.filter(a => a.gravidade === 'critica').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertasFiltrados.filter(a => a.situacao === 'vencido').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A vencer</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alertasFiltrados.filter(a => a.situacao === 'a_vencer').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de alertas</CardTitle>
          <CardDescription>
            {alertasFiltrados.length} alertas encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Obra</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Gravidade</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertasFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum alerta encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    alertasFiltrados.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{alerta.colaborador_nome}</div>
                            <div className="text-sm text-muted-foreground">RE: {alerta.colaborador_re}</div>
                          </div>
                        </TableCell>
                        <TableCell>{alerta.obra_nome}</TableCell>
                        <TableCell>{alerta.tipo_documento}</TableCell>
                        <TableCell>
                          <Badge className={getSituacaoColor(alerta.situacao)}>
                            {getSituacaoText(alerta)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGravidadeColor(alerta.gravidade)}>
                            {alerta.gravidade.charAt(0).toUpperCase() + alerta.gravidade.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(alerta.dt_criacao).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEnviarNotificacao(alerta.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarcarComoLido(alerta.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}