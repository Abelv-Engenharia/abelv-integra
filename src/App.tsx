import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layout/Layout";

// Auth pages
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Main pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// SMS pages
import DesviosDashboard from "@/pages/sms/desvios/DesviosDashboard";
import DesviosCadastro from "@/pages/sms/desvios/DesviosCadastro";
import DesviosConsulta from "@/pages/sms/desvios/DesviosConsulta";
import DesviosNaoConformidade from "@/pages/sms/desvios/DesviosNaoConformidade";
import TreinamentosDashboard from "@/pages/sms/treinamentos/TreinamentosDashboard";
import TreinamentosNormativo from "@/pages/sms/treinamentos/TreinamentosNormativo";
import TreinamentosConsulta from "@/pages/sms/treinamentos/TreinamentosConsulta";
import TreinamentosExecucao from "@/pages/sms/treinamentos/TreinamentosExecucao";
import TreinamentosCracha from "@/pages/sms/treinamentos/TreinamentosCracha";
import HoraSegurancaDashboard from "@/pages/sms/hora-seguranca/HoraSegurancaDashboard";
import HoraSegurancaAgenda from "@/pages/sms/hora-seguranca/HoraSegurancaAgenda";
import HoraSegurancaCadastroInspecao from "@/pages/sms/hora-seguranca/HoraSegurancaCadastroInspecao";
import HoraSegurancaAcompanhamento from "@/pages/sms/hora-seguranca/HoraSegurancaAcompanhamento";
import HoraSegurancaCadastroInspecaoNaoPlanejada from "@/pages/sms/hora-seguranca/HoraSegurancaCadastroInspecaoNaoPlanejada";
import OcorrenciasDashboard from "@/pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasCadastro from "@/pages/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "@/pages/ocorrencias/OcorrenciasConsulta";
import MedidasDisciplinaresDashboard from "@/pages/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "@/pages/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "@/pages/medidas-disciplinares/MedidasDisciplinaresConsulta";

// Tarefas pages
import TarefasDashboard from "@/pages/tarefas/TarefasDashboard";
import TarefasMinhasTarefas from "@/pages/tarefas/TarefasMinhasTarefas";
import TarefasCadastro from "@/pages/tarefas/TarefasCadastro";

// Relatorios pages
import Relatorios from "@/pages/relatorios/Relatorios";
import RelatoriosIDSMS from "@/pages/relatorios/RelatoriosIDSMS";

// IDSMS pages
import IDSMSDashboard from "@/pages/idsms/IDSMSDashboard";
import IDSMSIndicadores from "@/pages/idsms/IDSMSIndicadores";
import IDSMSIID from "@/pages/idsms/IDSMSIID";
import IDSMSHSA from "@/pages/idsms/IDSMSHSA";
import IDSMSHT from "@/pages/idsms/IDSMSHT";
import IDSMSIPOM from "@/pages/idsms/IDSMSIPOM";
import IDSMSInspecaoAltaLideranca from "@/pages/idsms/IDSMSInspecaoAltaLideranca";
import IDSMSInspecaoGestaoSMS from "@/pages/idsms/IDSMSInspecaoGestaoSMS";
import IDSMSIndiceReativo from "@/pages/idsms/IDSMSIndiceReativo";

// GRO pages
import GRODashboard from "@/pages/gro/GRODashboard";
import GROPerigos from "@/pages/gro/GROPerigos";
import GROAvaliacao from "@/pages/gro/GROAvaliacao";
import GROPGR from "@/pages/gro/GROPGR";
import GRORevisao from "@/pages/gro/GRORevisao";
import GRORelatorios from "@/pages/gro/GRORelatorios";

// Admin pages
import AdminUsuarios from "@/pages/admin/AdminUsuarios";
import AdminPerfis from "@/pages/admin/AdminPerfis";
import AdminEmpresas from "@/pages/admin/AdminEmpresas";
import AdminCCAs from "@/pages/admin/AdminCCAs";
import AdminEngenheiros from "@/pages/admin/AdminEngenheiros";
import AdminSupervisores from "@/pages/admin/AdminSupervisores";
import AdminFuncionarios from "@/pages/admin/AdminFuncionarios";
import AdminHHT from "@/pages/admin/AdminHHT";
import AdminMetasIndicadores from "@/pages/admin/AdminMetasIndicadores";
import AdminTemplates from "@/pages/admin/AdminTemplates";
import AdminLogo from "@/pages/admin/AdminLogo";

// Account pages
import AccountProfile from "@/pages/account/AccountProfile";
import AccountSettings from "@/pages/account/AccountSettings";

