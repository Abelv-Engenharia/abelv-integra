import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, AlertTriangle, ClipboardCheck } from 'lucide-react';

// Mock data
const mockRelatorioPorObra = [
  {
    obra: "CCA 001 - Projeto Alpha",
    contratosAnexados: 3,
    vistoriasPendentes: 2,
    vistoriasAtraso: 0,
    alertasAtivos: 2,
    alertasResolvidos: 1
  },
  {
    obra: "CCA 002 - Projeto Beta",
    contratosAnexados: 2,
    vistoriasPendentes: 1,
    vistoriasAtraso: 1,
    alertasAtivos: 2,
    alertasResolvidos: 0
  },
  {
    obra: "CCA 003 - Projeto Gamma",
    contratosAnexados: 4,
    vistoriasPendentes: 0,
    vistoriasAtraso: 0,
    alertasAtivos: 0,
    alertasResolvidos: 4
  }
];

// Parâmetros de Alertas por Módulo
const parametrosAlertasAlojamento = [
  { parametro: "Vistoria próxima ao vencimento", valor: "15 dias antes", tipo: "Temporal" },
  { parametro: "Vistoria vencida", valor: "Imediato", tipo: "Crítico" },
  { parametro: "Contrato sem vistoria inicial", valor: "7 dias após assinatura", tipo: "Alerta" },
  { parametro: "Documentação pendente", valor: "5 dias", tipo: "Alerta" }
];

const parametrosAlertasMaoObra = [
  { parametro: "Falta não justificada", valor: "Imediato", tipo: "Alerta" },
  { parametro: "Documentação vencida", valor: "7 dias antes", tipo: "Temporal" },
  { parametro: "Efetivo abaixo do planejado", valor: "> 10%", tipo: "Crítico" },
  { parametro: "Horas extras excessivas", valor: "> 20h/mês", tipo: "Alerta" }
];

const parametrosAlertasTransporte = [
  { parametro: "Nota fiscal não anexada", valor: "5 dias após medição", tipo: "Alerta" },
  { parametro: "Medição pendente aprovação", valor: "10 dias", tipo: "Temporal" },
  { parametro: "Custo acima do orçado", valor: "> 15%", tipo: "Crítico" },
  { parametro: "Documentação incompleta", valor: "3 dias", tipo: "Alerta" }
];

// Parâmetros de Exigências por Módulo
const exigenciasAlojamento = [
  { exigencia: "Vistoria inicial obrigatória", prazo: "Até 7 dias após contrato", status: "Ativo" },
  { exigencia: "Vistoria periódica trimestral", prazo: "A cada 90 dias", status: "Ativo" },
  { exigencia: "Registro fotográfico completo", prazo: "Em toda vistoria", status: "Ativo" },
  { exigencia: "Aprovação do gestor", prazo: "Antes da ocupação", status: "Ativo" }
];

const exigenciasMaoObra = [
  { exigencia: "ASO válido", prazo: "Obrigatório para admissão", status: "Ativo" },
  { exigencia: "Registro de ponto diário", prazo: "Até 23:59 do dia", status: "Ativo" },
  { exigencia: "Relatório de efetivo mensal", prazo: "Até dia 5 do mês seguinte", status: "Ativo" },
  { exigencia: "Justificativa de faltas", prazo: "Até 2 dias úteis", status: "Ativo" }
];

const exigenciasTransporte = [
  { exigencia: "Nota fiscal anexada", prazo: "Até 5 dias após serviço", status: "Ativo" },
  { exigencia: "Aprovação da medição", prazo: "Até 10 dias", status: "Ativo" },
  { exigencia: "Conferência de custos", prazo: "Antes do pagamento", status: "Ativo" },
  { exigencia: "Relatório mensal", prazo: "Até dia 3 do mês seguinte", status: "Ativo" }
];

