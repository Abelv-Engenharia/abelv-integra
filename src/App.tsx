
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layout/Layout";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Account pages
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";
import Support from "./pages/account/Support";
import Suporte from "./pages/Suporte";

// Admin pages - NEW USER MANAGEMENT PAGE
import GerenciarUsuarios from "./pages/admin/GerenciarUsuarios";
import AdminUsuariosAuth from "./pages/admin/AdminUsuariosAuth";
import AdminCCAs from "./pages/admin/AdminCCAs";
import AdminPerfis from "./pages/admin/AdminPerfis";
import AdminEmpresas from "./pages/admin/AdminEmpresas";
import AdminEngenheiros from "./pages/admin/AdminEngenheiros";
import AdminSupervisores from "./pages/admin/AdminSupervisores";
import AdminLogo from "./pages/admin/AdminLogo";
import AdminTemplates from "./pages/AdminTemplates";
import AdminModelosInspecao from "./pages/admin/AdminModelosInspecao";
import CadastroFuncionarios from "./pages/admin/CadastroFuncionarios";
import CriarUsuario from "./pages/admin/CriarUsuario";
import MetasIndicadores from "./pages/admin/MetasIndicadores";
import RegistroHHT from "./pages/admin/RegistroHHT";

// Tarefas pages
import TarefasDashboard from "./pages/tarefas/TarefasDashboard";
import CadastroTarefas from "./pages/tarefas/CadastroTarefas";
import MinhasTarefas from "./pages/tarefas/MinhasTarefas";
import DetalheTarefa from "./pages/tarefas/DetalheTarefa";
import EditarTarefa from "./pages/tarefas/EditarTarefa";

// Treinamentos pages
import TreinamentosDashboard from "./pages/treinamentos/TreinamentosDashboard";
import TreinamentosExecucao from "./pages/treinamentos/TreinamentosExecucao";
import TreinamentosConsulta from "./pages/treinamentos/TreinamentosConsulta";
import TreinamentosCracha from "./pages/treinamentos/TreinamentosCracha";
import TreinamentosNormativo from "./pages/treinamentos/TreinamentosNormativo";
import EditarExecucaoTreinamento from "./pages/treinamentos/EditarExecucaoTreinamento";
import VisualizarExecucaoTreinamento from "./pages/treinamentos/VisualizarExecucaoTreinamento";

// Ocorrências pages
import OcorrenciasDashboard from "./pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasCadastro from "./pages/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "./pages/ocorrencias/OcorrenciasConsulta";
import OcorrenciasVisualizacao from "./pages/ocorrencias/OcorrenciasVisualizacao";
import OcorrenciasDetalhes from "./pages/ocorrencias/OcorrenciasDetalhes";
import OcorrenciasEdicao from "./pages/ocorrencias/OcorrenciasEdicao";
import OcorrenciasAtualizarStatus from "./pages/ocorrencias/OcorrenciasAtualizarStatus";

// Desvios pages
import DesviosDashboard from "./pages/DesviosDashboard";
import DesviosForm from "./pages/DesviosForm";
import DesviosConsulta from "./pages/DesviosConsulta";
import DesviosNaoConformidade from "./pages/DesviosNaoConformidade";

// Hora da Segurança pages
import HoraSegurancaDashboard from "./pages/hora-seguranca/HoraSegurancaDashboard";
import InspecoesCadastro from "./pages/hora-seguranca/InspecoesCadastro";
import InspecoesAcompanhamento from "./pages/hora-seguranca/InspecoesAcompanhamento";
import InspecoesNaoProgramadas from "./pages/hora-seguranca/InspecoesNaoProgramadas";
import InspecaoCadastroHSA from "./pages/hora-seguranca/InspecaoCadastroHSA";
import InspecaoNaoProgramadaHSA from "./pages/hora-seguranca/InspecaoNaoProgramadaHSA";
import PainelExecucaoHSA from "./pages/hora-seguranca/PainelExecucaoHSA";
import AgendaHSA from "./pages/hora-seguranca/AgendaHSA";

