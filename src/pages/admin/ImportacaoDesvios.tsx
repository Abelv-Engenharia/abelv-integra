import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, CheckCircle, AlertCircle, Download, Code, FileText } from "lucide-react";
import { DesviosExcelUpload } from "@/components/desvios/DesviosExcelUpload";
import { DesvioImportData } from "@/types/desviosImport";
import { useDesviosImport } from "@/hooks/useDesviosImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CCACodesTab } from "@/components/admin/funcionarios/CCACodesTab";
import { LogsImportacaoDesvios } from "@/components/desvios/LogsImportacaoDesvios";
import * as XLSX from "xlsx";

const ImportacaoDesvios = () => {
  const [importData, setImportData] = useState<DesvioImportData[]>([]);
  const { isValidating, isImporting, validationResults, validateImport, importDesvios } = useDesviosImport();

  const handleFileProcessed = async (data: DesvioImportData[]) => {
    setImportData(data);
    await validateImport(data);
  };

  const handleImport = async () => {
    await importDesvios();
    setImportData([]);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        data_desvio: "01/01/2024",
        hora_desvio: "14:30",
        cca_codigo: "001",
        tipo_registro: "DESVIO",
        processo: "PROCESSO 01",
        evento_identificado: "EV 01",
        causa_provavel: "CAUSA 01",
        responsavel_inspecao: "João Silva",
        empresa: "Empresa ABC",
        disciplina: "DISC 01",
        engenheiro_responsavel: "Engenheiro Responsável",
        supervisor_responsavel: "Supervisor Responsável",
        encarregado_responsavel: "Encarregado Responsável",
        descricao_desvio: "Descrição detalhada do desvio identificado",
        base_legal: "NR-01",
        colaborador_infrator: "Colaborador",
        funcao: "Função",
        matricula: "12345",
        acao_imediata: "Ação imediata tomada",
        tratativa_aplicada: "Tratativa aplicada",
        responsavel_acao: "Responsável pela ação",
        prazo_conclusao: "31/12/2024",
        status: "Aberto",
        exposicao: "EXP1",
        controle: "CTRL1",
        deteccao: "DET1",
        efeito_falha: "EF1",
        impacto: "IMP1",
        imagem_url: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    
    const columnWidths = [
      { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
      { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 40 }, { wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 30 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 30 }
    ];
    
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Desvios_Template");
    XLSX.writeFile(workbook, "template_importacao_desvios.xlsx");
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Importação de Desvios</h1>
        <p className="text-muted-foreground">
          Importe dados de desvios através de planilhas Excel
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
                Faça upload do arquivo Excel com os dados de desvios para validação e importação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DesviosExcelUpload
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
                      <li>Colunas obrigatórias: <code>data_desvio</code>, <code>cca_codigo</code>, <code>responsavel_inspecao</code>, <code>descricao_desvio</code></li>
                      <li>Datas devem estar no formato DD/MM/AAAA</li>
                      <li>Use códigos para: tipo_registro, processo, evento_identificado, causa_provavel, disciplina, base_legal</li>
                      <li>Campos de risco: exposicao, controle, deteccao, efeito_falha, impacto (usar códigos)</li>
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
          <LogsImportacaoDesvios />
        </TabsContent>

        <TabsContent value="ccas">
          <CCACodesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoDesvios;
