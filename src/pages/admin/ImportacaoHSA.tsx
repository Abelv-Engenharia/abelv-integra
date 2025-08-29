import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, CheckCircle, AlertCircle, Download, Code, FileText } from "lucide-react";
import { HSAExcelUpload } from "@/components/admin/hsa/HSAExcelUpload";
import { HSAImportData } from "@/types/hsaImport";
import { useHSAImport } from "@/hooks/useHSAImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CCACodesTab } from "@/components/admin/funcionarios/CCACodesTab";
import { LogsImportacaoHSA } from "@/components/admin/hsa/LogsImportacaoHSA";
import * as XLSX from "xlsx";

const ImportacaoHSA = () => {
  const [importData, setImportData] = useState<HSAImportData[]>([]);
  const { isValidating, isImporting, validationResults, validateImport, importHSA } = useHSAImport();

  const handleFileProcessed = async (data: HSAImportData[]) => {
    setImportData(data);
    await validateImport(data);
  };

  const handleImport = async () => {
    await importHSA();
    setImportData([]);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        data: "01/01/2024",
        cca_codigo: "001",
        responsavel_inspecao: "João Silva",
        funcao: "Técnico de Segurança",
        tipo_inspecao: "Bloqueio de Energias",
        status: "REALIZADA",
        desvios_identificados: 0,
        observacao: "Inspeção realizada sem intercorrências",
        relatorio_url: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    
    // Definir larguras das colunas
    const columnWidths = [
      { wch: 12 }, // data
      { wch: 12 }, // cca_codigo
      { wch: 25 }, // responsavel_inspecao
      { wch: 20 }, // funcao
      { wch: 25 }, // tipo_inspecao
      { wch: 15 }, // status
      { wch: 18 }, // desvios_identificados
      { wch: 40 }, // observacao
      { wch: 30 }, // relatorio_url
    ];
    
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "HSA_Template");
    XLSX.writeFile(workbook, "template_importacao_hsa.xlsx");
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Importação de HSA</h1>
        <p className="text-muted-foreground">
          Importe dados de Hora de Segurança através de planilhas Excel
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload do Arquivo
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs de Importação
          </TabsTrigger>
          <TabsTrigger value="ccas" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Códigos CCA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload e Validação
              </CardTitle>
              <CardDescription>
                Faça upload do arquivo Excel com os dados de HSA para validação e importação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <HSAExcelUpload
                onFileProcessed={handleFileProcessed}
                isProcessing={isValidating || isImporting}
              />

              {importData.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total de Registros</p>
                            <p className="text-2xl font-bold">{importData.length}</p>
                          </div>
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Registros Válidos</p>
                            <p className="text-2xl font-bold text-green-600">{validationResults.valid.length}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Registros com Erro</p>
                            <p className="text-2xl font-bold text-red-600">{validationResults.invalid.length}</p>
                          </div>
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {validationResults.invalid.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p><strong>Encontrados {validationResults.invalid.length} registros com erro:</strong></p>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {validationResults.invalid.slice(0, 5).map((item, index) => (
                              <div key={index} className="text-xs">
                                <strong>Linha {index + 2}:</strong> {item.errors.join(', ')}
                              </div>
                            ))}
                            {validationResults.invalid.length > 5 && (
                              <div className="text-xs">
                                ... e mais {validationResults.invalid.length - 5} erros
                              </div>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validationResults.valid.length > 0 && (
                    <div className="flex justify-end">
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
                            Importar {validationResults.valid.length} registros
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Instruções para preparar o arquivo Excel:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                      <li>Colunas obrigatórias: <code>data</code>, <code>cca_codigo</code>, <code>responsavel_inspecao</code>, <code>status</code></li>
                      <li>Colunas opcionais: <code>funcao</code>, <code>tipo_inspecao</code>, <code>desvios_identificados</code>, <code>observacao</code>, <code>relatorio_url</code></li>
                      <li>Data deve estar no formato DD/MM/AAAA</li>
                      <li>Status deve ser: REALIZADA, NÃO REALIZADA, A REALIZAR, CANCELADA ou REALIZADA (NÃO PROGRAMADA)</li>
                      <li>Tipo de Inspeção: Ex: Bloqueio de Energias, Documentação de Atividade, Segurança na Soldagem, etc.</li>
                    </ul>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar Modelo Excel
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <LogsImportacaoHSA />
        </TabsContent>

        <TabsContent value="ccas">
          <CCACodesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoHSA;