import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Layout from "@/components/layout/Layout";

// Import pages
import Dashboard from "./pages/Dashboard";
import ComunicadosCadastro from "./pages/admin/ComunicadosCadastro";
import ComunicadosConsulta from "./pages/admin/ComunicadosConsulta";
import ComunicadoDetalhe from "./pages/admin/ComunicadoDetalhe";
import ComunicadoEdicao from "./pages/admin/ComunicadoEdicao";
import MeusComunicados from "./pages/comunicados/MeusComunicados";
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

// Admin pages - NEW ACCESS CONTROL SYSTEM
import AdminSistema from "./pages/admin/AdminSistema";
import Perfis from "./pages/admin/Perfis";
import UsuariosPerfis from "./pages/admin/UsuariosPerfis";
import UsuariosCCAs from "./pages/admin/UsuariosCCAs";

// Admin pages - DIRECT USER MANAGEMENT
import GerenciarUsuariosDirect from "./pages/admin/GerenciarUsuariosDirect";
import AdminCCAs from "./pages/admin/AdminCCAs";
import AdminEmpresas from "./pages/admin/AdminEmpresas";
import AdminEngenheiros from "./pages/admin/AdminEngenheiros";
import AdminSupervisores from "./pages/admin/AdminSupervisores";
import AdminEncarregados from "./pages/admin/AdminEncarregados";
import AdminUnidadesMedidas from "./pages/admin/AdminUnidadesMedidas";
import AdminTiposDocumentos from "./pages/admin/AdminTiposDocumentos";
import AdminEmpresasSienge from "./pages/admin/AdminEmpresasSienge";
import AdminLogo from "./pages/admin/AdminLogo";
import AdminTemplates from "./pages/AdminTemplates";

import ExportacaoDados from "./pages/admin/ExportacaoDados";
import CadastroFuncionarios from "./pages/admin/CadastroFuncionarios";
import ImportacaoFuncionarios from "./pages/admin/ImportacaoFuncionarios";
import CriarUsuarioDirect from "./pages/admin/CriarUsuarioDirect";
import MetasIndicadores from "./pages/admin/MetasIndicadores";
import RegistroHHT from "./pages/admin/RegistroHHT";
import ImportacaoExecucaoTreinamentos from "./pages/admin/ImportacaoExecucaoTreinamentos";
import ImportacaoHSA from "./pages/admin/ImportacaoHSA";
import ImportacaoDesvios from "./pages/admin/ImportacaoDesvios";
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
import DesviosVisualizacao from "./pages/desvios/DesviosVisualizacao";
import InsightsDesvios from "@/pages/desvios/InsightsDesvios";

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
import RelatoriosTreinamentosPendentes from "./pages/relatorios/RelatoriosTreinamentosPendentes";
import RelatoriosHSAPendentes from "./pages/relatorios/RelatoriosHSAPendentes";
import RelatoriosOcorrenciasPendentes from "./pages/relatorios/RelatoriosOcorrenciasPendentes";

// Documentação SMS pages
import DocumentacaoSMSDashboard from "./pages/documentacao-sms/Dashboard";
import DocumentacaoSMSModelos from "./pages/documentacao-sms/Modelos";

// Inspeção SMS pages
import CadastrarInspecao from "./pages/inspecao-sms/CadastrarInspecao";
import ConsultarInspecoes from "./pages/inspecao-sms/ConsultarInspecoes";
import InspecaoSMSDashboard from "./pages/inspecao-sms/InspecaoSMSDashboard";
import VisualizarInspecao from "./pages/inspecao-sms/VisualizarInspecao";
import HoraSeguranca from "./pages/inspecao-sms/HoraSeguranca";

// Prevenção de Incêndio pages
import PrevencaoIncendioDashboard from "./pages/prevencao-incendio/PrevencaoIncendioDashboard";
import CadastroExtintores from "./pages/prevencao-incendio/CadastroExtintores";
import ConsultaExtintores from "./pages/prevencao-incendio/ConsultaExtintores";
import InspecaoExtintores from "./pages/prevencao-incendio/InspecaoExtintores";
import ConsultaInspecoesExtintores from "./pages/prevencao-incendio/ConsultaInspecoesExtintores";
import VisualizarInspecaoExtintor from "./pages/prevencao-incendio/VisualizarInspecaoExtintor";
import ExtintorPublico from "./pages/prevencao-incendio/ExtintorPublico";
import InspecaoExtintorPublico from "./pages/prevencao-incendio/InspecaoExtintorPublico";

