import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ColaboradoresProvider } from "@/contexts/ColaboradoresContext";
import { ColaboradoresAbelvPJProvider } from "@/contexts/ColaboradoresAbelvPJContext";
import Index from "./pages/Index";
import ControleMaoObra from "./pages/ControleMaoObra";
// Controle Mão de Obra pages
import EfetivoTerceiros from "./pages/controle-mao-obra/EfetivoTerceiros";
import ControleDiario from "./pages/controle-mao-obra/ControleDiario";
import EfetivoAbelvPJ from "./pages/controle-mao-obra/EfetivoAbelvPJ";
import ControleDiarioAbelvPJ from "./pages/controle-mao-obra/ControleDiarioAbelvPJ";
import RelatoriosEfetivo from "./pages/controle-mao-obra/RelatoriosEfetivo";
import DestinatariosEfetivo from "./pages/controle-mao-obra/DestinatariosEfetivo";
import LeadTimeContratacao from "./pages/mobilizacao/LeadTimeContratacao";
import FornecedoresAlojamento from "./pages/FornecedoresAlojamento";
import DetalheFornecedor from "./pages/DetalheFornecedor";
import DetalheContrato from "./pages/DetalheContrato";
import NovoFornecedor from "./pages/NovoFornecedor";
import ContratosAlojamento from "./pages/ContratosAlojamento";
import NovoContratoAlojamento from "./pages/NovoContratoAlojamento";
import EditarContratoAlojamento from "./pages/EditarContratoAlojamento";
import PainelAnaliseContratual from "./pages/alojamento/PainelAnaliseContratual";
import GuiaGestaoAlojamentosMensal from "./pages/alojamento/GuiaGestaoAlojamentosMensal";

import VistoriasAlojamento from "./pages/VistoriasAlojamento";
import NovaVistoria from "./pages/NovaVistoria";
import EditarVistoria from "./pages/EditarVistoria";
import AnexarVistoria from "./pages/AnexarVistoria";
import RelatoriosAlertasAlojamento from "./pages/RelatoriosAlertasAlojamento";
import GestaoContratos from "./pages/relatorios-alertas-alojamento/GestaoContratos";
import RelatorioObra from "./pages/relatorios-alertas-alojamento/RelatorioObra";
import Destinatarios from "./pages/relatorios-alertas-alojamento/Destinatarios";
import DashboardAlertasAlojamento from "./pages/relatorios-alertas-alojamento/Dashboard";
import RelatoriosVistorias from "./pages/RelatoriosVistorias";
import AlertasVistorias from "./pages/AlertasVistorias";
import DashboardVistorias from "./pages/DashboardVistorias";
import ControleAgregadosAlojamento from "./pages/ControleAgregadosAlojamento";
import ControleTransporteColaboradores from "./pages/ControleTransporteColaboradores";
import ControleAlimentacao from "./pages/ControleAlimentacao";
import ControleFolgaCampo from "./pages/ControleFolgaCampo";
import RelatorioMaoObra from "./pages/RelatorioMaoObra";
import RelatorioConsolidadoObras from "./pages/RelatorioConsolidadoObras";
import NovaAdmissao from "./pages/NovaAdmissao";
import ChecklistColaborador from "./pages/ChecklistColaborador";
import RelacaoDocumentosPrazos from "./pages/RelacaoDocumentosPrazos";
import ValidacaoAdmissao from "./pages/ValidacaoAdmissao";
import DashboardAlertas from "./pages/DashboardAlertas";
import RelatorioDocumentacaoMobilizacao from "./pages/RelatorioDocumentacaoMobilizacao";
import NotFound from "./pages/NotFound";
// Folga Campo pages
import ColaboradoresFolgaCampo from "./pages/folga-campo/Colaboradores";
import DashboardFolgaCampo from "./pages/folga-campo/Dashboard";
import PorObraFolgaCampo from "./pages/folga-campo/PorObra";
import ComprasFolgaCampo from "./pages/folga-campo/Compras";
import RelatoriosFolgaCampo from "./pages/folga-campo/Relatorios";
import AlertasFolgaCampo from "./pages/folga-campo/Alertas";
import AuditoriaFolgaCampo from "./pages/folga-campo/Auditoria";
import AlertasMobilizacao from "./pages/mobilizacao/AlertasMobilizacao";
import DestinatariosMobilizacao from "./pages/mobilizacao/DestinatariosMobilizacao";
import DashboardMobilizacao from "./pages/mobilizacao/DashboardMobilizacao";
import GuiaModulo from "./pages/mobilizacao/GuiaModulo";
// Controle Agregados pages
import VisaoGeralAlojamentos from "./pages/controle-agregados/VisaoGeralAlojamentos";
import DestinatariosMedicao from "./pages/controle-agregados/DestinatariosMedicao";
import RelatoriosAgregados from "./pages/controle-agregados/RelatoriosAgregados";
import DashboardAgregados from "./pages/controle-agregados/DashboardAgregados";
import AlertasAgregados from "./pages/controle-agregados/AlertasAgregados";
import RelatorioCCACompetencia from "./pages/controle-agregados/RelatorioCCACompetencia";

