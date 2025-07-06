
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
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

// Admin pages
import AdminUsuarios from "./pages/admin/AdminUsuarios";
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <AuthGuard>
                  <Layout>
                    <Index />
                  </Layout>
                </AuthGuard>
              } />
              
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AuthGuard>
              } />

              {/* Account routes */}
              <Route path="/account/profile" element={
                <AuthGuard>
                  <Layout>
                    <Profile />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/account/settings" element={
                <AuthGuard>
                  <Layout>
                    <Settings />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/account/support" element={
                <AuthGuard>
                  <Layout>
                    <Support />
                  </Layout>
                </AuthGuard>
              } />

              {/* Admin routes */}
              <Route path="/admin/usuarios" element={
                <AuthGuard>
                  <Layout>
                    <AdminUsuarios />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/usuarios-auth" element={
                <AuthGuard>
                  <Layout>
                    <AdminUsuariosAuth />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/ccas" element={
                <AuthGuard>
                  <Layout>
                    <AdminCCAs />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/perfis" element={
                <AuthGuard>
                  <Layout>
                    <AdminPerfis />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/empresas" element={
                <AuthGuard>
                  <Layout>
                    <AdminEmpresas />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/engenheiros" element={
                <AuthGuard>
                  <Layout>
                    <AdminEngenheiros />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/supervisores" element={
                <AuthGuard>
                  <Layout>
                    <AdminSupervisores />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/logo" element={
                <AuthGuard>
                  <Layout>
                    <AdminLogo />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/templates" element={
                <AuthGuard>
                  <Layout>
                    <AdminTemplates />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/modelos-inspecao" element={
                <AuthGuard>
                  <Layout>
                    <AdminModelosInspecao />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/funcionarios" element={
                <AuthGuard>
                  <Layout>
                    <CadastroFuncionarios />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/criar-usuario" element={
                <AuthGuard>
                  <Layout>
                    <CriarUsuario />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/metas-indicadores" element={
                <AuthGuard>
                  <Layout>
                    <MetasIndicadores />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/admin/registro-hht" element={
                <AuthGuard>
                  <Layout>
                    <RegistroHHT />
                  </Layout>
                </AuthGuard>
              } />

              {/* Tarefas routes */}
              <Route path="/tarefas/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <TarefasDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/tarefas/cadastro" element={
                <AuthGuard>
                  <Layout>
                    <CadastroTarefas />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/tarefas/minhas" element={
                <AuthGuard>
                  <Layout>
                    <MinhasTarefas />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/tarefas/:id" element={
                <AuthGuard>
                  <Layout>
                    <DetalheTarefa />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/tarefas/:id/editar" element={
                <AuthGuard>
                  <Layout>
                    <EditarTarefa />
                  </Layout>
                </AuthGuard>
              } />

              {/* Treinamentos routes */}
              <Route path="/treinamentos/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <TreinamentosDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/execucao" element={
                <AuthGuard>
                  <Layout>
                    <TreinamentosExecucao />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/consulta" element={
                <AuthGuard>
                  <Layout>
                    <TreinamentosConsulta />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/cracha" element={
                <AuthGuard>
                  <Layout>
                    <TreinamentosCracha />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/normativo" element={
                <AuthGuard>
                  <Layout>
                    <TreinamentosNormativo />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/execucao/:id/editar" element={
                <AuthGuard>
                  <Layout>
                    <EditarExecucaoTreinamento />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/treinamentos/execucao/:id/visualizar" element={
                <AuthGuard>
                  <Layout>
                    <VisualizarExecucaoTreinamento />
                  </Layout>
                </AuthGuard>
              } />

              {/* Ocorrências routes */}
              <Route path="/ocorrencias/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/cadastro" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasCadastro />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/consulta" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasConsulta />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/visualizacao" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasVisualizacao />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/:id" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasDetalhes />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/:id/editar" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasEdicao />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/ocorrencias/:id/atualizar-status" element={
                <AuthGuard>
                  <Layout>
                    <OcorrenciasAtualizarStatus />
                  </Layout>
                </AuthGuard>
              } />

              {/* Desvios routes */}
              <Route path="/desvios/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <DesviosDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/desvios/cadastro" element={
                <AuthGuard>
                  <Layout>
                    <DesviosForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/desvios/consulta" element={
                <AuthGuard>
                  <Layout>
                    <DesviosConsulta />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/desvios/nao-conformidade" element={
                <AuthGuard>
                  <Layout>
                    <DesviosNaoConformidade />
                  </Layout>
                </AuthGuard>
              } />

              {/* Hora da Segurança routes */}
              <Route path="/hora-seguranca/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <HoraSegurancaDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/inspecoes-cadastro" element={
                <AuthGuard>
                  <Layout>
                    <InspecoesCadastro />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/inspecoes-acompanhamento" element={
                <AuthGuard>
                  <Layout>
                    <InspecoesAcompanhamento />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/inspecoes-nao-programadas" element={
                <AuthGuard>
                  <Layout>
                    <InspecoesNaoProgramadas />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/inspecao-cadastro-hsa" element={
                <AuthGuard>
                  <Layout>
                    <InspecaoCadastroHSA />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/inspecao-nao-programada-hsa" element={
                <AuthGuard>
                  <Layout>
                    <InspecaoNaoProgramadaHSA />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/painel-execucao-hsa" element={
                <AuthGuard>
                  <Layout>
                    <PainelExecucaoHSA />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/hora-seguranca/agenda-hsa" element={
                <AuthGuard>
                  <Layout>
                    <AgendaHSA />
                  </Layout>
                </AuthGuard>
              } />

              {/* IDSMS routes */}
              <Route path="/idsms/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <IDSMSDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/indicadores" element={
                <AuthGuard>
                  <Layout>
                    <IDSMSIndicadores />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/ht" element={
                <AuthGuard>
                  <Layout>
                    <HTForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/hsa" element={
                <AuthGuard>
                  <Layout>
                    <HSAForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/iid" element={
                <AuthGuard>
                  <Layout>
                    <IIDForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/ipom" element={
                <AuthGuard>
                  <Layout>
                    <IPOMForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/indice-reativo" element={
                <AuthGuard>
                  <Layout>
                    <IndiceReativoForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/inspecao-alta-lideranca" element={
                <AuthGuard>
                  <Layout>
                    <InspecaoAltaLiderancaForm />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/idsms/inspecao-gestao-sms" element={
                <AuthGuard>
                  <Layout>
                    <InspecaoGestaoSMSForm />
                  </Layout>
                </AuthGuard>
              } />

              {/* GRO routes */}
              <Route path="/gro/avaliacao-riscos" element={
                <AuthGuard>
                  <Layout>
                    <GroAvaliacaoRiscos />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/gro/cadastro-perigos" element={
                <AuthGuard>
                  <Layout>
                    <GroCadastroPerigos />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/gro/pgr" element={
                <AuthGuard>
                  <Layout>
                    <GroPGR />
                  </Layout>
                </AuthGuard>
              } />

              {/* Medidas Disciplinares routes */}
              <Route path="/medidas-disciplinares/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <MedidasDisciplinaresDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/medidas-disciplinares/cadastro" element={
                <AuthGuard>
                  <Layout>
                    <MedidasDisciplinaresCadastro />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/medidas-disciplinares/consulta" element={
                <AuthGuard>
                  <Layout>
                    <MedidasDisciplinaresConsulta />
                  </Layout>
                </AuthGuard>
              } />

              {/* Relatórios routes */}
              <Route path="/relatorios/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <RelatoriosDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/relatorios/ocorrencias" element={
                <AuthGuard>
                  <Layout>
                    <RelatoriosOcorrencias />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/relatorios/desvios" element={
                <AuthGuard>
                  <Layout>
                    <RelatoriosDesvios />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/relatorios/treinamentos" element={
                <AuthGuard>
                  <Layout>
                    <RelatoriosTreinamentos />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/relatorios/idsms" element={
                <AuthGuard>
                  <Layout>
                    <RelatoriosIDSMS />
                  </Layout>
                </AuthGuard>
              } />

              {/* Inspeção SMS routes */}
              <Route path="/inspecao-sms/cadastrar" element={
                <AuthGuard>
                  <Layout>
                    <CadastrarInspecao />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/inspecao-sms/consulta" element={
                <AuthGuard>
                  <Layout>
                    <ConsultarInspecoes />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/inspecao-sms/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <InspecaoSMSDashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/inspecao-sms/visualizar/:id" element={
                <AuthGuard>
                  <Layout>
                    <VisualizarInspecao />
                  </Layout>
                </AuthGuard>
              } />

              {/* Placeholder routes */}
              <Route path="/placeholder" element={
                <AuthGuard>
                  <Layout>
                    <PlaceholderPage />
                  </Layout>
                </AuthGuard>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
