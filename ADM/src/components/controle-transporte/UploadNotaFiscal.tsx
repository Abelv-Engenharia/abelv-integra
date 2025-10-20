import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NotaFiscalData {
  numero: string;
  serie: string;
  chaveAcesso: string;
  dataEmissao: string;
  valorNF: number;
  xmlFile?: File;
  pdfFile?: File;
}

interface UploadNotaFiscalProps {
  onDataChange: (data: NotaFiscalData) => void;
  valorMedicao: number;
  readOnly?: boolean;
}

export default function UploadNotaFiscal({ onDataChange, valorMedicao, readOnly = false }: UploadNotaFiscalProps) {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [nfData, setNfData] = useState<NotaFiscalData>({
    numero: '',
    serie: '',
    chaveAcesso: '',
    dataEmissao: '',
    valorNF: 0
  });

  const handleXmlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xml')) {
        toast.error('Por favor, selecione um arquivo XML');
        return;
      }
      setXmlFile(file);
      
      // Simular extração de dados do XML
      const mockData = {
        numero: '179990',
        serie: '1',
        chaveAcesso: '35190800000000000000000000000000000000000000',
        dataEmissao: new Date().toISOString().split('T')[0],
        valorNF: valorMedicao
      };
      
      setNfData(mockData);
      onDataChange({ ...mockData, xmlFile: file, pdfFile });
      toast.success('XML carregado e dados extraídos com sucesso');
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        toast.error('Por favor, selecione um arquivo PDF');
        return;
      }
      setPdfFile(file);
      onDataChange({ ...nfData, xmlFile, pdfFile: file });
      toast.success('PDF anexado com sucesso');
    }
  };

  const removeFile = (type: 'xml' | 'pdf') => {
    if (type === 'xml') {
      setXmlFile(null);
      setNfData({ numero: '', serie: '', chaveAcesso: '', dataEmissao: '', valorNF: 0 });
      onDataChange({ numero: '', serie: '', chaveAcesso: '', dataEmissao: '', valorNF: 0, pdfFile });
    } else {
      setPdfFile(null);
      onDataChange({ ...nfData, xmlFile, pdfFile: undefined });
    }
  };

  const validateValor = () => {
    const diff = Math.abs(nfData.valorNF - valorMedicao);
    const tolerance = valorMedicao * 0.005; // 0.5%
    
    if (diff > tolerance) {
      return {
        valid: false,
        message: `Divergência: R$ ${diff.toFixed(2)} (>${tolerance.toFixed(2)})`
      };
    }
    return { valid: true, message: 'Valores compatíveis' };
  };

  const valorValidation = nfData.valorNF > 0 ? validateValor() : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nota Fiscal</CardTitle>
        <CardDescription>Anexe os arquivos XML e PDF da nota fiscal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de Arquivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-red-500">Arquivo XML *</Label>
            {!xmlFile ? (
              <Button variant="outline" className="w-full h-24 border-dashed" asChild disabled={readOnly}>
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Clique ou arraste o XML</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xml"
                    onChange={handleXmlUpload}
                    disabled={readOnly}
                  />
                </label>
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50 border-green-200">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="flex-1 text-sm truncate">{xmlFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile('xml')}
                  disabled={readOnly}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-red-500">Arquivo PDF *</Label>
            {!pdfFile ? (
              <Button variant="outline" className="w-full h-24 border-dashed" asChild disabled={readOnly}>
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Clique ou arraste o PDF</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    disabled={readOnly}
                  />
                </label>
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50 border-green-200">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="flex-1 text-sm truncate">{pdfFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile('pdf')}
                  disabled={readOnly}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Dados Extraídos do XML */}
        {xmlFile && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm">Dados da Nota Fiscal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={nfData.numero}
                  onChange={(e) => {
                    const updated = { ...nfData, numero: e.target.value };
                    setNfData(updated);
                    onDataChange({ ...updated, xmlFile, pdfFile });
                  }}
                  disabled={readOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie">Série *</Label>
                <Input
                  id="serie"
                  value={nfData.serie}
                  onChange={(e) => {
                    const updated = { ...nfData, serie: e.target.value };
                    setNfData(updated);
                    onDataChange({ ...updated, xmlFile, pdfFile });
                  }}
                  disabled={readOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataEmissao">Data Emissão *</Label>
                <Input
                  id="dataEmissao"
                  type="date"
                  value={nfData.dataEmissao}
                  onChange={(e) => {
                    const updated = { ...nfData, dataEmissao: e.target.value };
                    setNfData(updated);
                    onDataChange({ ...updated, xmlFile, pdfFile });
                  }}
                  disabled={readOnly}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="chaveAcesso">Chave de Acesso *</Label>
                <Input
                  id="chaveAcesso"
                  value={nfData.chaveAcesso}
                  onChange={(e) => {
                    const updated = { ...nfData, chaveAcesso: e.target.value };
                    setNfData(updated);
                    onDataChange({ ...updated, xmlFile, pdfFile });
                  }}
                  disabled={readOnly}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorNF">Valor NF (R$) *</Label>
                <Input
                  id="valorNF"
                  type="number"
                  step="0.01"
                  value={nfData.valorNF || ''}
                  onChange={(e) => {
                    const updated = { ...nfData, valorNF: parseFloat(e.target.value) || 0 };
                    setNfData(updated);
                    onDataChange({ ...updated, xmlFile, pdfFile });
                  }}
                  disabled={readOnly}
                />
              </div>
            </div>

            {/* Validação de Valor */}
            {valorValidation && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                valorValidation.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {valorValidation.valid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Valor da Medição: R$ {valorMedicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm">
                    Valor da NF: R$ {nfData.valorNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm ${valorValidation.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {valorValidation.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
