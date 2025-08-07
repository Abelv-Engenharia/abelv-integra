
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { FuncionarioImportData } from "@/types/funcionarios";
import { useToast } from "@/hooks/use-toast";

interface CsvUploadProps {
  onFileProcessed: (data: FuncionarioImportData[]) => void;
  isProcessing: boolean;
}

export const CsvUpload: React.FC<CsvUploadProps> = ({
  onFileProcessed,
  isProcessing
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const processCsvFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast({
            title: "Erro no arquivo",
            description: "O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados.",
            variant: "destructive",
          });
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data: FuncionarioImportData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length !== headers.length) {
            toast({
              title: "Erro na linha " + (i + 1),
              description: "Número de colunas não corresponde ao cabeçalho.",
              variant: "destructive",
            });
            continue;
          }

          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
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

          data.push(funcionario);
        }

        if (data.length > 0) {
          onFileProcessed(data);
          toast({
            title: "Arquivo processado",
            description: `${data.length} registros encontrados no arquivo.`,
          });
        }
      } catch (error) {
        console.error('Erro ao processar CSV:', error);
        toast({
          title: "Erro ao processar arquivo",
          description: "Verifique se o arquivo está no formato CSV correto.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  }, [onFileProcessed, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos CSV.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      processCsvFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, arraste apenas arquivos CSV.",
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
            <FileText className="h-8 w-8 text-blue-600" />
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
              Arraste o arquivo CSV aqui
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar
            </p>
            <Label htmlFor="csv-file">
              <Button variant="outline" asChild>
                <span>Selecionar Arquivo</span>
              </Button>
            </Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
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
