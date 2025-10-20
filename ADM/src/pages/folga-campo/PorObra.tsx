import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileDown, Send } from "lucide-react";

export default function PorObraFolgaCampo() {
  const [filtroObra, setFiltroObra] = useState("");
  const [filtroCCA, setFiltroCCA] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // Mock data
  const obras = ["Obra Alpha", "Obra Beta", "Obra Gamma"];
  const ccas = ["CCA-001", "CCA-002", "CCA-003"];
  
  const folgasPorObra = [
    {
      id: 1,
      colaborador: "João Silva",
      matricula: "12345",
      obra: "Obra Alpha",
      cca: "CCA-001",
      periodo: "15/01/2024 - 30/01/2024",
      status: "aprovada",
      passagem: "comprada",
      responsavel: "Admin Obra A"
    },
    {
      id: 2,
      colaborador: "Maria Santos",
      matricula: "12346", 
      obra: "Obra Beta",
      cca: "CCA-002",
      periodo: "20/01/2024 - 05/02/2024",
      status: "pendente",
      passagem: "solicitada",
      responsavel: "Supervisor B"
    },
    {
      id: 3,
      colaborador: "Pedro Costa",
      matricula: "12347",
      obra: "Obra Gamma", 
      cca: "CCA-003",
      periodo: "25/01/2024 - 10/02/2024",
      status: "em_analise",
      passagem: "em_compra",
      responsavel: "Engenheiro C"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      aprovada: { variant: "default" as const, label: "Aprovada" },
      pendente: { variant: "destructive" as const, label: "Pendente" },
      em_analise: { variant: "secondary" as const, label: "Em análise" }
    };
    const config = variants[status as keyof typeof variants] || variants.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPassagemBadge = (status: string) => {
    const variants = {
      comprada: { variant: "default" as const, label: "Comprada" },
      solicitada: { variant: "destructive" as const, label: "Solicitada" },
      em_compra: { variant: "secondary" as const, label: "Em compra" }
    };
    const config = variants[status as keyof typeof variants] || variants.solicitada;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folgas por Obra</h1>
          <p className="text-muted-foreground">Controle de folgas organizadas por centro de custo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Enviar lembretes
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as folgas por obra, CCA ou status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as obras</SelectItem>
                  {obras.map(obra => (
                    <SelectItem key={obra} value={obra}>{obra}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroCCA} onValueChange={setFiltroCCA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os CCAs</SelectItem>
                  {ccas.map(cca => (
                    <SelectItem key={cca} value={cca}>{cca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status da folga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_analise">Em análise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário de Folgas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendário de Folgas
          </CardTitle>
          <CardDescription>Visualização das folgas por período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Calendário visual será implementado aqui</p>
            <p className="text-sm text-muted-foreground mt-2">Mostrará folgas por mês com cores por status</p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Folgas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Folgas</CardTitle>
          <CardDescription>Todas as folgas organizadas por obra</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Obra/CCA</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Passagem</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folgasPorObra.map((folga) => (
                <TableRow key={folga.id}>
                  <TableCell className="font-medium">{folga.colaborador}</TableCell>
                  <TableCell>{folga.matricula}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{folga.obra}</div>
                      <div className="text-sm text-muted-foreground">{folga.cca}</div>
                    </div>
                  </TableCell>
                  <TableCell>{folga.periodo}</TableCell>
                  <TableCell>{getStatusBadge(folga.status)}</TableCell>
                  <TableCell>{getPassagemBadge(folga.passagem)}</TableCell>
                  <TableCell>{folga.responsavel}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Detalhes</Button>
                      <Button variant="outline" size="sm">Lembrete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}