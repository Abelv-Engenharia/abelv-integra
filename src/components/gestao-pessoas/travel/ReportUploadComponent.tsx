import { useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TravelDetailedRecord, Agency } from "@/types/gestao-pessoas/travel";
import * as XLSX from 'xlsx';

interface ReportUploadComponentProps {
  onImport: (records: TravelDetailedRecord[]) => void;
}

export const ReportUploadComponent = ({ onImport }: ReportUploadComponentProps) => {
  const [selectedAgency, setSelectedAgency] = useState<Agency | ''>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState<TravelDetailedRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const calculateAntecedencia = (dataDaCompra: string, checkIn: string): number => {
    const compra = new Date(dataDaCompra);
    const viagem = new Date(checkIn);
    const diffTime = viagem.getTime() - compra.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDentroDaPolitica = (antecedencia: number): boolean => {
    // Política: compras com mais de 7 dias de antecedência estão dentro da política
    return antecedencia >= 7;
  };

  const processOnflyData = (data: any[]): TravelDetailedRecord[] => {
    return data.map((row, index) => {
      const checkIn = row['Check-in'] || row['Data da Viagem'] || '';
      const dataDaCompra = row['Data da Compra'] || '';
      const antecedencia = calculateAntecedencia(dataDaCompra, checkIn);
      
      return {
        id: `onfly-${index + 1}`,
        dataEmissaoFat: row['Data Emissão Fatura'] || new Date().toISOString().split('T')[0],
        agencia: 'Onfly',
        numeroDeFat: row['Número Fatura'] || `ONF-${Date.now()}-${index}`,
        protocolo: row['Protocolo'] || `PROT-${index + 1}`,
        dataDaCompra: dataDaCompra,
        viajante: row['Viajante'] || row['Nome'] || '',
        tipo: row['Tipo'] || 'aereo',
        hospedagem: row['Hotel'] || row['Hospedagem'] || '',
        origem: row['Origem'] || '',
        destino: row['Destino'] || '',
        checkIn: checkIn,
        checkOut: row['Check-out'] || row['Data Retorno'] || '',
        comprador: row['Comprador'] || row['Solicitante'] || '',
        valorPago: parseFloat(row['Valor'] || row['Valor Pago'] || '0'),
        motivoEvento: row['Motivo'] || row['Evento'] || '',
        cca: row['CCA'] || row['Centro de Custo'] || '',
        descricaoCentroDeCusto: row['Descrição CC'] || '',
        antecedencia: antecedencia,
        ciaIda: row['Companhia Ida'] || row['Airline'] || '',
        ciaVolta: row['Companhia Volta'] || row['Airline'] || '',
        possuiBagagem: row['Bagagem'] === 'Sim' ? 'Sim' : 'Não',
        valorPagoDeBagagem: parseFloat(row['Valor Bagagem'] || '0'),
        observacao: row['Observação'] || '',
        quemSolicitouForaPolitica: antecedencia < 7 ? (row['Solicitante'] || '') : '',
        dentroDaPolitica: calculateDentroDaPolitica(antecedencia)
      };
    });
  };

  const processBiztripData = (data: any[]): TravelDetailedRecord[] => {
    return data.map((row, index) => {
      const checkIn = row['Data Check-in'] || row['Data Viagem'] || '';
      const dataDaCompra = row['Data Compra'] || row['Data Solicitação'] || '';
      const antecedencia = calculateAntecedencia(dataDaCompra, checkIn);
      
      return {
        id: `biztrip-${index + 1}`,
        dataEmissaoFat: row['Data Fatura'] || new Date().toISOString().split('T')[0],
        agencia: 'Biztrip',
        numeroDeFat: row['Nº Fatura'] || `BZT-${Date.now()}-${index}`,
        protocolo: row['Protocolo'] || `PROT-BZT-${index + 1}`,
        dataDaCompra: dataDaCompra,
        viajante: row['Passageiro'] || row['Viajante'] || '',
        tipo: row['Serviço'] || row['Tipo'] || 'aereo',
        hospedagem: row['Hotel'] || '',
        origem: row['Origem'] || '',
        destino: row['Destino'] || '',
        checkIn: checkIn,
        checkOut: row['Data Check-out'] || row['Data Retorno'] || '',
        comprador: row['Responsável'] || row['Gestor'] || '',
        valorPago: parseFloat(row['Valor Total'] || row['Valor'] || '0'),
        motivoEvento: row['Justificativa'] || row['Motivo'] || '',
        cca: row['Centro Custo'] || row['CC'] || '',
        descricaoCentroDeCusto: row['Descrição Centro Custo'] || '',
        antecedencia: antecedencia,
        ciaIda: row['Cia Aérea'] || row['Companhia'] || '',
        ciaVolta: row['Cia Aérea Volta'] || row['Companhia'] || '',
        possuiBagagem: row['Possui Bagagem'] === 'Sim' ? 'Sim' : 'Não',
        valorPagoDeBagagem: parseFloat(row['Taxa Bagagem'] || '0'),
        observacao: row['Obs'] || row['Observações'] || '',
        quemSolicitouForaPolitica: antecedencia < 7 ? (row['Responsável'] || '') : '',
        dentroDaPolitica: calculateDentroDaPolitica(antecedencia)
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedAgency) {
      setErrorMessage('Seleccione uma agência e um arquivo');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          setUploadProgress(50);
          
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          setUploadProgress(75);

          let processedData: TravelDetailedRecord[];
          if (selectedAgency === 'Onfly') {
            processedData = processOnflyData(jsonData);
          } else {
            processedData = processBiztripData(jsonData);
          }

          setPreviewData(processedData);
          setShowPreview(true);
          setUploadProgress(100);
          setUploadStatus('success');
        } catch (error) {
          setErrorMessage('Erro ao processar arquivo. Verifique se o formato está correto.');
          setUploadStatus('error');
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      setErrorMessage('Erro ao ler arquivo');
      setUploadStatus('error');
    }
  };

  const handleConfirmImport = () => {
    onImport(previewData);
    setShowPreview(false);
    setPreviewData([]);
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  const handleCancelImport = () => {
    setShowPreview(false);
    setPreviewData([]);
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar Relatório Detalhado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPreview ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Agência</label>
              <Select value={selectedAgency} onValueChange={(value: Agency) => setSelectedAgency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione a agência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onfly">Onfly</SelectItem>
                  <SelectItem value="Biztrip">Biztrip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Arquivo do Relatório</label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={!selectedAgency || uploadStatus === 'uploading'}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: Excel (.xlsx, .xls), CSV
              </p>
            </div>

            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground">Processando arquivo...</p>
              </div>
            )}

            {uploadStatus === 'error' && errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Arquivo processado com sucesso! {previewData.length} registros encontrados.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{previewData.length}</div>
                <div className="text-sm text-muted-foreground">Total Registros</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {previewData.filter(r => r.dentroDaPolitica).length}
                </div>
                <div className="text-sm text-muted-foreground">Dentro da Política</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {previewData.filter(r => !r.dentroDaPolitica).length}
                </div>
                <div className="text-sm text-muted-foreground">Fora da Política</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  R$ {previewData.reduce((sum, r) => sum + r.valorPago, 0).toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-muted-foreground">Valor Total</div>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Viajante</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Valor</th>
                    <th className="p-2 text-left">Política</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((record) => (
                    <tr key={record.id} className="border-t">
                      <td className="p-2">{record.viajante}</td>
                      <td className="p-2">
                        <Badge variant="outline">{record.tipo}</Badge>
                      </td>
                      <td className="p-2">R$ {record.valorPago.toLocaleString('pt-BR')}</td>
                      <td className="p-2">
                        <Badge variant={record.dentroDaPolitica ? "default" : "destructive"}>
                          {record.dentroDaPolitica ? "Conforme" : "Não Conforme"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="p-2 text-center text-sm text-muted-foreground border-t">
                  E mais {previewData.length - 10} registros...
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelImport}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmImport}>
                Confirmar Importação
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};