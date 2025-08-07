
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Users, AlertTriangle } from "lucide-react";
import { FuncionarioImportData } from "@/types/funcionarios";

interface ImportPreviewProps {
  validationResults: {
    valid: FuncionarioImportData[];
    invalid: { data: FuncionarioImportData; errors: string[] }[];
    duplicates: FuncionarioImportData[];
    updates: FuncionarioImportData[];
  };
}

export const ImportPreview: React.FC<ImportPreviewProps> = ({ validationResults }) => {
  const { valid, invalid, duplicates, updates } = validationResults;

  const renderFuncionarioRow = (funcionario: FuncionarioImportData, index: number) => (
    <div key={index} className="grid grid-cols-6 gap-2 p-3 border rounded-lg text-sm">
      <span className="font-medium">{funcionario.nome}</span>
      <span>{funcionario.funcao}</span>
      <span>{funcionario.matricula}</span>
      <span>{funcionario.cpf}</span>
      <span>{funcionario.cca_codigo || '-'}</span>
      <span>{funcionario.data_admissao || '-'}</span>
    </div>
  );

  const renderHeader = () => (
    <div className="grid grid-cols-6 gap-2 p-3 bg-muted rounded-lg text-sm font-medium">
      <span>Nome</span>
      <span>Função</span>
      <span>Matrícula</span>
      <span>CPF</span>
      <span>CCA</span>
      <span>Data Admissão</span>
    </div>
  );

  return (
    <Tabs defaultValue="valid" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="valid" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Válidos ({valid.length})
        </TabsTrigger>
        <TabsTrigger value="updates" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Atualizações ({updates.length})
        </TabsTrigger>
        <TabsTrigger value="invalid" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Inválidos ({invalid.length})
        </TabsTrigger>
        <TabsTrigger value="duplicates" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Duplicatas ({duplicates.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="valid">
        <div className="space-y-4">
          {valid.length > 0 ? (
            <>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{valid.length} funcionários</strong> serão criados como novos registros.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {renderHeader()}
                {valid.map((funcionario, index) => renderFuncionarioRow(funcionario, index))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhum funcionário novo para criar.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="updates">
        <div className="space-y-4">
          {updates.length > 0 ? (
            <>
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  <strong>{updates.length} funcionários</strong> serão atualizados (CPF já existe no sistema).
                </AlertDescription>
              </Alert>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {renderHeader()}
                {updates.map((funcionario, index) => renderFuncionarioRow(funcionario, index))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhum funcionário para atualizar.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="invalid">
        <div className="space-y-4">
          {invalid.length > 0 ? (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{invalid.length} registros</strong> contêm erros e não serão importados.
                </AlertDescription>
              </Alert>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {invalid.map((item, index) => (
                  <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                      <span><strong>Nome:</strong> {item.data.nome}</span>
                      <span><strong>Função:</strong> {item.data.funcao}</span>
                      <span><strong>Matrícula:</strong> {item.data.matricula}</span>
                      <span><strong>CPF:</strong> {item.data.cpf}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.errors.map((error, errorIndex) => (
                        <Badge key={errorIndex} variant="destructive" className="text-xs">
                          {error}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhum erro encontrado nos dados.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="duplicates">
        <div className="space-y-4">
          {duplicates.length > 0 ? (
            <>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{duplicates.length} registros</strong> estão duplicados no arquivo CSV e foram removidos.
                </AlertDescription>
              </Alert>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {renderHeader()}
                {duplicates.map((funcionario, index) => renderFuncionarioRow(funcionario, index))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma duplicata encontrada no arquivo.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
