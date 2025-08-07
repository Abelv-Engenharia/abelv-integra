
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/account/Settings";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminPerfis from "./pages/admin/AdminPerfis";
import AdminEmpresas from "./pages/admin/AdminEmpresas";
import AdminCcas from "./pages/admin/AdminCcas";
import AdminEngenheiros from "./pages/admin/AdminEngenheiros";
import AdminSupervisores from "./pages/admin/AdminSupervisores";
import AdminEncarregados from "./pages/admin/AdminEncarregados";
import AdminFuncionarios from "./pages/admin/AdminFuncionarios";
import AdminRegistroHht from "./pages/admin/AdminRegistroHht";
import AdminMetasIndicadores from "./pages/admin/AdminMetasIndicadores";
import AdminModelosInspecao from "./pages/admin/AdminModelosInspecao";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminLogoSistema from "./pages/admin/AdminLogoSistema";
import UploadTutoriais from "./pages/UploadTutoriais";
import ConfiguracaoEmails from "./pages/ConfiguracaoEmails";
import AdminExportacaoDados from "./pages/admin/AdminExportacaoDados";
import ImportacaoFuncionarios from "./pages/admin/ImportacaoFuncionarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account/settings" element={<Settings />} />
            <Route path="admin/usuarios" element={<AdminUsuarios />} />
            <Route path="admin/perfis" element={<AdminPerfis />} />
            <Route path="admin/empresas" element={<AdminEmpresas />} />
            <Route path="admin/ccas" element={<AdminCcas />} />
            <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
            <Route path="admin/supervisores" element={<AdminSupervisores />} />
            <Route path="admin/encarregados" element={<AdminEncarregados />} />
            <Route path="admin/funcionarios" element={<AdminFuncionarios />} />
            <Route path="admin/registro-hht" element={<AdminRegistroHht />} />
            <Route path="admin/metas-indicadores" element={<AdminMetasIndicadores />} />
            <Route path="admin/modelos-inspecao" element={<AdminModelosInspecao />} />
            <Route path="admin/templates" element={<AdminTemplates />} />
            <Route path="admin/logo-sistema" element={<AdminLogoSistema />} />
            <Route path="upload-tutoriais" element={<UploadTutoriais />} />
            <Route path="configuracao-emails" element={<ConfiguracaoEmails />} />
            <Route path="admin/exportacao-dados" element={<AdminExportacaoDados />} />
            <Route path="admin/importacao-funcionarios" element={<ImportacaoFuncionarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