// Caução imports
import CadastroCaucao from "./pages/caucao/CadastroCaucao";
import AprovacaoCaucao from "./pages/caucao/AprovacaoCaucao";
import LiquidacaoCaucao from "./pages/caucao/LiquidacaoCaucao";
import RestituicaoCaucao from "./pages/caucao/RestituicaoCaucao";
import LogsCaucao from "./pages/caucao/LogsCaucao";
import DestinatariosCaucao from "./pages/caucao/DestinatariosCaucao";

// Aluguel imports
import AluguelVisaoGeral from "./pages/aluguel/AluguelVisaoGeral";
import AluguelMedicoes from "./pages/aluguel/AluguelMedicoes";
import AluguelLancamentos from "./pages/aluguel/AluguelLancamentos";
import AluguelRelatoriosAlertas from "./pages/aluguel/AluguelRelatoriosAlertas";
import DestinatariosAluguel from "./pages/aluguel/DestinatariosAluguel";

// Controle de Transporte imports
import AlertasTransporte from "./pages/controle-transporte/AlertasTransporte";
import Metas from "./pages/controle-transporte/Metas";
import DestinatariosTransporte from "./pages/controle-transporte/DestinatariosTransporte";
import GuiaModuloTransporte from "./pages/controle-transporte/GuiaModulo";
import RelatoriosTransporte from "./pages/controle-transporte/RelatoriosTransporte";

// Hospedagem imports
import HospedagemMedicoes from "./pages/hospedagem/HospedagemMedicoes";
import HospedagemLancamentos from "./pages/hospedagem/HospedagemLancamentos";
import HospedagemRelatoriosAlertas from "./pages/hospedagem/HospedagemRelatoriosAlertas";
import DestinatariosHospedagem from "./pages/hospedagem/DestinatariosHospedagem";

// Novas páginas de Controle de Transporte
import MedicaoTransporte from "./pages/controle-transporte/MedicaoTransporte";
import NovaMediacaoTransporte from "./pages/controle-transporte/NovaMediacaoTransporte";
import LancamentosSiengeTransporte from "./pages/controle-transporte/LancamentosSiengeTransporte";
import DetalheLancamentoSienge from "./pages/controle-transporte/DetalheLancamentoSienge";

