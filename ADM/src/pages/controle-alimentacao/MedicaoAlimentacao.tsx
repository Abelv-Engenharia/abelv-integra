import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Plus } from 'lucide-react';

// Mock data
const mockMedicoes = [
  {
    id: 1,
    obra: "CCA 001 - Projeto Alpha",
    fornecedor: "Refeições & Cia",
    periodo: "Dezembro/2024",
    totalRefeicoes: 450,
    valorUnitario: 18.50,
    valorTotal: 8325.00,
    status: "Aprovada"
  },
  {
    id: 2,
    obra: "CCA 002 - Projeto Beta", 
    fornecedor: "Nutri Foods",
    periodo: "Dezembro/2024",
    totalRefeicoes: 320,
    valorUnitario: 16.75,
    valorTotal: 5360.00,
    status: "Pendente"
  },
  {
    id: 3,
    obra: "CCA 003 - Projeto Gamma",
    fornecedor: "Sabor & Nutrição",
    periodo: "Dezembro/2024", 
    totalRefeicoes: 680,
    valorUnitario: 19.25,
    valorTotal: 13090.00,
    status: "Em Análise"
  }
];

export default function MedicaoAlimentacao() {
  const navigate = useNavigate();
  const [medicoes, setMedicoes] = useState(mockMedicoes);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprovada</Badge>;
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'Em Análise':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Análise</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medição - Controle de Alimentação</h1>
            <p className="text-muted-foreground">Gerenciar medições de alimentação por obra e fornecedor</p>
          </div>
        </div>

        {/* Nova Medição */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                <CardTitle>Medições de Alimentação</CardTitle>
              </div>
              <Button onClick={() => navigate('/controle-alimentacao/medicao/nova')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Medição
              </Button>
            </div>
            <CardDescription>
              Registrar e acompanhar medições de alimentação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obra/CCA</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-center">Total Refeições</TableHead>
                    <TableHead className="text-center">Valor Unitário</TableHead>
                    <TableHead className="text-center">Valor Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicoes.map((medicao) => (
                    <TableRow key={medicao.id}>
                      <TableCell className="font-medium">{medicao.obra}</TableCell>
                      <TableCell>{medicao.fornecedor}</TableCell>
                      <TableCell>{medicao.periodo}</TableCell>
                      <TableCell className="text-center">{medicao.totalRefeicoes.toLocaleString()}</TableCell>
                      <TableCell className="text-center">R$ {medicao.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">R$ {medicao.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(medicao.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          Editar
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
    </div>
  );
}