import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, ClipboardCheck, AlertTriangle, User, CreditCard, Route, BarChart3, FileText } from "lucide-react";
import { FiltrosAvancados } from "./FiltrosAvancados";
import { ExportButtons } from "./ExportButtons";
import { RelatorioConsolidado } from "./RelatorioConsolidado";
import { RelatorioMultas } from "./RelatorioMultas";
import { RelatorioVeiculos } from "./RelatorioVeiculos";
import { FiltroRelatorio, DadosRelatorioConsolidado } from "@/types/relatorio";

interface RelatoriosTabProps {
  veiculos: any[];
  checklists: any[];
  multas: any[];
  condutores: any[];
  cartoes: any[];
  pedagogios: any[];
  calculos: any[];
}

type TipoRelatorio = 'consolidado' | 'veiculos' | 'checklist' | 'multas' | 'condutores' | 'cartoes' | 'pedagios' | 'rotas' | null;

export function RelatoriosTab({
  veiculos,
  checklists,
  multas,
  condutores,
  cartoes,
  pedagogios,
  calculos
}: RelatoriosTabProps) {
  const [tiposelecionado, setTipoSelecionado] = useState<TipoRelatorio>(null);
  const [filtros, setFiltros] = useState<FiltroRelatorio>({
    periodo: 'mes'
  });

  const tiposrelatorio = [
    { id: 'consolidado', nome: 'Consolidado Geral', icone: BarChart3, cor: 'bg-primary' },
    { id: 'veiculos', nome: 'Veículos', icone: Car, cor: 'bg-blue-500' },
    { id: 'checklist', nome: 'Checklist', icone: ClipboardCheck, cor: 'bg-green-500' },
    { id: 'multas', nome: 'Multas', icone: AlertTriangle, cor: 'bg-red-500' },
    { id: 'condutores', nome: 'Condutores', icone: User, cor: 'bg-purple-500' },
    { id: 'cartoes', nome: 'Cartões', icone: CreditCard, cor: 'bg-orange-500' },
    { id: 'pedagios', nome: 'Pedágios', icone: Route, cor: 'bg-yellow-500' },
    { id: 'rotas', nome: 'Cálculo de Rotas', icone: Route, cor: 'bg-indigo-500' },
  ];

  const gerarDadosConsolidado = (): DadosRelatorioConsolidado => {
    return {
      totalveiculosativos: veiculos.filter(v => v.status === 'Ativo').length,
      custototalmensal: 245000,
      multaspendentes: multas.filter(m => m.statuspagamento !== 'Pago').length,
      cnhsvencendo: 5,
      alertascriticos: 8,
      distribuicaocustos: [
        { categoria: 'Locação', valor: 150000 },
        { categoria: 'Combustível', valor: 65000 },
        { categoria: 'Multas', valor: 18000 },
        { categoria: 'Pedágios', valor: 12000 },
      ],
      evolucaocustos: [
        { mes: 'Jan', locacao: 145000, combustivel: 58000, multas: 15000, pedagios: 10000 },
        { mes: 'Fev', locacao: 148000, combustivel: 61000, multas: 16500, pedagios: 11000 },
        { mes: 'Mar', locacao: 150000, combustivel: 63000, multas: 17000, pedagios: 11500 },
        { mes: 'Abr', locacao: 152000, combustivel: 64000, multas: 17500, pedagios: 11800 },
        { mes: 'Mai', locacao: 150000, combustivel: 65000, multas: 18000, pedagios: 12000 },
      ],
      top5veiculos: veiculos
        .slice(0, 5)
        .map(v => ({
          placa: v.placa,
          modelo: v.modelo,
          custototal: v.valorlocacao + Math.random() * 5000
        })),
      top5condutores: [
        { nome: 'João Silva', multas: 8, pontos: 21 },
        { nome: 'Carlos Oliveira', multas: 6, pontos: 14 },
        { nome: 'Ana Santos', multas: 5, pontos: 12 },
        { nome: 'Pedro Costa', multas: 4, pontos: 8 },
        { nome: 'Maria Souza', multas: 3, pontos: 7 },
      ],
      alertasprioritarios: [
        { tipo: 'cnh', mensagem: '5 CNHs vencendo nos próximos 30 dias', prioridade: 'alta' },
        { tipo: 'multa', mensagem: `${multas.filter(m => m.statuspagamento !== 'Pago').length} multas pendentes de pagamento`, prioridade: 'alta' },
        { tipo: 'checklist', mensagem: '3 checklists com prazo de cobrança vencido', prioridade: 'media' },
      ]
    };
  };

  const handleAplicarFiltros = () => {
    console.log('Filtros aplicados:', filtros);
  };

  const handleLimparFiltros = () => {
    setFiltros({ periodo: 'mes' });
  };

  const renderRelatorio = () => {
    if (!tiposelecionado) return null;

    switch (tiposelecionado) {
      case 'consolidado':
        return <RelatorioConsolidado dados={gerarDadosConsolidado()} />;
      case 'veiculos':
        return <RelatorioVeiculos veiculos={veiculos} />;
      case 'multas':
        return <RelatorioMultas multas={multas} />;
      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">Relatório em Desenvolvimento</p>
              <p className="text-muted-foreground">
                Este tipo de relatório será implementado em breve.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const getDadosExport = () => {
    switch (tiposelecionado) {
      case 'veiculos':
        return {
          dados: veiculos,
          colunas: ['Placa', 'Modelo', 'Locadora', 'CCA', 'Condutor', 'Valor Locação', 'Status'],
          titulo: 'Relatório de Veículos'
        };
      case 'multas':
        return {
          dados: multas,
          colunas: ['Auto Infração', 'Placa', 'Condutor', 'Tipo Ocorrência', 'Data', 'Valor', 'Pontos', 'Status'],
          titulo: 'Relatório de Multas'
        };
      default:
        return {
          dados: [],
          colunas: [],
          titulo: 'Relatório'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <p className="text-muted-foreground">
          Visualize e exporte relatórios detalhados de todas as categorias
        </p>
      </div>

      {/* Seleção de Tipo de Relatório */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Selecione o Tipo de Relatório</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiposrelatorio.map((tipo) => {
              const Icone = tipo.icone;
              return (
                <Button
                  key={tipo.id}
                  variant={tiposelecionado === tipo.id ? 'default' : 'outline'}
                  className="h-auto flex-col items-center gap-2 p-4"
                  onClick={() => setTipoSelecionado(tipo.id as TipoRelatorio)}
                >
                  <Icone className="h-6 w-6" />
                  <span className="text-sm text-center">{tipo.nome}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros - aparece após seleção */}
      {tiposelecionado && (
        <>
          <FiltrosAvancados
            filtros={filtros}
            onFiltrosChange={setFiltros}
            onAplicar={handleAplicarFiltros}
            onLimpar={handleLimparFiltros}
            mostrarCampos={{
              condutor: tiposelecionado === 'multas' || tiposelecionado === 'condutores',
              placa: tiposelecionado === 'veiculos' || tiposelecionado === 'multas',
              cca: tiposelecionado !== 'condutores',
              valor: tiposelecionado === 'multas' || tiposelecionado === 'pedagios',
            }}
          />

          {/* Relatório */}
          {renderRelatorio()}

          {/* Botões de Exportação */}
          {tiposelecionado && tiposelecionado !== 'consolidado' && (
            <ExportButtons
              tiporelatino={tiposelecionado}
              {...getDadosExport()}
              onAtualizar={() => console.log('Atualizar relatório')}
            />
          )}
        </>
      )}
    </div>
  );
}