// Placeholder page
import PlaceholderPage from "./pages/PlaceholderPage";

// Engenharia Matricial pages
import EngenhariaMatricialIndex from "./pages/engenharia-matricial/Index";

// === COMERCIAL - Repositório de Documentos ===
import DocumentList from "./pages/comercial/repositorio/DocumentList";
import DocumentUpload from "./pages/comercial/repositorio/DocumentUpload";
import DocumentCategories from "./pages/comercial/repositorio/DocumentCategories";
import CategoryView from "./pages/comercial/repositorio/CategoryView";
import SubcategoryView from "./pages/comercial/repositorio/SubcategoryView";

// === COMERCIAL - Controle Comercial ===
import CommercialSpreadsheet from "./pages/comercial/controle/CommercialSpreadsheet";
import CommercialForm from "./pages/comercial/controle/CommercialForm";
import CommercialDashboard from "./pages/comercial/controle/CommercialDashboard";
import AnnualGoalsForm from "./pages/comercial/controle/AnnualGoalsForm";
import CommercialRecords from "./pages/comercial/controle/CommercialRecords";
import CommercialReports from "./pages/comercial/controle/CommercialReports";
import ConsolidationDetails from "./pages/comercial/controle/ConsolidationDetails";
import SegmentManagement from "./pages/comercial/controle/SegmentManagement";
import VendedorManagement from "./pages/comercial/controle/VendedorManagement";
import OrdemServicoList from "./pages/engenharia-matricial/OrdemServicoList";
import OSAbertas from "./pages/engenharia-matricial/OSAbertas";
import NovaOrdemServico from "./pages/engenharia-matricial/NovaOrdemServico";
import EditarOS from "./pages/engenharia-matricial/EditarOS";
import DetalhesOrdemServico from "./pages/engenharia-matricial/DetalhesOrdemServico";
import OSEmPlanejamento from "./pages/engenharia-matricial/OSEmPlanejamento";
import OSAguardandoAceite from "./pages/engenharia-matricial/OSAguardandoAceite";
import OSEmExecucao from "./pages/engenharia-matricial/OSEmExecucao";
import OSEmFechamento from "./pages/engenharia-matricial/OSEmFechamento";
import OSAguardandoAceiteFechamento from "./pages/engenharia-matricial/OSAguardandoAceiteFechamento";
import OSConcluidas from "./pages/engenharia-matricial/OSConcluidas";
import OSReplanejamento from "./pages/engenharia-matricial/OSReplanejamento";
import OSAguardandoAceiteReplanejamento from "./pages/engenharia-matricial/OSAguardandoAceiteReplanejamento";
import RelatoriosAnual from "./pages/engenharia-matricial/RelatoriosAnual";
import RelatoriosEMEletrica from "./pages/engenharia-matricial/RelatoriosEMEletrica";
import RelatoriosEMMecanica from "./pages/engenharia-matricial/RelatoriosEMMecanica";
import RelatoriosEMDepartamento from "./pages/engenharia-matricial/RelatoriosEMDepartamento";
import AdminUsuariosEM from "./pages/engenharia-matricial/AdminUsuarios";

