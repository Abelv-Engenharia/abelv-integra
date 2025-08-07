import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { FuncionarioImportData } from "@/types/funcionarios";
import * as XLSX from "xlsx";

interface ExcelUploadProps {
  onFileProcessed: (data: FuncionarioImportData[], fileName?: string) => void;
  isProcessing?: boolean;
}

export const ExcelUpload = ({ onFileProcessed, isProcessing }: ExcelUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const parseExcelDate = (excelDate: number): string | null => {
    if (typeof excelDate !== 'number') {
      return null;
    }
  
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
      await processFile(file);
    }
  }, []);

  const processFile = async (file: File) => {
    try {
      console.log('Processando arquivo:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerMap: { [key: string]: string } = {
        nome: 'nome',
        funcao: 'funcao',
        matricula: 'matricula',
        cpf: 'cpf',
        cca_codigo: 'cca_codigo',
        data_admissao: 'data_admissao'
      };

      const data: FuncionarioImportData[] = rawData.slice(1).map((row: any) => {
        const item: FuncionarioImportData = {
          nome: row[0],
          funcao: row[1],
          matricula: row[2],
          cpf: row[3],
          cca_codigo: row[4],
        };

        if (row[5]) {
          if (typeof row[5] === 'number') {
            const parsedDate = parseExcelDate(row[5]);
            item.data_admissao = parsedDate;
          } else {
            item.data_admissao = row[5];
          }
        }

        return item;
      });

      console.log('Dados processados com sucesso:', data.length, 'registros');
      onFileProcessed(data, file.name); // Passar o nome do arquivo
    } catch (error) {
      console.error('Erro ao processar arquivo Excel:', error);
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

      {uploadedFile && (
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
