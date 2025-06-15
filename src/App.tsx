import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import AuthGuard from './components/auth/AuthGuard';
import Dashboard from './pages/Dashboard';
import DesviosDashboard from './pages/DesviosDashboard';
import DesviosForm from './pages/DesviosForm';
import DesviosConsulta from './pages/DesviosConsulta';
import DesviosNaoConformidade from './pages/DesviosNaoConformidade';
import TreinamentosDashboard from './pages/treinamentos/TreinamentosDashboard';
import TreinamentoNormativo from './pages/treinamentos/TreinamentosNormativo';
import TreinamentosConsulta from './pages/treinamentos/TreinamentosConsulta';
import ExecucaoTreinamentos from './pages/treinamentos/TreinamentosExecucao';
import EmissaoCracha from './pages/treinamentos/TreinamentosCracha';
import MedidasDashboard from './pages/PlaceholderPage';
import MedidasCadastro from './pages/PlaceholderPage';
import MedidasConsulta from './pages/PlaceholderPage';
import TarefasDashboard from './pages/tarefas/TarefasDashboard';
import MinhasTarefas from './pages/tarefas/MinhasTarefas';
import CadastroTarefas from './pages/tarefas/CadastroTarefas';
import DetalheTarefa from './pages/tarefas/DetalheTarefa';
import Relatorios from './pages/relatorios/RelatoriosDashboard';
import UsuariosAdmin from './pages/admin/AdminUsuarios';
import PerfisAdmin from './pages/admin/AdminPerfis';
import EmpresasAdmin from './pages/admin/AdminEmpresas';
import AdminCCAs from './pages/admin/AdminCCAs';
import EngenheirosAdmin from './pages/admin/AdminEngenheiros';
import SupervisoresAdmin from './pages/admin/AdminSupervisores';
import FuncionariosAdmin from './pages/admin/CadastroFuncionarios';
import HHTAdmin from './pages/admin/RegistroHHT';
import MetasIndicadoresAdmin from './pages/admin/MetasIndicadores';
import TemplatesAdmin from './pages/AdminTemplates';
import LogoAdmin from './pages/admin/AdminLogo';
import IDSMSDashboard from './pages/idsms/IDSMSDashboard';
import IIDForm from './pages/idsms/IIDForm';
import HSAForm from './pages/idsms/HSAForm';
import HTForm from './pages/idsms/HTForm';
import IPOMForm from './pages/idsms/IPOMForm';
import InspecaoAltaLiderancaForm from './pages/idsms/InspecaoAltaLiderancaForm';
import InspecaoGestaoSMSForm from './pages/idsms/InspecaoGestaoSMSForm';
import IndiceReativoForm from './pages/idsms/IndiceReativoForm';
import RelatoriosIDSMS from './pages/relatorios/RelatoriosIDSMS';
import IDSMSIndicadores from './pages/idsms/IDSMSIndicadores';
import VisualizarExecucaoTreinamento from './pages/treinamentos/VisualizarExecucaoTreinamento';
import EditarExecucaoTreinamento from './pages/treinamentos/EditarExecucaoTreinamento';
import Layout from './components/layout/Layout';
import Profile from './pages/account/Profile';
import Settings from './pages/account/Settings';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import InspecaoCadastroHSA from './pages/hora-seguranca/InspecaoCadastroHSA';
import InspecaoNaoProgramadaHSA from './pages/hora-seguranca/InspecaoNaoProgramadaHSA';
import InspecoesAcompanhamento from './pages/hora-seguranca/InspecoesAcompanhamento';
import PainelExecucaoHSA from './pages/hora-seguranca/PainelExecucaoHSA';
import AgendaHSA from './pages/hora-seguranca/AgendaHSA';
import MedidasDisciplinaresDashboard from "./pages/medidas-disciplinares/MedidasDisciplinaresDashboard";
import MedidasDisciplinaresCadastro from "./pages/medidas-disciplinares/MedidasDisciplinaresCadastro";
import MedidasDisciplinaresConsulta from "./pages/medidas-disciplinares/MedidasDisciplinaresConsulta";
import GroCadastroPerigos from "./pages/gro/GroCadastroPerigos";
import GroAvaliacaoRiscos from './pages/gro/GroAvaliacaoRiscos';
import GroPGR from "./pages/gro/GroPGR";
import OcorrenciasDashboard from './pages/ocorrencias/OcorrenciasDashboard';
import OcorrenciasConsulta from './pages/ocorrencias/OcorrenciasConsulta';
import OcorrenciasCadastro from './pages/ocorrencias/OcorrenciasCadastro';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              {/* Desvios Routes */}
              <Route path="desvios/dashboard" element={<DesviosDashboard />} />
              <Route path="desvios/cadastro" element={<DesviosForm />} />
              <Route path="desvios/consulta" element={<DesviosConsulta />} />
              <Route path="desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
              {/* Account/Profile/Auth pages */}
              <Route path="account/profile" element={<Profile />} />
              <Route path="account/settings" element={<Settings />} />
              {/* Treinamentos Routes */}
              <Route path="treinamentos/dashboard" element={<TreinamentosDashboard />} />
              <Route path="treinamentos/normativo" element={<TreinamentoNormativo />} />
              <Route path="treinamentos/consulta" element={<TreinamentosConsulta />} />
              <Route path="treinamentos/execucao" element={<ExecucaoTreinamentos />} />
              <Route path="treinamentos/cracha" element={<EmissaoCracha />} />
              <Route path="/treinamentos/execucao/visualizar/:id" element={<VisualizarExecucaoTreinamento />} />
              <Route path="/treinamentos/execucao/editar/:id" element={<EditarExecucaoTreinamento />} />
              {/* Medidas Disciplinares Routes */}
              <Route path="medidas-disciplinares/dashboard" element={<MedidasDisciplinaresDashboard />} />
              <Route path="medidas-disciplinares/cadastro" element={<MedidasDisciplinaresCadastro />} />
              <Route path="medidas-disciplinares/consulta" element={<MedidasDisciplinaresConsulta />} />
              {/* Tarefas Routes */}
              <Route path="tarefas/dashboard" element={<TarefasDashboard />} />
              <Route path="tarefas/minhas-tarefas" element={<MinhasTarefas />} />
              <Route path="tarefas/cadastro" element={<CadastroTarefas />} />
              <Route path="tarefas/detalhe/:id" element={<DetalheTarefa />} />
              {/* Relatorios Routes */}
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />
              {/* Admin Routes */}
              <Route path="admin/usuarios" element={<UsuariosAdmin />} />
              <Route path="admin/perfis" element={<PerfisAdmin />} />
              <Route path="admin/empresas" element={<EmpresasAdmin />} />
              <Route path="admin/ccas" element={<AdminCCAs />} />
              <Route path="admin/engenheiros" element={<EngenheirosAdmin />} />
              <Route path="admin/supervisores" element={<SupervisoresAdmin />} />
              <Route path="admin/funcionarios" element={<FuncionariosAdmin />} />
              <Route path="admin/hht" element={<HHTAdmin />} />
              <Route path="admin/metas-indicadores" element={<MetasIndicadoresAdmin />} />
              <Route path="admin/templates" element={<TemplatesAdmin />} />
              <Route path="admin/logo" element={<LogoAdmin />} />
              {/* IDSMS Routes */}
              <Route path="idsms/dashboard" element={<IDSMSDashboard />} />
              <Route path="idsms/indicadores" element={<IDSMSIndicadores />} />
              <Route path="idsms/iid" element={<IIDForm />} />
              <Route path="idsms/hsa" element={<HSAForm />} />
              <Route path="idsms/ht" element={<HTForm />} />
              <Route path="idsms/ipom" element={<IPOMForm />} />
              <Route path="idsms/inspecao-alta-lideranca" element={<InspecaoAltaLiderancaForm />} />
              <Route path="idsms/inspecao-gestao-sms" element={<InspecaoGestaoSMSForm />} />
              <Route path="idsms/indice-reativo" element={<IndiceReativoForm />} />
              {/* Hora da Segurança - Nova página de cadastro */}
              <Route path="hora-seguranca/cadastro" element={<InspecaoCadastroHSA />} />
              <Route path="hora-seguranca/cadastro-inspecao" element={<InspecaoCadastroHSA />} />
              <Route path="hora-seguranca/cadastro-inspecao-nao-programada" element={<InspecaoNaoProgramadaHSA />} />
              <Route path="hora-seguranca/cadastro-inspecao-nao-planejada" element={<InspecaoNaoProgramadaHSA />} />
              {/* Painel Execução HSA - ADICIONADA ROTA DO DASHBOARD */}
              <Route path="hora-seguranca/painel-execucao" element={<PainelExecucaoHSA />} />
              <Route path="hora-seguranca/dashboard" element={<PainelExecucaoHSA />} />
              <Route path="hora-seguranca/agenda" element={<AgendaHSA />} />
              {/* ROTA ALTERNATIVA PARA AGENDA HSA */}
              <Route path="hora-seguranca/agenda-hsa" element={<AgendaHSA />} />
              {/* Página de acompanhamento */}
              <Route path="hora-seguranca/acompanhamento" element={<InspecoesAcompanhamento />} />
              {/* GRO */}
              <Route path="gro/perigos" element={<GroCadastroPerigos />} />
              <Route path="gro/avaliacao" element={<GroAvaliacaoRiscos />} />
              <Route path="gro/pgr" element={<GroPGR />} />
              {/* Ocorrencias */}
              <Route path="ocorrencias/dashboard" element={<OcorrenciasDashboard />} />
              <Route path="ocorrencias/cadastro" element={<OcorrenciasCadastro />} />
              <Route path="ocorrencias/consulta" element={<OcorrenciasConsulta />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
