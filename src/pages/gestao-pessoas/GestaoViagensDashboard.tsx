import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Mail } from "lucide-react";
import { ModalSummaryCards } from "@/components/gestao-pessoas/travel/dashboard/ModalSummaryCards";
import { ReservationsByModalChart } from "@/components/gestao-pessoas/travel/dashboard/ReservationsByModalChart";
import { AverageAdvanceChart } from "@/components/gestao-pessoas/travel/dashboard/AverageAdvanceChart";
import { CancellationsChart } from "@/components/gestao-pessoas/travel/dashboard/CancellationsChart";
import { ApprovalTimeTable } from "@/components/gestao-pessoas/travel/dashboard/ApprovalTimeTable";
import { AirDetailsSection } from "@/components/gestao-pessoas/travel/dashboard/AirDetailsSection";
import { HotelDetailsSection } from "@/components/gestao-pessoas/travel/dashboard/HotelDetailsSection";
import { BusDetailsSection } from "@/components/gestao-pessoas/travel/dashboard/BusDetailsSection";
import { CCAAnalysisSection } from "@/components/gestao-pessoas/travel/dashboard/CCAAnalysisSection";
import { SendSelectedChartsModal } from "@/components/gestao-pessoas/travel/dashboard/SendSelectedChartsModal";
import { toast } from "sonner";

const GestaoViagensDashboard = () => {
  // TODO: Implementar queries reais do banco de dados
  const [dashboardData] = useState({
    periodo: { inicio: new Date().toISOString(), fim: new Date().toISOString() },
    resumoGeral: { totalGeral: 0, aereo: 0, hotel: 0, automovel: 0, onibus: 0, total: 0 },
    reservasPorModal: { aereo: 0, hotel: 0, onibus: 0, automovel: 0 },
    antecedenciaMedia: { aereo: 0, hotel: 0, onibus: 0 },
    cancelamentos: { aereo: 0, hotel: 0, onibus: 0 },
    tempoAprovacao: [],
    analisePorCCA: [],
    detalhesAereo: { 
      totalReservas: 0, valorTotal: 0, ticketMedioDentro: 0, ticketMedioFora: 0, 
      antecedenciaMedia: 0, nacionais: 0, internacionais: 0, comAcordo: 0, semAcordo: 0, 
      emissaoCO2: 0, companhias: [], trechosComuns: [], trechosMaisUtilizados: [], 
      tipoTarifas: [], empresasAereas: [] 
    },
    detalhesHotel: { 
      totalReservas: 0, valorTotal: 0, ticketMedio: 0, hoteisMaisUsados: [], 
      cidadesMaisVisitadas: [], cidadesMaisUtilizadas: [], hotelsMaisUtilizados: [], 
      tipoAcomodacao: [] 
    },
    detalhesRodoviario: { 
      totalReservas: 0, valorTotal: 0, ticketMedio: 0, empresas: [], rotasComuns: [], 
      trechosMaisUtilizados: [], empresasRodoviarias: [] 
    }
  });
  const [selectChartsModalOpen, setSelectChartsModalOpen] = useState(false);
  const [preSelectedCCA, setPreSelectedCCA] = useState<string | undefined>();

  const handleExportPDF = () => {
    toast.success("Exportação de PDF iniciada", {
      description: "O relatório será gerado em breve"
    });
  };

  const handleSendCCA = (cca: string) => {
    setPreSelectedCCA(cca);
    setSelectChartsModalOpen(true);
  };

  const formatPeriod = () => {
    const inicio = new Date(dashboardData.periodo.inicio).toLocaleDateString('pt-BR');
    const fim = new Date(dashboardData.periodo.fim).toLocaleDateString('pt-BR');
    return `${inicio} - ${fim}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Gestão de Viagens</h1>
          <p className="text-muted-foreground mt-1">
            Período: {formatPeriod()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={() => {
            setPreSelectedCCA(undefined);
            setSelectChartsModalOpen(true);
          }}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar Seleção por Email
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ModalSummaryCards resumo={dashboardData.resumoGeral} />

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReservationsByModalChart reservas={dashboardData.reservasPorModal} />
        <AverageAdvanceChart antecedencia={dashboardData.antecedenciaMedia} />
      </div>

      {/* Cancellations and Approval Time */}
      <div className="grid gap-4 md:grid-cols-2">
        <CancellationsChart cancelamentos={dashboardData.cancelamentos} />
        <ApprovalTimeTable tempoAprovacao={dashboardData.tempoAprovacao} />
      </div>

      {/* CCA Analysis Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Análise de Gastos por CCA</h2>
        <CCAAnalysisSection 
          ccaData={dashboardData.analisePorCCA}
          onSendCCA={handleSendCCA}
        />
      </div>

      {/* Detailed Sections */}
      <Tabs defaultValue="aereo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="aereo">Aéreo</TabsTrigger>
          <TabsTrigger value="hotel">Hotel</TabsTrigger>
          <TabsTrigger value="rodoviario">Rodoviário</TabsTrigger>
        </TabsList>
        <TabsContent value="aereo" className="mt-6">
          <AirDetailsSection detalhes={dashboardData.detalhesAereo} />
        </TabsContent>
        <TabsContent value="hotel" className="mt-6">
          <HotelDetailsSection detalhes={dashboardData.detalhesHotel} />
        </TabsContent>
        <TabsContent value="rodoviario" className="mt-6">
          <BusDetailsSection detalhes={dashboardData.detalhesRodoviario} />
        </TabsContent>
      </Tabs>

      {/* Send Selected Charts Modal */}
      <SendSelectedChartsModal
        open={selectChartsModalOpen}
        onOpenChange={setSelectChartsModalOpen}
        dashboardData={dashboardData}
        preSelectedCCA={preSelectedCCA}
      />
    </div>
  );
};

export default GestaoViagensDashboard;
