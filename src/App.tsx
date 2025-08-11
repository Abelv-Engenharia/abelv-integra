import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/admin/Admin";
import AdminFuncionarios from "@/pages/admin/Funcionarios";
import AdminHHT from "@/pages/admin/HHT";
import AdminMetasIndicadores from "@/pages/admin/MetasIndicadores";
import AdminTemplates from "@/pages/admin/Templates";
import AdminLogo from "@/pages/admin/Logo";
import AdminModelosInspecao from "@/pages/admin/ModelosInspecao";
import AdminUsuarios from "@/pages/admin/Usuarios";
import AdminPerfis from "@/pages/admin/Perfis";
import AdminEmpresas from "@/pages/admin/Empresas";
import AdminCCAs from "@/pages/admin/CCAs";
import AdminEngenheiros from "@/pages/admin/Engenheiros";
import AdminSupervisores from "@/pages/admin/Supervisores";
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

import ImportacaoDados from "@/pages/admin/ImportacaoDados";
import ImportacaoDesvios from "@/pages/admin/ImportacaoDesvios";
import ImportacaoExecucaoTreinamentos from "@/pages/admin/ImportacaoExecucaoTreinamentos";

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* App Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* SMS Routes */}
            <Route path="/desvios/dashboard" element={<ProtectedRoute><DesviosDashboard /></ProtectedRoute>} />
            <Route path="/desvios/cadastro" element={<ProtectedRoute><DesviosCadastro /></ProtectedRoute>} />
            <Route path="/desvios/consulta" element={<ProtectedRoute><DesviosConsulta /></ProtectedRoute>} />
            <Route path="/desvios/nao-conformidade" element={<ProtectedRoute><DesviosNaoConformidade /></ProtectedRoute>} />

            <Route path="/treinamentos/dashboard" element={<ProtectedRoute><TreinamentosDashboard /></ProtectedRoute>} />
            <Route path="/treinamentos/normativo" element={<ProtectedRoute><TreinamentosNormativo /></ProtectedRoute>} />
            <Route path="/treinamentos/consulta" element={<ProtectedRoute><TreinamentosConsulta /></ProtectedRoute>} />
            <Route path="/treinamentos/execucao" element={<ProtectedRoute><TreinamentosExecucao /></ProtectedRoute>} />
            <Route path="/treinamentos/cracha" element={<ProtectedRoute><TreinamentosCracha /></ProtectedRoute>} />

            <Route path="/hora-seguranca/cadastro" element={<ProtectedRoute><HoraSegurancaCadastro /></ProtectedRoute>} />
            <Route path="/hora-seguranca/cadastro/inspecao" element={<ProtectedRoute><HoraSegurancaCadastroInspecao /></ProtectedRoute>} />
            <Route path="/hora-seguranca/cadastro/nao-programada" element={<ProtectedRoute><HoraSegurancaCadastroNaoProgramada /></ProtectedRoute>} />
            <Route path="/hora-seguranca/dashboard" element={<ProtectedRoute><HoraSegurancaDashboard /></ProtectedRoute>} />
            <Route path="/hora-seguranca/agenda" element={<ProtectedRoute><HoraSegurancaAgenda /></ProtectedRoute>} />
            <Route path="/hora-seguranca/acompanhamento" element={<ProtectedRoute><HoraSegurancaAcompanhamento /></ProtectedRoute>} />

            <Route path="/inspecao-sms/dashboard" element={<ProtectedRoute><InspecaoSMSDashboard /></ProtectedRoute>} />
            <Route path="/inspecao-sms/cadastro" element={<ProtectedRoute><InspecaoSMSCadastro /></ProtectedRoute>} />
            <Route path="/inspecao-sms/consulta" element={<ProtectedRoute><InspecaoSMSConsulta /></ProtectedRoute>} />

            <Route path="/medidas-disciplinares/dashboard" element={<ProtectedRoute><MedidasDisciplinaresDashboard /></ProtectedRoute>} />
            <Route path="/medidas-disciplinares/cadastro" element={<ProtectedRoute><MedidasDisciplinaresCadastro /></ProtectedRoute>} />
            <Route path="/medidas-disciplinares/consulta" element={<ProtectedRoute><MedidasDisciplinaresConsulta /></ProtectedRoute>} />

            <Route path="/ocorrencias/dashboard" element={<ProtectedRoute><OcorrenciasDashboard /></ProtectedRoute>} />
            <Route path="/ocorrencias/cadastro" element={<ProtectedRoute><OcorrenciasCadastro /></ProtectedRoute>} />
            <Route path="/ocorrencias/consulta" element={<ProtectedRoute><OcorrenciasConsulta /></ProtectedRoute>} />

            {/* Tarefas Routes */}
            <Route path="/tarefas/dashboard" element={<ProtectedRoute><TarefasDashboard /></ProtectedRoute>} />
            <Route path="/tarefas/minhas-tarefas" element={<ProtectedRoute><TarefasMinhasTarefas /></ProtectedRoute>} />
            <Route path="/tarefas/cadastro" element={<ProtectedRoute><TarefasCadastro /></ProtectedRoute>} />

            {/* Relatorios Routes */}
            <Route path="/relatorios/dashboard" element={<ProtectedRoute><RelatoriosDashboard /></ProtectedRoute>} />
            <Route path="/relatorios/idsms" element={<ProtectedRoute><RelatoriosIDSMS /></ProtectedRoute>} />

            {/* Account Routes */}
            <Route path="/account/profile" element={<ProtectedRoute><AccountProfile /></ProtectedRoute>} />
            <Route path="/account/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />

             {/* GRO Routes */}
             <Route path="/gro" element={<ProtectedRoute><GRO /></ProtectedRoute>} />

            {/* ADM Routes */}
            <Route path="/adm/dashboard" element={<ProtectedRoute><ADMDashboard /></ProtectedRoute>} />
            <Route path="/adm/usuarios" element={<ProtectedRoute><ADMUsuarios /></ProtectedRoute>} />
            <Route path="/adm/perfis" element={<ProtectedRoute><ADMPerfis /></ProtectedRoute>} />
            <Route path="/adm/empresas" element={<ProtectedRoute><ADMEmpresas /></ProtectedRoute>} />
            <Route path="/adm/ccas" element={<ProtectedRoute><ADMCCAs /></ProtectedRoute>} />
            <Route path="/adm/supervisores" element={<ProtectedRoute><ADMSupervisores /></ProtectedRoute>} />
            <Route path="/adm/funcionarios" element={<ProtectedRoute><ADMFuncionarios /></ProtectedRoute>} />
            <Route path="/adm/hht" element={<ProtectedRoute><ADMHHT /></ProtectedRoute>} />
            <Route path="/adm/metas-indicadores" element={<ProtectedRoute><ADMMetasIndicadores /></ProtectedRoute>} />
            <Route path="/adm/modelos-inspecao" element={<ProtectedRoute><ADMModelosInspecao /></ProtectedRoute>} />
            <Route path="/adm/templates" element={<ProtectedRoute><ADMTemplates /></ProtectedRoute>} />
            <Route path="/adm/logo" element={<ProtectedRoute><ADMLogo /></ProtectedRoute>} />

            {/* Suprimentos Routes */}
            <Route path="/suprimentos/dashboard" element={<ProtectedRoute><SuprimentosDashboard /></ProtectedRoute>} />
            <Route path="/suprimentos/fornecedores" element={<ProtectedRoute><SuprimentosFornecedores /></ProtectedRoute>} />
            <Route path="/suprimentos/materiais" element={<ProtectedRoute><SuprimentosMateriais /></ProtectedRoute>} />
            <Route path="/suprimentos/compras" element={<ProtectedRoute><SuprimentosCompras /></ProtectedRoute>} />
            <Route path="/suprimentos/estoque" element={<ProtectedRoute><SuprimentosEstoque /></ProtectedRoute>} />
            <Route path="/suprimentos/pedidos" element={<ProtectedRoute><SuprimentosPedidos /></ProtectedRoute>} />
            <Route path="/suprimentos/contratos" element={<ProtectedRoute><SuprimentosContratos /></ProtectedRoute>} />

            {/* Producao Routes */}
            <Route path="/producao/dashboard" element={<ProtectedRoute><ProducaoDashboard /></ProtectedRoute>} />
            <Route path="/producao/planejamento" element={<ProtectedRoute><ProducaoPlanejamento /></ProtectedRoute>} />
            <Route path="/producao/ordens-producao" element={<ProtectedRoute><ProducaoOrdensProducao /></ProtectedRoute>} />
            <Route path="/producao/controle-qualidade" element={<ProtectedRoute><ProducaoControleQualidade /></ProtectedRoute>} />
            <Route path="/producao/manutencao" element={<ProtectedRoute><ProducaoManutencao /></ProtectedRoute>} />
            <Route path="/producao/recursos" element={<ProtectedRoute><ProducaoRecursos /></ProtectedRoute>} />
            <Route path="/producao/indicadores" element={<ProtectedRoute><ProducaoIndicadores /></ProtectedRoute>} />

            {/* Orcamentos Routes */}
            <Route path="/orcamentos/dashboard" element={<ProtectedRoute><OrcamentosDashboard /></ProtectedRoute>} />
            <Route path="/orcamentos/projetos" element={<ProtectedRoute><OrcamentosProjetos /></ProtectedRoute>} />
            <Route path="/orcamentos/custos" element={<ProtectedRoute><OrcamentosCustos /></ProtectedRoute>} />
            <Route path="/orcamentos/analises" element={<ProtectedRoute><OrcamentosAnalises /></ProtectedRoute>} />
            <Route path="/orcamentos/aprovacoes" element={<ProtectedRoute><OrcamentosAprovacoes /></ProtectedRoute>} />
            <Route path="/orcamentos/historico" element={<ProtectedRoute><OrcamentosHistorico /></ProtectedRoute>} />

            {/* Qualidade Routes */}
            <Route path="/qualidade/dashboard" element={<ProtectedRoute><QualidadeDashboard /></ProtectedRoute>} />
            <Route path="/qualidade/controle" element={<ProtectedRoute><QualidadeControle /></ProtectedRoute>} />
            <Route path="/qualidade/auditorias" element={<ProtectedRoute><QualidadeAuditorias /></ProtectedRoute>} />
            <Route path="/qualidade/indicadores" element={<ProtectedRoute><QualidadeIndicadores /></ProtectedRoute>} />
            <Route path="/qualidade/equipe" element={<ProtectedRoute><QualidadeEquipe /></ProtectedRoute>} />
            <Route path="/qualidade/configuracoes" element={<ProtectedRoute><QualidadeConfiguracoes /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/funcionarios" element={<ProtectedRoute><AdminFuncionarios /></ProtectedRoute>} />
            <Route path="/admin/hht" element={<ProtectedRoute><AdminHHT /></ProtectedRoute>} />
            <Route path="/admin/metas-indicadores" element={<ProtectedRoute><AdminMetasIndicadores /></ProtectedRoute>} />
            <Route path="/admin/templates" element={<ProtectedRoute><AdminTemplates /></ProtectedRoute>} />
            <Route path="/admin/logo" element={<ProtectedRoute><AdminLogo /></ProtectedRoute>} />
            <Route path="/admin/modelos-inspecao" element={<ProtectedRoute><AdminModelosInspecao /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsuarios /></ProtectedRoute>} />
            <Route path="/admin/perfis" element={<ProtectedRoute><AdminPerfis /></ProtectedRoute>} />
            <Route path="/admin/empresas" element={<ProtectedRoute><AdminEmpresas /></ProtectedRoute>} />
            <Route path="/admin/ccas" element={<ProtectedRoute><AdminCCAs /></ProtectedRoute>} />
            <Route path="/admin/engenheiros" element={<ProtectedRoute><AdminEngenheiros /></ProtectedRoute>} />
            <Route path="/admin/supervisores" element={<ProtectedRoute><AdminSupervisores /></ProtectedRoute>} />
            <Route path="/admin/tutoriais" element={<ProtectedRoute><Tutoriais /></ProtectedRoute>} />
            <Route path="/admin/importacao-funcionarios" element={<ProtectedRoute><ImportacaoFuncionarios /></ProtectedRoute>} />
            <Route path="/admin/importacao" element={<ProtectedRoute><ImportacaoDados /></ProtectedRoute>} />
            <Route path="/admin/importacao/funcionarios" element={<ProtectedRoute><ImportacaoFuncionarios /></ProtectedRoute>} />
            <Route path="/admin/importacao/desvios" element={<ProtectedRoute><ImportacaoDesvios /></ProtectedRoute>} />
            <Route path="/admin/importacao/execucao-treinamentos" element={<ProtectedRoute><ImportacaoExecucaoTreinamentos /></ProtectedRoute>} />
            
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
