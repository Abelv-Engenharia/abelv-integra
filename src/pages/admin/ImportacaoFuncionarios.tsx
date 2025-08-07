
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Users, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExcelUpload } from "@/components/admin/funcionarios/ExcelUpload";
import { ImportPreview } from "@/components/admin/funcionarios/ImportPreview";
import { useFuncionarioImport } from "@/hooks/useFuncionarioImport";
import { FuncionarioImportData } from "@/types/funcionarios";
import * as XLSX from "xlsx";

const ImportacaoFuncionarios = () => {
  const [importData, setImportData] = useState<FuncionarioImportData[]>([]);
  const [validationResults, setValidationResults] = useState<{
    valid: FuncionarioImportData[];
    invalid: { data: FuncionarioImportData; errors: string[] }[];
    duplicates: FuncionarioImportData[];
    updates: FuncionarioImportData[];
  } | null>(null);

  const {
    validateImport,
    importFuncionarios,
    isValidating,
    isImporting
  } = useFuncionarioImport();

  const handleFileProcessed = async (data: FuncionarioImportData[]) => {
    setImportData(data);
    const results = await validateImport(data);
    setValidationResults(results);
  };

  const handleImport = async () => {
    if (!validationResults) return;
    
    await importFuncionarios(validationResults.valid, validationResults.updates);
    
    // Reset após importação bem-sucedida
    setImportData([]);
    setValidationResults(null);
  };

  const downloadTemplate = () => {
    // Criar dados do template
    const templateData = [
      ['nome', 'funcao', 'matricula', 'cpf', 'cca_codigo', 'data_admissao'],
      ['João Silva', 'Técnico', '12345', '123.456.789-00', 'CCA01', '2024-01-15'],
      ['Maria Santos', 'Engenheira', '67890', '987.654.321-00', 'CCA02', '2024-02-01'],
      ['Pedro Oliveira', 'Analista', '11111', '111.222.333-44', 'CCA01', '2024-03-10']
    ];

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Definir largura das colunas
    const colWidths = [
      { wch: 20 }, // nome
      { wch: 15 }, // funcao
      { wch: 12 }, // matricula
      { wch: 18 }, // cpf
      { wch: 12 }, // cca_codigo
      { wch: 15 }  // data_admissao
    ];
    worksheet['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionários');
    
    // Gerar e baixar arquivo
    XLSX.writeFile(workbook, 'template_funcionarios.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Importação de Funcionários</h1>
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Template Excel
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Instruções:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Baixe o template Excel e preencha com os dados dos funcionários</li>
            <li>O CPF será usado para identificar funcionários existentes (atualizações)</li>
            <li>Campos obrigatórios: nome, funcao, matricula, cpf</li>
            <li>Data de admissão deve estar no formato YYYY-MM-DD (ex: 2024-01-15)</li>
            <li>CCA deve usar o código do CCA (opcional)</li>
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
              isProcessing={isValidating}
            />
          </CardContent>
        </Card>

        {validationResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
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
                
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Atualizações</p>
                    <p className="font-semibold text-blue-700">{validationResults.updates.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-red-600">Inválidos</p>
                    <p className="font-semibold text-red-700">{validationResults.invalid.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-600">Duplicatas no arquivo</p>
                    <p className="font-semibold text-yellow-700">{validationResults.duplicates.length}</p>
                  </div>
                </div>
              </div>

              <ImportPreview validationResults={validationResults} />
              
              {(validationResults.valid.length > 0 || validationResults.updates.length > 0) && (
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleImport}
                    disabled={isImporting}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isImporting ? "Importando..." : `Importar ${validationResults.valid.length + validationResults.updates.length} Funcionários`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImportacaoFuncionarios;
