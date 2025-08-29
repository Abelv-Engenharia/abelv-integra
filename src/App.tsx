import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import PermissionGuard from "@/components/auth/PermissionGuard";
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
import ConfiguracaoEmailsPage from "./pages/configuracao-emails/ConfiguracaoEmails";
import UploadTutoriaisPage from "./pages/configuracao-emails/UploadTutoriais";
import Suporte from "./pages/Suporte";

// Admin pages - NEW USER MANAGEMENT PAGE
import GerenciarUsuarios from "./pages/admin/GerenciarUsuarios";
import AdminUsuariosAuth from "./pages/admin/AdminUsuariosAuth";
import AdminCCAs from "./pages/admin/AdminCCAs";
import AdminPerfis from "./pages/admin/AdminPerfis";
import AdminEmpresas from "./pages/admin/AdminEmpresas";
import AdminEngenheiros from "./pages/admin/AdminEngenheiros";
import AdminSupervisores from "./pages/admin/AdminSupervisores";
import AdminEncarregados from "./pages/admin/AdminEncarregados";
import AdminLogo from "./pages/admin/AdminLogo";
import AdminTemplates from "./pages/AdminTemplates";

import ExportacaoDados from "./pages/admin/ExportacaoDados";
import CadastroFuncionarios from "./pages/admin/CadastroFuncionarios";
import ImportacaoFuncionarios from "./pages/admin/ImportacaoFuncionarios";
import CriarUsuario from "./pages/admin/CriarUsuario";
import MetasIndicadores from "./pages/admin/MetasIndicadores";
import RegistroHHT from "./pages/admin/RegistroHHT";
import ImportacaoExecucaoTreinamentos from "./pages/admin/ImportacaoExecucaoTreinamentos";
import ImportacaoHSA from "./pages/admin/ImportacaoHSA";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";
import AdminChecklists from "./pages/admin/AdminChecklists";

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

