
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, AlertCircle, CheckCircle, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDesvioImport } from "@/hooks/useDesvioImport";
import { DesvioImportData } from "@/types/desviosImport";
import * as XLSX from 'xlsx';

export default function ImportacaoDesvios() {
  const { toast } = useToast();
  const { validateImport, importDesvios, isValidating, isImporting } = useDesvioImport();
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: DesvioImportData[];
    invalid: { data: DesvioImportData; errors: string[] }[];
    duplicates: DesvioImportData[];
    updates: DesvioImportData[];
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationResult(null);
    }
  };

  const processExcelFile = (file: File): Promise<DesvioImportData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('O arquivo deve conter pelo menos um cabeçalho e uma linha de dados.'));
            return;
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];

          // Mapear os dados
          const mappedData: DesvioImportData[] = rows
            .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map((row, index) => {
              const rowData: any = {};
              headers.forEach((header, headerIndex) => {
                if (header && row[headerIndex] !== undefined) {
                  const cleanHeader = header.toString().toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '')
                    .trim();
                  
                  let value = row[headerIndex];
                  
                  // Converter datas do Excel para formato ISO
                  if (cleanHeader.includes('data') && typeof value === 'number') {
                    const excelDate = new Date((value - 25569) * 86400 * 1000);
                    value = excelDate.toISOString().split('T')[0];
                  }
                  
                  rowData[cleanHeader] = value;
                }
              });

              // Mapear campos específicos para o formato esperado
              return {
                data: rowData.data || rowData.data_desvio || '',
                hora: rowData.hora || rowData.hora_desvio || '00:00',
                ano: rowData.ano || new Date().getFullYear().toString(),
                mes: rowData.mes || (new Date().getMonth() + 1).toString(),
                cca_codigo: rowData.cca_codigo || rowData.cca || '',
                tipo_registro: rowData.tipo_registro || '',
                processo: rowData.processo || '',
                evento_identificado: rowData.evento_identificado || '',
                causa_provavel: rowData.causa_provavel || '',
                responsavel_inspecao: rowData.responsavel_inspecao || rowData.responsavel || '',
                empresa: rowData.empresa || '',
                disciplina: rowData.disciplina || '',
                engenheiro_responsavel: rowData.engenheiro_responsavel || '',
                descricao_desvio: rowData.descricao_desvio || rowData.descricao || '',
                base_legal: rowData.base_legal || '',
                supervisor_responsavel: rowData.supervisor_responsavel || '',
                encarregado_responsavel: rowData.encarregado_responsavel || '',
                colaborador_infrator: rowData.colaborador_infrator || '',
                funcao: rowData.funcao || '',
                matricula: rowData.matricula || '',
                tratativa_aplicada: rowData.tratativa_aplicada || '',
                responsavel_acao: rowData.responsavel_acao || '',
                prazo_correcao: rowData.prazo_correcao || '',
                situacao: rowData.situacao || 'Aberto',
                situacao_acao: rowData.situacao_acao || '',
                aplicacao_medida_disciplinar: Boolean(rowData.aplicacao_medida_disciplinar),
                exposicao: rowData.exposicao || '',
                controle: rowData.controle || '',
                deteccao: rowData.deteccao || '',
                efeito_falha: rowData.efeito_falha || '',
                impacto: rowData.impacto || '',
                probabilidade: Number(rowData.probabilidade) || 0,
                severidade: Number(rowData.severidade) || 0,
                classificacao_risco: rowData.classificacao_risco || ''
              } as DesvioImportData;
            });

          resolve(mappedData);
        } catch (error) {
          reject(new Error(`Erro ao processar arquivo Excel: ${error}`));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsBinaryString(file);
    });
  };

  const handleValidate = async () => {
    if (!file) {
      toast({
        title: "Arquivo necessário",
        description: "Por favor, selecione um arquivo para validar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await processExcelFile(file);
      const result = await validateImport(data);
      setValidationResult(result);
    } catch (error) {
      console.error('Erro na validação:', error);
      toast({
        title: "Erro na validação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!validationResult || validationResult.valid.length === 0) {
      toast({
        title: "Nada para importar",
        description: "Não há registros válidos para importar.",
        variant: "destructive",
      });
      return;
    }

    try {
      await importDesvios(validationResult.valid, file?.name);
      setValidationResult(null);
      setFile(null);
      // Reset do input file
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Erro na importação:', error);
    }
  };

  const downloadTemplate = () => {
    const template = [
      [
        'data', 'hora', 'cca_codigo', 'responsavel_inspecao', 'descricao_desvio',
        'empresa', 'supervisor_responsavel', 'encarregado_responsavel',
        'colaborador_infrator', 'funcao', 'matricula', 'tratativa_aplicada',
        'situacao', 'base_legal'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_importacao_desvios.xlsx");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Importação de Desvios</h1>
          <p className="text-muted-foreground">
            Importe desvios em lote através de arquivos Excel
          </p>
        </div>
        <Button onClick={downloadTemplate} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Baixar Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload do Arquivo
          </CardTitle>
          <CardDescription>
            Selecione um arquivo Excel (.xlsx) com os dados dos desvios para importar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">Arquivo Excel</Label>
            <Input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isValidating || isImporting}
            />
          </div>

          {file && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Arquivo selecionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleValidate}
              disabled={!file || isValidating || isImporting}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Validando...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Validar Dados
                </>
              )}
            </Button>

            {validationResult && validationResult.valid.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importar Desvios
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {validationResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-600">Válidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {validationResult.valid.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-600">Com Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {validationResult.invalid.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-yellow-600">Duplicados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {validationResult.duplicates.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {validationResult.invalid.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Registros com Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Erros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResult.invalid.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.data.data}</TableCell>
                        <TableCell>{item.data.descricao_desvio}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.errors.map((error, errorIndex) => (
                              <Badge key={errorIndex} variant="destructive" className="text-xs">
                                {error}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {validationResult.invalid.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ... e mais {validationResult.invalid.length - 10} registros com erros
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
