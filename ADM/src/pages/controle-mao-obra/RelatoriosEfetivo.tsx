import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Mail, Filter, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useColaboradores } from '@/contexts/ColaboradoresContext';
import { useColaboradoresAbelvPJ } from '@/contexts/ColaboradoresAbelvPJContext';
import PreviewEmailEfetivo from '@/components/controle-mao-obra/PreviewEmailEfetivo';

interface ColaboradorRelatorio {
  id: string;
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
  empresa: string;
  tipo: 'Abelv' | 'Terceiro';
  cca_codigo?: string;
  cca_nome?: string;
}

const mockDisciplinas = ["Civil", "Elétrica", "Container", "Operadores", "Mecânica", "Instrumentação", "Tubulação", "Isolamento"];
const mockFuncoes = ["Ajudante", "Pedreiro", "Eletricista", "Encanador", "Operador", "Engenheira", "Técnico", "Coordenador", "Encarregado", "Montador"];

export default function RelatoriosEfetivo() {
  const { toast } = useToast();
  const { colaboradores: colaboradoresTerceiros } = useColaboradores();
  const { colaboradores: colaboradoresAbelv } = useColaboradoresAbelvPJ();
  const [ccaSelecionado, setCcaSelecionado] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');

  // Combinar colaboradores Abelv com Terceiros
  const todosColaboradores: ColaboradorRelatorio[] = [
    ...colaboradoresAbelv.map(col => ({
      ...col,
      tipo: 'Abelv' as const
    })),
    ...colaboradoresTerceiros.map(col => ({
      ...col,
      tipo: 'Terceiro' as const
    }))
  ];

  // Construir lista única de CCAs dinamicamente
  const ccasUnicos = Array.from(
    new Set([
      ...colaboradoresAbelv.map(c => c.cca_codigo),
      ...colaboradoresTerceiros.map(c => c.cca_codigo)
    ].filter(Boolean))
  ).sort();

  // Obter lista única de empresas
  const empresasUnicas = Array.from(new Set(todosColaboradores.map(c => c.empresa))).sort();

  const colaboradoresFiltrados = todosColaboradores.filter(col => {
    const matchCca = !ccaSelecionado || col.cca_codigo === ccaSelecionado;
    const matchEmpresa = !empresaSelecionada || col.empresa === empresaSelecionada;
    const matchDisciplina = !disciplinaSelecionada || col.disciplina === disciplinaSelecionada;
    const matchFuncao = !funcaoSelecionada || col.funcao === funcaoSelecionada;
    return matchCca && matchEmpresa && matchDisciplina && matchFuncao;
  });

  const totalAbelv = colaboradoresFiltrados.filter(c => c.tipo === 'Abelv').length;
  const totalTerceiros = colaboradoresFiltrados.filter(c => c.tipo === 'Terceiro').length;
  const totalGeral = colaboradoresFiltrados.length;

  const handleExportarExcel = () => {
    toast({
      title: "Exportando Excel",
      description: "Relatório consolidado sendo gerado..."
    });
  };

  const handleExportarPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "Relatório consolidado sendo gerado..."
    });
  };

  const handleEnviarEmail = () => {
    toast({
      title: "Enviando por e-mail",
      description: "Relatório será enviado para os destinatários cadastrados"
    });
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Relatórios de Efetivo</h1>
              <p className="text-muted-foreground">Consolidação de efetivo Abelv + Terceiros</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportarExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={handleExportarPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={handleEnviarEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Enviar por E-mail
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="relatorio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="relatorio">
              <FileText className="h-4 w-4 mr-2" />
              Relatório
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Visualização de Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="relatorio" className="space-y-6 mt-6">

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Obra/CCA</Label>
                <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as obras" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccasUnicos.map(cca => (
                      <SelectItem key={cca} value={cca}>{cca}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresasUnicas.map(emp => (
                      <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as disciplinas" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDisciplinas.map(disc => (
                      <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Função</Label>
                <Select value={funcaoSelecionada} onValueChange={setFuncaoSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as funções" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFuncoes.map(func => (
                      <SelectItem key={func} value={func}>{func}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Efetivo Abelv</CardDescription>
              <CardTitle className="text-3xl">{totalAbelv}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Efetivo Terceiros</CardDescription>
              <CardTitle className="text-3xl">{totalTerceiros}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Geral</CardDescription>
              <CardTitle className="text-3xl">{totalGeral}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatório Consolidado
            </CardTitle>
            <CardDescription>
              Listagem completa de colaboradores (Abelv + Terceiros)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Nome do colaborador</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradoresFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum colaborador encontrado com os filtros selecionados
                      </TableCell>
                    </TableRow>
                  ) : (
                    colaboradoresFiltrados.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell>
                          <Badge variant={colaborador.tipo === 'Abelv' ? 'default' : 'secondary'}>
                            {colaborador.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{colaborador.empresa}</TableCell>
                        <TableCell>{colaborador.nome}</TableCell>
                        <TableCell>{colaborador.funcao}</TableCell>
                        <TableCell>{colaborador.disciplina}</TableCell>
                        <TableCell>{colaborador.classificacao}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <PreviewEmailEfetivo
              cca={ccaSelecionado || "Todas as CCAs"}
              data={new Date().toLocaleDateString('pt-BR')}
              colaboradoresAbelv={colaboradoresFiltrados
                .filter(c => c.tipo === 'Abelv')
                .map(c => ({
                  nome: c.nome,
                  funcao: c.funcao,
                  disciplina: c.disciplina,
                  classificacao: c.classificacao
                }))}
              colaboradoresTerceiros={colaboradoresFiltrados
                .filter(c => c.tipo === 'Terceiro')
                .map(c => ({
                  nome: c.nome,
                  funcao: c.funcao,
                  disciplina: c.disciplina,
                  classificacao: c.classificacao,
                  empresa: c.empresa
                }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
