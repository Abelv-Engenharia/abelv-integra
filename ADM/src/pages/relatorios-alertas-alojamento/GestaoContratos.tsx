import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, Download, FileText } from 'lucide-react';

// Mock data
const mockContratos = [
  {
    id: 1,
    fornecedor: "Hotel Central Ltda",
    obra: "CCA 001 - Projeto Alpha",
    contratoAnexado: true,
    dataAnexacao: "2024-01-15",
    prazoVistoria: 30,
    diasRestantes: 15,
    statusVistoria: "Pendente",
    dataVistoria: null,
    situacaoAlerta: "Ativo"
  },
  {
    id: 2,
    fornecedor: "Pousada Bom Descanso",
    obra: "CCA 002 - Projeto Beta", 
    contratoAnexado: true,
    dataAnexacao: "2024-01-01",
    prazoVistoria: 30,
    diasRestantes: -2,
    statusVistoria: "Atrasada",
    dataVistoria: null,
    situacaoAlerta: "Ativo"
  },
  {
    id: 3,
    fornecedor: "Residencial Conforto",
    obra: "CCA 003 - Projeto Gamma",
    contratoAnexado: true,
    dataAnexacao: "2023-12-20",
    prazoVistoria: 30,
    diasRestantes: 0,
    statusVistoria: "Anexada",
    dataVistoria: "2024-01-10",
    situacaoAlerta: "Resolvido"
  }
];

export default function GestaoContratos() {
  const [filtroObra, setFiltroObra] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏳ Pendente</Badge>;
      case 'Anexada':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Anexada</Badge>;
      case 'Atrasada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🚨 Atrasada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertaBadge = (situacao: string) => {
    return situacao === 'Ativo' 
      ? <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Ativo</Badge>
      : <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Resolvido</Badge>;
  };

  const getDiasRestantesColor = (dias: number) => {
    if (dias < 0) return 'text-red-600 font-bold';
    if (dias <= 7) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Contratos e Vistorias</h1>
            <p className="text-muted-foreground">Acompanhamento de contratos anexados e prazos de vistoria</p>
          </div>
        </div>

        {/* Alertas Críticos */}
        {mockContratos.filter(c => c.diasRestantes < 0 || c.diasRestantes <= 7).length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Atenção:</strong> Existem {mockContratos.filter(c => c.diasRestantes < 0).length} vistorias em atraso 
              e {mockContratos.filter(c => c.diasRestantes <= 7 && c.diasRestantes >= 0).length} próximas do prazo.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestão de Contratos e Vistorias
            </CardTitle>
            <CardDescription>
              Acompanhamento de contratos anexados e prazos de vistoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as obras</SelectItem>
                  <SelectItem value="cca001">CCA 001 - Projeto Alpha</SelectItem>
                  <SelectItem value="cca002">CCA 002 - Projeto Beta</SelectItem>
                  <SelectItem value="cca003">CCA 003 - Projeto Gamma</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Status da vistoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="anexada">Anexada</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>

            {/* Tabela */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Obra/CCA</TableHead>
                    <TableHead className="text-center">Contrato Anexado</TableHead>
                    <TableHead>Data Anexação</TableHead>
                    <TableHead className="text-center">Dias Restantes</TableHead>
                    <TableHead>Status Vistoria</TableHead>
                    <TableHead>Data Vistoria</TableHead>
                    <TableHead>Situação Alerta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">{contrato.fornecedor}</TableCell>
                      <TableCell>{contrato.obra}</TableCell>
                      <TableCell className="text-center">
                        {contrato.contratoAnexado ? '✅' : '❌'}
                      </TableCell>
                      <TableCell>{contrato.dataAnexacao}</TableCell>
                      <TableCell className={`text-center ${getDiasRestantesColor(contrato.diasRestantes)}`}>
                        {contrato.diasRestantes < 0 
                          ? `${Math.abs(contrato.diasRestantes)} dias em atraso`
                          : `${contrato.diasRestantes} dias`
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(contrato.statusVistoria)}</TableCell>
                      <TableCell>{contrato.dataVistoria || '-'}</TableCell>
                      <TableCell>{getAlertaBadge(contrato.situacaoAlerta)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}