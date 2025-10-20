import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ItemRefeicao {
  id: string;
  tipo: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  comentarios: string;
}

const TIPOS_REFEICAO_PADRAO = [
  'Vale Alimentação',
  'Café',
  'Almoço',
  'Marmita',
  'Janta',
  'Lanches',
  'Extra',
  'Cesta Básica',
  '', // Linha editável 1
  ''  // Linha editável 2
];

export default function NovaMediacaoAlimentacao() {
  const navigate = useNavigate();
  const [cca, setCCA] = useState('');
  const [admResponsavel, setAdmResponsavel] = useState('');
  const [data, setData] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [notaFiscalFile, setNotaFiscalFile] = useState<File | null>(null);
  const [xmlFile, setXMLFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [itens, setItens] = useState<ItemRefeicao[]>(
    TIPOS_REFEICAO_PADRAO.map((tipo, index) => ({
      id: (index + 1).toString(),
      tipo,
      quantidade: 0,
      valorUnitario: 0,
      valorTotal: 0,
      comentarios: ''
    }))
  );


  const updateItem = (id: string, field: keyof ItemRefeicao, value: string | number) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === 'quantidade' || field === 'valorUnitario') {
          updated.valorTotal = updated.quantidade * updated.valorUnitario;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const calcularValorTotal = () => {
    return itens.reduce((sum, item) => sum + item.valorTotal, 0);
  };

  const handleNFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos');
        return;
      }
      setNotaFiscalFile(file);
      toast.success('Nota fiscal anexada com sucesso');
    }
  };

  const handleXMLUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/xml' && !file.name.endsWith('.xml')) {
        toast.error('Apenas arquivos XML são permitidos');
        return;
      }
      setXMLFile(file);
      toast.success('XML anexado com sucesso');
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath, nome: file.name };
  };

  const handleSave = async () => {
    if (!cca || !fornecedor || !periodoInicio || !periodoFim || !admResponsavel || !data || !cnpj) {
      toast.error('Preencha todos os campos obrigatórios marcados com *');
      return;
    }

    if (!notaFiscalFile) {
      toast.error('É obrigatório anexar a Nota Fiscal');
      return;
    }

    setUploading(true);

    try {
      let nfData = null;
      let xmlData = null;

      if (notaFiscalFile) {
        nfData = await uploadFile(notaFiscalFile, 'hospedagem-anexos', 'alimentacao-nf');
      }

      if (xmlFile) {
        xmlData = await uploadFile(xmlFile, 'hospedagem-anexos', 'alimentacao-xml');
      }

      const numeroMedicao = `ALIM-${Date.now().toString().slice(-6)}`;
      const valorTotal = calcularValorTotal();
      const periodo = `${periodoInicio} até ${periodoFim}`;

      const { error } = await supabase
        .from('medicoes_alimentacao')
        .insert({
          numero_medicao: numeroMedicao,
          fornecedor,
          cnpj,
          cca,
          periodo,
          data_emissao: data || null,
          prazo_pagamento: null,
          valor_total: valorTotal,
          itens: itens as any,
          observacoes: `ADM. Resp.: ${admResponsavel}\n${observacoes}`,
          status: 'pendente',
          anexo_nf_url: nfData?.url,
          anexo_nf_nome: nfData?.nome,
          anexo_xml_url: xmlData?.url,
          anexo_xml_nome: xmlData?.nome,
          dados_nf: nfData ? { numero_nf: '', data_emissao: data, valor: valorTotal } as any : null
        } as any);

      if (error) throw error;

      toast.success(`Medição ${numeroMedicao} criada com sucesso!`);
      navigate('/controle-alimentacao/lancamentos-sienge');
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      toast.error('Erro ao salvar medição de alimentação');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/controle-alimentacao/medicao')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Medição de Alimentação</h1>
        <p className="text-muted-foreground">Preencha os dados da medição mensal</p>
      </div>

      <div className="grid gap-6">
        {/* Dados Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
            <CardDescription>Informações básicas da medição</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cca" className="text-red-500">Obra *</Label>
                <Input 
                  id="cca"
                  value={cca}
                  onChange={(e) => setCCA(e.target.value)}
                  placeholder="Ex: 24021 - ROUSSELOT - CANINDÉ"
                  className={!cca ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admResponsavel" className="text-red-500">ADM. Resp. *</Label>
                <Input 
                  id="admResponsavel"
                  value={admResponsavel}
                  onChange={(e) => setAdmResponsavel(e.target.value)}
                  placeholder="Nome do responsável"
                  className={!admResponsavel ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data" className="text-red-500">Data *</Label>
                <Input 
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={!data ? 'border-red-300' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor" className="text-red-500">Restaurante *</Label>
                <Input 
                  id="fornecedor"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  placeholder="Nome do restaurante/fornecedor"
                  className={!fornecedor ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-red-500">CNPJ *</Label>
                <Input 
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCNPJ(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className={!cnpj ? 'border-red-300' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodoInicio" className="text-red-500">Período Considerado - De *</Label>
                <Input 
                  id="periodoInicio"
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                  className={!periodoInicio ? 'border-red-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodoFim" className="text-red-500">Até *</Label>
                <Input 
                  id="periodoFim"
                  type="date"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                  className={!periodoFim ? 'border-red-300' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card>
          <CardHeader>
            <CardTitle>Anexos</CardTitle>
            <CardDescription>Nota fiscal e XML (obrigatório anexar NF)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notaFiscal">Nota Fiscal (PDF) *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="notaFiscal"
                    type="file"
                    accept="application/pdf"
                    onChange={handleNFUpload}
                    className="flex-1"
                  />
                  {notaFiscalFile && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setNotaFiscalFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {notaFiscalFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo: {notaFiscalFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="xml">XML (Opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="xml"
                    type="file"
                    accept="text/xml,.xml"
                    onChange={handleXMLUpload}
                    className="flex-1"
                  />
                  {xmlFile && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setXMLFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {xmlFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo: {xmlFile.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens da Medição */}
        <Card>
          <CardHeader>
            <CardTitle>Medição Atual</CardTitle>
            <CardDescription>Preencha as quantidades, valores unitários e comentários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Item</TableHead>
                    <TableHead className="w-[120px] text-center">Qtde</TableHead>
                    <TableHead className="w-[140px] text-center">Unit</TableHead>
                    <TableHead className="w-[140px] text-center">Total</TableHead>
                    <TableHead>Comentários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
                    <TableRow key={item.id} className={item.valorTotal === 0 ? 'bg-muted/30' : ''}>
                      <TableCell className="font-medium">
                        {item.tipo || index >= 8 ? (
                          <Input 
                            value={item.tipo} 
                            onChange={(e) => updateItem(item.id, 'tipo', e.target.value)}
                            placeholder="Digite o tipo"
                            className="font-medium"
                          />
                        ) : (
                          item.tipo
                        )}
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={item.quantidade || ''} 
                          onChange={(e) => updateItem(item.id, 'quantidade', Number(e.target.value))}
                          placeholder="0"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={item.valorUnitario || ''} 
                          onChange={(e) => updateItem(item.id, 'valorUnitario', Number(e.target.value))}
                          placeholder="0,00"
                          className="text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.valorTotal > 0 ? (
                          `R$ ${item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.comentarios} 
                          onChange={(e) => updateItem(item.id, 'comentarios', e.target.value)}
                          placeholder="Observações"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-yellow-100 dark:bg-yellow-900/20 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">
                      {itens.reduce((sum, item) => sum + item.quantidade, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      {(calcularValorTotal() / itens.reduce((sum, item) => sum + item.quantidade, 0) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center text-lg">
                      R$ {calcularValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre a medição"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/controle-alimentacao/medicao')}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={uploading}
          >
            <Save className="h-4 w-4 mr-2" />
            {uploading ? 'Salvando...' : 'Salvar Medição'}
          </Button>
        </div>
      </div>
    </div>
  );
}
