import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FuelTransaction, FuelImportResult } from "@/types/fuel";
import * as XLSX from 'xlsx';

interface FuelReportImportComponentProps {
  onImport: (data: FuelTransaction[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FuelReportImportComponent: React.FC<FuelReportImportComponentProps> = ({
  onImport,
  loading,
  setLoading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File): Promise<void> => {
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Arquivo Inválido",
        description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx, .xls)",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo Muito Grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const data = await parseFile(file);
      
      if (data.length === 0) {
        throw new Error("Nenhuma linha de dados válida encontrada no arquivo");
      }

      // Adicionar metadados
      const processedData: FuelTransaction[] = data.map((row, index) => ({
        ...row,
        id: `${Date.now()}_${index}`,
        data_upload: new Date().toISOString(),
        usuario_responsavel: "Usuario Atual" // Substitua pela lógica de usuário real
      }));

      onImport(processedData);
      
      toast({
        title: "Importação Realizada",
        description: `${processedData.length} registros importados com sucesso`
      });

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro na Importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const parseFile = async (file: File): Promise<FuelTransaction[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let jsonData: any[] = [];

          if (file.name.toLowerCase().endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
            
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
                const row: any = {};
                headers.forEach((header, index) => {
                  row[header] = values[index] || '';
                });
                jsonData.push(row);
              }
            }
          } else {
            // Parse Excel
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
          }

          // Mapear colunas para nossa estrutura
          const mappedData: Partial<FuelTransaction>[] = jsonData.map(row => ({
            motorista: row['Motorista'] || row['motorista'] || '',
            centro_custo: row['Centro de Custo'] || row['centro_custo'] || '',
            placa: row['Placa'] || row['placa'] || '',
            modelo_veiculo: row['Modelo do Veículo'] || row['modelo_veiculo'] || '',
            tipo_cartao: row['Tipo Cartão'] || row['tipo_cartao'] || '',
            numero_cartao: row['Número do Cartão'] || row['numero_cartao'] || '',
            data_hora_transacao: row['Data/Hora da Transação'] || row['data_hora_transacao'] || '',
            uf_ec: row['UF EC'] || row['uf_ec'] || '',
            cidade_ec: row['Cidade EC'] || row['cidade_ec'] || '',
            nome_ec: row['Nome EC'] || row['nome_ec'] || '',
            tipo_mercadoria: row['Tipo Mercadoria'] || row['tipo_mercadoria'] || '',
            mercadoria: row['Mercadoria'] || row['mercadoria'] || '',
            qtd_mercadoria: parseFloat(row['Qtd. Mercadoria'] || row['qtd_mercadoria'] || '0'),
            valor: parseFloat(row['Valor'] || row['valor'] || '0')
          })).filter(row => row.placa && row.motorista); // Filtrar linhas com dados essenciais

          resolve(mappedData as FuelTransaction[]);

          
        } catch (error) {
          reject(new Error('Erro ao processar arquivo: ' + (error as Error).message));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {loading ? "Importando..." : "Upload Relatório"}
      </Button>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Área de drag and drop */}
      <Card
        className={`
          ${dragActive ? 'border-primary bg-primary/5' : 'border-dashed border-muted-foreground/25'}
          transition-colors cursor-pointer hover:border-primary/50
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex items-center gap-2 p-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Arraste o arquivo aqui
          </span>
        </CardContent>
      </Card>
    </div>
  );
};