// New Inspeção SMS pages
import InspecaoSMSDashboard from "@/pages/inspecao-sms/InspecaoSMSDashboard";
import CadastrarInspecao from "@/pages/inspecao-sms/CadastrarInspecao";
import ConsultarInspecoes from "@/pages/inspecao-sms/ConsultarInspecoes";
import AdminModelosInspecao from "@/pages/admin/AdminModelosInspecao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* SMS routes */}
              <Route path="desvios/dashboard" element={<DesviosDashboard />} />
              <Route path="desvios/cadastro" element={<DesviosCadastro />} />
              <Route path="desvios/consulta" element={<DesviosConsulta />} />
              <Route path="desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
              <Route path="treinamentos/dashboard" element={<TreinamentosDashboard />} />
              <Route path="treinamentos/normativo" element={<TreinamentosNormativo />} />
              <Route path="treinamentos/consulta" element={<TreinamentosConsulta />} />
              <Route path="treinamentos/execucao" element={<TreinamentosExecucao />} />
              <Route path="treinamentos/cracha" element={<TreinamentosCracha />} />
              <Route path="hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
              <Route path="hora-seguranca/agenda-hsa" element={<HoraSegurancaAgenda />} />
              <Route path="hora-seguranca/cadastro-inspecao" element={<HoraSegurancaCadastroInspecao />} />
              <Route path="hora-seguranca/acompanhamento" element={<HoraSegurancaAcompanhamento />} />
              <Route path="hora-seguranca/cadastro-inspecao-nao-planejada" element={<HoraSegurancaCadastroInspecaoNaoPlanejada />} />
              <Route path="ocorrencias/dashboard" element={<OcorrenciasDashboard />} />
              <Route path="ocorrencias/cadastro" element={<OcorrenciasCadastro />} />
              <Route path="ocorrencias/consulta" element={<OcorrenciasConsulta />} />
              <Route path="medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
              <Route path="medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
              <Route path="medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />
              
              {/* New Inspeção SMS routes */}
              <Route path="inspecao-sms/dashboard" element={<InspecaoSMSDashboard />} />
              <Route path="inspecao-sms/cadastro" element={<CadastrarInspecao />} />
              <Route path="inspecao-sms/consulta" element={<ConsultarInspecoes />} />
              
              {/* Tarefas routes */}
              <Route path="tarefas/dashboard" element={<TarefasDashboard />} />
              <Route path="tarefas/minhas-tarefas" element={<TarefasMinhasTarefas />} />
              <Route path="tarefas/cadastro" element={<TarefasCadastro />} />

              {/* Relatorios routes */}
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />

              {/* IDSMS routes */}
              <Route path="idsms/dashboard" element={<IDSMSDashboard />} />
              <Route path="idsms/indicadores" element={<IDSMSIndicadores />} />
              <Route path="idsms/iid" element={<IDSMSIID />} />
              <Route path="idsms/hsa" element={<IDSMSHSA />} />
              <Route path="idsms/ht" element={<IDSMSHT />} />
              <Route path="idsms/ipom" element={<IDSMSIPOM />} />
              <Route path="idsms/inspecao-alta-lideranca" element={<IDSMSInspecaoAltaLideranca />} />
              <Route path="idsms/inspecao-gestao-sms" element={<IDSMSInspecaoGestaoSMS />} />
              <Route path="idsms/indice-reativo" element={<IDSMSIndiceReativo />} />

              {/* GRO routes */}
              <Route path="gro/dashboard" element={<GRODashboard />} />
              <Route path="gro/perigos" element={<GROPerigos />} />
              <Route path="gro/avaliacao" element={<GROAvaliacao />} />
              <Route path="gro/pgr" element={<GROPGR />} />
              <Route path="gro/revisao" element={<GRORevisao />} />
              <Route path="gro/relatorios" element={<GRORelatorios />} />
              
              {/* Admin routes */}
              <Route path="admin/usuarios" element={<AdminUsuarios />} />
              <Route path="admin/perfis" element={<AdminPerfis />} />
              <Route path="admin/empresas" element={<AdminEmpresas />} />
              <Route path="admin/ccas" element={<AdminCCAs />} />
              <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
              <Route path="admin/supervisores" element={<AdminSupervisores />} />
              <Route path="admin/funcionarios" element={<AdminFuncionarios />} />
              <Route path="admin/hht" element={<AdminHHT />} />
              <Route path="admin/metas-indicadores" element={<AdminMetasIndicadores />} />
              {/* Admin routes - Add new model route */}
              <Route path="admin/modelos-inspecao" element={<AdminModelosInspecao />} />
              <Route path="admin/templates" element={<AdminTemplates />} />
              <Route path="admin/logo" element={<AdminLogo />} />

              {/* Account routes */}
              <Route path="account/profile" element={<AccountProfile />} />
              <Route path="account/settings" element={<AccountSettings />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
