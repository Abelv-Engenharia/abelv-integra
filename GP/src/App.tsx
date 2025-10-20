import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SolicitacoesProvider } from "./context/SolicitacoesContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import ConsultaPrestadores from "./pages/ConsultaPrestadores";
import CadastroPessoaJuridica from "./pages/CadastroPessoaJuridica";
import EmissaoContratoPrestacaoServico from "./pages/EmissaoContratoPrestacaoServico";
import DemonstrativoPrestacaoServico from "./pages/DemonstrativoPrestacaoServico";
import CadastroEmissaoNF from "./pages/CadastroEmissaoNF";
import AprovacaoNF from "./pages/AprovacaoNF";
import RequisicoesServicos from "./pages/RequisicoesServicos";
import ChecklistVeiculos from "./pages/ChecklistVeiculos";
import RelatorioViagens from "./pages/RelatorioViagens";

import CadastroFatura from "./pages/CadastroFatura";
import ConsultaFaturas from "./pages/ConsultaFaturas";
import ImportarFatura from "./pages/ImportarFatura";
import RelatoriosVeiculos from "./pages/RelatoriosVeiculos";
import DashboardVeiculos from "./pages/DashboardVeiculos";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import CadastroMulta from "./pages/CadastroMulta";
import CadastroCondutor from "./pages/CadastroCondutor";
import CadastroCartaoAbastecimento from "./pages/CadastroCartaoAbastecimento";
import CadastroPedagioEstacionamento from "./pages/CadastroPedagioEstacionamento";
import ConsultasVeiculos from "./pages/ConsultasVeiculos";
import CalculoRotas from "./pages/CalculoRotas";
import GestaoViagensDashboard from "./pages/GestaoViagensDashboard";
import ControleSolicitacoes from "./pages/ControleSolicitacoes";
import SolicitacaoServicos from "./pages/SolicitacaoServicos";
import AprovacaoSolicitacoes from "./pages/AprovacaoSolicitacoes";
import RhAberturaVaga from "./pages/RhAberturaVaga";
import RhDetalhesVaga from "./pages/RhDetalhesVaga";
import ControleAbastecimento from "./pages/ControleAbastecimento";
import ControleFerias from "./pages/ControleFerias";
import AprovacaoFerias from "./pages/AprovacaoFerias";
import ControlePassivos from "./pages/ControlePassivos";
import RelatoriosPrestadores from "./pages/RelatoriosPrestadores";
import DashboardPrestadores from "./pages/DashboardPrestadores";
import ConsultaContratos from "./pages/ConsultaContratos";
import BancoTalentos from "./pages/BancoTalentos";
import AprovacaoVaga from "./pages/AprovacaoVaga";
import GestaoVagas from "./pages/GestaoVagas";
import RelatoriosSolicitacoes from "./pages/RelatoriosSolicitacoes";
import KPISolicitacoes from "./pages/KPISolicitacoes";
import DashboardRecrutamento from "./pages/DashboardRecrutamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolicitacoesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastro-pessoa-juridica" element={<CadastroPessoaJuridica />} />
            <Route path="/consulta-prestadores" element={<ConsultaPrestadores />} />
            <Route path="/emissao-contrato-prestacao-servico" element={<EmissaoContratoPrestacaoServico />} />
            <Route path="/consulta-contratos" element={<ConsultaContratos />} />
            <Route path="/demonstrativo-prestacao-servico" element={<DemonstrativoPrestacaoServico />} />
            <Route path="/cadastro-emissao-nf" element={<CadastroEmissaoNF />} />
            <Route path="/aprovacao-nf" element={<AprovacaoNF />} />
            <Route path="/controle-ferias" element={<ControleFerias />} />
            <Route path="/aprovacao-ferias" element={<AprovacaoFerias />} />
            <Route path="/controle-passivos" element={<ControlePassivos />} />
            <Route path="/relatorios-prestadores" element={<RelatoriosPrestadores />} />
            <Route path="/dashboard-prestadores" element={<DashboardPrestadores />} />
            <Route path="/requisicoes-servicos" element={<RequisicoesServicos />} />
            <Route path="/checklist-veiculos" element={<ChecklistVeiculos />} />
            <Route path="/relatorio-viagens" element={<RelatorioViagens />} />
            <Route path="/cadastro-fatura" element={<CadastroFatura />} />
            <Route path="/importar-fatura" element={<ImportarFatura />} />
            <Route path="/consulta-faturas" element={<ConsultaFaturas />} />
            <Route path="/dashboard-veiculos" element={<DashboardVeiculos />} />
            <Route path="/relatorios-veiculos" element={<RelatoriosVeiculos />} />
            <Route path="/cadastro-veiculo" element={<CadastroVeiculo />} />
            <Route path="/cadastro-multa" element={<CadastroMulta />} />
            <Route path="/cadastro-condutor" element={<CadastroCondutor />} />
            <Route path="/cadastro-cartao-abastecimento" element={<CadastroCartaoAbastecimento />} />
            <Route path="/cadastro-pedagio-estacionamento" element={<CadastroPedagioEstacionamento />} />
            <Route path="/consultas-veiculos" element={<ConsultasVeiculos />} />
            <Route path="/calculo-rotas" element={<CalculoRotas />} />
            <Route path="/gestao-viagens-dashboard" element={<GestaoViagensDashboard />} />
            <Route path="/solicitacao-servicos" element={<SolicitacaoServicos />} />
              <Route path="/controle-solicitacoes" element={<ControleSolicitacoes />} />
              <Route path="/aprovacao-solicitacoes" element={<AprovacaoSolicitacoes />} />
              <Route path="/relatorios-solicitacoes" element={<RelatoriosSolicitacoes />} />
              <Route path="/kpi-solicitacoes" element={<KPISolicitacoes />} />
              <Route path="/dashboard-recrutamento" element={<DashboardRecrutamento />} />
              <Route path="/rh-abertura-vaga" element={<RhAberturaVaga />} />
              <Route path="/aprovacao-vaga" element={<AprovacaoVaga />} />
              <Route path="/gestao-vagas" element={<GestaoVagas />} />
              <Route path="/rh-detalhes-vaga/:id" element={<RhDetalhesVaga />} />
              <Route path="/controle-abastecimento" element={<ControleAbastecimento />} />
              <Route path="/controle-abastecimento" element={<ControleAbastecimento />} />
              <Route path="/banco-talentos" element={<BancoTalentos />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
    </SolicitacoesProvider>
  </QueryClientProvider>
);

export default App;