// SMS pages
import DashboardSMS from "./pages/sms/DashboardSMS";

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
import RelatoriosHSA from "./pages/relatorios/RelatoriosHSA";

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <TooltipProvider>
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
                <Route path="admin/usuarios" element={
                  <PermissionGuard requiredPermission="sistema_usuarios">
                    <GerenciarUsuarios />
                  </PermissionGuard>
                } />
                <Route path="admin/usuarios-auth" element={
                  <PermissionGuard requiredPermission="sistema_usuarios">
                    <AdminUsuariosAuth />
                  </PermissionGuard>
                } />
                <Route path="admin/ccas" element={
                  <PermissionGuard requiredPermission="sistema_ccas">
                    <AdminCCAs />
                  </PermissionGuard>
                } />
                <Route path="admin/perfis" element={
                  <PermissionGuard requiredPermission="sistema_perfis">
                    <AdminPerfis />
                  </PermissionGuard>
                } />
                <Route path="admin/empresas" element={
                  <PermissionGuard requiredPermission="sistema_empresas">
                    <AdminEmpresas />
                  </PermissionGuard>
                } />
                <Route path="admin/engenheiros" element={
                  <PermissionGuard requiredPermission="sistema_engenheiros">
                    <AdminEngenheiros />
                  </PermissionGuard>
                } />
                <Route path="admin/supervisores" element={
                  <PermissionGuard requiredPermission="sistema_supervisores">
                    <AdminSupervisores />
                  </PermissionGuard>
                } />
                <Route path="admin/encarregados" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <AdminEncarregados />
                  </PermissionGuard>
                } />
                <Route path="admin/logo" element={
                  <PermissionGuard requiredPermission="sistema_logo">
                    <AdminLogo />
                  </PermissionGuard>
                } />
                <Route path="admin/templates" element={
                  <PermissionGuard requiredPermission="sistema_templates">
                    <AdminTemplates />
                  </PermissionGuard>
                } />
                
                <Route path="admin/funcionarios" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <CadastroFuncionarios />
                  </PermissionGuard>
                } />
                <Route path="admin/importacao-funcionarios" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <ImportacaoFuncionarios />
                  </PermissionGuard>
                } />
                <Route path="admin/criar-usuario" element={
                  <PermissionGuard requiredPermission="sistema_usuarios">
                    <CriarUsuario />
                  </PermissionGuard>
                } />
                <Route path="admin/metas-indicadores" element={
                  <PermissionGuard requiredPermission="sistema_metas_indicadores">
                    <MetasIndicadores />
                  </PermissionGuard>
                } />
                <Route path="admin/registro-hht" element={
                  <PermissionGuard requiredPermission="sistema_hht">
                    <RegistroHHT />
                  </PermissionGuard>
                } />
                <Route path="admin/exportacao-dados" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <ExportacaoDados />
                  </PermissionGuard>
                } />
                <Route path="adm/configuracoes" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <AdminConfiguracoes />
                  </PermissionGuard>
                } />
                <Route path="admin/configuracoes" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <AdminConfiguracoes />
                  </PermissionGuard>
                } />
                <Route path="admin/checklists" element={
                  <PermissionGuard requiredPermission="sistema_modelos_inspecao">
                    <AdminChecklists />
                  </PermissionGuard>
                } />
                <Route path="configuracao-emails" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <ConfiguracaoEmailsPage />
                  </PermissionGuard>
                } />
                <Route path="upload-tutoriais" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <UploadTutoriaisPage />
                  </PermissionGuard>
                } />
                <Route path="admin/importacao-execucao-treinamentos" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <ImportacaoExecucaoTreinamentos />
                  </PermissionGuard>
                } />
                <Route path="admin/importacao-hsa" element={
                  <PermissionGuard requiredPermission="sistema_funcionarios">
                    <ImportacaoHSA />
                  </PermissionGuard>
                } />

                {/* Tarefas routes */}
                <Route path="tarefas/dashboard" element={
                  <PermissionGuard requiredPermission="tarefas_dashboard">
                    <TarefasDashboard />
                  </PermissionGuard>
                } />
                <Route path="tarefas/cadastro" element={
                  <PermissionGuard requiredPermission="tarefas_cadastro">
                    <CadastroTarefas />
                  </PermissionGuard>
                } />
                <Route path="tarefas/minhas-tarefas" element={
                  <PermissionGuard requiredPermission="tarefas_minhas_tarefas">
                    <MinhasTarefas />
                  </PermissionGuard>
                } />
                <Route path="tarefas/detalhe/:id" element={<DetalheTarefa />} />
                <Route path="tarefas/editar/:id" element={<EditarTarefa />} />

                {/* Treinamentos routes */}
                <Route path="treinamentos/dashboard" element={
                  <PermissionGuard requiredPermission="treinamentos_dashboard">
                    <TreinamentosDashboard />
                  </PermissionGuard>
                } />
                <Route path="treinamentos/execucao" element={
                  <PermissionGuard requiredPermission="treinamentos_execucao">
                    <TreinamentosExecucao />
                  </PermissionGuard>
                } />
                <Route path="treinamentos/consulta" element={
                  <PermissionGuard requiredPermission="treinamentos_consulta">
                    <TreinamentosConsulta />
                  </PermissionGuard>
                } />
                <Route path="treinamentos/cracha" element={
                  <PermissionGuard requiredPermission="treinamentos_cracha">
                    <TreinamentosCracha />
                  </PermissionGuard>
                } />
                <Route path="treinamentos/normativo" element={
                  <PermissionGuard requiredPermission="treinamentos_normativo">
                    <TreinamentosNormativo />
                  </PermissionGuard>
                } />
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
                <Route path="desvios/dashboard" element={
                  <PermissionGuard requiredPermission="desvios_dashboard">
                    <DesviosDashboard />
                  </PermissionGuard>
                } />
                <Route path="desvios/cadastro" element={
                  <PermissionGuard requiredPermission="desvios_cadastro">
                    <DesviosForm />
                  </PermissionGuard>
                } />
                <Route path="desvios/consulta" element={
                  <PermissionGuard requiredPermission="desvios_consulta">
                    <DesviosConsulta />
                  </PermissionGuard>
                } />
                <Route path="desvios/nao-conformidade" element={
                  <PermissionGuard requiredPermission="desvios_nao_conformidade">
                    <DesviosNaoConformidade />
                  </PermissionGuard>
                } />

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

                {/* SMS routes */}
                <Route path="sms/dashboard" element={<DashboardSMS />} />

                {/* GRO routes */}
                <Route path="gro/avaliacao-riscos" element={<GroAvaliacaoRiscos />} />
                <Route path="gro/cadastro-perigos" element={<GroCadastroPerigos />} />
                <Route path="gro/pgr" element={<GroPGR />} />

                {/* Medidas Disciplinares routes */}
                <Route path="medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
                <Route path="medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
                <Route path="medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />

                {/* Relatórios routes */}
                <Route path="relatorios" element={<Navigate to="/relatorios/dashboard" replace />} />
                <Route path="relatorios/dashboard" element={
                  <PermissionGuard requiredPermission="relatorios_dashboard">
                    <RelatoriosDashboard />
                  </PermissionGuard>
                } />
                <Route path="relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />
                <Route path="relatorios/hsa" element={<RelatoriosHSA />} />

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
  );
}

export default App;
