import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, CheckCircle, AlertCircle, Download, Code, FileText } from "lucide-react";
import { ExecucaoExcelUpload } from "@/components/admin/treinamentos/ExecucaoExcelUpload";
import { ExecucaoTreinamentoImportData } from "@/types/treinamentosExecucaoImport";
import { useExecucaoTreinamentosImport } from "@/hooks/useExecucaoTreinamentosImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CCACodesTab } from "@/components/admin/funcionarios/CCACodesTab";
import { LogsImportacaoExecucao } from "@/components/admin/treinamentos/LogsImportacaoExecucao";
import * as XLSX from "xlsx";

const ImportacaoExecucaoTreinamentos = () => {
  const [importData, setImportData] = useState<ExecucaoTreinamentoImportData[]>([]);
  const { isValidating, isImporting, validationResults, validateImport, importExecucoes } = useExecucaoTreinamentosImport();

  const handleFileProcessed = async (data: ExecucaoTreinamentoImportData[]) => {
    setImportData(data);
    await validateImport(data);
  };

  const handleImport = async () => {
    const res = await importExecucoes();
    if (res.success) {
      setImportData([]);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Data': '2024-01-15',
        'CCA Código': '010',
        'Processo de Treinamento': 'Treinamento de Segurança',
        'Tipo de Treinamento': 'Formação',
        'Carga Horária': 8,
        'Efetivo MOD': 15,
        'Efetivo MOI': 3,
        'Observações': 'Treinamento realizado conforme programação'
      },
      {
        'Data': '2024-01-20',
        'CCA Código': '020',
        'Processo de Treinamento': 'Capacitação Técnica',
        'Tipo de Treinamento': 'Reciclagem',
        'Carga Horária': 4,
        'Efetivo MOD': 10,
        'Efetivo MOI': 2,
        'Observações': 'Reciclagem anual obrigatória'
      }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Ajustar largura das colunas
    const wscols = [
      { wch: 12 }, // Data
      { wch: 12 }, // CCA Código
      { wch: 30 }, // Processo de Treinamento
      { wch: 20 }, // Tipo de Treinamento
      { wch: 15 }, // Carga Horária
      { wch: 15 }, // Efetivo MOD
      { wch: 15 }, // Efetivo MOI
      { wch: 40 }  // Observações
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, 'Template Execução');
    
    const timestamp = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `template_execucao_treinamentos_${timestamp}.xlsx`);
  };

  return (
    <div className="container max-w-full mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importação de Execução de Treinamentos</h1>
          <p className="text-muted-foreground">Carregue um arquivo Excel para importar execuções em massa.</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload do Arquivo
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs de Importação
          </TabsTrigger>
          <TabsTrigger value="cca-codes" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Códigos CCA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" /> 
                  Upload do Arquivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar Template Excel
                  </Button>
                </div>

                <ExecucaoExcelUpload onFileProcessed={handleFileProcessed} isProcessing={isValidating || isImporting} />

                {validationResults && (validationResults.valid.length > 0 || validationResults.invalid.length > 0) && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Válidos:</strong> {validationResults.valid.length}
                        </AlertDescription>
                      </Alert>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Inválidos:</strong> {validationResults.invalid.length}
                        </AlertDescription>
                      </Alert>
                    </div>

                    {validationResults.invalid.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Erros encontrados</h3>
                        <div className="space-y-2 max-h-64 overflow-auto border rounded-md p-3">
                          {validationResults.invalid.slice(0, 50).map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">Linha {idx + 2}:</span> {item.errors.join('; ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validationResults.valid.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Pré-visualização (primeiros 10)</h3>
                        <div className="border rounded-md overflow-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left p-2">Data</th>
                                <th className="text-left p-2">CCA</th>
                                <th className="text-left p-2">Processo</th>
                                <th className="text-left p-2">Tipo</th>
                                <th className="text-left p-2">Carga (h)</th>
                                <th className="text-left p-2">EF MOD</th>
                                <th className="text-left p-2">EF MOI</th>
                              </tr>
                            </thead>
                            <tbody>
                              {validationResults.valid.slice(0, 10).map((r, i) => (
                                <tr key={i} className="border-t">
                                  <td className="p-2">{r.data}</td>
                                  <td className="p-2">{r.cca}</td>
                                  <td className="p-2">{r.processo_treinamento}</td>
                                  <td className="p-2">{r.tipo_treinamento}</td>
                                  <td className="p-2">{r.carga_horaria}</td>
                                  <td className="p-2">{r.efetivo_mod}</td>
                                  <td className="p-2">{r.efetivo_moi}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {(validationResults.valid.length > 0) && (
                      <div className="flex justify-end">
                        <Button onClick={handleImport} disabled={isImporting}>
                          {isImporting ? 'Importando...' : `Importar ${validationResults.valid.length} registros`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" /> 
                  Instruções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Prepare um arquivo Excel com as colunas na seguinte ordem:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Data (YYYY-MM-DD ou formato Excel)</li>
                    <li>CCA Código (ex.: 010, 020)</li>
                    <li>Processo de Treinamento</li>
                    <li>Tipo de Treinamento</li>
                    <li>Carga Horária (número)</li>
                    <li>Efetivo MOD (opcional, número)</li>
                    <li>Efetivo MOI (opcional, número)</li>
                    <li>Observações (opcional)</li>
                  </ul>
                  <Alert>
                    <AlertDescription>
                      Os CCAs devem existir previamente. O código será usado para associar o registro ao CCA correto.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <LogsImportacaoExecucao />
        </TabsContent>

        <TabsContent value="cca-codes">
          <CCACodesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoExecucaoTreinamentos;
