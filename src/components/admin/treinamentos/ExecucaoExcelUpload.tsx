
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { ExecucaoTreinamentoImportData } from "@/types/treinamentosExecucaoImport";

interface ExcelUploadProps {
  onFileProcessed: (data: ExecucaoTreinamentoImportData[], fileName?: string) => void;
  isProcessing?: boolean;
}

export const ExecucaoExcelUpload = ({ onFileProcessed, isProcessing }: ExcelUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const parseExcelDate = (excelDate: number): string | null => {
    if (typeof excelDate !== 'number') return null;
    const date = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setProcessingError(null);
      await processFile(file);
    }
  }, []);

  const processFile = async (file: File) => {
    try {
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Arquivo deve ser do tipo Excel (.xlsx ou .xls)');
      }
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!rawData || rawData.length < 2) {
        throw new Error('A planilha deve conter cabeçalho e pelo menos uma linha de dados');
      }

      const dataRows = rawData.slice(1).filter((row: any) => Array.isArray(row) && row.some((c: any) => c !== null && c !== undefined && c !== ''));

      const data: ExecucaoTreinamentoImportData[] = dataRows.map((row: any) => {
        const item: ExecucaoTreinamentoImportData = {};
        // Colunas esperadas:
        // 0: data, 1: cca_codigo, 2: processo_treinamento, 3: tipo_treinamento,
        // 4: carga_horaria, 5: efetivo_mod, 6: efetivo_moi, 7: observacoes
        if (row[0]) {
          if (typeof row[0] === 'number') item.data = parseExcelDate(row[0]);
          else if (typeof row[0] === 'string') item.data = row[0].trim();
        }
        item.cca_codigo = row[1] ? String(row[1]).trim() : '';
        item.processo_treinamento = row[2] ? String(row[2]).trim() : '';
        item.tipo_treinamento = row[3] ? String(row[3]).trim() : '';
        item.carga_horaria = row[4] ?? '';
        item.efetivo_mod = row[5] ?? 0;
        item.efetivo_moi = row[6] ?? 0;
        item.observacoes = row[7] ? String(row[7]).trim() : '';
        return item;
      });

      onFileProcessed(data, file.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar o arquivo';
      setProcessingError(errorMessage);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProcessingError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
          isDragActive ? 'border-primary' : 'border-muted-foreground/50'
        } ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste e solte o arquivo Excel aqui, ou clique para selecionar'}
          </p>
        </div>
      </div>

      {processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erro ao processar arquivo:</strong> {processingError}
          </AlertDescription>
        </Alert>
      )}

      {uploadedFile && !processingError && (
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Upload className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium">{uploadedFile.name}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemoveFile}>
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
