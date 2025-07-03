
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import AuthGuard from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import RelatoriosDashboard from "./pages/relatorios/RelatoriosDashboard";
import RelatoriosDesvios from "./pages/relatorios/RelatoriosDesvios";
import RelatoriosTreinamentos from "./pages/relatorios/RelatoriosTreinamentos";
import RelatoriosOcorrencias from "./pages/relatorios/RelatoriosOcorrencias";
import RelatoriosIDSMS from "./pages/relatorios/RelatoriosIDSMS";
import RelatoriosHSA from "./pages/relatorios/RelatoriosHSA";
import DesviosForm from "./pages/DesviosForm";
import DesviosDashboard from "./pages/DesviosDashboard";
import DesviosConsulta from "./pages/DesviosConsulta";
import DesviosNaoConformidade from "./pages/DesviosNaoConformidade";
import TreinamentosDashboard from "./pages/treinamentos/TreinamentosDashboard";
import TreinamentosForm from "./pages/treinamentos/TreinamentosExecucao";
import TreinamentosNormativo from "./pages/treinamentos/TreinamentosNormativo";
import TreinamentosConsulta from "./pages/treinamentos/TreinamentosConsulta";
import TreinamentosCracha from "./pages/treinamentos/TreinamentosCracha";
import OcorrenciasDashboard from "./pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasForm from "./pages/ocorrencias/OcorrenciasCadastro";
import OcorrenciasConsulta from "./pages/ocorrencias/OcorrenciasConsulta";
import UsuariosDashboard from "./pages/admin/AdminUsuarios";
import UsuariosForm from "./pages/admin/CriarUsuario";
import AdminPerfis from "./pages/admin/AdminPerfis";
import AdminEmpresas from "./pages/admin/AdminEmpresas";
import AdminCCAs from "./pages/admin/AdminCCAs";
import AdminEngenheiros from "./pages/admin/AdminEngenheiros";
import AdminSupervisores from "./pages/admin/AdminSupervisores";
import CadastroFuncionarios from "./pages/admin/CadastroFuncionarios";
import RegistroHHT from "./pages/admin/RegistroHHT";
import MetasIndicadores from "./pages/admin/MetasIndicadores";
import AdminTemplates from "./pages/AdminTemplates";
import AdminLogo from "./pages/admin/AdminLogo";
import AdminModelosInspecao from "./pages/admin/AdminModelosInspecao";
import HoraSegurancaDashboard from "./pages/hora-seguranca/HoraSegurancaDashboard";
import InspecoesCadastro from "./pages/hora-seguranca/InspecoesCadastro";
import InspecaoNaoProgramadaHSA from "./pages/hora-seguranca/InspecaoNaoProgramadaHSA";
import AgendaHSA from "./pages/hora-seguranca/AgendaHSA";
import InspecoesAcompanhamento from "./pages/hora-seguranca/InspecoesAcompanhamento";
import IDSMSDashboard from "./pages/idsms/IDSMSDashboard";
import InspecaoSMSDashboard from "./pages/inspecao-sms/InspecaoSMSDashboard";
import CadastrarInspecao from "./pages/inspecao-sms/CadastrarInspecao";
import ConsultarInspecoes from "./pages/inspecao-sms/ConsultarInspecoes";
import MedidasDisciplinaresDashboard from "./pages/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "./pages/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "./pages/medidas-disciplinares/MedidasDisciplinaresConsulta";
import TarefasDashboard from "./pages/tarefas/TarefasDashboard";
import MinhasTarefas from "./pages/tarefas/MinhasTarefas";
import CadastroTarefas from "./pages/tarefas/CadastroTarefas";
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route element={<AuthGuard><Layout /></AuthGuard>}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Desvios */}
                <Route path="/desvios" element={<DesviosDashboard />} />
                <Route path="/desvios/novo" element={<DesviosForm />} />
                <Route path="/desvios/editar/:id" element={<DesviosForm />} />
                <Route path="/desvios/consulta" element={<DesviosConsulta />} />
                <Route path="/desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
                
                {/* Treinamentos */}
                <Route path="/treinamentos" element={<TreinamentosDashboard />} />
                <Route path="/treinamentos/novo" element={<TreinamentosForm />} />
                <Route path="/treinamentos/editar/:id" element={<TreinamentosForm />} />
                <Route path="/treinamentos/normativo" element={<TreinamentosNormativo />} />
                <Route path="/treinamentos/consulta" element={<TreinamentosConsulta />} />
                <Route path="/treinamentos/execucao" element={<TreinamentosForm />} />
                <Route path="/treinamentos/cracha" element={<TreinamentosCracha />} />
                
                {/* Ocorrências */}
                <Route path="/ocorrencias" element={<OcorrenciasDashboard />} />
                <Route path="/ocorrencias/novo" element={<OcorrenciasForm />} />
                <Route path="/ocorrencias/editar/:id" element={<OcorrenciasForm />} />
                <Route path="/ocorrencias/consulta" element={<OcorrenciasConsulta />} />
                
                {/* Usuários e Administração */}
                <Route path="/usuarios" element={<UsuariosDashboard />} />
                <Route path="/usuarios/novo" element={<UsuariosForm />} />
                <Route path="/usuarios/editar/:id" element={<UsuariosForm />} />
                <Route path="/admin/usuarios" element={<UsuariosDashboard />} />
                <Route path="/admin/perfis" element={<AdminPerfis />} />
                <Route path="/admin/empresas" element={<AdminEmpresas />} />
                <Route path="/admin/ccas" element={<AdminCCAs />} />
                <Route path="/admin/engenheiros" element={<AdminEngenheiros />} />
                <Route path="/admin/supervisores" element={<AdminSupervisores />} />
                <Route path="/admin/funcionarios" element={<CadastroFuncionarios />} />
                <Route path="/admin/hht" element={<RegistroHHT />} />
                <Route path="/admin/metas-indicadores" element={<MetasIndicadores />} />
                <Route path="/admin/templates" element={<AdminTemplates />} />
                <Route path="/admin/logo" element={<AdminLogo />} />
                <Route path="/admin/modelos-inspecao" element={<AdminModelosInspecao />} />

                {/* Hora da Segurança */}
                <Route path="/hora-seguranca" element={<HoraSegurancaDashboard />} />
                <Route path="/hora-seguranca/cadastro" element={<InspecoesCadastro />} />
                <Route path="/hora-seguranca/cadastro-inspecao" element={<InspecoesCadastro />} />
                <Route path="/hora-seguranca/cadastro-nao-programada" element={<InspecaoNaoProgramadaHSA />} />
                <Route path="/hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
                <Route path="/hora-seguranca/agenda" element={<AgendaHSA />} />
                <Route path="/hora-seguranca/acompanhamento" element={<InspecoesAcompanhamento />} />

                {/* Inspeção SMS */}
                <Route path="/inspecao-sms" element={<InspecaoSMSDashboard />} />
                <Route path="/inspecao-sms/dashboard" element={<InspecaoSMSDashboard />} />
                <Route path="/inspecao-sms/cadastro" element={<CadastrarInspecao />} />
                <Route path="/inspecao-sms/consulta" element={<ConsultarInspecoes />} />

                {/* Medidas Disciplinares */}
                <Route path="/medidas-disciplinares" element={<MedidasDisciplinaresDashboard />} />
                <Route path="/medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
                <Route path="/medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
                <Route path="/medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />

                {/* Tarefas */}
                <Route path="/tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="/tarefas/minhas-tarefas" element={<MinhasTarefas />} />
                <Route path="/tarefas/cadastro" element={<CadastroTarefas />} />

                {/* IDSMS */}
                <Route path="/idsms" element={<IDSMSDashboard />} />
                
                {/* Relatórios */}
                <Route path="/relatorios" element={<RelatoriosDashboard />} />
                <Route path="/relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="/relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="/relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="/relatorios/idsms" element={<RelatoriosIDSMS />} />
                <Route path="/relatorios/hsa" element={<RelatoriosHSA />} />

                {/* Conta */}
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/settings" element={<Settings />} />
                
                {/* Redirecionamento para o Dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