// Suprimentos - Estoque pages
import EstoqueDashboard from "./pages/suprimentos/estoque/Dashboard";
import EstoqueEAP from "./pages/suprimentos/estoque/apoio/EAP";
import EstoqueAlmoxarifados from "./pages/suprimentos/estoque/apoio/Almoxarifados";
import EstoqueConfiguracoesArcabouco from "./pages/suprimentos/estoque/apoio/ConfiguracoesArcabouco";
import EstoqueRelatorioEAP from "./pages/suprimentos/estoque/apoio/RelatorioEAP";
import EstoqueRelacaoAlmoxarifados from "./pages/suprimentos/estoque/apoio/RelacaoAlmoxarifados";
import EstoqueAlocacaoEntradas from "./pages/suprimentos/estoque/entradas/AlocacaoEntradas";
import EstoqueEntradaMateriais from "./pages/suprimentos/estoque/entradas/EntradaMateriais";
import EstoqueNovaEntrada from "./pages/suprimentos/estoque/entradas/NovaEntrada";
import EstoqueEditarEntrada from "./pages/suprimentos/estoque/entradas/EditarEntrada";
import EstoqueRelatorioEntrada from "./pages/suprimentos/estoque/entradas/RelatorioEntrada";
import EstoqueRelacaoEntradas from "./pages/suprimentos/estoque/entradas/RelacaoEntradas";
import EstoqueRequisicaoMateriais from "./pages/suprimentos/estoque/requisicoes/RequisicaoMateriais";
import EstoqueDevolucaoMateriais from "./pages/suprimentos/estoque/requisicoes/DevolucaoMateriais";
import EstoqueRelatorioRequisicao from "./pages/suprimentos/estoque/requisicoes/RelatorioRequisicao";
import EstoqueRelacaoRequisicoes from "./pages/suprimentos/estoque/requisicoes/RelacaoRequisicoes";
import EstoqueRelacaoDevolucoes from "./pages/suprimentos/estoque/requisicoes/RelacaoDevolucoes";
import EstoqueNovaRequisicao from "./pages/suprimentos/estoque/requisicoes/NovaRequisicao";
import EstoqueProcessarDevolucao from "./pages/suprimentos/estoque/requisicoes/ProcessarDevolucao";
import EstoqueRelacaoRequisicoesEmitidas from "./pages/suprimentos/estoque/requisicoes/RelacaoRequisicoesEmitidas";
import EstoqueRelacaoRequisicoesPendentes from "./pages/suprimentos/estoque/requisicoes/RelacaoRequisicoesPendentes";
import EstoqueTransferenciaAlmoxarifados from "./pages/suprimentos/estoque/transferencias/TransferenciaAlmoxarifados";
import EstoqueNovaTransferenciaAlmoxarifados from "./pages/suprimentos/estoque/transferencias/NovaTransferenciaAlmoxarifados";
import EstoqueTransferenciaCCAs from "./pages/suprimentos/estoque/transferencias/TransferenciaCCAs";
import EstoqueRelatorioTransferencias from "./pages/suprimentos/estoque/transferencias/RelatorioTransferencias";
import EstoqueRelacaoTransferencias from "./pages/suprimentos/estoque/transferencias/RelacaoTransferencias";
import EstoqueEnvioBeneficiamento from "./pages/suprimentos/estoque/beneficiamento/EnvioBeneficiamento";
import EstoqueNovoEnvioBeneficiamento from "./pages/suprimentos/estoque/beneficiamento/NovoEnvioBeneficiamento";
import EstoqueRetornoBeneficiamento from "./pages/suprimentos/estoque/beneficiamento/RetornoBeneficiamento";
import EstoqueNovoRetornoBeneficiamento from "./pages/suprimentos/estoque/beneficiamento/NovoRetornoBeneficiamento";
import EstoqueRelacaoMateriaisBeneficiamento from "./pages/suprimentos/estoque/beneficiamento/RelacaoMateriaisBeneficiamento";

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
              <Route path="/prevencao-incendio/extintor/:codigo" element={<ExtintorPublico />} />
              <Route path="/prevencao-incendio/inspecao/:id" element={<InspecaoExtintorPublico />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Account routes */}
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/settings" element={<Settings />} />
                <Route path="account/support" element={<Support />} />
                
                {/* Support route */}
                <Route path="suporte" element={<Suporte />} />

                {/* Admin routes - NEW ACCESS CONTROL SYSTEM */}
                <Route path="admin/admin-sistema" element={<AdminSistema />} />
                <Route path="admin/perfis" element={<Perfis />} />
                <Route path="admin/usuarios-perfis" element={<UsuariosPerfis />} />
                <Route path="admin/usuarios-ccas" element={<UsuariosCCAs />} />
                
                {/* Admin routes - DIRECT USER MANAGEMENT */}
                <Route path="admin/usuarios" element={<Navigate to="/admin/usuarios-direct" replace />} />
                <Route path="admin/usuarios-direct" element={<GerenciarUsuariosDirect />} />
                <Route path="admin/criar-usuario-direct" element={<CriarUsuarioDirect />} />
                
                {/* Redirect old routes */}
                <Route path="admin/usuarios-auth" element={<Navigate to="/admin/usuarios-direct" replace />} />
                <Route path="admin/ccas" element={<AdminCCAs />} />
                <Route path="admin/empresas" element={<AdminEmpresas />} />
                <Route path="admin/unidades-medidas" element={<AdminUnidadesMedidas />} />
                <Route path="admin/tipos-documentos" element={<AdminTiposDocumentos />} />
                <Route path="admin/empresas-sienge" element={<AdminEmpresasSienge />} />
                <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
                <Route path="admin/supervisores" element={<AdminSupervisores />} />
                <Route path="admin/encarregados" element={<AdminEncarregados />} />
                <Route path="admin/logo" element={<AdminLogo />} />
                <Route path="admin/templates" element={<AdminTemplates />} />
                
                <Route path="admin/funcionarios" element={<CadastroFuncionarios />} />
                <Route path="admin/importacao-funcionarios" element={<ImportacaoFuncionarios />} />
                <Route path="admin/criar-usuario" element={<Navigate to="/admin/criar-usuario-direct" replace />} />
                <Route path="admin/metas-indicadores" element={<MetasIndicadores />} />
                <Route path="admin/registro-hht" element={<RegistroHHT />} />
                <Route path="admin/exportacao-dados" element={<ExportacaoDados />} />
                <Route path="adm/configuracoes" element={<AdminConfiguracoes />} />
                <Route path="admin/configuracoes" element={<AdminConfiguracoes />} />
                <Route path="admin/checklists" element={<AdminChecklists />} />
                <Route path="configuracao-emails" element={<ConfiguracaoEmailsPage />} />
                <Route path="upload-tutoriais" element={<UploadTutoriaisPage />} />
                <Route path="admin/importacao-execucao-treinamentos" element={<ImportacaoExecucaoTreinamentos />} />
                <Route path="admin/importacao-hsa" element={<ImportacaoHSA />} />
                <Route path="admin/importacao-desvios" element={<ImportacaoDesvios />} />
                <Route path="admin/atualizar-perfis" element={<Navigate to="/admin/usuarios-direct" replace />} />

                {/* Comunicados routes */}
                <Route path="admin/comunicados/cadastro" element={<ComunicadosCadastro />} />
                <Route path="admin/comunicados/consulta" element={<ComunicadosConsulta />} />
                <Route path="admin/comunicados/detalhe/:id" element={<ComunicadoDetalhe />} />
                <Route path="admin/comunicados/edicao/:id" element={<ComunicadoEdicao />} />
                <Route path="comunicados/meus-comunicados" element={<MeusComunicados />} />

                {/* Tarefas routes */}
                <Route path="tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="tarefas/cadastro" element={<CadastroTarefas />} />
                <Route path="tarefas/minhas-tarefas" element={<MinhasTarefas />} />
                <Route path="tarefas/detalhe/:id" element={<DetalheTarefa />} />
                <Route path="tarefas/editar/:id" element={<EditarTarefa />} />

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
                <Route path="desvios/visualizacao/:id" element={<DesviosVisualizacao />} />
                <Route path="desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
                <Route path="desvios/insights" element={<InsightsDesvios />} />

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

                {/* Documentação SMS routes */}
                <Route path="documentacao-sms/dashboard" element={<DocumentacaoSMSDashboard />} />
                <Route path="documentacao-sms/modelos" element={<DocumentacaoSMSModelos />} />

                {/* Relatórios routes */}
                <Route path="relatorios" element={<Navigate to="/relatorios/dashboard" replace />} />
                <Route path="relatorios/dashboard" element={<RelatoriosDashboard />} />
                <Route path="relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="relatorios/idsms" element={<RelatoriosIDSMS />} />
                <Route path="relatorios/hsa" element={<RelatoriosHSA />} />
                <Route path="relatorios/treinamentos-pendentes" element={<RelatoriosTreinamentosPendentes />} />
                <Route path="relatorios/hsa-pendentes" element={<RelatoriosHSAPendentes />} />
                <Route path="relatorios/ocorrencias-pendentes" element={<RelatoriosOcorrenciasPendentes />} />

                {/* Inspeção SMS routes */}
                <Route path="inspecao-sms/cadastrar" element={<CadastrarInspecao />} />
                <Route path="inspecao-sms/consulta" element={<ConsultarInspecoes />} />
                <Route path="inspecao-sms/dashboard" element={<InspecaoSMSDashboard />} />
                <Route path="inspecao-sms/visualizar/:id" element={<VisualizarInspecao />} />
                <Route path="inspecao-sms/hora-seguranca" element={<HoraSeguranca />} />

                {/* Prevenção de Incêndio routes */}
                <Route path="prevencao-incendio/dashboard" element={<PrevencaoIncendioDashboard />} />
                <Route path="prevencao-incendio/cadastro-extintores" element={<CadastroExtintores />} />
                <Route path="prevencao-incendio/consulta-extintores" element={<ConsultaExtintores />} />
                <Route path="prevencao-incendio/inspecao-extintores" element={<InspecaoExtintores />} />
                <Route path="prevencao-incendio/consulta-inspecoes" element={<ConsultaInspecoesExtintores />} />
                <Route path="prevencao-incendio/inspecoes/:id" element={<VisualizarInspecaoExtintor />} />

                {/* Suprimentos - Estoque routes */}
                <Route path="suprimentos/estoque/dashboard" element={<EstoqueDashboard />} />
                
                {/* Apoio */}
                <Route path="suprimentos/estoque/apoio/eap" element={<EstoqueEAP />} />
                <Route path="suprimentos/estoque/apoio/almoxarifados" element={<EstoqueAlmoxarifados />} />
                <Route path="suprimentos/estoque/apoio/configuracoes-arcabouco" element={<EstoqueConfiguracoesArcabouco />} />
                <Route path="suprimentos/estoque/apoio/relatorio-eap" element={<EstoqueRelatorioEAP />} />
                <Route path="suprimentos/estoque/apoio/relacao-almoxarifados" element={<EstoqueRelacaoAlmoxarifados />} />
                
                {/* Entradas */}
                <Route path="suprimentos/estoque/entradas/alocacao-entradas" element={<EstoqueAlocacaoEntradas />} />
                <Route path="suprimentos/estoque/entradas/entrada-materiais" element={<EstoqueEntradaMateriais />} />
                <Route path="suprimentos/estoque/entradas/nova-entrada" element={<EstoqueNovaEntrada />} />
                <Route path="suprimentos/estoque/entradas/editar/:id" element={<EstoqueEditarEntrada />} />
                <Route path="suprimentos/estoque/entradas/relatorio-entrada" element={<EstoqueRelatorioEntrada />} />
                <Route path="suprimentos/estoque/entradas/relacao-entradas" element={<EstoqueRelacaoEntradas />} />
                
                {/* Requisições */}
                <Route path="suprimentos/estoque/requisicoes/requisicao-materiais" element={<EstoqueRequisicaoMateriais />} />
                <Route path="suprimentos/estoque/requisicoes/nova-requisicao" element={<EstoqueNovaRequisicao />} />
                <Route path="suprimentos/estoque/requisicoes/devolucao-materiais" element={<EstoqueDevolucaoMateriais />} />
                <Route path="suprimentos/estoque/requisicoes/processar-devolucao/:id" element={<EstoqueProcessarDevolucao />} />
                <Route path="suprimentos/estoque/requisicoes/relatorio-requisicao" element={<EstoqueRelatorioRequisicao />} />
                <Route path="suprimentos/estoque/requisicoes/relacao-requisicoes" element={<EstoqueRelacaoRequisicoes />} />
                <Route path="suprimentos/estoque/requisicoes/relacao-devolucoes" element={<EstoqueRelacaoDevolucoes />} />
                <Route path="suprimentos/estoque/requisicoes/requisicoes-emitidas" element={<EstoqueRelacaoRequisicoesEmitidas />} />
                <Route path="suprimentos/estoque/requisicoes/requisicoes-pendentes" element={<EstoqueRelacaoRequisicoesPendentes />} />
                
                {/* Transferências */}
                <Route path="suprimentos/estoque/transferencias/transferencia-almoxarifados" element={<EstoqueTransferenciaAlmoxarifados />} />
                <Route path="suprimentos/estoque/transferencias/nova-transferencia-almoxarifados" element={<EstoqueNovaTransferenciaAlmoxarifados />} />
                <Route path="suprimentos/estoque/transferencias/transferencia-ccas" element={<EstoqueTransferenciaCCAs />} />
                <Route path="suprimentos/estoque/transferencias/relatorio-transferencias" element={<EstoqueRelatorioTransferencias />} />
                <Route path="suprimentos/estoque/transferencias/relacao-transferencias" element={<EstoqueRelacaoTransferencias />} />
                
                {/* Beneficiamento */}
                <Route path="suprimentos/estoque/beneficiamento/envio-beneficiamento" element={<EstoqueEnvioBeneficiamento />} />
                <Route path="suprimentos/estoque/beneficiamento/novo-envio-beneficiamento" element={<EstoqueNovoEnvioBeneficiamento />} />
                <Route path="suprimentos/estoque/beneficiamento/retorno-beneficiamento" element={<EstoqueRetornoBeneficiamento />} />
                <Route path="suprimentos/estoque/beneficiamento/novo-retorno-beneficiamento" element={<EstoqueNovoRetornoBeneficiamento />} />
                <Route path="suprimentos/estoque/beneficiamento/relacao-materiais" element={<EstoqueRelacaoMateriaisBeneficiamento />} />
                <Route path="suprimentos/estoque/beneficiamento/relacao-materiais-beneficiamento" element={<EstoqueRelacaoMateriaisBeneficiamento />} />

                {/* Placeholder routes */}
                <Route path="placeholder" element={<PlaceholderPage />} />
                
                {/* Engenharia Matricial routes */}
                <Route path="engenharia-matricial" element={<EngenhariaMatricialIndex />} />
                <Route path="engenharia-matricial/ordens-servico" element={<OrdemServicoList />} />
                <Route path="engenharia-matricial/os/:id" element={<DetalhesOrdemServico />} />
                <Route path="engenharia-matricial/os-abertas" element={<OSAbertas />} />
                <Route path="os/nova" element={<NovaOrdemServico />} />
                <Route path="os/:id/editar" element={<EditarOS />} />
                <Route path="engenharia-matricial/os-em-planejamento" element={<OSEmPlanejamento />} />
                <Route path="engenharia-matricial/os-aguardando-aceite" element={<OSAguardandoAceite />} />
                <Route path="engenharia-matricial/os-em-execucao" element={<OSEmExecucao />} />
                <Route path="engenharia-matricial/os-em-fechamento" element={<OSEmFechamento />} />
                <Route path="engenharia-matricial/os-aguardando-aceite-fechamento" element={<OSAguardandoAceiteFechamento />} />
                <Route path="engenharia-matricial/os-concluidas" element={<OSConcluidas />} />
                <Route path="engenharia-matricial/os-replanejamento" element={<OSReplanejamento />} />
                <Route path="engenharia-matricial/os-aguardando-aceite-replanejamento" element={<OSAguardandoAceiteReplanejamento />} />
                <Route path="engenharia-matricial/relatorios-anual" element={<RelatoriosAnual />} />
                <Route path="engenharia-matricial/relatorios-em-eletrica" element={<RelatoriosEMEletrica />} />
                <Route path="engenharia-matricial/relatorios-em-mecanica" element={<RelatoriosEMMecanica />} />
                <Route path="engenharia-matricial/relatorios-em-departamento" element={<RelatoriosEMDepartamento />} />
                <Route path="engenharia-matricial/admin/usuarios" element={<AdminUsuariosEM />} />

                {/* ========================================== */}
                {/* COMERCIAL - Repositório de Documentos     */}
                {/* ========================================== */}
                <Route path="comercial/repositorio/documentos" element={<DocumentList />} />
                <Route path="comercial/repositorio/upload" element={<DocumentUpload />} />
                <Route path="comercial/repositorio/categorias" element={<DocumentCategories />} />
                <Route path="comercial/repositorio/categoria/:categoriaId" element={<CategoryView />} />
                <Route path="comercial/repositorio/categoria/:categoriaId/subcategoria/:subcategoriaId" element={<SubcategoryView />} />

                {/* ========================================== */}
                {/* COMERCIAL - Controle Comercial            */}
                {/* ========================================== */}
                <Route path="comercial/controle/dashboard" element={<CommercialDashboard />} />
                <Route path="comercial/controle/performance" element={<CommercialSpreadsheet />} />
                <Route path="comercial/controle/cadastro" element={<CommercialForm />} />
                <Route path="comercial/controle/editar/:id" element={<CommercialForm />} />
                <Route path="comercial/controle/registros" element={<CommercialRecords />} />
                <Route path="comercial/controle/metas" element={<AnnualGoalsForm />} />
                <Route path="comercial/controle/relatorios" element={<CommercialReports />} />
                <Route path="comercial/controle/consolidacao/:id" element={<ConsolidationDetails />} />
                <Route path="comercial/controle/cadastros/segmentos" element={<SegmentManagement />} />
                <Route path="comercial/controle/cadastros/vendedores" element={<VendedorManagement />} />
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