// Novas páginas de Controle de Alimentação
import MedicaoAlimentacao from "./pages/controle-alimentacao/MedicaoAlimentacao";
import NovaMediacaoAlimentacao from "./pages/controle-alimentacao/NovaMediacaoAlimentacao";
import LancamentosSiengeAlimentacao from "./pages/controle-alimentacao/LancamentosSiengeAlimentacao";
import DestinatariosAlimentacao from "./pages/controle-alimentacao/DestinatariosAlimentacao";
import MetasAlimentacao from "./pages/controle-alimentacao/MetasAlimentacao";
import AlertasAlimentacao from "./pages/controle-alimentacao/AlertasAlimentacao";
import GuiaModuloAlimentacao from "./pages/controle-alimentacao/GuiaModulo";
import RelatoriosAlimentacao from "./pages/controle-alimentacao/RelatoriosAlimentacao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ColaboradoresProvider>
      <ColaboradoresAbelvPJProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
            <Route path="/controle-mao-obra" element={<ControleMaoObra />} />
            {/* Controle Mão de Obra subroutes */}
            <Route path="/controle-mao-obra/efetivo-terceiros" element={<EfetivoTerceiros />} />
            <Route path="/controle-mao-obra/controle-diario" element={<ControleDiario />} />
            <Route path="/controle-mao-obra/efetivo-abelv-pj" element={<EfetivoAbelvPJ />} />
            <Route path="/controle-mao-obra/controle-diario-abelv-pj" element={<ControleDiarioAbelvPJ />} />
            <Route path="/controle-mao-obra/relatorios-efetivo" element={<RelatoriosEfetivo />} />
            <Route path="/controle-mao-obra/destinatarios-efetivo" element={<DestinatariosEfetivo />} />
            <Route path="/mobilizacao/leadtime-contratacao" element={<LeadTimeContratacao />} />
            <Route path="/fornecedores-alojamento" element={<FornecedoresAlojamento />} />
            <Route path="/novo-fornecedor" element={<NovoFornecedor />} />
            <Route path="/fornecedor/:id" element={<DetalheFornecedor />} />
            <Route path="/contrato/:id" element={<DetalheContrato />} />
            <Route path="/painel-analise-contratual" element={<PainelAnaliseContratual />} />
            <Route path="/alojamento/guia-gestao-mensal" element={<GuiaGestaoAlojamentosMensal />} />
            <Route path="/contratos-alojamento" element={<ContratosAlojamento />} />
            <Route path="/novo-contrato-alojamento" element={<NovoContratoAlojamento />} />
            <Route path="/editar-contrato-alojamento/:id" element={<EditarContratoAlojamento />} />
            <Route path="/vistorias-alojamento" element={<VistoriasAlojamento />} />
            <Route path="/nova-vistoria" element={<NovaVistoria />} />
            <Route path="/editar-vistoria/:id" element={<EditarVistoria />} />
            <Route path="/anexar-vistoria/:id" element={<AnexarVistoria />} />
            <Route path="/vistorias-alojamento/relatorios" element={<RelatoriosVistorias />} />
            <Route path="/vistorias-alojamento/alertas" element={<AlertasVistorias />} />
            <Route path="/vistorias-alojamento/dashboard" element={<DashboardVistorias />} />
            <Route path="/relatorios-alertas-alojamento" element={<RelatoriosAlertasAlojamento />} />
            <Route path="/relatorios-alertas-alojamento/gestao-contratos" element={<GestaoContratos />} />
            <Route path="/relatorios-alertas-alojamento/relatorio-obra" element={<RelatorioObra />} />
            <Route path="/relatorios-alertas-alojamento/destinatarios" element={<Destinatarios />} />
            <Route path="/relatorios-alertas-alojamento/dashboard" element={<DashboardAlertasAlojamento />} />
            <Route path="/controle-agregados-alojamento" element={<ControleAgregadosAlojamento />} />
            <Route path="/controle-transporte-colaboradores" element={<ControleTransporteColaboradores />} />
            <Route path="/controle-alimentacao" element={<ControleAlimentacao />} />
            <Route path="/controle-folga-campo" element={<ControleFolgaCampo />} />
            {/* Folga Campo subroutes */}
            <Route path="/folga-campo/dashboard" element={<DashboardFolgaCampo />} />
            <Route path="/folga-campo/colaboradores" element={<ColaboradoresFolgaCampo />} />
            <Route path="/folga-campo/por-obra" element={<PorObraFolgaCampo />} />
            <Route path="/folga-campo/compras" element={<ComprasFolgaCampo />} />
            <Route path="/folga-campo/relatorios" element={<RelatoriosFolgaCampo />} />
            <Route path="/folga-campo/alertas" element={<AlertasFolgaCampo />} />
            <Route path="/folga-campo/auditoria" element={<AuditoriaFolgaCampo />} />
              <Route path="/relatorio-mao-obra" element={<RelatorioMaoObra />} />
              <Route path="/relatorio-consolidado-obras" element={<RelatorioConsolidadoObras />} />
          <Route path="/nova-admissao" element={<NovaAdmissao />} />
          <Route path="/checklist-colaborador" element={<ChecklistColaborador />} />
          <Route path="/validacao-admissao" element={<ValidacaoAdmissao />} />
          <Route path="/relacao-documentos-prazos/:colaboradorId" element={<RelacaoDocumentosPrazos />} />
          <Route path="/dashboard-alertas" element={<DashboardAlertas />} />
          <Route path="/relatorio-documentacao-mobilizacao" element={<RelatorioDocumentacaoMobilizacao />} />
           <Route path="/mobilizacao/guia" element={<GuiaModulo />} />
           <Route path="/mobilizacao/alertas" element={<AlertasMobilizacao />} />
           <Route path="/mobilizacao/dashboard" element={<DashboardMobilizacao />} />
           <Route path="/mobilizacao/destinatarios" element={<DestinatariosMobilizacao />} />
           {/* Controle Agregados subroutes */}
           <Route path="/controle-agregados/visao-geral" element={<VisaoGeralAlojamentos />} />
        <Route path="/controle-agregados/relatorios" element={<RelatoriosAgregados />} />
        <Route path="/controle-agregados/destinatarios-medicao" element={<DestinatariosMedicao />} />
        <Route path="/controle-agregados/dashboard" element={<DashboardAgregados />} />
        <Route path="/controle-agregados/alertas" element={<AlertasAgregados />} />
        <Route path="/controle-agregados/relatorio-cca-competencia" element={<RelatorioCCACompetencia />} />
        
        {/* Caução Routes */}
        <Route path="/caucao/cadastro" element={<CadastroCaucao />} />
        <Route path="/caucao/aprovacao" element={<AprovacaoCaucao />} />
        <Route path="/caucao/liquidacao" element={<LiquidacaoCaucao />} />
        <Route path="/caucao/restituicao" element={<RestituicaoCaucao />} />
        <Route path="/caucao/logs" element={<LogsCaucao />} />
        <Route path="/caucao/destinatarios" element={<DestinatariosCaucao />} />
        
        {/* Aluguel Routes */}
        <Route path="/aluguel/visao-geral" element={<AluguelVisaoGeral />} />
        <Route path="/aluguel/medicoes" element={<AluguelMedicoes />} />
        <Route path="/aluguel/lancamentos-sienge" element={<AluguelLancamentos />} />
        <Route path="/aluguel/relatorios-alertas" element={<AluguelRelatoriosAlertas />} />
        <Route path="/aluguel/destinatarios" element={<DestinatariosAluguel />} />
        
        {/* Controle de Transporte Routes */}
        <Route path="/controle-transporte/guia" element={<GuiaModuloTransporte />} />
        <Route path="/controle-transporte/medicao" element={<MedicaoTransporte />} />
        <Route path="/controle-transporte/medicao/nova" element={<NovaMediacaoTransporte />} />
        <Route path="/controle-transporte/lancamentos-sienge" element={<LancamentosSiengeTransporte />} />
        <Route path="/controle-transporte/lancamentos-sienge/:id" element={<DetalheLancamentoSienge />} />
        {/* Relatórios de Transporte */}
        <Route path="/controle-transporte/relatorios" element={<RelatoriosTransporte />} />
        <Route path="/controle-transporte/alertas" element={<AlertasTransporte />} />
        <Route path="/controle-transporte/metas" element={<Metas />} />
        <Route path="/controle-transporte/destinatarios" element={<DestinatariosTransporte />} />
        
        {/* Controle de Alimentação Routes */}
        <Route path="/controle-alimentacao/guia" element={<GuiaModuloAlimentacao />} />
        <Route path="/controle-alimentacao/medicao" element={<MedicaoAlimentacao />} />
        <Route path="/controle-alimentacao/medicao/nova" element={<NovaMediacaoAlimentacao />} />
        <Route path="/controle-alimentacao/lancamentos-sienge" element={<LancamentosSiengeAlimentacao />} />
        <Route path="/controle-alimentacao/relatorios" element={<RelatoriosAlimentacao />} />
        <Route path="/controle-alimentacao/alertas" element={<AlertasAlimentacao />} />
        <Route path="/controle-alimentacao/metas" element={<MetasAlimentacao />} />
        <Route path="/controle-alimentacao/destinatarios" element={<DestinatariosAlimentacao />} />
        
        {/* Hospedagem Routes */}
        <Route path="/hospedagem/medicoes" element={<HospedagemMedicoes />} />
        <Route path="/hospedagem/lancamentos-sienge" element={<HospedagemLancamentos />} />
        <Route path="/hospedagem/relatorios-alertas" element={<HospedagemRelatoriosAlertas />} />
        <Route path="/hospedagem/destinatarios" element={<DestinatariosHospedagem />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
      </BrowserRouter>
        </TooltipProvider>
      </ColaboradoresAbelvPJProvider>
    </ColaboradoresProvider>
  </QueryClientProvider>
);

export default App;
