import { useState } from "react";
import { Calendar, Users, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisualizarFeriasModal } from "@/components/ferias/VisualizarFeriasModal";
import { EditarFeriasModal } from "@/components/ferias/EditarFeriasModal";
import { FeriasStatusBadge } from "@/components/ferias/FeriasStatusBadge";
import { ControleFérias, StatusFerias } from "@/types/ferias";
import { toast } from "@/hooks/use-toast";

export default function AprovacaoFerias() {
  const [visualizarModal, setVisualizarModal] = useState<{ aberto: boolean; ferias?: ControleFérias }>({ aberto: false });
  const [editarModal, setEditarModal] = useState<{ aberto: boolean; ferias?: ControleFérias }>({ aberto: false });
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPrestador, setFiltroPrestador] = useState("");

  // Mock data - seria substituído por dados reais do banco
  const mockFerias: ControleFérias[] = [
    {
      id: "1",
      nomePrestador: "João Silva",
      empresa: "Empresa ABC",
      funcaoCargo: "Operador",
      obraLocalAtuacao: "Obra Norte",
      dataInicioFerias: new Date("2024-01-15"),
      periodoAquisitivo: "2023/2024",
      diasFerias: 14,
      responsavelRegistro: "Maria RH",
      responsavelDireto: "Carlos Supervisor",
      status: StatusFerias.AGUARDANDO_APROVACAO,
      dataCriacao: new Date("2024-01-01"),
      dataUltimaAtualizacao: new Date("2024-01-01"),
      historicoStatus: []
    },
    {
      id: "2", 
      nomePrestador: "Ana Costa",
      empresa: "Empresa XYZ",
      funcaoCargo: "Técnica",
      obraLocalAtuacao: "Obra Sul",
      dataInicioFerias: new Date("2024-02-01"),
      periodoAquisitivo: "2023/2024",
      diasFerias: 21,
      responsavelRegistro: "Maria RH",
      responsavelDireto: "José Coordenador",
      status: StatusFerias.APROVADO,
      dataCriacao: new Date("2023-12-15"),
      dataUltimaAtualizacao: new Date("2024-01-05"),
      historicoStatus: []
    }
  ];

  const feriasEmAprovacao = mockFerias.filter(f => f.status === StatusFerias.AGUARDANDO_APROVACAO).length;
  const feriasAtivas = mockFerias.filter(f => f.status === StatusFerias.EM_FERIAS).length;
  const proximosInicios = mockFerias.filter(f => {
    const hoje = new Date();
    const inicio = new Date(f.dataInicioFerias);
    const diferenca = Math.ceil((inicio.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diferenca <= 7 && diferenca >= 0;
  }).length;

  const feriasFiltradas = mockFerias.filter(ferias => {
    const statusMatch = filtroStatus === "todos" || ferias.status === filtroStatus;
    const prestadorMatch = filtroPrestador === "" || 
      ferias.nomePrestador.toLowerCase().includes(filtroPrestador.toLowerCase());
    return statusMatch && prestadorMatch;
  });

  const handleAprovar = (id: string) => {
    console.log("Aprovando férias:", id);
    toast({
      title: "Férias aprovadas",
      description: "A solicitação de férias foi aprovada com sucesso."
    });
  };

  const handleReprovar = (id: string) => {
    console.log("Reprovando férias:", id);
    toast({
      title: "Férias reprovadas",
      description: "A solicitação de férias foi reprovada.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Aprovação de Férias</h1>
          <p className="text-muted-foreground">
            Gerenciar e aprovar solicitações de férias de prestadores de serviços
          </p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feriasEmAprovacao}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feriasAtivas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Inícios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proximosInicios}</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFerias.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por prestador..."
                value={filtroPrestador}
                onChange={(e) => setFiltroPrestador(e.target.value)}
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value={StatusFerias.SOLICITADO}>Solicitado</SelectItem>
                <SelectItem value={StatusFerias.AGUARDANDO_APROVACAO}>Aguardando Aprovação</SelectItem>
                <SelectItem value={StatusFerias.APROVADO}>Aprovado</SelectItem>
                <SelectItem value={StatusFerias.EM_FERIAS}>Em Férias</SelectItem>
                <SelectItem value={StatusFerias.CONCLUIDO}>Concluído</SelectItem>
                <SelectItem value={StatusFerias.REPROVADO}>Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de férias */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Férias</CardTitle>
          <CardDescription>
            Lista de todos os registros de férias dos prestadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prestador</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Obra/Local</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feriasFiltradas.map((ferias) => (
                <TableRow key={ferias.id}>
                  <TableCell className="font-medium">{ferias.nomePrestador}</TableCell>
                  <TableCell>{ferias.empresa}</TableCell>
                  <TableCell>{ferias.funcaoCargo}</TableCell>
                  <TableCell>{ferias.obraLocalAtuacao}</TableCell>
                  <TableCell>
                    {ferias.dataInicioFerias.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{ferias.diasFerias}</TableCell>
                  <TableCell>
                    <FeriasStatusBadge status={ferias.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVisualizarModal({ aberto: true, ferias })}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditarModal({ aberto: true, ferias })}
                      >
                        Editar
                      </Button>
                      {ferias.status === StatusFerias.AGUARDANDO_APROVACAO && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAprovar(ferias.id)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReprovar(ferias.id)}
                          >
                            Reprovar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modais */}
      {visualizarModal.ferias && (
        <VisualizarFeriasModal
          aberto={visualizarModal.aberto}
          ferias={visualizarModal.ferias}
          onFechar={() => setVisualizarModal({ aberto: false })}
        />
      )}

      {editarModal.ferias && (
        <EditarFeriasModal
          aberto={editarModal.aberto}
          ferias={editarModal.ferias}
          onFechar={() => setEditarModal({ aberto: false })}
        />
      )}
    </div>
  );
}
