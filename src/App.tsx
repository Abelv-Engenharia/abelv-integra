
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DesviosForm from "./pages/DesviosForm";
import DesviosDashboard from "./pages/DesviosDashboard";
import DesviosConsulta from "./pages/DesviosConsulta";
import DesviosNaoConformidade from "./pages/DesviosNaoConformidade";
import AdminTemplates from "./pages/AdminTemplates";
import AdminLogo from "./pages/admin/AdminLogo";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";

// Account pages
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";
import Support from "./pages/account/Support";

// Ocorrências pages
import OcorrenciasDashboard from "./pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasCadastro from "./pages/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "./pages/ocorrencias/OcorrenciasConsulta";
import OcorrenciasDetalhes from "./pages/ocorrencias/OcorrenciasDetalhes";

// Treinamentos pages
import TreinamentosDashboard from "./pages/treinamentos/TreinamentosDashboard";
import TreinamentosNormativo from "./pages/treinamentos/TreinamentosNormativo";
import TreinamentosExecucao from "./pages/treinamentos/TreinamentosExecucao";
import TreinamentosCracha from "./pages/treinamentos/TreinamentosCracha";
import TreinamentosConsulta from "./pages/treinamentos/TreinamentosConsulta";

// IDSMS pages
import IDSMSDashboard from "./pages/idsms/IDSMSDashboard";
import IIDForm from "./pages/idsms/IIDForm";
import HSAForm from "./pages/idsms/HSAForm";
import HTForm from "./pages/idsms/HTForm";
import IPOMForm from "./pages/idsms/IPOMForm";
import InspecaoAltaLiderancaForm from "./pages/idsms/InspecaoAltaLiderancaForm";
import InspecaoGestaoSMSForm from "./pages/idsms/InspecaoGestaoSMSForm";
import IndiceReativoForm from "./pages/idsms/IndiceReativoForm";

// Hora da Segurança pages
import HoraSegurancaDashboard from "./pages/hora-seguranca/HoraSegurancaDashboard";
import InspecoesCadastro from "./pages/hora-seguranca/InspecoesCadastro";
import InspecoesNaoProgramadas from "./pages/hora-seguranca/InspecoesNaoProgramadas";
import InspecoesAcompanhamento from "./pages/hora-seguranca/InspecoesAcompanhamento";

// Tarefas pages
import TarefasDashboard from "./pages/tarefas/TarefasDashboard";
import MinhasTarefas from "./pages/tarefas/MinhasTarefas";
import CadastroTarefas from "./pages/tarefas/CadastroTarefas";
import DetalheTarefa from "./pages/tarefas/DetalheTarefa";
import EditarTarefa from "./pages/tarefas/EditarTarefa";

// Relatórios pages
import RelatoriosDashboard from "./pages/relatorios/RelatoriosDashboard";
import RelatoriosDesvios from "./pages/relatorios/RelatoriosDesvios";
import RelatoriosTreinamentos from "./pages/relatorios/RelatoriosTreinamentos";
import RelatoriosOcorrencias from "./pages/relatorios/RelatoriosOcorrencias";
import RelatoriosIDSMS from "./pages/relatorios/RelatoriosIDSMS";

// Admin pages
import RegistroHHT from "./pages/admin/RegistroHHT";
import CadastroFuncionarios from "./pages/admin/CadastroFuncionarios";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuariosAuth from "./pages/admin/AdminUsuariosAuth";
import AdminPerfis from "./pages/admin/AdminPerfis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="app-container">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route path="/" element={<Dashboard />} />
                
                {/* Account routes */}
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/settings" element={<Settings />} />
                <Route path="/account/support" element={<Support />} />
                
                {/* Gestão de SMS routes */}
                <Route path="/desvios/dashboard" element={<DesviosDashboard />} />
                <Route path="/desvios/cadastro" element={<DesviosForm />} />
                <Route path="/desvios/consulta" element={<DesviosConsulta />} />
                <Route path="/desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
                
                {/* Treinamentos routes */}
                <Route path="/treinamentos/dashboard" element={<TreinamentosDashboard />} />
                <Route path="/treinamentos/normativo" element={<TreinamentosNormativo />} />
                <Route path="/treinamentos/consulta" element={<TreinamentosConsulta />} />
                <Route path="/treinamentos/execucao" element={<TreinamentosExecucao />} />
                <Route path="/treinamentos/cracha" element={<TreinamentosCracha />} />
                
                {/* IDSMS routes */}
                <Route path="/idsms/dashboard" element={<IDSMSDashboard />} />
                <Route path="/idsms/iid" element={<IIDForm />} />
                <Route path="/idsms/hsa" element={<HSAForm />} />
                <Route path="/idsms/ht" element={<HTForm />} />
                <Route path="/idsms/ipom" element={<IPOMForm />} />
                <Route path="/idsms/inspecao-alta-lideranca" element={<InspecaoAltaLiderancaForm />} />
                <Route path="/idsms/inspecao-gestao-sms" element={<InspecaoGestaoSMSForm />} />
                <Route path="/idsms/indice-reativo" element={<IndiceReativoForm />} />
                
                {/* Hora-seguranca routes */}
                <Route path="/hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
                <Route path="/hora-seguranca/inspecoes" element={<InspecoesCadastro />} />
                <Route path="/hora-seguranca/inspecao-nao-programada" element={<InspecoesNaoProgramadas />} />
                <Route path="/hora-seguranca/acompanhamento" element={<InspecoesAcompanhamento />} />
                
                {/* Ocorrencias routes */}
                <Route path="/ocorrencias/dashboard" element={<OcorrenciasDashboard />} />
                <Route path="/ocorrencias/cadastro" element={<OcorrenciasCadastro />} />
                <Route path="/ocorrencias/consulta" element={<OcorrenciasConsulta />} />
                <Route path="/ocorrencias/detalhes/:id" element={<OcorrenciasDetalhes />} />
                
                {/* Medidas-disciplinares routes */}
                <Route path="/medidas-disciplinares/dashboard" element={<Dashboard />} />
                <Route path="/medidas-disciplinares/cadastro" element={<Dashboard />} />
                <Route path="/medidas-disciplinares/consulta" element={<Dashboard />} />
                
                {/* Tarefas routes */}
                <Route path="/tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="/tarefas/minhas-tarefas" element={<MinhasTarefas />} />
                <Route path="/tarefas/cadastro" element={<CadastroTarefas />} />
                <Route path="/tarefas/detalhes/:id" element={<DetalheTarefa />} />
                <Route path="/tarefas/editar/:id" element={<EditarTarefa />} />
                
                {/* Relatórios routes */}
                <Route path="/relatorios" element={<RelatoriosDashboard />} />
                <Route path="/relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="/relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="/relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="/relatorios/idsms" element={<RelatoriosIDSMS />} />
                
                {/* Administração routes */}
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/usuarios-auth" element={<AdminUsuariosAuth />} />
                <Route path="/admin/perfis" element={<AdminPerfis />} />
                <Route path="/admin/funcionarios" element={<CadastroFuncionarios />} />
                <Route path="/admin/hht" element={<RegistroHHT />} />
                <Route path="/admin/templates" element={<AdminTemplates />} />
                <Route path="/admin/logo" element={<AdminLogo />} />
              </Route>
              
              {/* Default route - redirect to login */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
