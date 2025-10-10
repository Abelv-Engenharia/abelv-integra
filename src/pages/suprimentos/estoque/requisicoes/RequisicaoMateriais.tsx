import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

interface Requisicao {
  id: string;
  requisitante: string;
  dataMovimento: Date;
  almoxarifado: string;
  apropriacao: string;
  observacao: string;
  status: string;
}

export default function RequisicaoMateriais() {
  const navigate = useNavigate();
  
  // Estados dos filtros
  const [filtros, setFiltros] = useState({
    cca: "",
    requisitante: "",
    dataMovimento: null as Date | null,
    almoxarifado: "",
    apropriacao: "",
    observacao: ""
  });

  // Dados mock das requisições
  const [requisicoes] = useState<Requisicao[]>([
    {
      id: "1",
      requisitante: "João",
      dataMovimento: new Date("2024-01-15"),
      almoxarifado: "Interno",
      apropriacao: "Projeto A",
      observacao: "Material urgente",
      status: "Pendente"
    },
    {
      id: "2",
      requisitante: "Carlos",
      dataMovimento: new Date("2024-01-14"),
      almoxarifado: "Externo",
      apropriacao: "Projeto B",
      observacao: "Verificar disponibilidade",
      status: "Aprovada"
    }
  ]);

  const filtrarRequisicoes = () => {
    // Aqui implementaria a lógica de filtro
    console.log("Aplicando filtros:", filtros);
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
              <Input
                id="cca"
                type="number"
                value={filtros.cca}
                onChange={(e) => setFiltros({...filtros, cca: e.target.value})}
                placeholder="Digite o CCA"
              />
            </div>

            {/* Requisitante */}
            <div className="space-y-2">
              <Label htmlFor="requisitante">
                Requisitante
              </Label>
              <Select value={filtros.requisitante} onValueChange={(value) => setFiltros({...filtros, requisitante: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o requisitante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="João">João</SelectItem>
                  <SelectItem value="Carlos">Carlos</SelectItem>
                  <SelectItem value="Marcos">Marcos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data do Movimento */}
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
                      !filtros.dataMovimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.dataMovimento ? format(filtros.dataMovimento, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filtros.dataMovimento || undefined}
                    onSelect={(date) => setFiltros({...filtros, dataMovimento: date || null})}
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
              <Select value={filtros.almoxarifado} onValueChange={(value) => setFiltros({...filtros, almoxarifado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interno">Interno</SelectItem>
                  <SelectItem value="Externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apropriação */}
            <div className="space-y-2">
              <Label htmlFor="apropriacao">
                Apropriação
              </Label>
              <Select value={filtros.apropriacao} onValueChange={(value) => setFiltros({...filtros, apropriacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a apropriação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Projeto A">Projeto A</SelectItem>
                  <SelectItem value="Projeto B">Projeto B</SelectItem>
                  <SelectItem value="Projeto C">Projeto C</SelectItem>
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
              <Button onClick={filtrarRequisicoes} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Filtrar
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
                  <TableHead>ID</TableHead>
                  <TableHead>Requisitante</TableHead>
                  <TableHead>Data movimento</TableHead>
                  <TableHead>Almoxarifado</TableHead>
                  <TableHead>Apropriação</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisicoes.map((requisicao) => (
                  <TableRow key={requisicao.id}>
                    <TableCell className="font-medium">{requisicao.id}</TableCell>
                    <TableCell>{requisicao.requisitante}</TableCell>
                    <TableCell>{format(requisicao.dataMovimento, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{requisicao.almoxarifado}</TableCell>
                    <TableCell>{requisicao.apropriacao}</TableCell>
                    <TableCell>{requisicao.observacao}</TableCell>
                    <TableCell>{requisicao.status}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
