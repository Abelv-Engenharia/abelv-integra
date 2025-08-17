import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { HSAImportData } from "@/types/hsaImport";

interface ExcelUploadProps {
  onFileProcessed: (data: HSAImportData[], fileName?: string) => void;
  isProcessing?: boolean;
}

export const HSAExcelUpload = ({ onFileProcessed, isProcessing }: ExcelUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const parseExcelDate = (excelDate: number): string => {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const processFile = async (file: File) => {
    try {
      setProcessingError(null);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const rows = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null,
      });

      if (rows.length === 0) {
        throw new Error('Planilha está vazia');
      }

      // Primeira linha são os cabeçalhos
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      // Converter para objetos com os cabeçalhos
      const jsonData = dataRows.map((row: any) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      // Filtrar linhas vazias
      const nonEmptyRows = jsonData.filter((row) =>
        Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== '')
      );

      const data: HSAImportData[] = nonEmptyRows.map((row: any) => {
        const item: HSAImportData = {};
        
        // Cabeçalhos esperados: data, cca_codigo, responsavel_inspecao, funcao, inspecao_programada, status, desvios_identificados, observacao, relatorio_url
        const d = row['data'];
        if (d !== undefined && d !== null && d !== '') {
          if (typeof d === 'number') item.data = parseExcelDate(d);
          else item.data = String(d);
        }

        if (row['cca_codigo']) item.cca_codigo = String(row['cca_codigo']).trim();
        if (row['responsavel_inspecao']) item.responsavel_inspecao = String(row['responsavel_inspecao']).trim();
        if (row['funcao']) item.funcao = String(row['funcao']).trim();
        if (row['inspecao_programada']) item.inspecao_programada = String(row['inspecao_programada']).trim();
        if (row['status']) item.status = String(row['status']).trim();
        if (row['desvios_identificados']) item.desvios_identificados = Number(row['desvios_identificados']) || 0;
        if (row['observacao']) item.observacao = String(row['observacao']).trim();
        if (row['relatorio_url']) item.relatorio_url = String(row['relatorio_url']).trim();

        return item;
      });

      onFileProcessed(data, file.name);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setProcessingError(error instanceof Error ? error.message : 'Erro desconhecido ao processar arquivo');
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        processFile(file);
      }
    },
    [onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setProcessingError(null);
  };

  return (
    <div className="space-y-4">
      {processingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo Excel aqui'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            ou clique para selecionar um arquivo (.xlsx, .xls)
          </p>
          <Button variant="outline" disabled={isProcessing}>
            {isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};