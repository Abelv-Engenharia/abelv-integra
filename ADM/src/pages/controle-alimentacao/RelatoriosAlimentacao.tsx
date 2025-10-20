import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Download, Filter, Settings, ClipboardCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockDados = {
  medicoes: [
    {
      id: "1",
      cca: "24043",
      obra: "Obra São Paulo Centro",
      fornecedor: "Restaurante Bom Apetite",
      periodo: "09/2024",
      tipo_refeicao: "Almoço",
      refeicoes: 1200,
      colaboradores: 60,
      valor: 18000.00,
      status: "validado"
    },
    {
      id: "2",
      cca: "24044",
      obra: "Obra Guarulhos",
      fornecedor: "Cantina Express", 
      periodo: "09/2024",
      tipo_refeicao: "Jantar",
      refeicoes: 800,
      colaboradores: 40,
      valor: 12000.00,
      status: "pendente"
    }
  ],
  notas_fiscais: [
    {
      id: "1",
      numero: "001234",
      fornecedor: "Restaurante Bom Apetite",
      valor: 18000.00,
      periodo: "09/2024",
      protocolo_sienge: "SGE-2024-001",
      status_integracao: "sucesso",
      data_integracao: "2024-10-01"
    }
  ],
  metas: [
    {
      id: "1",
      cca: "24043",
      fornecedor: "Restaurante Bom Apetite",
      periodo: "09/2024",
      meta_refeicoes: 1200,
      meta_valor: 18000.00,
      realizado_refeicoes: 1180,
      realizado_valor: 17700.00,
      percentual: 98.3
    }
  ],
  alertas: [
    {
      id: "1",
      cca: "24043",
      tipo: "Integração Sienge",
      descricao: "Falha na integração da NF 001234",
      status: "aberto",
      data: "2024-09-25"
    }
  ]
};

// Parâmetros de Alertas - Alimentação
const parametrosAlertasAlimentacao = [
  { parametro: "Nota fiscal não anexada", valor: "5 dias após medição", tipo: "Alerta" },
  { parametro: "Medição pendente aprovação", valor: "10 dias", tipo: "Temporal" },
  { parametro: "Custo acima do orçado", valor: "> 15%", tipo: "Crítico" },
  { parametro: "Documentação incompleta", valor: "3 dias", tipo: "Alerta" }
];

// Exigências - Alimentação
const exigenciasAlimentacao = [
  { exigencia: "Nota fiscal anexada", prazo: "Até 5 dias após serviço", status: "Ativo" },
  { exigencia: "Aprovação da medição", prazo: "Até 10 dias", status: "Ativo" },
  { exigencia: "Conferência de custos", prazo: "Antes do pagamento", status: "Ativo" },
  { exigencia: "Relatório mensal", prazo: "Até dia 3 do mês seguinte", status: "Ativo" }
];

