import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useSupabaseDocuments, SupabaseDocument } from '@/hooks/useSupabaseDocuments';
import { DISCIPLINAS, TIPOS_DOCUMENTO, FORMATOS } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ImportPreview {
  data: Partial<SupabaseDocument>[];
  errors: ImportError[];
  totalRows: number;
}

export function LMDImporter() {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importComplete, setImportComplete] = useState(false);
  const { toast } = useToast();
  const { addDocument } = useSupabaseDocuments();

  const generateTemplate = () => {
    const template = [
      {
        'Número': 'DOC-001',
        'Título': 'Memorial Descritivo do Sistema',
        'Disciplina': 'Civil',
        'Tipo': 'Memorial Descritivo',
        'Formato': 'PDF',
        'Versão Atual': 'R00',
        'Data Revisão': '2024-01-15',
        'Status': 'elaboracao',
        'Responsável Emissão': 'João Silva',
        'Responsável Revisão': 'Maria Santos',
        'Cliente': 'Petrobras',
        'Projeto': 'FPSO P-80',
        'Observações': 'Documento em elaboração'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template LMD');
    XLSX.writeFile(wb, 'template_lmd.xlsx');
  };

  const validateRow = (row: any, index: number): ImportError[] => {
    const errors: ImportError[] = [];
    
    // Campos obrigatórios
    if (!row['Número']) {
      errors.push({ row: index + 2, field: 'Número', message: 'Campo obrigatório' });
    }
    if (!row['Título']) {
      errors.push({ row: index + 2, field: 'Título', message: 'Campo obrigatório' });
    }
    if (!row['Disciplina']) {
      errors.push({ row: index + 2, field: 'Disciplina', message: 'Campo obrigatório' });
    }
    if (!row['Tipo']) {
      errors.push({ row: index + 2, field: 'Tipo', message: 'Campo obrigatório' });
    }
    if (!row['Formato']) {
      errors.push({ row: index + 2, field: 'Formato', message: 'Campo obrigatório' });
    }
    if (!row['Responsável Emissão']) {
      errors.push({ row: index + 2, field: 'Responsável Emissão', message: 'Campo obrigatório' });
    }
    if (!row['Cliente']) {
      errors.push({ row: index + 2, field: 'Cliente', message: 'Campo obrigatório' });
    }
    if (!row['Projeto']) {
      errors.push({ row: index + 2, field: 'Projeto', message: 'Campo obrigatório' });
    }

    // Validações de valores
    if (row['Disciplina'] && !DISCIPLINAS.includes(row['Disciplina'])) {
      errors.push({ 
        row: index + 2, 
        field: 'Disciplina', 
        message: `Valor inválido. Use: ${DISCIPLINAS.join(', ')}` 
      });
    }

    if (row['Tipo'] && !TIPOS_DOCUMENTO.includes(row['Tipo'])) {
      errors.push({ 
        row: index + 2, 
        field: 'Tipo', 
        message: `Valor inválido. Use: ${TIPOS_DOCUMENTO.join(', ')}` 
      });
    }

    if (row['Formato'] && !FORMATOS.includes(row['Formato'])) {
      errors.push({ 
        row: index + 2, 
        field: 'Formato', 
        message: `Valor inválido. Use: ${FORMATOS.join(', ')}` 
      });
    }

    if (row['Status'] && !['elaboracao', 'revisao', 'aprovado', 'obsoleto'].includes(row['Status'])) {
      errors.push({ 
        row: index + 2, 
        field: 'Status', 
        message: 'Valor inválido. Use: elaboracao, revisao, aprovado, obsoleto' 
      });
    }

    // Validação de data
    if (row['Data Revisão']) {
      const date = new Date(row['Data Revisão']);
      if (isNaN(date.getTime())) {
        errors.push({ 
          row: index + 2, 
          field: 'Data Revisão', 
          message: 'Data inválida. Use formato YYYY-MM-DD' 
        });
      }
    }

    return errors;
  };

  const mapRowToDocument = (row: any): Partial<SupabaseDocument> => {
    return {
      numero: row['Número'],
      titulo: row['Título'],
      disciplina: row['Disciplina'],
      tipo: row['Tipo'],
      formato: row['Formato'],
      versao_atual: row['Versão Atual'] || 'R00',
      data_revisao: row['Data Revisão'] || new Date().toISOString().split('T')[0],
      status: row['Status'] || 'elaboracao',
      responsavel_emissao: row['Responsável Emissão'],
      responsavel_revisao: row['Responsável Revisão'],
      cliente: row['Cliente'],
      projeto: row['Projeto'],
      observacoes: row['Observações']
    };
  };

  const processFile = async (file: File) => {
    return new Promise<ImportPreview>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const errors: ImportError[] = [];
          const documents: Partial<SupabaseDocument>[] = [];

          jsonData.forEach((row: any, index: number) => {
            const rowErrors = validateRow(row, index);
            errors.push(...rowErrors);
            
            if (rowErrors.length === 0) {
              documents.push(mapRowToDocument(row));
            }
          });

          resolve({
            data: documents,
            errors,
            totalRows: jsonData.length
          });
        } catch (error) {
          reject(new Error('Erro ao processar arquivo Excel'));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setImporting(true);
    setImportProgress(0);

    try {
      setImportProgress(25);
      const previewData = await processFile(file);
      setImportProgress(50);
      setPreview(previewData);
      
      toast({
        title: "Arquivo processado",
        description: `${previewData.data.length} documentos válidos encontrados`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao processar arquivo",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  }, [toast]);

  const executeImport = async () => {
    if (!preview) return;

    setImporting(true);
    setImportProgress(0);

    try {
      let successCount = 0;
      const total = preview.data.length;

      for (let i = 0; i < preview.data.length; i++) {
        const document = preview.data[i];
        try {
          await addDocument(document as Omit<SupabaseDocument, 'id' | 'created_at' | 'updated_at'>);
          successCount++;
        } catch (error) {
          console.error('Erro ao importar documento:', error);
        }
        setImportProgress(((i + 1) / total) * 100);
      }

      // Log da importação
      await supabase.from('import_logs').insert([{
        filename: preview.totalRows > 0 ? 'importacao_lmd.xlsx' : 'arquivo_vazio.xlsx',
        total_rows: preview.totalRows,
        success_count: successCount,
        error_count: preview.data.length - successCount,
        errors: JSON.stringify(preview.errors)
      }]);

      setImportComplete(true);
      toast({
        title: "Importação concluída",
        description: `${successCount} documentos importados com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const resetImport = () => {
    setPreview(null);
    setImportComplete(false);
    setImportProgress(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: importing || !!preview
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Importação de LMD via Excel
        </CardTitle>
        <CardDescription>
          Importe múltiplos documentos de uma planilha Excel. Baixe o template para ver o formato correto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium">Template Excel</p>
            <p className="text-sm text-muted-foreground">
              Baixe o modelo para estruturar seus dados corretamente
            </p>
          </div>
          <Button onClick={generateTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Upload Area */}
        {!preview && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${importing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Solte o arquivo Excel aqui...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Arraste um arquivo Excel aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Formatos suportados: .xlsx, .xls
                </p>
              </div>
            )}
          </div>
        )}

        {/* Processing Progress */}
        {importing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processando arquivo...</span>
              <span>{Math.round(importProgress)}%</span>
            </div>
            <Progress value={importProgress} />
          </div>
        )}

        {/* Preview Results */}
        {preview && !importComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Prévia da Importação</h4>
              <Button onClick={resetImport} variant="outline" size="sm">
                Cancelar
              </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">{preview.totalRows}</p>
                <p className="text-sm text-muted-foreground">Total de linhas</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{preview.data.length}</p>
                <p className="text-sm text-muted-foreground">Documentos válidos</p>
              </div>
              <div className="text-center p-4 bg-danger/10 rounded-lg">
                <p className="text-2xl font-bold text-danger">{preview.errors.length}</p>
                <p className="text-sm text-muted-foreground">Erros encontrados</p>
              </div>
            </div>

            {/* Errors */}
            {preview.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erros encontrados ({preview.errors.length})</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {preview.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-xs">
                        Linha {error.row}, Campo "{error.field}": {error.message}
                      </div>
                    ))}
                    {preview.errors.length > 10 && (
                      <div className="text-xs font-medium">
                        ... e mais {preview.errors.length - 10} erro(s)
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Table */}
            {preview.data.length > 0 && (
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <h5 className="font-medium">Documentos que serão importados</h5>
                </div>
                <div className="max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Disciplina</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.data.slice(0, 10).map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{doc.numero}</TableCell>
                          <TableCell className="truncate max-w-48">{doc.titulo}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.disciplina}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doc.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {preview.data.length > 10 && (
                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                      ... e mais {preview.data.length - 10} documento(s)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={executeImport}
                disabled={preview.data.length === 0 || importing}
                className="bg-gradient-primary"
              >
                {importing ? (
                  <>Importando...</>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Importar {preview.data.length} documento(s)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Import Complete */}
        {importComplete && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Importação concluída!</AlertTitle>
            <AlertDescription>
              Os documentos foram importados com sucesso para o sistema.
              <div className="mt-2">
                <Button onClick={resetImport} size="sm">
                  Nova importação
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}