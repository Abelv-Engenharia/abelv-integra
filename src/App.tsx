
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

// SMS pages - corrigindo imports para caminhos corretos
import DesviosDashboard from "@/pages/DesviosDashboard";
import DesviosForm from "@/pages/DesviosForm";
import DesviosConsulta from "@/pages/DesviosConsulta";
import DesviosNaoConformidade from "@/pages/DesviosNaoConformidade";
import TreinamentosDashboard from "@/pages/treinamentos/TreinamentosDashboard";
import TreinamentosNormativo from "@/pages/treinamentos/TreinamentosNormativo";
import TreinamentosConsulta from "@/pages/treinamentos/TreinamentosConsulta";
import TreinamentosExecucao from "@/pages/treinamentos/TreinamentosExecucao";
import TreinamentosCracha from "@/pages/treinamentos/TreinamentosCracha";
import HoraSegurancaDashboard from "@/pages/hora-seguranca/HoraSegurancaDashboard";
import AgendaHSA from "@/pages/hora-seguranca/AgendaHSA";
import InspecaoCadastroHSA from "@/pages/hora-seguranca/InspecaoCadastroHSA";
import InspecoesAcompanhamento from "@/pages/hora-seguranca/InspecoesAcompanhamento";
import InspecaoNaoProgramadaHSA from "@/pages/hora-seguranca/InspecaoNaoProgramadaHSA";
import OcorrenciasDashboard from "@/pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasCadastro from "@/pages/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "@/pages/ocorrencias/OcorrenciasConsulta";
import MedidasDisciplinaresDashboard from "@/pages/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "@/pages/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "@/pages/medidas-disciplinares/MedidasDisciplinaresConsulta";

// Tarefas pages
import TarefasDashboard from "@/pages/tarefas/TarefasDashboard";
import MinhasTarefas from "@/pages/tarefas/MinhasTarefas";
import CadastroTarefas from "@/pages/tarefas/CadastroTarefas";

// Relatorios pages
import RelatoriosDashboard from "@/pages/relatorios/RelatoriosDashboard";
import RelatoriosIDSMS from "@/pages/relatorios/RelatoriosIDSMS";

// IDSMS pages
import IDSMSDashboard from "@/pages/idsms/IDSMSDashboard";
import IDSMSIndicadores from "@/pages/idsms/IDSMSIndicadores";
import IIDForm from "@/pages/idsms/IIDForm";
import HSAForm from "@/pages/idsms/HSAForm";
import HTForm from "@/pages/idsms/HTForm";
import IPOMForm from "@/pages/idsms/IPOMForm";
import InspecaoAltaLiderancaForm from "@/pages/idsms/InspecaoAltaLiderancaForm";
import InspecaoGestaoSMSForm from "@/pages/idsms/InspecaoGestaoSMSForm";
import IndiceReativoForm from "@/pages/idsms/IndiceReativoForm";

// GRO pages
import GroCadastroPerigos from "@/pages/gro/GroCadastroPerigos";
import GroAvaliacaoRiscos from "@/pages/gro/GroAvaliacaoRiscos";
import GroPGR from "@/pages/gro/GroPGR";

// Admin pages
import AdminUsuarios from "@/pages/admin/AdminUsuarios";
import AdminPerfis from "@/pages/admin/AdminPerfis";
import AdminEmpresas from "@/pages/admin/AdminEmpresas";
import AdminCCAs from "@/pages/admin/AdminCCAs";
import AdminEngenheiros from "@/pages/admin/AdminEngenheiros";
import AdminSupervisores from "@/pages/admin/AdminSupervisores";
import CadastroFuncionarios from "@/pages/admin/CadastroFuncionarios";
import RegistroHHT from "@/pages/admin/RegistroHHT";
import MetasIndicadores from "@/pages/admin/MetasIndicadores";
import AdminTemplates from "@/pages/AdminTemplates";
import AdminLogo from "@/pages/admin/AdminLogo";

// Account pages
import Profile from "@/pages/account/Profile";
import Settings from "@/pages/account/Settings";

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
              <Route path="desvios/cadastro" element={<DesviosForm />} />
              <Route path="desvios/consulta" element={<DesviosConsulta />} />
              <Route path="desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
              <Route path="treinamentos/dashboard" element={<TreinamentosDashboard />} />
              <Route path="treinamentos/normativo" element={<TreinamentosNormativo />} />
              <Route path="treinamentos/consulta" element={<TreinamentosConsulta />} />
              <Route path="treinamentos/execucao" element={<TreinamentosExecucao />} />
              <Route path="treinamentos/cracha" element={<TreinamentosCracha />} />
              <Route path="hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
              <Route path="hora-seguranca/agenda-hsa" element={<AgendaHSA />} />
              <Route path="hora-seguranca/cadastro-inspecao" element={<InspecaoCadastroHSA />} />
              <Route path="hora-seguranca/acompanhamento" element={<InspecoesAcompanhamento />} />
              <Route path="hora-seguranca/cadastro-inspecao-nao-planejada" element={<InspecaoNaoProgramadaHSA />} />
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
              <Route path="tarefas/minhas-tarefas" element={<MinhasTarefas />} />
              <Route path="tarefas/cadastro" element={<CadastroTarefas />} />

              {/* Relatorios routes */}
              <Route path="relatorios" element={<RelatoriosDashboard />} />
              <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />

              {/* IDSMS routes */}
              <Route path="idsms/dashboard" element={<IDSMSDashboard />} />
              <Route path="idsms/indicadores" element={<IDSMSIndicadores />} />
              <Route path="idsms/iid" element={<IIDForm />} />
              <Route path="idsms/hsa" element={<HSAForm />} />
              <Route path="idsms/ht" element={<HTForm />} />
              <Route path="idsms/ipom" element={<IPOMForm />} />
              <Route path="idsms/inspecao-alta-lideranca" element={<InspecaoAltaLiderancaForm />} />
              <Route path="idsms/inspecao-gestao-sms" element={<InspecaoGestaoSMSForm />} />
              <Route path="idsms/indice-reativo" element={<IndiceReativoForm />} />

              {/* GRO routes */}
              <Route path="gro/perigos" element={<GroCadastroPerigos />} />
              <Route path="gro/avaliacao" element={<GroAvaliacaoRiscos />} />
              <Route path="gro/pgr" element={<GroPGR />} />
              
              {/* Admin routes */}
              <Route path="admin/usuarios" element={<AdminUsuarios />} />
              <Route path="admin/perfis" element={<AdminPerfis />} />
              <Route path="admin/empresas" element={<AdminEmpresas />} />
              <Route path="admin/ccas" element={<AdminCCAs />} />
              <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
              <Route path="admin/supervisores" element={<AdminSupervisores />} />
              <Route path="admin/funcionarios" element={<CadastroFuncionarios />} />
              <Route path="admin/hht" element={<RegistroHHT />} />
              <Route path="admin/metas-indicadores" element={<MetasIndicadores />} />
              {/* Admin routes - Add new model route */}
              <Route path="admin/modelos-inspecao" element={<AdminModelosInspecao />} />
              <Route path="admin/templates" element={<AdminTemplates />} />
              <Route path="admin/logo" element={<AdminLogo />} />

              {/* Account routes */}
              <Route path="account/profile" element={<Profile />} />
              <Route path="account/settings" element={<Settings />} />
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
