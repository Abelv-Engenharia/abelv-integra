
import React, { useRef } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Printer } from "lucide-react";
import { formatarData } from "@/utils/treinamentosUtils";
import { format } from "date-fns";
import { Funcionario, TreinamentoNormativo } from "@/types/treinamentos";
import { useSystemLogoUrl } from "@/components/common/useSystemLogoUrl";

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
  onPrint?: () => void;
}

const CrachaPreview: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
  onPrint,
}) => {
  const crachaRef = useRef<HTMLDivElement | null>(null);

  const treinamentosFiltrados = getTreinamentosMaisRecentes(treinamentosValidos);

  // Logo salva do sistema
  const logoUrl = useSystemLogoUrl();

  // Função para imprimir SOMENTE o crachá mostrado (não página toda)
  const handlePrintCracha = () => {
    if (!crachaRef.current) return;

    const crachaHtml = crachaRef.current.innerHTML;

    // Janela de impressão dedicada
    const printWindow = window.open('', '_blank', 'width=400,height=650');
    if (!printWindow) return;

    // Estilos customizados para impressão com dimensões exatas: 5,4cm x 8,6cm
    const style = `
      <style>
        @page { size: 5.4cm 8.6cm; margin: 0; }
        body { margin: 0; font-family: Arial, sans-serif; background: #fff;}
        .print-cracha {
          width: 5.4cm;
          height: 8.6cm;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 2mm;
          display: flex;
          flex-direction: column;
          box-shadow: none;
          font-size: 8px;
        }
        .print-cracha .bg-primary { background: hsl(222.2, 47.4%, 11.2%) !important; color: #fff; }
        .print-cracha .rounded-t-md { border-radius: 2px 2px 0 0;  }
        .print-cracha h3 { margin: 0; font-size: 9px; font-weight: bold; padding: 3px 0; }
        .print-cracha h4, .print-cracha h5 { margin: 0; }
        .print-cracha .w-28, .print-cracha .h-28 { width: 35px !important; height: 35px !important;}
        .print-cracha .rounded-full { border-radius: 50%; }
        .print-cracha img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .print-cracha .funcionario-info { flex: 1; min-width: 0; }
        .print-cracha .funcionario-nome { font-size: 9px; font-weight: bold; margin-bottom: 1px; line-height: 1.1; }
        .print-cracha .funcionario-funcao { font-size: 7px; margin-bottom: 1px; color: #333; line-height: 1.1; }
        .print-cracha .funcionario-matricula { font-size: 6px; color: #666; }
        .print-cracha table { width: 100%; font-size: 6px; border-collapse: collapse; margin-top: 2px; }
        .print-cracha th, .print-cracha td { padding: 1px 2px; }
        .print-cracha th { text-align: left; font-weight: bold; font-size: 7px; }
        .print-cracha th:last-child, .print-cracha td:last-child { text-align: right;}
        .print-cracha .border-t { border-top: 1px solid #eee; }
        .print-cracha .border-b { border-bottom: 1px solid #eee; }
        .print-cracha .mt-auto { margin-top: auto; }
        .print-cracha .pt-3 { padding-top: 3px; }
        .print-cracha .pt-4 { padding-top: 4px; }
        .print-cracha .font-bold { font-weight: bold; }
        .print-cracha .font-semibold { font-weight: 600; }
        .print-cracha .text-center { text-align: center; }
        .print-cracha .text-xs { font-size: 6px; }
        .print-cracha .text-sm { font-size: 7px; }
        .print-cracha .mb-2 { margin-bottom: 2px; }
        .print-cracha .header-info { display: flex; align-items: flex-start; gap: 4px; margin: 3px 0; }
        .print-cracha .certificacoes-section { flex: 1; }
        .print-cracha .certificacoes-title { font-size: 8px; font-weight: bold; text-align: center; margin: 3px 0 2px 0; }
        .print-cracha .emissao { font-size: 6px; text-align: center; margin-top: auto; padding-top: 2px; color: #666; }
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
          Como ficará o crachá de capacitação (5,4cm x 8,6cm)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={crachaRef}
          className="bg-white border rounded-lg shadow-md p-2 w-full max-w-[200px] mx-auto"
          style={{ aspectRatio: "5.4/8.6" }}
        >
          {funcionario ? (
            <div className="flex flex-col h-full text-xs">
              <div className="bg-primary text-white text-center py-1 rounded-t-md">
                <h3 className="font-bold uppercase text-[9px]">Crachá de Capacitação</h3>
              </div>

              <div className="header-info flex items-start gap-2 my-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain p-1 rounded-full bg-white"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div className="funcionario-info flex-1 min-w-0">
                  <h4 className="funcionario-nome text-[9px] font-bold leading-tight">{funcionario.nome}</h4>
                  <p className="funcionario-funcao text-[7px] text-gray-600 leading-tight">{funcionario.funcao}</p>
                  <p className="funcionario-matricula text-[6px] text-gray-500">Mat: {funcionario.matricula}</p>
                </div>
              </div>

              <div className="certificacoes-section border-t pt-1 flex-1">
                <h5 className="certificacoes-title text-[8px] font-semibold">Certificações Válidas</h5>

                {isLoading ? (
                  <p className="text-center text-[6px] text-muted-foreground">Carregando...</p>
                ) : treinamentosFiltrados.length > 0 ? (
                  <div>
                    <table className="text-[6px] w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1 text-[7px]">Treinamento</th>
                          <th className="text-right py-1 text-[7px]">Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treinamentosFiltrados.map(treinamento => (
                          <tr key={treinamento.id} className="border-b">
                            <td className="py-1 text-left text-[6px] leading-tight">
                              {treinamento.treinamentoNome}
                            </td>
                            <td className="py-1 text-right text-[6px]">
                              {formatarData(treinamento.data_validade)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-[6px] text-muted-foreground">
                    Sem treinamentos válidos
                  </p>
                )}
              </div>

              <div className="emissao mt-auto border-t pt-1">
                <p className="text-center text-[6px] text-gray-500">
                  Emitido em {format(new Date(), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <User className="w-8 h-8 mb-2" />
              <p className="text-center text-[8px]">
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