// IDSMS pages
import IDSMSDashboard from "./pages/idsms/IDSMSDashboard";
import IDSMSIndicadores from "./pages/idsms/IDSMSIndicadores";
import HTForm from "./pages/idsms/HTForm";
import HSAForm from "./pages/idsms/HSAForm";
import IIDForm from "./pages/idsms/IIDForm";
import IPOMForm from "./pages/idsms/IPOMForm";
import IndiceReativoForm from "./pages/idsms/IndiceReativoForm";
import InspecaoAltaLiderancaForm from "./pages/idsms/InspecaoAltaLiderancaForm";
import InspecaoGestaoSMSForm from "./pages/idsms/InspecaoGestaoSMSForm";

// GRO pages
import GroAvaliacaoRiscos from "./pages/gro/GroAvaliacaoRiscos";
import GroCadastroPerigos from "./pages/gro/GroCadastroPerigos";
import GroPGR from "./pages/gro/GroPGR";

// Medidas Disciplinares pages
import MedidasDisciplinaresDashboard from "./pages/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "./pages/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "./pages/medidas-disciplinares/MedidasDisciplinaresConsulta";

// Relatórios pages
import RelatoriosDashboard from "./pages/relatorios/RelatoriosDashboard";
import RelatoriosOcorrencias from "./pages/relatorios/RelatoriosOcorrencias";
import RelatoriosDesvios from "./pages/relatorios/RelatoriosDesvios";
import RelatoriosTreinamentos from "./pages/relatorios/RelatoriosTreinamentos";
import RelatoriosIDSMS from "./pages/relatorios/RelatoriosIDSMS";

// Inspeção SMS pages
import CadastrarInspecao from "./pages/inspecao-sms/CadastrarInspecao";
import ConsultarInspecoes from "./pages/inspecao-sms/ConsultarInspecoes";
import InspecaoSMSDashboard from "./pages/inspecao-sms/InspecaoSMSDashboard";
import VisualizarInspecao from "./pages/inspecao-sms/VisualizarInspecao";