export default function RelatorioObra() {
  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório Consolidado por Obra</h1>
            <p className="text-muted-foreground">Visão consolidada de contratos e vistorias por obra/CCA</p>
          </div>
        </div>

        <Tabs defaultValue="consolidado" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
            <TabsTrigger value="alojamento">Alojamento</TabsTrigger>
            <TabsTrigger value="maoobra">Mão de Obra</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
          </TabsList>

          {/* Tab Consolidado */}
          <TabsContent value="consolidado">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Relatório Consolidado por Obra/CCA
                </CardTitle>
                <CardDescription>
                  Visão consolidada de contratos e vistorias por obra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Obra/CCA</TableHead>
                        <TableHead className="text-center">Contratos Anexados</TableHead>
                        <TableHead className="text-center">Vistorias Pendentes</TableHead>
                        <TableHead className="text-center">Vistorias em Atraso</TableHead>
                        <TableHead className="text-center">Alertas Ativos</TableHead>
                        <TableHead className="text-center">Alertas Resolvidos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRelatorioPorObra.map((obra, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{obra.obra}</TableCell>
                          <TableCell className="text-center">{obra.contratosAnexados}</TableCell>
                          <TableCell className="text-center text-orange-600 font-medium">
                            {obra.vistoriasPendentes}
                          </TableCell>
                          <TableCell className="text-center text-red-600 font-medium">
                            {obra.vistoriasAtraso}
                          </TableCell>
                          <TableCell className="text-center text-red-600 font-medium">
                            {obra.alertasAtivos}
                          </TableCell>
                          <TableCell className="text-center text-green-600 font-medium">
                            {obra.alertasResolvidos}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Alojamento */}
          <TabsContent value="alojamento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Parâmetros de Alertas - Alojamento
                </CardTitle>
                <CardDescription>
                  Configuração de alertas para o módulo de alojamento
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
                      {parametrosAlertasAlojamento.map((param, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.parametro}</TableCell>
                          <TableCell>{param.valor}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              param.tipo === 'Crítico' ? 'text-red-600' : 
                              param.tipo === 'Alerta' ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {param.tipo}
                            </span>
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
                  Exigências - Alojamento
                </CardTitle>
                <CardDescription>
                  Requisitos obrigatórios do módulo de alojamento
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
                      {exigenciasAlojamento.map((exig, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exig.exigencia}</TableCell>
                          <TableCell>{exig.prazo}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{exig.status}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Mão de Obra */}
          <TabsContent value="maoobra" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Parâmetros de Alertas - Mão de Obra
                </CardTitle>
                <CardDescription>
                  Configuração de alertas para o módulo de mão de obra
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
                      {parametrosAlertasMaoObra.map((param, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.parametro}</TableCell>
                          <TableCell>{param.valor}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              param.tipo === 'Crítico' ? 'text-red-600' : 
                              param.tipo === 'Alerta' ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {param.tipo}
                            </span>
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
                  Exigências - Mão de Obra
                </CardTitle>
                <CardDescription>
                  Requisitos obrigatórios do módulo de mão de obra
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
                      {exigenciasMaoObra.map((exig, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exig.exigencia}</TableCell>
                          <TableCell>{exig.prazo}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{exig.status}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Transporte */}
          <TabsContent value="transporte" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Parâmetros de Alertas - Transporte
                </CardTitle>
                <CardDescription>
                  Configuração de alertas para o módulo de transporte
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
                      {parametrosAlertasTransporte.map((param, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.parametro}</TableCell>
                          <TableCell>{param.valor}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${
                              param.tipo === 'Crítico' ? 'text-red-600' : 
                              param.tipo === 'Alerta' ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {param.tipo}
                            </span>
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
                  Exigências - Transporte
                </CardTitle>
                <CardDescription>
                  Requisitos obrigatórios do módulo de transporte
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
                      {exigenciasTransporte.map((exig, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exig.exigencia}</TableCell>
                          <TableCell>{exig.prazo}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{exig.status}</span>
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
    </div>
  );
}