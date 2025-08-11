
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, GraduationCap, AlertCircle, CheckCircle, Info, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExcelUpload } from "@/components/admin/funcionarios/ExcelUpload";
import { ImportPreview } from "@/components/admin/funcionarios/ImportPreview";
import * as XLSX from "xlsx";

const ImportacaoExecucaoTreinamentos = () => {
  const [importData, setImportData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<{
    valid: any[];
    invalid: { data: any; errors: string[] }[];
    duplicates: any[];
    updates: any[];
  } | null>(null);

  const handleFileProcessed = async (data: any[]) => {
    setImportData(data);
    // Aqui você implementaria a validação específica para execução de treinamentos
    const results = {
      valid: data.filter((_, index) => index % 2 === 0), // Exemplo simples
      invalid: [],
      duplicates: [],
      updates: []
    };
    setValidationResults(results);
  };

  const handleImport = async () => {
    if (!validationResults) return;
    
    // Implementar lógica de importação de execução de treinamentos
    console.log("Importando execuções de treinamentos:", validationResults.valid);
    
    // Reset após importação bem-sucedida
    setImportData([]);
    setValidationResults(null);
  };

  const downloadTemplate = () => {
    // Criar dados do template para execução de treinamentos
    const templateData = [
      ['data', 'cca', 'treinamento_nome', 'tipo_treinamento', 'processo_treinamento', 'carga_horaria', 'efetivo_mod', 'efetivo_moi'],
      ['2024-01-15', 'CCA01', 'Segurança do Trabalho', 'Obrigatório', 'Admissional', '8', '15', '10'],
      ['2024-02-01', 'CCA02', 'Qualidade', 'Técnico', 'Reciclagem', '4', '20', '5']
    ];

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Definir largura das colunas
    const colWidths = [
      { wch: 15 }, // data
      { wch: 12 }, // cca
      { wch: 25 }, // treinamento_nome
      { wch: 20 }, // tipo_treinamento
      { wch: 20 }, // processo_treinamento
      { wch: 15 }, // carga_horaria
      { wch: 12 }, // efetivo_mod
      { wch: 12 }  // efetivo_moi
    ];
    worksheet['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Execução Treinamentos');
    
    // Gerar e baixar arquivo
    XLSX.writeFile(workbook, 'template_execucao_treinamentos.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Importação de Execução de Treinamentos</h1>
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Template Excel
        </Button>
      </div>

      <Tabs defaultValue="importacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="importacao" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importação
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs de Importação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="importacao" className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Instruções:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Baixe o template Excel e preencha com os dados das execuções de treinamentos</li>
                <li>Campos obrigatórios: data, cca, treinamento_nome, tipo_treinamento, processo_treinamento</li>
                <li>Data deve estar no formato YYYY-MM-DD (ex: 2024-01-15)</li>
                <li>Carga horária deve ser um número inteiro</li>
                <li>Utilize apenas arquivos .xlsx ou .xls</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload do Arquivo Excel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExcelUpload
                  onFileProcessed={handleFileProcessed}
                  isProcessing={false}
                />
              </CardContent>
            </Card>

            {validationResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Preview da Importação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Válidos</p>
                        <p className="font-semibold text-green-700">{validationResults.valid.length}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm text-red-600">Inválidos</p>
                        <p className="font-semibold text-red-700">{validationResults.invalid.length}</p>
                      </div>
                    </div>
                  </div>

                  <ImportPreview validationResults={validationResults} />
                  
                  {validationResults.valid.length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleImport}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Importar {validationResults.valid.length} Execuções
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Importação de Execução de Treinamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Logs de importação serão exibidos aqui...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoExecucaoTreinamentos;