// Placeholder page
import PlaceholderPage from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Account routes */}
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/settings" element={<Settings />} />
                <Route path="account/support" element={<Support />} />
                
                {/* Support route */}
                <Route path="suporte" element={<Suporte />} />

                {/* Admin routes - NEW USER MANAGEMENT */}
                <Route path="admin/usuarios" element={<GerenciarUsuarios />} />
                <Route path="admin/usuarios-auth" element={<AdminUsuariosAuth />} />
                <Route path="admin/ccas" element={<AdminCCAs />} />
                <Route path="admin/perfis" element={<AdminPerfis />} />
                <Route path="admin/empresas" element={<AdminEmpresas />} />
                <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
                <Route path="admin/supervisores" element={<AdminSupervisores />} />
                <Route path="admin/logo" element={<AdminLogo />} />
                <Route path="admin/templates" element={<AdminTemplates />} />
                <Route path="admin/modelos-inspecao" element={<AdminModelosInspecao />} />
                <Route path="admin/funcionarios" element={<CadastroFuncionarios />} />
                <Route path="admin/criar-usuario" element={<CriarUsuario />} />
                <Route path="admin/metas-indicadores" element={<MetasIndicadores />} />
                <Route path="admin/registro-hht" element={<RegistroHHT />} />

                {/* Tarefas routes */}
                <Route path="tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="tarefas/cadastro" element={<CadastroTarefas />} />
                <Route path="tarefas/minhas" element={<MinhasTarefas />} />
                <Route path="tarefas/:id" element={<DetalheTarefa />} />
                <Route path="tarefas/:id/editar" element={<EditarTarefa />} />

                {/* Treinamentos routes */}
                <Route path="treinamentos/dashboard" element={<TreinamentosDashboard />} />
                <Route path="treinamentos/execucao" element={<TreinamentosExecucao />} />
                <Route path="treinamentos/consulta" element={<TreinamentosConsulta />} />
                <Route path="treinamentos/cracha" element={<TreinamentosCracha />} />
                <Route path="treinamentos/normativo" element={<TreinamentosNormativo />} />
                <Route path="treinamentos/execucao/:id/editar" element={<EditarExecucaoTreinamento />} />
                <Route path="treinamentos/execucao/:id/visualizar" element={<VisualizarExecucaoTreinamento />} />

                {/* Ocorrências routes */}
                <Route path="ocorrencias/dashboard" element={<OcorrenciasDashboard />} />
                <Route path="ocorrencias/cadastro" element={<OcorrenciasCadastro />} />
                <Route path="ocorrencias/consulta" element={<OcorrenciasConsulta />} />
                <Route path="ocorrencias/visualizacao" element={<OcorrenciasVisualizacao />} />
                <Route path="ocorrencias/:id" element={<OcorrenciasDetalhes />} />
                <Route path="ocorrencias/:id/editar" element={<OcorrenciasEdicao />} />
                <Route path="ocorrencias/:id/atualizar-status" element={<OcorrenciasAtualizarStatus />} />

                {/* Desvios routes */}
                <Route path="desvios/dashboard" element={<DesviosDashboard />} />
                <Route path="desvios/cadastro" element={<DesviosForm />} />
                <Route path="desvios/consulta" element={<DesviosConsulta />} />
                <Route path="desvios/nao-conformidade" element={<DesviosNaoConformidade />} />

                {/* Hora da Segurança routes */}
                <Route path="hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
                <Route path="hora-seguranca/inspecoes-cadastro" element={<InspecoesCadastro />} />
                <Route path="hora-seguranca/inspecoes-acompanhamento" element={<InspecoesAcompanhamento />} />
                <Route path="hora-seguranca/inspecoes-nao-programadas" element={<InspecoesNaoProgramadas />} />
                <Route path="hora-seguranca/inspecao-cadastro-hsa" element={<InspecaoCadastroHSA />} />
                <Route path="hora-seguranca/inspecao-nao-programada-hsa" element={<InspecaoNaoProgramadaHSA />} />
                <Route path="hora-seguranca/painel-execucao-hsa" element={<PainelExecucaoHSA />} />
                <Route path="hora-seguranca/agenda-hsa" element={<AgendaHSA />} />

                {/* IDSMS routes */}
                <Route path="idsms/dashboard" element={<IDSMSDashboard />} />
                <Route path="idsms/indicadores" element={<IDSMSIndicadores />} />
                <Route path="idsms/ht" element={<HTForm />} />
                <Route path="idsms/hsa" element={<HSAForm />} />
                <Route path="idsms/iid" element={<IIDForm />} />
                <Route path="idsms/ipom" element={<IPOMForm />} />
                <Route path="idsms/indice-reativo" element={<IndiceReativoForm />} />
                <Route path="idsms/inspecao-alta-lideranca" element={<InspecaoAltaLiderancaForm />} />
                <Route path="idsms/inspecao-gestao-sms" element={<InspecaoGestaoSMSForm />} />

                {/* GRO routes */}
                <Route path="gro/avaliacao-riscos" element={<GroAvaliacaoRiscos />} />
                <Route path="gro/cadastro-perigos" element={<GroCadastroPerigos />} />
                <Route path="gro/pgr" element={<GroPGR />} />

                {/* Medidas Disciplinares routes */}
                <Route path="medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
                <Route path="medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
                <Route path="medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />

                {/* Relatórios routes */}
                <Route path="relatorios/dashboard" element={<RelatoriosDashboard />} />
                <Route path="relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />

                {/* Inspeção SMS routes */}
                <Route path="inspecao-sms/cadastrar" element={<CadastrarInspecao />} />
                <Route path="inspecao-sms/consulta" element={<ConsultarInspecoes />} />
                <Route path="inspecao-sms/dashboard" element={<InspecaoSMSDashboard />} />
                <Route path="inspecao-sms/visualizar/:id" element={<VisualizarInspecao />} />

                {/* Placeholder routes */}
                <Route path="placeholder" element={<PlaceholderPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
