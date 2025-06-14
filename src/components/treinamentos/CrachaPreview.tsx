
import React, { useRef } from "react";
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
  // onPrint pode ser passado de fora, mas aqui usaremos o da visualização
  onPrint?: () => void;
}

const CrachaPreview: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
  onPrint, // não vamos mais usar
}) => {
  const crachaRef = useRef<HTMLDivElement | null>(null);

  const treinamentosFiltrados = getTreinamentosMaisRecentes(treinamentosValidos);

  // Função para imprimir SOMENTE o crachá mostrado (não página toda)
  const handlePrintCracha = () => {
    if (!crachaRef.current) return;

    const crachaHtml = crachaRef.current.innerHTML;

    // Janela de impressão dedicada
    const printWindow = window.open('', '_blank', 'width=400,height=650');
    if (!printWindow) return;

    // Estilos customizados para impressão fiel
    const style = `
      <style>
        @page { size: 100mm 160mm; margin: 0; }
        body { margin: 0; font-family: Arial, sans-serif; background: #fff;}
        .print-cracha {
          width: 100mm;
          height: 160mm;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 5mm;
          display: flex;
          flex-direction: column;
          box-shadow: none;
        }
        .print-cracha .bg-primary { background: hsl(222.2, 47.4%, 11.2%) !important; color: #fff; }
        .print-cracha .rounded-t-md { border-radius: 0.5rem 0.5rem 0 0;  }
        .print-cracha h3, .print-cracha h4, .print-cracha h5 { margin: 0; }
        .print-cracha .w-28, .print-cracha .h-28 { width: 70px !important; height: 70px !important;}
        .print-cracha .rounded-full { border-radius: 9999px; }
        .print-cracha img { width: 100%; height: 100%; object-fit: cover; border-radius: 9999px; }
        .print-cracha table { width: 100%; font-size: 12px; border-collapse: collapse; }
        .print-cracha th, .print-cracha td { padding: 3px 5px; }
        .print-cracha th { text-align: left; }
        .print-cracha th:last-child, .print-cracha td:last-child { text-align: right;}
        .print-cracha .border-t { border-top: 1px solid #eee; }
        .print-cracha .border-b { border-bottom: 1px solid #eee; }
        .print-cracha .mt-auto { margin-top: auto; }
        .print-cracha .pt-3 { padding-top: 8px; }
        .print-cracha .pt-4 { padding-top: 12px; }
        .print-cracha .font-bold { font-weight: bold; }
        .print-cracha .font-semibold { font-weight: 600; }
        .print-cracha .text-center { text-align: center; }
        .print-cracha .text-xs { font-size: 10px; }
        .print-cracha .text-sm { font-size: 12px; }
        .print-cracha .mb-2 { margin-bottom: 8px; }
      </style>
    `;

    printWindow.document.write(`
      <!doctype html>
      <html>
      <head><title>Crachá de Capacitação</title>${style}</head>
      <body>
        <div class="print-cracha">
          ${crachaHtml}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

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
          ref={crachaRef}
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
                  <div>
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
          <Button onClick={handlePrintCracha} variant="outline" className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimir crachá
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CrachaPreview;
