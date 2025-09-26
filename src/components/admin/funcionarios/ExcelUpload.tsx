
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { FuncionarioImportData } from "@/types/funcionarios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";

interface ExcelUploadProps {
  onFileProcessed: (data: FuncionarioImportData[], fileName?: string) => void;
  isProcessing?: boolean;
}

export const ExcelUpload = ({ onFileProcessed, isProcessing }: ExcelUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const parseExcelDate = (excelDate: number): string | null => {
    if (typeof excelDate !== 'number') {
      return null;
    }
  
    const date = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  const parseBrazilianDate = (dateStr: string): string | null => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    
    const cleanDate = dateStr.trim();
    
    // Formato DD/MM/AAAA ou DD/MM/AA
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
    const match = cleanDate.match(dateRegex);
    
    if (!match) return null;
    
    let [, day, month, year] = match;
    
    // Normalizar ano de 2 dígitos
    if (year.length === 2) {
      const yearNum = parseInt(year);
      year = yearNum >= 50 ? `19${year}` : `20${year}`;
    }
    
    // Validar se é uma data válida
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (dateObj.getDate() !== parseInt(day) || 
        dateObj.getMonth() !== parseInt(month) - 1 || 
        dateObj.getFullYear() !== parseInt(year)) {
      return null;
    }
    
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  const parseAtivoStatus = (value: any): boolean => {
    if (value === null || value === undefined || value === '') {
      return true; // Padrão: ativo se não informado
    }
    
    const strValue = String(value).toLowerCase().trim();
    
    // Valores que indicam ativo
    if (['sim', 's', 'ativo', 'true', '1'].includes(strValue)) {
      return true;
    }
    
    // Valores que indicam inativo
    if (['não', 'nao', 'n', 'inativo', 'demitido', 'false', '0'].includes(strValue)) {
      return false;
    }
    
    // Padrão: ativo se não reconhecido
    return true;
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
      console.log('Processando arquivo:', file.name);
      
      // Verificar se o arquivo é válido
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Arquivo deve ser do tipo Excel (.xlsx ou .xls)');
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('O arquivo Excel não contém planilhas válidas');
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('Dados brutos extraídos:', rawData);

      if (!rawData || rawData.length === 0) {
        throw new Error('A planilha está vazia');
      }

      if (rawData.length < 2) {
        throw new Error('A planilha deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
      }

      // Verificar se há dados após o cabeçalho
      const dataRows = rawData.slice(1).filter(row => row && Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== ''));
      
      if (dataRows.length === 0) {
        throw new Error('Não foram encontradas linhas de dados válidas na planilha');
      }

      const data: FuncionarioImportData[] = dataRows.map((row: any, index: number) => {
        console.log(`Processando linha ${index + 2}:`, row);
        
        const item: FuncionarioImportData = {
          nome: row[0] ? String(row[0]).trim() : '',
          funcao: row[1] ? String(row[1]).trim() : '',
          matricula: row[2] ? String(row[2]).trim() : '',
          cpf: row[3] ? String(row[3]).trim() : '',
          cca_codigo: row[4] ? String(row[4]).trim() : '',
        };

        // Processar data de admissão (posição 5)
        if (row[5]) {
          if (typeof row[5] === 'number') {
            const parsedDate = parseExcelDate(row[5]);
            item.data_admissao = parsedDate;
          } else if (typeof row[5] === 'string') {
            const parsedBrazilianDate = parseBrazilianDate(row[5]);
            item.data_admissao = parsedBrazilianDate || row[5].trim();
          } else {
            console.warn(`Data de admissão inválida na linha ${index + 2}:`, row[5]);
          }
        }

        // Processar status ativo (posição 6)
        item.ativo = parseAtivoStatus(row[6]);

        return item;
      });

      console.log('Dados processados:', data);

      if (data.length === 0) {
        throw new Error('Nenhum registro válido foi encontrado no arquivo');
      }

      onFileProcessed(data, file.name);
    } catch (error) {
      console.error('Erro ao processar arquivo Excel:', error);
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
            {isDragActive
              ? 'Solte o arquivo aqui...'
              : 'Arraste e solte o arquivo Excel aqui, ou clique para selecionar'}
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
