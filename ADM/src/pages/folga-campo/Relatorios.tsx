import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileDown, Filter, FileText, AlertCircle, DollarSign, Users, Download, Plus } from "lucide-react";
import FormularioSolicitacao from "@/components/folga-campo/FormularioSolicitacao";

export default function RelatoriosFolgaCampo() {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroObra, setFiltroObra] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [modalFormularioAberto, setModalFormularioAberto] = useState(false);

  // Dados mock para demonstrar o formulário
  const colaboradorMock = {
    nome: "João Santos",
    matricula: "12345",
    funcao: "Técnico",
    obra: "CCA-001 - Obra Alpha",
    cca: "CCA-001",
    telefone: "(11) 99999-9999"
  };

  // Mock data para relatórios
  const pendentesFormularios = [
    {
      colaborador: "Ana Costa",
      matricula: "12348",
      obra: "Obra Alpha",
      dataFolga: "20/01/2024",
      diasPendentes: 5,
      responsavel: "Admin Obra A"
    },
    {
      colaborador: "Carlos Lima",
      matricula: "12349",
      obra: "Obra Beta", 
      dataFolga: "25/01/2024",
      diasPendentes: 3,
      responsavel: "Supervisor B"
    }
  ];

  const pendentesValores = [
    {
      colaborador: "João Silva",
      matricula: "12345",
      obra: "Obra Alpha",
      tipoValor: "Reembolso",
      valor: 850.00,
      diasPendentes: 12,
      status: "aguardando_comprovante"
    }
  ];

  const pendentesCompras = [
    {
      colaborador: "Maria Santos",
      matricula: "12346",
      obra: "Obra Beta",
      itinerario: "Brasília → Salvador", 
      dataViagem: "20/01/2024",
      diasSolicitacao: 8,
      fornecedor: "ONFLY"
    }
  ];

  const mapaFolgas = [
    {
      colaborador: "Pedro Costa",
      matricula: "12347", 
      obra: "Obra Gamma",
      periodo: "25/01/2024 - 10/02/2024",
      duracao: "16 dias",
      status: "aprovada",
      politica: "30/30"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Relatórios padrão de folgas e pendências</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={modalFormularioAberto} onOpenChange={setModalFormularioAberto}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Formulário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Formulário de Solicitação de Passagem</DialogTitle>
                <DialogDescription>
                  Demonstração do formulário automático com geração de PDF e integração
                </DialogDescription>
              </DialogHeader>
              <FormularioSolicitacao 
                colaborador={colaboradorMock}
                onSubmit={(dados) => {
                  console.log('Dados do formulário:', dados);
                  setModalFormularioAberto(false);
                }}
                onCancel={() => setModalFormularioAberto(false)}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros avançados
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar todos
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formulários pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendentesFormularios.length}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendentesValores.length}</div>
            <p className="text-xs text-muted-foreground">R$ {pendentesValores.reduce((acc, item) => acc + item.valor, 0).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendentesCompras.length}</div>
            <p className="text-xs text-muted-foreground">Solicitações abertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapaFolgas.length}</div>
            <p className="text-xs text-muted-foreground">Com folgas ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros dos Relatórios</CardTitle>
          <CardDescription>Aplique filtros para personalizar os relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="formularios">Formulários pendentes</SelectItem>
                  <SelectItem value="valores">Valores pendentes</SelectItem>
                  <SelectItem value="compras">Compras pendentes</SelectItem>
                  <SelectItem value="mapa">Mapa de folgas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger>
                  <SelectValue placeholder="Obra/Projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as obras</SelectItem>
                  <SelectItem value="Obra Alpha">Obra Alpha</SelectItem>
                  <SelectItem value="Obra Beta">Obra Beta</SelectItem>
                  <SelectItem value="Obra Gamma">Obra Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input 
                type="date"
                placeholder="Período"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pendentes de Formulários */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Pendentes de Recebimento de Formulários</CardTitle>
            <CardDescription>Colaboradores que não enviaram formulários de folga</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar XLSX
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Data da folga</TableHead>
                <TableHead>Dias pendentes</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendentesFormularios.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.colaborador}</TableCell>
                  <TableCell>{item.matricula}</TableCell>
                  <TableCell>{item.obra}</TableCell>
                  <TableCell>{item.dataFolga}</TableCell>
                  <TableCell>
                    <Badge variant={item.diasPendentes > 7 ? "destructive" : "secondary"}>
                      {item.diasPendentes} dias
                    </Badge>
                  </TableCell>
                  <TableCell>{item.responsavel}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Cobrar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pendentes de Valores */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Pendentes de Valores (Reembolso/Comprovação)</CardTitle>
            <CardDescription>Valores em aberto para reembolso ou aguardando comprovação</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Dias pendentes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendentesValores.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.colaborador}</TableCell>
                  <TableCell>{item.matricula}</TableCell>
                  <TableCell>{item.obra}</TableCell>
                  <TableCell>{item.tipoValor}</TableCell>
                  <TableCell className="font-medium">R$ {item.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.diasPendentes > 15 ? "destructive" : "secondary"}>
                      {item.diasPendentes} dias
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Processar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mapa de Folgas e Formulários de Passagem */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Folga por Colaborador/Obra/Período</CardTitle>
          <CardDescription>Visão geral das folgas e formulários de passagem</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status Folga</TableHead>
                <TableHead>Formulário PDF</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>João Santos</TableCell>
                <TableCell>CCA-001</TableCell>
                <TableCell>15/02/2024</TableCell>
                <TableCell><Badge>Aprovada</Badge></TableCell>
                <TableCell><Badge variant="outline">FSP-2024-A1B2C3</Badge></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}