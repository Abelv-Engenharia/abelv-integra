import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Plus, FileCheck, Calendar, Download, Upload, FileSpreadsheet, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Mock data - Estrutura hierárquica por fornecedor e medições mensais
const mockMedicoes = [
  {
    id: 'T01',
    cca: "ABELV 24021 - ROUSSELOT - CANINDÉ",
    fornecedor: "JESSICA MARIA ESPINHOSA CARDOSO",
    cnpj: "59.391.341/0001-88",
    medicoes: [
      {
        id: 'T01.M01',
        numero: 'Med 01',
        periodo: '01/fev',
        emissao: '15/fev',
        prazoPgto: '01/mar/25',
        valorTotal: 1000.00,
        status: 'Lançada',
        nf: '179990',
        itens: [
          { descricao: 'Aeroporto Pres. Prudente X Hotel Maanaim', qtde: 2, valorUnit: 250.00, valorTotal: 500.00 },
          { descricao: 'Hotel Maanaim X Aeroporto Pres. Prudente', qtde: 2, valorUnit: 250.00, valorTotal: 500.00 }
        ]
      },
      {
        id: 'T01.M02',
        numero: 'Med 02',
        periodo: '16/fev',
        emissao: '28/fev',
        prazoPgto: '01/fev/25',
        valorTotal: 2430.00,
        status: 'Lançada',
        nf: '180830',
        itens: [
          { descricao: 'Aeroporto Pres. Prudente X Hotel Maanaim', qtde: 6, valorUnit: 250.00, valorTotal: 1500.00 },
          { descricao: 'Obra Rousselot X Hotel Maanaim', qtde: 1, valorUnit: 30.00, valorTotal: 30.00 },
          { descricao: 'Hotel Maanaim X Aeroporto Pres. Prudente', qtde: 3, valorUnit: 300.00, valorTotal: 900.00 }
        ]
      },
      {
        id: 'T01.M03',
        numero: 'Med 03',
        periodo: '01/mar',
        emissao: '31/mar',
        prazoPgto: '01/mar/25',
        valorTotal: 1910.00,
        status: 'Lançada',
        nf: '182344',
        itens: [
          { descricao: 'Aeroporto Pres. Prudente X Hotel Maanaim', qtde: 3, valorUnit: 250.00, valorTotal: 750.00 },
          { descricao: 'Hotel Maanaim X Aeroporto Pres. Prudente', qtde: 2, valorUnit: 300.00, valorTotal: 600.00 },
          { descricao: 'Aeroporto Pres. Prudente X Hotel Potosi (noite/madrugada)', qtde: 2, valorUnit: 280.00, valorTotal: 560.00 }
        ]
      }
    ]
  }
];