export default function RelatoriosAlimentacao() {
  const [tipoRelatorio, setTipoRelatorio] = useState("medicoes");
  const [filtros, setFiltros] = useState({
    cca: "all",
    fornecedor: "all",
    periodo: "all",
    tipo_refeicao: "all",
    status: "all"
  });
  const { toast } = useToast();

  const handleExportar = (formato: "pdf" | "excel") => {
    toast({
      title: "Sucesso",
      description: `Relatório exportado em ${formato.toUpperCase()}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validado":
      case "sucesso":
        return <Badge variant="default">Validado</Badge>;
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>;
      case "erro":
        return <Badge variant="destructive">Erro</Badge>;
      case "aberto":
        return <Badge variant="destructive">Aberto</Badge>;
      case "resolvido":
        return <Badge variant="default">Resolvido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTabela = () => {
    switch (tipoRelatorio) {
      case "medicoes":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Refeições</TableHead>
                <TableHead>Colaboradores</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDados.medicoes.map((medicao) => (
                <TableRow key={medicao.id}>
                  <TableCell className="font-medium">{medicao.cca}</TableCell>
                  <TableCell>{medicao.obra}</TableCell>
                  <TableCell>{medicao.fornecedor}</TableCell>
                  <TableCell>{medicao.periodo}</TableCell>
                  <TableCell>{medicao.tipo_refeicao}</TableCell>
                  <TableCell>{medicao.refeicoes}</TableCell>
                  <TableCell>{medicao.colaboradores}</TableCell>
                  <TableCell>R$ {medicao.valor.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(medicao.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "notas_fiscais":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número NF</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Protocolo Sienge</TableHead>
                <TableHead>Status Integração</TableHead>
                <TableHead>Data Integração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDados.notas_fiscais.map((nf) => (
                <TableRow key={nf.id}>
                  <TableCell className="font-medium">{nf.numero}</TableCell>
                  <TableCell>{nf.fornecedor}</TableCell>
                  <TableCell>R$ {nf.valor.toFixed(2)}</TableCell>
                  <TableCell>{nf.periodo}</TableCell>
                  <TableCell>{nf.protocolo_sienge}</TableCell>
                  <TableCell>{getStatusBadge(nf.status_integracao)}</TableCell>
                  <TableCell>{nf.data_integracao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "metas":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Meta Refeições</TableHead>
                <TableHead>Meta Valor</TableHead>
                <TableHead>Realizado Refeições</TableHead>
                <TableHead>Realizado Valor</TableHead>
                <TableHead>% Atingimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDados.metas.map((meta) => (
                <TableRow key={meta.id}>
                  <TableCell className="font-medium">{meta.cca}</TableCell>
                  <TableCell>{meta.fornecedor}</TableCell>
                  <TableCell>{meta.periodo}</TableCell>
                  <TableCell>{meta.meta_refeicoes}</TableCell>
                  <TableCell>R$ {meta.meta_valor.toFixed(2)}</TableCell>
                  <TableCell>{meta.realizado_refeicoes}</TableCell>
                  <TableCell>R$ {meta.realizado_valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={meta.percentual >= 100 ? "default" : meta.percentual >= 80 ? "secondary" : "destructive"}>
                      {meta.percentual.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "alertas":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDados.alertas.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell className="font-medium">{alerta.cca}</TableCell>
                  <TableCell>{alerta.tipo}</TableCell>
                  <TableCell className="max-w-xs truncate">{alerta.descricao}</TableCell>
                  <TableCell>{getStatusBadge(alerta.status)}</TableCell>
                  <TableCell>{alerta.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return null;
    }
  };

  const getTituloRelatorio = () => {
    switch (tipoRelatorio) {
      case "medicoes":
        return "Relatório de Medições";
      case "notas_fiscais":
        return "Relatório de Notas Fiscais";
      case "metas":
        return "Atingimento de Metas";
      case "alertas":
        return "Painel de Alertas";
      default:
        return "Relatório";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Extração consolidada por obra, fornecedor e período</p>
        </div>
      </div>

      <Tabs defaultValue="relatorios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
        </TabsList>

        <TabsContent value="relatorios" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tipo de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant={tipoRelatorio === "medicoes" ? "default" : "outline"}
              onClick={() => setTipoRelatorio("medicoes")}
              className="justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Medições
            </Button>
            <Button 
              variant={tipoRelatorio === "notas_fiscais" ? "default" : "outline"}
              onClick={() => setTipoRelatorio("notas_fiscais")}
              className="justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notas Fiscais
            </Button>
            <Button 
              variant={tipoRelatorio === "metas" ? "default" : "outline"}
              onClick={() => setTipoRelatorio("metas")}
              className="justify-start"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metas
            </Button>
            <Button 
              variant={tipoRelatorio === "alertas" ? "default" : "outline"}
              onClick={() => setTipoRelatorio("alertas")}
              className="justify-start"
            >
              <Filter className="w-4 h-4 mr-2" />
              Alertas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Select value={filtros.cca} onValueChange={(value) => setFiltros({...filtros, cca: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Obra / CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.fornecedor} onValueChange={(value) => setFiltros({...filtros, fornecedor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  <SelectItem value="restaurante-bom-apetite">Restaurante Bom Apetite</SelectItem>
                  <SelectItem value="cantina-express">Cantina Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.periodo} onValueChange={(value) => setFiltros({...filtros, periodo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="09/2024">Setembro/2024</SelectItem>
                  <SelectItem value="08/2024">Agosto/2024</SelectItem>
                  <SelectItem value="07/2024">Julho/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.tipo_refeicao} onValueChange={(value) => setFiltros({...filtros, tipo_refeicao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Refeição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="almoco">Almoço</SelectItem>
                  <SelectItem value="jantar">Jantar</SelectItem>
                  <SelectItem value="cafe">Café da manhã</SelectItem>
                  <SelectItem value="lanche">Lanche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="validado">Validado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {getTituloRelatorio()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportar("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportar("excel")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderTabela()}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parâmetros de Alertas - Alimentação
              </CardTitle>
              <CardDescription>
                Configuração de alertas automáticos para o módulo de alimentação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parâmetro</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parametrosAlertasAlimentacao.map((param, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{param.parametro}</TableCell>
                        <TableCell>{param.valor}</TableCell>
                        <TableCell>
                          <Badge variant={
                            param.tipo === "Crítico" ? "destructive" : 
                            param.tipo === "Alerta" ? "secondary" : 
                            "default"
                          }>
                            {param.tipo}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Exigências - Alimentação
              </CardTitle>
              <CardDescription>
                Requisitos e prazos para o controle de alimentação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exigência</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exigenciasAlimentacao.map((exigencia, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{exigencia.exigencia}</TableCell>
                        <TableCell>{exigencia.prazo}</TableCell>
                        <TableCell>
                          <Badge variant="default">{exigencia.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
