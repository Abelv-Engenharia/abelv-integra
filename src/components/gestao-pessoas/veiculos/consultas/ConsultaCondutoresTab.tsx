import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, FileSpreadsheet, FileText, FileCheck } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { MultaCompleta } from "@/types/multa";

interface Condutor {
  id: string;
  nome?: string;
  nomeCondutor?: string;
  cpf: string;
  categoriaCnh: string;
  validadeCnh: Date;
  statusCnh: string;
  termoResponsabilidade?: string;
}

export function ConsultaCondutoresTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [condutores, setCondutores] = useState<Condutor[]>([]);
  const [multas, setMultas] = useState<MultaCompleta[]>([]);

  useEffect(() => {
    const dadosLocalStorage = localStorage.getItem("condutores");
    if (dadosLocalStorage) {
      setCondutores(JSON.parse(dadosLocalStorage));
    }
    
    const multasLocalStorage = localStorage.getItem("multas");
    if (multasLocalStorage) {
      setMultas(JSON.parse(multasLocalStorage));
    }
  }, []);

  const condutoresFiltrados = condutores.filter(condutor => {
    const matchBusca = busca === "" || 
      condutor.nome.toLowerCase().includes(busca.toLowerCase()) ||
      condutor.cpf.replace(/\D/g, "").includes(busca.replace(/\D/g, ""));
    
    const matchCategoria = filtroCategoria === "todos" || condutor.categoriaCnh === filtroCategoria;
    const matchStatus = filtroStatus === "todos" || condutor.statusCnh.toLowerCase() === filtroStatus;

    return matchBusca && matchCategoria && matchStatus;
  });

  const calcularPontuacaoCondutor = (nomeCondutor: string): number => {
    return multas
      .filter(multa => multa.condutorInfrator === nomeCondutor)
      .reduce((total, multa) => total + (multa.pontos || 0), 0);
  };

  const getStatusCnhBadge = (validadeCnh: Date) => {
    const diasRestantes = differenceInDays(new Date(validadeCnh), new Date());
    
    if (diasRestantes < 0) {
      return <Badge variant="destructive">Vencida</Badge>;
    } else if (diasRestantes <= 30) {
      return <Badge className="bg-yellow-500">Vencendo em {diasRestantes} dias</Badge>;
    } else {
      return <Badge variant="default">Válida</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros de Busca</CardTitle>
            <Button onClick={() => navigate("/cadastro-condutor")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Condutor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria CNH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status CNH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="válida">Válida</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Condutores Cadastrados ({condutoresFiltrados.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {condutoresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroCategoria !== "todos" || filtroStatus !== "todos"
                  ? "Nenhum condutor encontrado com os filtros aplicados."
                  : "Nenhum condutor cadastrado ainda."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/cadastro-condutor")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Condutor
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Categoria CNH</TableHead>
                    <TableHead>Validade CNH</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Status CNH</TableHead>
                    <TableHead>Termo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {condutoresFiltrados.map((condutor) => (
                    <TableRow key={condutor.id}>
                      <TableCell className="font-medium">{condutor.nome || condutor.nomeCondutor || "-"}</TableCell>
                      <TableCell className="font-mono">{condutor.cpf}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{condutor.categoriaCnh}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(condutor.validadeCnh), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        {(() => {
                          const pontuacaoTotal = calcularPontuacaoCondutor(
                            condutor.nome || condutor.nomeCondutor || ""
                          );
                          return (
                            <Badge 
                              variant={
                                pontuacaoTotal >= 20 ? "destructive" : 
                                pontuacaoTotal >= 10 ? "default" : 
                                "secondary"
                              }
                            >
                              {pontuacaoTotal} pts
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        {getStatusCnhBadge(new Date(condutor.validadeCnh))}
                      </TableCell>
                      <TableCell>
                        {condutor.termoResponsabilidade ? (
                          <Badge variant="default" className="gap-1">
                            <FileCheck className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
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
}