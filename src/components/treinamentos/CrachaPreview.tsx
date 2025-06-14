
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Printer } from "lucide-react";
import { formatarData } from "@/utils/treinamentosUtils";
import { format } from "date-fns";
import { Funcionario, TreinamentoNormativo } from "@/types/treinamentos";

// Função deduplicar treinamentos, igual usada no card de treinamentos válidos
const getTreinamentosMaisRecentes = (
  treinamentos: TreinamentoNormativo[]
): TreinamentoNormativo[] => {
  const map = new Map<string, TreinamentoNormativo>();
  for (const t of treinamentos) {
    const key = t.treinamentoNome || t.treinamento_id;
    const existente = map.get(key);
    if (
      !existente ||
      new Date(t.data_realizacao).getTime() > new Date(existente.data_realizacao).getTime()
    ) {
      map.set(key, t);
    }
  }
  // Ordenar por data de validade crescente para exibição
  return Array.from(map.values()).sort(
    (a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime()
  );
};

interface Props {
  funcionario: Funcionario | null;
  treinamentosValidos: TreinamentoNormativo[];
  isLoading: boolean;
  onPrint: () => void;
}

const CrachaPreview: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
  onPrint
}) => {
  // Filtra antes de exibir
  const treinamentosFiltrados = getTreinamentosMaisRecentes(treinamentosValidos);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pré-visualização do Crachá</CardTitle>
        <CardDescription>
          Como ficará o crachá de capacitação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="bg-white border rounded-lg shadow-md p-4 w-full max-w-sm mx-auto aspect-[9/16]"
        >
          {funcionario ? (
            <div className="flex flex-col h-full">
              <div className="bg-primary text-white text-center py-3 rounded-t-md">
                <h3 className="font-bold uppercase">Crachá de Capacitação</h3>
              </div>

              <div className="flex items-start gap-4 my-4">
                <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {funcionario.foto ? (
                    <img
                      src={funcionario.foto}
                      alt={funcionario.nome}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-14 h-14 text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col">
                  <h4 className="font-bold text-lg">{funcionario.nome}</h4>
                  <p className="text-gray-600">{funcionario.funcao}</p>
                  <p className="text-sm text-gray-500">Matrícula: {funcionario.matricula}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-2 flex-grow">
                <h5 className="font-semibold text-center mb-2">Certificações Válidas</h5>

                {isLoading ? (
                  <p className="text-center text-sm text-muted-foreground">Carregando treinamentos...</p>
                ) : treinamentosFiltrados.length > 0 ? (
                  <div className="overflow-auto max-h-[200px]">
                    <table className="text-sm w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Treinamento</th>
                          <th className="text-right py-1">Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treinamentosFiltrados.map(treinamento => (
                          <tr key={treinamento.id} className="border-b">
                            <td className="py-2 text-left">
                              {treinamento.treinamentoNome}
                            </td>
                            <td className="py-2 text-right">
                              {formatarData(treinamento.data_validade)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Sem treinamentos válidos
                  </p>
                )}
              </div>

              <div className="mt-auto border-t pt-3">
                <p className="text-center text-xs text-gray-500">
                  Emitido em {format(new Date(), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <User className="w-16 h-16 mb-4" />
              <p className="text-center">
                Selecione um funcionário para visualizar o crachá
              </p>
            </div>
          )}
        </div>
      </CardContent>
      {funcionario && treinamentosFiltrados.length > 0 && (
        <CardFooter className="justify-center">
          <Button onClick={onPrint} variant="outline" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimir crachá
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CrachaPreview;

