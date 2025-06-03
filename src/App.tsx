import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import DesviosDashboard from './pages/desvios/DesviosDashboard';
import DesviosCadastro from './pages/desvios/DesviosCadastro';
import DesviosConsulta from './pages/desvios/DesviosConsulta';
import NaoConformidade from './pages/desvios/NaoConformidade';
import TreinamentosDashboard from './pages/treinamentos/TreinamentosDashboard';
import TreinamentoNormativo from './pages/treinamentos/TreinamentoNormativo';
import TreinamentosConsulta from './pages/treinamentos/TreinamentosConsulta';
import ExecucaoTreinamentos from './pages/treinamentos/ExecucaoTreinamentos';
import EmissaoCracha from './pages/treinamentos/EmissaoCracha';
import OcorrenciasDashboard from './pages/ocorrencias/OcorrenciasDashboard';
import OcorrenciasCadastro from './pages/ocorrencias/OcorrenciasCadastro';
import OcorrenciasConsulta from './pages/ocorrencias/OcorrenciasConsulta';
import MedidasDashboard from './pages/medidas_disciplinares/MedidasDashboard';
import MedidasCadastro from './pages/medidas_disciplinares/MedidasCadastro';
import MedidasConsulta from './pages/medidas_disciplinares/MedidasConsulta';
import TarefasDashboard from './pages/tarefas/TarefasDashboard';
import MinhasTarefas from './pages/tarefas/MinhasTarefas';
import CadastroTarefas from './pages/tarefas/CadastroTarefas';
import Relatorios from './pages/relatorios/Relatorios';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import PerfisAdmin from './pages/admin/PerfisAdmin';
import EmpresasAdmin from './pages/admin/EmpresasAdmin';
import EngenheirosAdmin from './pages/admin/EngenheirosAdmin';
import SupervisoresAdmin from './pages/admin/SupervisoresAdmin';
import FuncionariosAdmin from './pages/admin/FuncionariosAdmin';
import HHTAdmin from './pages/admin/HHTAdmin';
import MetasIndicadoresAdmin from './pages/admin/MetasIndicadoresAdmin';
import TemplatesAdmin from './pages/admin/TemplatesAdmin';
import LogoAdmin from './pages/admin/LogoAdmin';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Desvios Routes */}
            <Route path="/desvios/dashboard" element={<PrivateRoute><DesviosDashboard /></PrivateRoute>} />
            <Route path="/desvios/cadastro" element={<PrivateRoute><DesviosCadastro /></PrivateRoute>} />
            <Route path="/desvios/consulta" element={<PrivateRoute><DesviosConsulta /></PrivateRoute>} />
            <Route path="/desvios/nao-conformidade" element={<PrivateRoute><NaoConformidade /></PrivateRoute>} />

            {/* Treinamentos Routes */}
            <Route path="/treinamentos/dashboard" element={<PrivateRoute><TreinamentosDashboard /></PrivateRoute>} />
            <Route path="/treinamentos/normativo" element={<PrivateRoute><TreinamentoNormativo /></PrivateRoute>} />
            <Route path="/treinamentos/consulta" element={<PrivateRoute><TreinamentosConsulta /></PrivateRoute>} />
            <Route path="/treinamentos/execucao" element={<PrivateRoute><ExecucaoTreinamentos /></PrivateRoute>} />
            <Route path="/treinamentos/cracha" element={<PrivateRoute><EmissaoCracha /></PrivateRoute>} />

            {/* Ocorrencias Routes */}
            <Route path="/ocorrencias/dashboard" element={<PrivateRoute><OcorrenciasDashboard /></PrivateRoute>} />
            <Route path="/ocorrencias/cadastro" element={<PrivateRoute><OcorrenciasCadastro /></PrivateRoute>} />
            <Route path="/ocorrencias/consulta" element={<PrivateRoute><OcorrenciasConsulta /></PrivateRoute>} />

            {/* Medidas Disciplinares Routes */}
            <Route path="/medidas-disciplinares/dashboard" element={<PrivateRoute><MedidasDashboard /></PrivateRoute>} />
            <Route path="/medidas-disciplinares/cadastro" element={<PrivateRoute><MedidasCadastro /></PrivateRoute>} />
            <Route path="/medidas-disciplinares/consulta" element={<PrivateRoute><MedidasConsulta /></PrivateRoute>} />

            {/* Tarefas Routes */}
            <Route path="/tarefas/dashboard" element={<PrivateRoute><TarefasDashboard /></PrivateRoute>} />
            <Route path="/tarefas/minhas-tarefas" element={<PrivateRoute><MinhasTarefas /></PrivateRoute>} />
            <Route path="/tarefas/cadastro" element={<PrivateRoute><CadastroTarefas /></PrivateRoute>} />

            {/* Relatorios Routes */}
            <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
            <Route path="/relatorios/idsms" element={<PrivateRoute><RelatoriosIDSMS /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/usuarios" element={<PrivateRoute><UsuariosAdmin /></PrivateRoute>} />
            <Route path="/admin/perfis" element={<PrivateRoute><PerfisAdmin /></PrivateRoute>} />
            <Route path="/admin/empresas" element={<PrivateRoute><EmpresasAdmin /></PrivateRoute>} />
            <Route path="/admin/engenheiros" element={<PrivateRoute><EngenheirosAdmin /></PrivateRoute>} />
            <Route path="/admin/supervisores" element={<PrivateRoute><SupervisoresAdmin /></PrivateRoute>} />
            <Route path="/admin/funcionarios" element={<PrivateRoute><FuncionariosAdmin /></PrivateRoute>} />
            <Route path="/admin/hht" element={<PrivateRoute><HHTAdmin /></PrivateRoute>} />
            <Route path="/admin/metas-indicadores" element={<PrivateRoute><MetasIndicadoresAdmin /></PrivateRoute>} />
            <Route path="/admin/templates" element={<PrivateRoute><TemplatesAdmin /></PrivateRoute>} />
            <Route path="/admin/logo" element={<PrivateRoute><LogoAdmin /></PrivateRoute>} />
            
            {/* IDSMS Routes */}
            <Route path="/idsms/dashboard" element={<PrivateRoute><IDSMSDashboard /></PrivateRoute>} />
            <Route path="/idsms/indicadores" element={<PrivateRoute><IDSMSIndicadores /></PrivateRoute>} />
            <Route path="/idsms/iid" element={<PrivateRoute><IIDForm /></PrivateRoute>} />
            <Route path="/idsms/hsa" element={<PrivateRoute><HSAForm /></PrivateRoute>} />
            <Route path="/idsms/ht" element={<PrivateRoute><HTForm /></PrivateRoute>} />
            <Route path="/idsms/ipom" element={<PrivateRoute><IPOMForm /></PrivateRoute>} />
            <Route path="/idsms/inspecao-alta-lideranca" element={<PrivateRoute><InspecaoAltaLiderancaForm /></PrivateRoute>} />
            <Route path="/idsms/inspecao-gestao-sms" element={<PrivateRoute><InspecaoGestaoSMSForm /></PrivateRoute>} />
            <Route path="/idsms/indice-reativo" element={<PrivateRoute><IndiceReativoForm /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
