import { useState } from "react";
import { Users, UserCheck, UserX, CalendarOff, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dados mockados
const ccas = [
  { id: "CCA001", nome: "Obra Principal" },
  { id: "CCA002", nome: "Expansão Norte" },
  { id: "CCA003", nome: "Manutenção Sul" }
];

const dadosResumo = {
  mobilizados: 245,
  presentes: 198,
  faltas: 32,
  folgasCampo: 15
};

const classificacaoEfetivo = [
  { tipo: "MOD - Direta", mobilizado: 150, presente: 125 },
  { tipo: "MOI - Indireta", mobilizado: 45, presente: 38 },
  { tipo: "Terceiros", mobilizado: 50, presente: 35 }
];

const modPorDisciplina = [
  { disciplina: "Elétrica", mobilizado: 45, presente: 38, variacao7dias: "+3" },
  { disciplina: "Tubulação", mobilizado: 35, presente: 28, variacao7dias: "-2" },
  { disciplina: "Solda", mobilizado: 40, presente: 35, variacao7dias: "+1" },
  { disciplina: "Mecânica", mobilizado: 30, presente: 24, variacao7dias: "0" }
];

const terceiros = [
  { civil: "Construtora ABC", mobilizado: 25, presente: 18 },
  { civil: "Empresa XYZ", mobilizado: 15, presente: 12 },
  { civil: "Serviços DEF", mobilizado: 10, presente: 5 }
];

const ControleMaoObra = () => {
  const [ccaSelecionado, setCcaSelecionado] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");

  const resumoCards = [
    {
      title: "Mobilizados",
      value: dadosResumo.mobilizados,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Presentes",
      value: dadosResumo.presentes,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Faltas",
      value: dadosResumo.faltas,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Folgas de Campo",
      value: dadosResumo.folgasCampo,
      icon: CalendarOff,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const totalMobilizado = classificacaoEfetivo.reduce((sum, item) => sum + item.mobilizado, 0);
  const totalPresente = classificacaoEfetivo.reduce((sum, item) => sum + item.presente, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Mão de Obra</h1>
          <p className="text-muted-foreground">Acompanhamento de efetivo por tipo e disciplina</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="space-y-2">
            <Label htmlFor="cca-filter">CCA da Obra</Label>
            <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione o CCA" />
              </SelectTrigger>
              <SelectContent>
                {ccas.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id}>
                    {cca.id} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-filter">Data</Label>
            <Input
              id="data-filter"
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className="w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classificação do Efetivo */}
        <Card>
          <CardHeader>
            <CardTitle>Classificação do Efetivo</CardTitle>
            <CardDescription>Distribuição por tipo de mão de obra</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Mobilizado</TableHead>
                  <TableHead className="text-right">Presente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classificacaoEfetivo.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.tipo}</TableCell>
                    <TableCell className="text-right">{item.mobilizado}</TableCell>
                    <TableCell className="text-right">{item.presente}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* MOD por Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle>MOD por Disciplina</CardTitle>
            <CardDescription>Detalhamento por área técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-right">Mobilizado</TableHead>
                  <TableHead className="text-right">Presente</TableHead>
                  <TableHead className="text-right">Variação 7d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modPorDisciplina.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.disciplina}</TableCell>
                    <TableCell className="text-right">{item.mobilizado}</TableCell>
                    <TableCell className="text-right">{item.presente}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={item.variacao7dias.startsWith('+') ? 'default' : 
                                item.variacao7dias.startsWith('-') ? 'destructive' : 'secondary'}
                      >
                        {item.variacao7dias}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Terceiros */}
      <Card>
        <CardHeader>
          <CardTitle>Terceiros</CardTitle>
          <CardDescription>Empresas prestadoras de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Civil</TableHead>
                <TableHead className="text-right">Mobilizado</TableHead>
                <TableHead className="text-right">Presente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terceiros.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.civil}</TableCell>
                  <TableCell className="text-right">{item.mobilizado}</TableCell>
                  <TableCell className="text-right">{item.presente}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totais */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Totais (MOD + Terceiros + MOI)</CardTitle>
          <CardDescription>Consolidação geral do efetivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Mobilizado</p>
              <p className="text-2xl font-bold text-primary">{totalMobilizado}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Presente</p>
              <p className="text-2xl font-bold text-green-600">{totalPresente}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">% Presença</p>
              <p className="text-2xl font-bold text-foreground">
                {((totalPresente / totalMobilizado) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControleMaoObra;