import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockRelatorios = [
  {
    id: 1,
    colaborador: "João Silva Santos",
    matricula: "001234", 
    obra: "Obra Alpha",
    cca: "CC001",
    periodo_folga: "15/01 a 17/01",
    status: "Pendente Formulário",
    pendencia: "Formulário não assinado",
    prazo_limite: "2025-01-10",
    responsavel: "Supervisor Obra"
  },
  {
    id: 2,
    colaborador: "Maria Costa Silva",
    matricula: "001235",
    obra: "Obra Beta", 
    cca: "CC002",
    periodo_folga: "01/02 a 08/02",
    status: "Pendente Reembolso",
    pendencia: "Comprovante não anexado",
    prazo_limite: "2025-02-15",
    responsavel: "Administrativo"
  },
  {
    id: 3,
    colaborador: "Carlos Lima Santos",
    matricula: "001236",
    obra: "Obra Gamma",
    cca: "CC003", 
    periodo_folga: "20/01 a 22/01",
    status: "Pendente Compra",
    pendencia: "Passagem não comprada", 
    prazo_limite: "2024-12-21",
    responsavel: "Bizztrip/Onfly"
  }
];

const RelatoriosTab = () => {
  const [filtroRelatorio, setFiltroRelatorio] = useState('pendencias');
  const [filtroObra, setFiltroObra] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('mes-atual');

  const exportarRelatorio = (formato: string) => {
    // Implementar exportação conforme formato
    console.log(`Exportando relatório em formato: ${formato}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Pendente Formulário": { variant: "secondary", icon: FileText },
      "Pendente Reembolso": { variant: "destructive", icon: AlertTriangle }, 
      "Pendente Compra": { variant: "destructive", icon: AlertTriangle }
    };
    
    const config = statusConfig[status] || { variant: "secondary", icon: FileText };
    return <Badge variant={config.variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes Formulários</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Não assinados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes Valores</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-xs text-muted-foreground">Reembolsos/Comprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes Compras</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Sem emissão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folgas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Tipo de Relatório</Label>
              <Select value={filtroRelatorio} onValueChange={setFiltroRelatorio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendencias">Pendências Ativas</SelectItem>
                  <SelectItem value="formularios">Formulários Pendentes</SelectItem>
                  <SelectItem value="reembolsos">Valores Pendentes</SelectItem>
                  <SelectItem value="compras">Compras Pendentes</SelectItem>
                  <SelectItem value="mapa-folgas">Mapa de Folgas</SelectItem>
                  <SelectItem value="conformidade">Conformidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Obra/CCA</Label>
              <Select value={filtroObra} onValueChange={setFiltroObra}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Obras</SelectItem>
                  <SelectItem value="cc001">Obra Alpha - CC001</SelectItem>
                  <SelectItem value="cc002">Obra Beta - CC002</SelectItem>
                  <SelectItem value="cc003">Obra Gamma - CC003</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Colaborador</Label>
              <Input placeholder="Nome ou matrícula..." />
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={() => exportarRelatorio('xlsx')}>
                <Download className="mr-2 h-4 w-4" />
                XLSX
              </Button>
              <Button variant="outline" onClick={() => exportarRelatorio('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Relatório */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório de Pendências</CardTitle>
              <CardDescription>
                Filtros aplicados serão mantidos na exportação
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Envio
              </Button>
              <Button size="sm" onClick={() => exportarRelatorio('xlsx')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Selecionados
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra/CCA</TableHead>
                <TableHead>Período da Folga</TableHead>
                <TableHead>Status/Pendência</TableHead>
                <TableHead>Prazo Limite</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRelatorios.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.colaborador}</p>
                      <p className="text-sm text-muted-foreground">{item.matricula}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{item.obra}</p>
                      <p className="text-sm text-muted-foreground">{item.cca}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.periodo_folga}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(item.status)}
                      <p className="text-xs text-muted-foreground">{item.pendencia}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${new Date(item.prazo_limite) < new Date() ? 'text-red-600 font-medium' : ''}`}>
                      {new Date(item.prazo_limite).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.responsavel}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
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
};

export default RelatoriosTab;