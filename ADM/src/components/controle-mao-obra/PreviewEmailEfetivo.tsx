import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface ColaboradorEmail {
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
  empresa?: string;
}
interface PreviewEmailEfetivoProps {
  cca?: string;
  data?: string;
  colaboradoresAbelv?: ColaboradorEmail[];
  colaboradoresTerceiros?: ColaboradorEmail[];
}
const PreviewEmailEfetivo: React.FC<PreviewEmailEfetivoProps> = ({
  cca = "CCA-001",
  data = new Date().toLocaleDateString('pt-BR'),
  colaboradoresAbelv = [{
    nome: "Ana Paula Silva",
    funcao: "Engenheira",
    disciplina: "Civil",
    classificacao: "MO"
  }, {
    nome: "Roberto Santos",
    funcao: "Técnico",
    disciplina: "Elétrica",
    classificacao: "MO"
  }],
  colaboradoresTerceiros = [{
    empresa: "Construtora ABC Ltda",
    nome: "João Silva Santos",
    funcao: "Pedreiro",
    disciplina: "Civil",
    classificacao: "MO"
  }, {
    empresa: "Construtora ABC Ltda",
    nome: "Carlos Eduardo Lima",
    funcao: "Ajudante",
    disciplina: "Civil",
    classificacao: "MO"
  }, {
    empresa: "Engenharia XYZ S.A.",
    nome: "Maria Oliveira Costa",
    funcao: "Eletricista",
    disciplina: "Elétrica",
    classificacao: "MO"
  }]
}) => {
  // Helper para normalizar classificação
  const isDireta = (c: ColaboradorEmail) => (c.classificacao || '').toLowerCase().includes('direta');

  // Calcular contadores para Classificação Abelv
  const moDireta = colaboradoresAbelv.filter(isDireta).length;
  const moIndireta = colaboradoresAbelv.length - moDireta;
  const totalAbelv = colaboradoresAbelv.length;

  // Agrupar por disciplina para MOD (apenas DIRETA)
  const disciplinasAbelv = colaboradoresAbelv
    .filter(isDireta)
    .reduce((acc, col) => {
      const disc = col.disciplina || 'Outras';
      if (!acc[disc]) acc[disc] = 0;
      acc[disc]++;
      return acc;
    }, {} as Record<string, number>);

  // Agrupar terceiros por função
  const terceirosMap = colaboradoresTerceiros.reduce((acc, col) => {
    const func = col.funcao || 'Outros';
    if (!acc[func]) acc[func] = 0;
    acc[func]++;
    return acc;
  }, {} as Record<string, number>);
  const totalTerceiros = colaboradoresTerceiros.length;
  return <Card className="w-full">
      <CardHeader>
        <CardTitle>Preview do Email</CardTitle>
        <CardDescription>Visualização do relatório que será enviado aos destinatários</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Email Container with max-width */}
        <div className="mx-auto border rounded-lg shadow-sm bg-background" style={{
        maxWidth: '600px'
      }}>
          {/* Email Header */}
          <div className="bg-primary text-primary-foreground p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold mb-2">Relatório de Efetivo - ABELV e Terceiros</h1>
            <p className="text-sm opacity-90">
              <strong>Obra/CCA:</strong> {cca}
            </p>
            <p className="text-sm opacity-90">
              <strong>Data:</strong> {data}
            </p>
          </div>

          {/* Email Body */}
          <div className="p-6 space-y-4">
            {/* Tabela 1: CLASSIFICAÇÃO DO EFETIVO - ABELV */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">
                CLASSIFICAÇÃO DO EFETIVO - ABELV
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Tipo</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Mobilizado</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">MO. Direta</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">MO. Indireta</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moIndireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moIndireta}</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-200 px-3 py-2">TOTAL ===&gt;</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalAbelv}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalAbelv}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabela 2: MOD - POR DISCIPLINA - ABELV */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-orange-200 text-orange-900 font-bold text-sm px-4 py-2">
                MOD - POR DISCIPLINA - ABELV
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Tipo</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Mobilizado</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Presente</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Variação 7 Dias</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(disciplinasAbelv).map(([disciplina, count]) => <tr key={disciplina}>
                      <td className="border border-gray-200 px-3 py-2">{disciplina.toUpperCase()}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">{count}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">{count}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">0</td>
                    </tr>)}
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-200 px-3 py-2">TOTAL ===&gt;</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabela 3: Terceiros por Disciplina */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">
                Terceiros por Disciplina
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Terceiro</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Civil</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Mobilizado</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(terceirosMap).map(([funcao, count]) => <tr key={funcao}>
                      <td className="border border-gray-200 px-3 py-2">{funcao.toUpperCase()}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">-</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">{count}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">{count}</td>
                    </tr>)}
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-200 px-3 py-2">Terceiros ===&gt;</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">-</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalTerceiros}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalTerceiros}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabela 4: ABELV+TERCEIRO */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">
                ABELV+TERCEIRO
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Tipo</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Mobilizado</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold">Presente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">MOD</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moDireta}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">MOI</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moIndireta}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{moIndireta}</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-200 px-3 py-2">TOTAL ===&gt;</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalAbelv + totalTerceiros}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{totalAbelv + totalTerceiros}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Seções Adicionais */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">AGUARDANDO CRACHÁ</div>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">AGUARDANDO DOCS SMS</div>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-blue-100 text-blue-900 font-bold text-sm px-4 py-2">AGUARDANDO INTEGRAÇÃO</div>
            </div>
          </div>

          {/* Email Footer */}
          <div className="bg-muted/50 p-4 rounded-b-lg text-center">
            <p className="text-xs text-muted-foreground">
              Este é um relatório automático gerado pelo sistema de controle de efetivo.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} Abelv - Todos os direitos reservados
            </p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default PreviewEmailEfetivo;