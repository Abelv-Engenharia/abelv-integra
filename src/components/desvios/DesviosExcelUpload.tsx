import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { DesvioImportData } from "@/types/desviosImport";

interface ExcelUploadProps {
  onFileProcessed: (data: DesvioImportData[], fileName?: string) => void;
  isProcessing?: boolean;
}

export const DesviosExcelUpload = ({ onFileProcessed, isProcessing }: ExcelUploadProps) => {
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

      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const jsonData = dataRows.map((row: any) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      const nonEmptyRows = jsonData.filter((row) =>
        Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== '')
      );

      const data: DesvioImportData[] = nonEmptyRows.map((row: any) => {
        const item: DesvioImportData = {};
        
        const d = row['data_desvio'];
        if (d !== undefined && d !== null && d !== '') {
          if (typeof d === 'number') item.data_desvio = parseExcelDate(d);
          else item.data_desvio = String(d);
        }

        if (row['hora_desvio']) item.hora_desvio = String(row['hora_desvio']).trim();
        if (row['cca_codigo']) item.cca_codigo = String(row['cca_codigo']).trim();
        if (row['tipo_registro']) item.tipo_registro = String(row['tipo_registro']).trim();
        if (row['processo']) item.processo = String(row['processo']).trim();
        if (row['evento_identificado']) item.evento_identificado = String(row['evento_identificado']).trim();
        if (row['causa_provavel']) item.causa_provavel = String(row['causa_provavel']).trim();
        if (row['responsavel_inspecao']) item.responsavel_inspecao = String(row['responsavel_inspecao']).trim();
        if (row['empresa']) item.empresa = String(row['empresa']).trim();
        if (row['disciplina']) item.disciplina = String(row['disciplina']).trim();
        if (row['engenheiro_responsavel']) item.engenheiro_responsavel = String(row['engenheiro_responsavel']).trim();
        if (row['supervisor_responsavel']) item.supervisor_responsavel = String(row['supervisor_responsavel']).trim();
        if (row['encarregado_responsavel']) item.encarregado_responsavel = String(row['encarregado_responsavel']).trim();
        if (row['descricao_desvio']) item.descricao_desvio = String(row['descricao_desvio']).trim();
        if (row['base_legal']) item.base_legal = String(row['base_legal']).trim();
        if (row['colaborador_infrator']) item.colaborador_infrator = String(row['colaborador_infrator']).trim();
        if (row['funcao']) item.funcao = String(row['funcao']).trim();
        if (row['matricula']) item.matricula = String(row['matricula']).trim();
        if (row['acao_imediata']) item.acao_imediata = String(row['acao_imediata']).trim();
        if (row['tratativa_aplicada']) item.tratativa_aplicada = String(row['tratativa_aplicada']).trim();
        if (row['responsavel_acao']) item.responsavel_acao = String(row['responsavel_acao']).trim();
        
        const pc = row['prazo_conclusao'];
        if (pc !== undefined && pc !== null && pc !== '') {
          if (typeof pc === 'number') item.prazo_conclusao = parseExcelDate(pc);
          else item.prazo_conclusao = String(pc);
        }
        
        if (row['status']) item.status = String(row['status']).trim();
        if (row['exposicao']) item.exposicao = String(row['exposicao']).trim();
        if (row['controle']) item.controle = String(row['controle']).trim();
        if (row['deteccao']) item.deteccao = String(row['deteccao']).trim();
        if (row['efeito_falha']) item.efeito_falha = String(row['efeito_falha']).trim();
        if (row['impacto']) item.impacto = String(row['impacto']).trim();
        if (row['imagem_url']) item.imagem_url = String(row['imagem_url']).trim();

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
