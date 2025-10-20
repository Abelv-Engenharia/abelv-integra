import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarDays, Building2, Users, CheckCircle, Clock, FileCheck } from "lucide-react";

const mockCcas = [
  { id: "24043", nome: "Obra São Paulo Centro" },
  { id: "24044", nome: "Obra Guarulhos" },
  { id: "24045", nome: "Obra Osasco" }
];

const mockAlojamentos = [
  { id: "A01", nome: "MOI 01 - Gerente", fornecedor: "Bruno Martins Moreira", capacidade: 12 },
  { id: "A02", nome: "MOD 01 - Operários", fornecedor: "Embu Mercearia", capacidade: 20 },
  { id: "A03", nome: "Técnicos", fornecedor: "Locações XYZ", capacidade: 8 }
];

const mockColaboradores = [
  { id: "1", nome: "Lara Cristinia", re: "12345", funcao: "Gerente", ativo: true },
  { id: "2", nome: "Nathalia Geovana", re: "12346", funcao: "Assistente", ativo: true },
  { id: "3", nome: "Patricia Silva", re: "12347", funcao: "Coordenador", ativo: false },
  { id: "4", nome: "João Santos", re: "12348", funcao: "Técnico", ativo: true },
  { id: "5", nome: "Maria Oliveira", re: "12349", funcao: "Auxiliar", ativo: true }
];

const mockAlocacoes = [
  {
    id: "1",
    alojamento: "MOI 01 - Gerente",
    colaboradores: ["Lara Cristinia", "Nathalia Geovana"],
    periodo_inicio: "2024-01-15",
    periodo_fim: "2024-12-31",
    status: "pendente",
    observacoes: "Aguardando validação administrativa"
  },
  {
    id: "2", 
    alojamento: "MOD 01 - Operários",
    colaboradores: ["João Santos", "Maria Oliveira"],
    periodo_inicio: "2024-02-01",
    periodo_fim: "2024-11-30",
    status: "validado",
    observacoes: ""
  }
];

export default function ValidacaoAlocacoes() {
  const [ccaSelecionado, setCcaSelecionado] = useState("");
  const [alojamentoSelecionado, setAlojamentoSelecionado] = useState("");
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<string[]>([]);
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleColaboradorToggle = (colaboradorId: string) => {
    setColaboradoresSelecionados(prev => 
      prev.includes(colaboradorId) 
        ? prev.filter(id => id !== colaboradorId)
        : [...prev, colaboradorId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
      case "validado":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Validado
        </Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validação de alocações</h1>
          <p className="text-muted-foreground">Validação administrativa de colaboradores em alojamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Nova Alocação */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Nova alocação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cca">Obra / Projeto (CCA) *</Label>
                  <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                    <SelectTrigger className={!ccaSelecionado ? "border-red-300 bg-red-50" : ""}>
                      <SelectValue placeholder="Selecione o CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCcas.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id}>
                          {cca.id} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alojamento">Alojamento *</Label>
                  <Select value={alojamentoSelecionado} onValueChange={setAlojamentoSelecionado}>
                    <SelectTrigger className={!alojamentoSelecionado ? "border-red-300 bg-red-50" : ""}>
                      <SelectValue placeholder="Selecione o alojamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAlojamentos.map((alojamento) => (
                        <SelectItem key={alojamento.id} value={alojamento.id}>
                          {alojamento.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lista de colaboradores</Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                  {mockColaboradores.map((colaborador) => (
                    <div key={colaborador.id} className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id={colaborador.id}
                        checked={colaboradoresSelecionados.includes(colaborador.id)}
                        onCheckedChange={() => handleColaboradorToggle(colaborador.id)}
                      />
                      <Label htmlFor={colaborador.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{colaborador.nome}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          RE: {colaborador.re} | {colaborador.funcao}
                        </span>
                        {colaborador.ativo && <Badge variant="secondary" className="ml-2 text-xs">Ativo</Badge>}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo-inicio">Período de ocupação - Início *</Label>
                  <Input
                    id="periodo-inicio"
                    type="date"
                    value={periodoInicio}
                    onChange={(e) => setPeriodoInicio(e.target.value)}
                    className={!periodoInicio ? "border-red-300 bg-red-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo-fim">Período de ocupação - Fim *</Label>
                  <Input
                    id="periodo-fim"
                    type="date"
                    value={periodoFim}
                    onChange={(e) => setPeriodoFim(e.target.value)}
                    className={!periodoFim ? "border-red-300 bg-red-50" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione observações sobre a alocação..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validar alocação
                </Button>
                <Button variant="outline">Limpar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Alojamento Selecionado */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Resumo do alojamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alojamentoSelecionado ? (
                <>
                  <div className="text-sm space-y-2">
                    <div><strong>Nome:</strong> MOI 01 - Gerente</div>
                    <div><strong>Capacidade:</strong> 12 pessoas</div>
                    <div><strong>Ocupação atual:</strong> 8 pessoas</div>
                    <div><strong>Disponível:</strong> 4 vagas</div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Colaboradores selecionados:</div>
                    {colaboradoresSelecionados.length > 0 ? (
                      <div className="space-y-1">
                        {colaboradoresSelecionados.map(id => {
                          const colaborador = mockColaboradores.find(c => c.id === id);
                          return (
                            <Badge key={id} variant="outline" className="text-xs">
                              {colaborador?.nome}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum colaborador selecionado</p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Selecione um alojamento para ver os detalhes</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de Alocações Existentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Alocações existentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alojamento</TableHead>
                <TableHead>Colaboradores</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAlocacoes.map((alocacao) => (
                <TableRow key={alocacao.id}>
                  <TableCell className="font-medium">{alocacao.alojamento}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {alocacao.colaboradores.map((nome, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {nome}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(alocacao.periodo_inicio).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(alocacao.periodo_fim).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(alocacao.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{alocacao.observacoes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      {alocacao.status === "pendente" && (
                        <Button size="sm">Validar</Button>
                      )}
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