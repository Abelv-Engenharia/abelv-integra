
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { FuncionarioImportData } from "@/types/funcionarios";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ExcelUploadProps {
  onFileProcessed: (data: FuncionarioImportData[]) => void;
  isProcessing: boolean;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({
  onFileProcessed,
  isProcessing
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const processExcelFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Usar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          toast({
            title: "Erro no arquivo",
            description: "O arquivo Excel deve conter pelo menos um cabeçalho e uma linha de dados.",
            variant: "destructive",
          });
          return;
        }

        const headers = (jsonData[0] as string[]).map(h => h?.toString().trim().toLowerCase() || '');
        const funcionarios: FuncionarioImportData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const values = jsonData[i] as any[];
          
          if (!values || values.length === 0) continue;

          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index]?.toString().trim() || '';
          });

          // Mapear campos
          const funcionario: FuncionarioImportData = {
            nome: rowData.nome || '',
            funcao: rowData.funcao || '',
            matricula: rowData.matricula || '',
            cpf: rowData.cpf || '',
            cca_codigo: rowData.cca_codigo || undefined,
            data_admissao: rowData.data_admissao || undefined
          };

          // Só adicionar se pelo menos o nome estiver preenchido
          if (funcionario.nome.trim()) {
            funcionarios.push(funcionario);
          }
        }

        if (funcionarios.length > 0) {
          onFileProcessed(funcionarios);
          toast({
            title: "Arquivo processado",
            description: `${funcionarios.length} registros encontrados no arquivo.`,
          });
        } else {
          toast({
            title: "Nenhum dado encontrado",
            description: "Não foram encontrados dados válidos no arquivo Excel.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao processar Excel:', error);
        toast({
          title: "Erro ao processar arquivo",
          description: "Verifique se o arquivo está no formato Excel correto (.xlsx).",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }, [onFileProcessed, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.toLowerCase();
      if (!fileExtension.endsWith('.xlsx') && !fileExtension.endsWith('.xls')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos Excel (.xlsx ou .xls).",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      processExcelFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileExtension = file.name.toLowerCase();
      if (!fileExtension.endsWith('.xlsx') && !fileExtension.endsWith('.xls')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, arraste apenas arquivos Excel (.xlsx ou .xls).",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  }, [toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
      >
        {selectedFile ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Arraste o arquivo Excel aqui
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar
            </p>
            <Label htmlFor="excel-file">
              <Button variant="outline" asChild>
                <span>Selecionar Arquivo</span>
              </Button>
            </Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isProcessing ? "Processando..." : "Processar Arquivo"}
          </Button>
        </div>
      )}
    </div>
  );
};