export default function MedicaoTransporte() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCCA, setSelectedCCA] = useState("ABELV 24021 - ROUSSELOT - CANINDÉ");
  const [selectedFornecedor, setSelectedFornecedor] = useState<string>('');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Buscar medições do banco de dados
  const { data: medicoesDb, isLoading } = useQuery({
    queryKey: ['medicoes_transporte'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicoes_transporte')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Realtime updates
  React.useEffect(() => {
    const channel = supabase
      .channel('medicoes_transporte_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medicoes_transporte' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['medicoes_transporte'] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Agrupar medições por fornecedor
  const medicoesPorFornecedor = React.useMemo(() => {
    if (!medicoesDb) return [];
    
    const grupos: { [key: string]: any } = {};
    
    medicoesDb.forEach(medicao => {
      const key = medicao.fornecedor;
      if (!grupos[key]) {
        grupos[key] = {
          id: medicao.id,
          cca: medicao.cca,
          fornecedor: medicao.fornecedor,
          cnpj: medicao.cnpj,
          medicoes: []
        };
      }
      grupos[key].medicoes.push({
        id: medicao.id,
        numero: medicao.numero_medicao,
        periodo: medicao.periodo,
        emissao: medicao.data_emissao ? new Date(medicao.data_emissao).toLocaleDateString('pt-BR') : '',
        prazoPgto: medicao.prazo_pagamento ? new Date(medicao.prazo_pagamento).toLocaleDateString('pt-BR') : '',
        valorTotal: Number(medicao.valor_total),
        status: medicao.status,
        nf: medicao.numero_nf || '',
        itens: medicao.itens || []
      });
    });
    
    return Object.values(grupos);
  }, [medicoesDb]);

  const handleDownloadTemplate = () => {
    toast.success('Download do template iniciado');
    // Aqui seria implementado o download do arquivo Excel template
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Arquivo ${file.name} carregado com sucesso`);
    }
  };

  const handleProcessFile = () => {
    if (uploadedFile) {
      toast.success('Processando arquivo e importando dados...');
      // Aqui seria implementada a lógica de processamento do arquivo
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lançada':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Lançada</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'aprovada':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aprovada</Badge>;
      case 'em análise':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Em Análise</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filtrar medições por CCA, fornecedor e período
  const filteredMedicoes = medicoesPorFornecedor.filter(m => {
    const matchCCA = !selectedCCA || m.cca === selectedCCA;
    const matchFornecedor = !selectedFornecedor || m.fornecedor.toLowerCase().includes(selectedFornecedor.toLowerCase());
    return matchCCA && matchFornecedor;
  });

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Medições de Transporte</h1>
            <p className="text-muted-foreground">Histórico mês a mês por CCA - anexo para preenchimento e controle</p>
          </div>
        </div>

        {/* Filtros e Template */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Anexo para Preenchimento
            </CardTitle>
            <CardDescription>
              Baixe o template, preencha os dados e faça o upload para importar as medições
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>CCA/Obra *</Label>
                <Select value={selectedCCA} onValueChange={setSelectedCCA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABELV 24021 - ROUSSELOT - CANINDÉ">ABELV 24021 - ROUSSELOT - CANINDÉ</SelectItem>
                    <SelectItem value="ABELV 24022 - OBRA BETA">ABELV 24022 - OBRA BETA</SelectItem>
                    <SelectItem value="ABELV 24023 - OBRA GAMMA">ABELV 24023 - OBRA GAMMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input
                  placeholder="Filtrar por fornecedor"
                  value={selectedFornecedor}
                  onChange={(e) => setSelectedFornecedor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Período</Label>
                <Input
                  placeholder="Ex: fev/2025"
                  value={selectedPeriodo}
                  onChange={(e) => setSelectedPeriodo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar Template Excel
              </Button>

              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Preenchido
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              </Button>

              {uploadedFile && (
                <Button onClick={handleProcessFile}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Processar {uploadedFile.name}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Medições */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <CardTitle>Histórico de Medições - {selectedCCA}</CardTitle>
              </div>
              <Button onClick={() => navigate('/controle-transporte/medicao/nova')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Medição
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-20 animate-spin" />
                <p>Carregando medições...</p>
              </div>
            ) : filteredMedicoes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhuma medição encontrada para os filtros selecionados</p>
              </div>
            ) : (
              filteredMedicoes.map((fornecedor) => (
                <div key={fornecedor.id} className="mb-8 last:mb-0">
                  {/* Cabeçalho do Fornecedor */}
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{fornecedor.id} - {fornecedor.fornecedor}</h3>
                        <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
                      </div>
                      <Badge variant="outline">
                        {fornecedor.medicoes.length} medições
                      </Badge>
                    </div>
                  </div>

                  {/* Medições do Fornecedor */}
                  <div className="space-y-4">
                    {fornecedor.medicoes.map((medicao: any) => (
                      <Card key={medicao.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{medicao.numero} - {fornecedor.fornecedor}</CardTitle>
                              <CardDescription>
                                Período: {medicao.periodo} | Emissão: {medicao.emissao} | Prazo Pgto: {medicao.prazoPgto}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(medicao.status)}
                              <Badge variant="secondary">NF {medicao.nf}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead>Trajeto/Descrição</TableHead>
                                  <TableHead className="text-center">Qtde</TableHead>
                                  <TableHead className="text-right">Valor Unit</TableHead>
                                  <TableHead className="text-right">Valor Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(medicao.itens || []).map((item: any, idx: number) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-mono text-sm">{medicao.id}.{idx + 1}</TableCell>
                                    <TableCell>{item.descricao}</TableCell>
                                    <TableCell className="text-center">{item.qtde?.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                      R$ {item.valorUnit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      R$ {item.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="bg-muted/50 font-semibold">
                                  <TableCell colSpan={4} className="text-right">Total da Medição:</TableCell>
                                  <TableCell className="text-right">
                                    R$ {medicao.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/controle-transporte/medicao/nova')}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Exportar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}