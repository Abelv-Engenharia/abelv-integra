
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCCAs } from "@/hooks/useCCAs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CCACodesTab = () => {
  const { data: ccas, isLoading, error } = useCCAs();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar os códigos de CCA. Tente recarregar a página.
        </AlertDescription>
      </Alert>
    );
  }

  if (!ccas || ccas.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Nenhum CCA ativo encontrado no sistema.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Use os códigos listados abaixo na coluna <strong>cca_codigo</strong> do arquivo Excel para associar funcionários aos CCAs correspondentes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Códigos de CCA Disponíveis
            <Badge variant="secondary">{ccas.length} CCAs</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ccas.map((cca) => (
              <div
                key={cca.id}
                className="border rounded-lg p-3 space-y-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600">
                    {cca.codigo}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {cca.tipo}
                  </Badge>
                </div>
                <div className="text-sm text-gray-700">{cca.nome}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Como usar</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            1. Copie o <strong>código</strong> do CCA desejado da lista acima
          </p>
          <p>
            2. Cole o código na coluna <code className="bg-gray-100 px-1 rounded">cca_codigo</code> do seu arquivo Excel
          </p>
          <p>
            3. O funcionário será automaticamente associado ao CCA correspondente após a importação
          </p>
          <p className="text-gray-600">
            <strong>Nota:</strong> O campo CCA é opcional. Se deixado em branco, o funcionário será importado sem associação a um CCA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
