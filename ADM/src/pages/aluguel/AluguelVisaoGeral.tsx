import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, FileCheck, AlertCircle, DollarSign, Users, RefreshCw, Eye, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data para alojamentos vinculados a contratos
const mockAlojamentos = [
  {
    id: 'CONT-001',
    obra: 'CCA 25051',
    fornecedor: 'Ricardo Queiroga Bueno',
    endereco: 'Rua das Palmeiras, 123',
    valorMensal: 8700,
    inicioLocacao: '2025-01-01',
    fimLocacao: '2025-12-31',
    statusContrato: 'vigente',
    competenciasAbertas: ['2025-01', '2025-02'],
    statusUltimaMedicao: 'aprovada',
    dataUltimaMedicao: '2025-01-15',
    proximoVencimento: '2025-02-02'
  },
  {
    id: 'CONT-002', 
    obra: 'CCA 25052',
    fornecedor: 'Maria Silva Santos',
    endereco: 'Av. Principal, 456',
    valorMensal: 12500,
    inicioLocacao: '2024-12-15',
    fimLocacao: '2025-06-15',
    statusContrato: 'vigente',
    competenciasAbertas: ['2025-01'],
    statusUltimaMedicao: 'pendente',
    dataUltimaMedicao: '',
    proximoVencimento: '2025-02-02'
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    vigente: { variant: 'default' as const, text: 'Vigente' },
    pendente: { variant: 'secondary' as const, text: 'Pendente' },
    aprovada: { variant: 'default' as const, text: 'Aprovada' },
    lancada: { variant: 'outline' as const, text: 'Lançada' },
    atrasada: { variant: 'destructive' as const, text: 'Atrasada' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default function AluguelVisaoGeral() {
  const { toast } = useToast();
  const [filtroObra, setFiltroObra] = useState<string>('todas');

  const handleRegerar = (contratoId: string) => {
    toast({
      title: "Medições Regeradas",
      description: `Medições futuras do contrato ${contratoId} foram regeradas com base no contrato`
    });
  };

  const handleSincronizar = () => {
    toast({
      title: "Sincronização Concluída",
      description: "Dados sincronizados com módulo de Contratos de Alojamento"
    });
  };

  const alojamentosFiltrados = filtroObra === 'todas' 
    ? mockAlojamentos 
    : mockAlojamentos.filter(item => item.obra.includes(filtroObra));

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aluguel - Visão Geral por Obra</h1>
            <p className="text-muted-foreground">Gestão de medições de aluguel por contrato de alojamento</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSincronizar}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar com Contratos
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Obra/CCA</label>
                <Select value={filtroObra} onValueChange={setFiltroObra}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Obras</SelectItem>
                    <SelectItem value="25051">CCA 25051</SelectItem>
                    <SelectItem value="25052">CCA 25052</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contratos Ativos</p>
                  <p className="text-2xl font-bold">{alojamentosFiltrados.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medições Pendentes</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {alojamentosFiltrados.filter(a => a.statusUltimaMedicao === 'pendente').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total Mensal</p>
                  <p className="text-2xl font-bold">
                    R$ {alojamentosFiltrados.reduce((sum, a) => sum + a.valorMensal, 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Competências Abertas</p>
                  <p className="text-2xl font-bold">
                    {alojamentosFiltrados.reduce((sum, a) => sum + a.competenciasAbertas.length, 0)}
                  </p>
                </div>
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Alojamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Contratos de Alojamento Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Obra/CCA</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Valor Mensal</TableHead>
                  <TableHead>Competências Abertas</TableHead>
                  <TableHead>Última Medição</TableHead>
                  <TableHead>Próximo Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alojamentosFiltrados.map((alojamento) => (
                  <TableRow key={alojamento.id}>
                    <TableCell className="font-medium">{alojamento.id}</TableCell>
                    <TableCell>{alojamento.obra}</TableCell>
                    <TableCell>{alojamento.fornecedor}</TableCell>
                    <TableCell>{alojamento.endereco}</TableCell>
                    <TableCell>R$ {alojamento.valorMensal.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {alojamento.competenciasAbertas.map(comp => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(alojamento.statusUltimaMedicao)}
                        {alojamento.dataUltimaMedicao && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(alojamento.dataUltimaMedicao).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(alojamento.proximoVencimento).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href="/aluguel/medicoes">
                            <Eye className="h-4 w-4 mr-1" />
                            Medição
                          </a>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRegerar(alojamento.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regerar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}