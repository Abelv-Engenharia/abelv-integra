import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, FileCheck, ArrowLeft, Search, Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BuscaFornecedorModal from '@/components/controle-transporte/BuscaFornecedorModal';
import UploadNotaFiscal from '@/components/controle-transporte/UploadNotaFiscal';

interface ItemMedicao {
  id: string;
  descricao: string;
  qtde: number;
  valorUnit: number;
  valorTotal: number;
}

export default function NovaMediacaoTransporte() {
  const navigate = useNavigate();
  const [cca, setCCA] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [emissao, setEmissao] = useState('');
  const [prazoPgto, setPrazoPgto] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [modalBuscaOpen, setModalBuscaOpen] = useState(false);
  const [notaFiscalData, setNotaFiscalData] = useState<any>(null);
  
  const [itens, setItens] = useState<ItemMedicao[]>([
    { id: '1', descricao: '', qtde: 0, valorUnit: 0, valorTotal: 0 }
  ]);

  const addItem = () => {
    const newId = (itens.length + 1).toString();
    setItens([...itens, { id: newId, descricao: '', qtde: 0, valorUnit: 0, valorTotal: 0 }]);
  };

  const removeItem = (id: string) => {
    if (itens.length > 1) {
      setItens(itens.filter(item => item.id !== id));
    } else {
      toast.error('Deve haver pelo menos um item na medição');
    }
  };

  const updateItem = (id: string, field: keyof ItemMedicao, value: string | number) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalcular valor total quando qtde ou valorUnit mudar
        if (field === 'qtde' || field === 'valorUnit') {
          updated.valorTotal = updated.qtde * updated.valorUnit;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const calcularValorTotal = () => {
    return itens.reduce((sum, item) => sum + item.valorTotal, 0);
  };

  const buscarFornecedorPorCNPJ = async (cnpjBusca: string) => {
    if (!cnpjBusca || cnpjBusca.length < 14) return;

    try {
      const { data, error } = await supabase
        .from('fornecedores_transporte')
        .select('*')
        .eq('cnpj', cnpjBusca)
        .eq('status', 'ativo')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFornecedor(data.nome);
        setFornecedorId(data.id);
        toast.success('Fornecedor encontrado!');
      } else {
        toast.error('Fornecedor não encontrado para este CNPJ');
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      toast.error('Erro ao buscar fornecedor');
    }
  };

  const handleSave = async () => {
    // Validações
    if (!cca) {
      toast.error('CCA é obrigatório');
      return;
    }
    if (!fornecedor) {
      toast.error('Fornecedor é obrigatório');
      return;
    }
    if (!periodo) {
      toast.error('Período é obrigatório');
      return;
    }
    if (itens.some(item => !item.descricao || item.qtde <= 0 || item.valorUnit <= 0)) {
      toast.error('Todos os itens devem ter descrição, quantidade e valor preenchidos');
      return;
    }

    try {
      const numeroMedicao = `MED-${Date.now()}`;
      
      const { error } = await supabase
        .from('medicoes_transporte')
        .insert([{
          numero_medicao: numeroMedicao,
          cca: cca,
          fornecedor: fornecedor,
          cnpj: cnpj || null,
          periodo: periodo,
          data_emissao: emissao || null,
          prazo_pagamento: prazoPgto || null,
          valor_total: calcularValorTotal(),
          itens: itens as any,
          observacoes: observacoes || null,
          status: 'pendente',
          anexo_xml_url: notaFiscalData?.xmlFile?.url || null,
          anexo_xml_nome: notaFiscalData?.xmlFile?.name || null,
          anexo_nf_url: notaFiscalData?.pdfFile?.url || null,
          anexo_nf_nome: notaFiscalData?.pdfFile?.name || null,
          dados_nf: notaFiscalData?.nfData || null
        }]);

      if (error) throw error;

      toast.success('Medição salva com sucesso!');
      navigate('/controle-transporte/medicao');
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      toast.error('Erro ao salvar medição');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Rascunho salvo');
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/controle-transporte/medicao')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Nova Medição de Transporte</h1>
            <p className="text-muted-foreground">Preencha os dados da medição e adicione os trajetos/itens</p>
          </div>
        </div>

        {/* Formulário Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Medição</CardTitle>
            <CardDescription>Informações gerais do período e fornecedor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cca" className="text-red-500">CCA/Obra *</Label>
                <Select value={cca} onValueChange={setCCA}>
                  <SelectTrigger id="cca" className={!cca ? 'border-red-300' : ''}>
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
                <Label htmlFor="fornecedor" className="text-red-500">Fornecedor *</Label>
                <div className="flex gap-2">
                  <Input
                    id="fornecedor"
                    placeholder="Nome do fornecedor"
                    value={fornecedor}
                    onChange={(e) => setFornecedor(e.target.value)}
                    className={!fornecedor ? 'border-red-300' : ''}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalBuscaOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCNPJ(e.target.value)}
                  onBlur={(e) => buscarFornecedorPorCNPJ(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo" className="text-red-500">Período *</Label>
                <Input
                  id="periodo"
                  placeholder="Ex: 01/fev ou 16/fev"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className={!periodo ? 'border-red-300' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emissao">Data Emissão</Label>
                <Input
                  id="emissao"
                  type="date"
                  value={emissao}
                  onChange={(e) => setEmissao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazoPgto">Prazo Pagamento</Label>
                <Input
                  id="prazoPgto"
                  type="date"
                  value={prazoPgto}
                  onChange={(e) => setPrazoPgto(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações gerais sobre a medição"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Anexo de Nota Fiscal */}
        <UploadNotaFiscal
          onDataChange={setNotaFiscalData}
          valorMedicao={calcularValorTotal()}
        />

        {/* Itens/Trajetos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Itens/Trajetos da Medição</CardTitle>
                <CardDescription>Liste todos os trajetos ou serviços prestados no período</CardDescription>
              </div>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Item</TableHead>
                    <TableHead>Trajeto/Descrição *</TableHead>
                    <TableHead className="w-[120px]">Qtde *</TableHead>
                    <TableHead className="w-[140px]">Valor Unit (R$) *</TableHead>
                    <TableHead className="w-[140px]">Valor Total (R$)</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">
                        {(index + 1).toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Ex: Aeroporto X Hotel"
                          value={item.descricao}
                          onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                          className={!item.descricao ? 'border-red-300' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0"
                          value={item.qtde || ''}
                          onChange={(e) => updateItem(item.id, 'qtde', parseFloat(e.target.value) || 0)}
                          className={item.qtde <= 0 ? 'border-red-300' : ''}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          value={item.valorUnit || ''}
                          onChange={(e) => updateItem(item.id, 'valorUnit', parseFloat(e.target.value) || 0)}
                          className={item.valorUnit <= 0 ? 'border-red-300' : ''}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={itens.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={4} className="text-right">
                      Total Geral:
                    </TableCell>
                    <TableCell className="text-lg">
                      R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar e Enviar p/ Aprovação
              </Button>
              <Button onClick={handleSaveDraft} variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Salvar como Rascunho
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/controle-transporte/medicao')}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BuscaFornecedorModal
        open={modalBuscaOpen}
        onClose={() => setModalBuscaOpen(false)}
        onSelect={(f) => {
          setFornecedor(f.nome);
          setFornecedorId(f.id);
          setCNPJ(f.cnpj);
        }}
      />
    </div>
  );
}
