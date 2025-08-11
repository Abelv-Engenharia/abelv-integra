
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/admin/Admin";
import AdminFuncionarios from "@/pages/admin/Funcionarios";
import HHT from "@/pages/admin/HHT";
import MetasIndicadores from "@/pages/admin/MetasIndicadores";
import Templates from "@/pages/admin/Templates";
import Logo from "@/pages/admin/Logo";
import ModelosInspecao from "@/pages/admin/ModelosInspecao";
import Usuarios from "@/pages/admin/Usuarios";
import Perfis from "@/pages/admin/Perfis";
import Empresas from "@/pages/admin/Empresas";
import CCAs from "@/pages/admin/CCAs";
import Engenheiros from "@/pages/admin/Engenheiros";
import Supervisores from "@/pages/admin/Supervisores";
import DesviosDashboard from "@/pages/sms/desvios/DesviosDashboard";
import DesviosCadastro from "@/pages/sms/desvios/DesviosCadastro";
import DesviosConsulta from "@/pages/sms/desvios/DesviosConsulta";
import DesviosNaoConformidade from "@/pages/sms/desvios/DesviosNaoConformidade";
import TreinamentosDashboard from "@/pages/sms/treinamentos/TreinamentosDashboard";
import TreinamentosNormativo from "@/pages/sms/treinamentos/TreinamentosNormativo";
import TreinamentosConsulta from "@/pages/sms/treinamentos/TreinamentosConsulta";
import TreinamentosExecucao from "@/pages/sms/treinamentos/TreinamentosExecucao";
import TreinamentosCracha from "@/pages/sms/treinamentos/TreinamentosCracha";
import HoraSegurancaCadastro from "@/pages/sms/hora-seguranca/HoraSegurancaCadastro";
import HoraSegurancaCadastroInspecao from "@/pages/sms/hora-seguranca/HoraSegurancaCadastroInspecao";
import HoraSegurancaCadastroNaoProgramada from "@/pages/sms/hora-seguranca/HoraSegurancaCadastroNaoProgramada";
import HoraSegurancaDashboard from "@/pages/sms/hora-seguranca/HoraSegurancaDashboard";
import HoraSegurancaAgenda from "@/pages/sms/hora-seguranca/HoraSegurancaAgenda";
import HoraSegurancaAcompanhamento from "@/pages/sms/hora-seguranca/HoraSegurancaAcompanhamento";
import InspecaoSMSDashboard from "@/pages/sms/inspecao-sms/InspecaoSMSDashboard";
import InspecaoSMSCadastro from "@/pages/sms/inspecao-sms/InspecaoSMSCadastro";
import InspecaoSMSConsulta from "@/pages/sms/inspecao-sms/InspecaoSMSConsulta";
import MedidasDisciplinaresDashboard from "@/pages/sms/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "@/pages/sms/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "@/pages/sms/medidas-disciplinares/MedidasDisciplinaresConsulta";
import OcorrenciasDashboard from "@/pages/sms/ocorrencias/OcorrenciasDashboard";
import OcorrenciasCadastro from "@/pages/sms/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "@/pages/sms/ocorrencias/OcorrenciasConsulta";
import TarefasDashboard from "@/pages/tarefas/TarefasDashboard";
import TarefasMinhasTarefas from "@/pages/tarefas/TarefasMinhasTarefas";
import TarefasCadastro from "@/pages/tarefas/TarefasCadastro";
import RelatoriosDashboard from "@/pages/relatorios/RelatoriosDashboard";
import RelatoriosIDSMS from "@/pages/relatorios/RelatoriosIDSMS";
import AccountProfile from "@/pages/account/AccountProfile";
import AccountSettings from "@/pages/account/AccountSettings";
import Tutoriais from "@/pages/admin/Tutoriais";
import GRO from "@/pages/gro/GRO";
import ADMDashboard from "@/pages/adm/ADMDashboard";
import ADMUsuarios from "@/pages/adm/ADMUsuarios";
import ADMPerfis from "@/pages/adm/ADMPerfis";
import ADMEmpresas from "@/pages/adm/ADMEmpresas";
import ADMCCAs from "@/pages/adm/ADMCCAs";
import ADMSupervisores from "@/pages/adm/ADMSupervisores";
import ADMFuncionarios from "@/pages/adm/ADMFuncionarios";
import ADMHHT from "@/pages/adm/ADMHHT";
import ADMMetasIndicadores from "@/pages/adm/ADMMetasIndicadores";
import ADMModelosInspecao from "@/pages/adm/ADMModelosInspecao";
import ADMTemplates from "@/pages/adm/ADMTemplates";
import ADMLogo from "@/pages/adm/ADMLogo";
import SuprimentosDashboard from "@/pages/suprimentos/SuprimentosDashboard";
import SuprimentosFornecedores from "@/pages/suprimentos/SuprimentosFornecedores";
import SuprimentosMateriais from "@/pages/suprimentos/SuprimentosMateriais";
import SuprimentosCompras from "@/pages/suprimentos/SuprimentosCompras";
import SuprimentosEstoque from "@/pages/suprimentos/SuprimentosEstoque";
import SuprimentosPedidos from "@/pages/suprimentos/SuprimentosPedidos";
import SuprimentosContratos from "@/pages/suprimentos/SuprimentosContratos";
import ProducaoDashboard from "@/pages/producao/ProducaoDashboard";
import ProducaoPlanejamento from "@/pages/producao/ProducaoPlanejamento";
import ProducaoOrdensProducao from "@/pages/producao/ProducaoOrdensProducao";
import ProducaoControleQualidade from "@/pages/producao/ProducaoControleQualidade";
import ProducaoManutencao from "@/pages/producao/ProducaoManutencao";
import ProducaoRecursos from "@/pages/producao/ProducaoRecursos";
import ProducaoIndicadores from "@/pages/producao/ProducaoIndicadores";
import OrcamentosDashboard from "@/pages/orcamentos/OrcamentosDashboard";
import OrcamentosProjetos from "@/pages/orcamentos/OrcamentosProjetos";
import OrcamentosCustos from "@/pages/orcamentos/OrcamentosCustos";
import OrcamentosAnalises from "@/pages/orcamentos/OrcamentosAnalises";
import OrcamentosAprovacoes from "@/pages/orcamentos/OrcamentosAprovacoes";
import OrcamentosHistorico from "@/pages/orcamentos/OrcamentosHistorico";
import QualidadeDashboard from "@/pages/qualidade/QualidadeDashboard";
import QualidadeControle from "@/pages/qualidade/QualidadeControle";
import QualidadeAuditorias from "@/pages/qualidade/QualidadeAuditorias";
import QualidadeIndicadores from "@/pages/qualidade/QualidadeIndicadores";
import QualidadeEquipe from "@/pages/qualidade/QualidadeEquipe";
import QualidadeConfiguracoes from "@/pages/qualidade/QualidadeConfiguracoes";
import ImportacaoFuncionarios from "@/pages/admin/ImportacaoFuncionarios";
import ImportacaoDesvios from "@/pages/admin/ImportacaoDesvios";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/funcionarios" element={<AdminFuncionarios />} />
            <Route path="/admin/hht" element={<HHT />} />
            <Route path="/admin/metas-indicadores" element={<MetasIndicadores />} />
            <Route path="/admin/templates" element={<Templates />} />
            <Route path="/admin/logo-sistema" element={<Logo />} />
            <Route path="/admin/modelos-inspecao" element={<ModelosInspecao />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/perfis" element={<Perfis />} />
            <Route path="/admin/empresas" element={<Empresas />} />
            <Route path="/admin/ccas" element={<CCAs />} />
            <Route path="/admin/engenheiros" element={<Engenheiros />} />
            <Route path="/admin/supervisores" element={<Supervisores />} />
            <Route path="/admin/importacao-funcionarios" element={<ImportacaoFuncionarios />} />
            <Route path="/admin/importacao-desvios" element={<ImportacaoDesvios />} />
            
            {/* SMS Routes */}
            <Route path="/desvios/dashboard" element={<DesviosDashboard />} />
            <Route path="/desvios/cadastro" element={<DesviosCadastro />} />
            <Route path="/desvios/consulta" element={<DesviosConsulta />} />
            <Route path="/desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
            
            <Route path="/treinamentos/dashboard" element={<TreinamentosDashboard />} />
            <Route path="/treinamentos/normativo" element={<TreinamentosNormativo />} />
            <Route path="/treinamentos/consulta" element={<TreinamentosConsulta />} />
            <Route path="/treinamentos/execucao" element={<TreinamentosExecucao />} />
            <Route path="/treinamentos/cracha" element={<TreinamentosCracha />} />
            
            <Route path="/hora-seguranca/cadastro" element={<HoraSegurancaCadastro />} />
            <Route path="/hora-seguranca/cadastro-inspecao" element={<HoraSegurancaCadastroInspecao />} />
            <Route path="/hora-seguranca/cadastro-nao-programada" element={<HoraSegurancaCadastroNaoProgramada />} />
            <Route path="/hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
            <Route path="/hora-seguranca/agenda" element={<HoraSegurancaAgenda />} />
            <Route path="/hora-seguranca/acompanhamento" element={<HoraSegurancaAcompanhamento />} />
            
            <Route path="/inspecao-sms/dashboard" element={<InspecaoSMSDashboard />} />
            <Route path="/inspecao-sms/cadastro" element={<InspecaoSMSCadastro />} />
            <Route path="/inspecao-sms/consulta" element={<InspecaoSMSConsulta />} />
            
            <Route path="/medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
            <Route path="/medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
            <Route path="/medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />
            
            <Route path="/ocorrencias/dashboard" element={<OcorrenciasDashboard />} />
            <Route path="/ocorrencias/cadastro" element={<OcorrenciasCadastro />} />
            <Route path="/ocorrencias/consulta" element={<OcorrenciasConsulta />} />
            
            {/* Tarefas Routes */}
            <Route path="/tarefas/dashboard" element={<TarefasDashboard />} />
            <Route path="/tarefas/minhas-tarefas" element={<TarefasMinhasTarefas />} />
            <Route path="/tarefas/cadastro" element={<TarefasCadastro />} />
            
            {/* Relatórios Routes */}
            <Route path="/relatorios/dashboard" element={<RelatoriosDashboard />} />
            <Route path="/relatorios/idsms" element={<RelatoriosIDSMS />} />
            
            {/* Account Routes */}
            <Route path="/account/profile" element={<AccountProfile />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/upload-tutoriais" element={<Tutoriais />} />
            
            {/* GRO Routes */}
            <Route path="/gro" element={<GRO />} />
            
            {/* ADM Routes */}
            <Route path="/adm/dashboard" element={<ADMDashboard />} />
            <Route path="/adm/usuarios" element={<ADMUsuarios />} />
            <Route path="/adm/perfis" element={<ADMPerfis />} />
            <Route path="/adm/empresas" element={<ADMEmpresas />} />
            <Route path="/adm/ccas" element={<ADMCCAs />} />
            <Route path="/adm/supervisores" element={<ADMSupervisores />} />
            <Route path="/adm/funcionarios" element={<ADMFuncionarios />} />
            <Route path="/adm/hht" element={<ADMHHT />} />
            <Route path="/adm/metas-indicadores" element={<ADMMetasIndicadores />} />
            <Route path="/adm/modelos-inspecao" element={<ADMModelosInspecao />} />
            <Route path="/adm/templates" element={<ADMTemplates />} />
            <Route path="/adm/logo" element={<ADMLogo />} />
            
            {/* Suprimentos Routes */}
            <Route path="/suprimentos/dashboard" element={<SuprimentosDashboard />} />
            <Route path="/suprimentos/fornecedores" element={<SuprimentosFornecedores />} />
            <Route path="/suprimentos/materiais" element={<SuprimentosMateriais />} />
            <Route path="/suprimentos/compras" element={<SuprimentosCompras />} />
            <Route path="/suprimentos/estoque" element={<SuprimentosEstoque />} />
            <Route path="/suprimentos/pedidos" element={<SuprimentosPedidos />} />
            <Route path="/suprimentos/contratos" element={<SuprimentosContratos />} />
            
            {/* Produção Routes */}
            <Route path="/producao/dashboard" element={<ProducaoDashboard />} />
            <Route path="/producao/planejamento" element={<ProducaoPlanejamento />} />
            <Route path="/producao/ordens-producao" element={<ProducaoOrdensProducao />} />
            <Route path="/producao/controle-qualidade" element={<ProducaoControleQualidade />} />
            <Route path="/producao/manutencao" element={<ProducaoManutencao />} />
            <Route path="/producao/recursos" element={<ProducaoRecursos />} />
            <Route path="/producao/indicadores" element={<ProducaoIndicadores />} />
            
            {/* Orçamentos Routes */}
            <Route path="/orcamentos/dashboard" element={<OrcamentosDashboard />} />
            <Route path="/orcamentos/projetos" element={<OrcamentosProjetos />} />
            <Route path="/orcamentos/custos" element={<OrcamentosCustos />} />
            <Route path="/orcamentos/analises" element={<OrcamentosAnalises />} />
            <Route path="/orcamentos/aprovacoes" element={<OrcamentosAprovacoes />} />
            <Route path="/orcamentos/historico" element={<OrcamentosHistorico />} />
            
            {/* Qualidade Routes */}
            <Route path="/qualidade/dashboard" element={<QualidadeDashboard />} />
            <Route path="/qualidade/controle" element={<QualidadeControle />} />
            <Route path="/qualidade/auditorias" element={<QualidadeAuditorias />} />
            <Route path="/qualidade/indicadores" element={<QualidadeIndicadores />} />
            <Route path="/qualidade/equipe" element={<QualidadeEquipe />} />
            <Route path="/qualidade/configuracoes" element={<QualidadeConfiguracoes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
