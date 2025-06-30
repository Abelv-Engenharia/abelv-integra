import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Layout } from "@/components/layout/Layout";

// Auth pages
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Main pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Account pages
import Profile from "@/pages/account/Profile";
import Settings from "@/pages/account/Settings";
import ChangePassword from "@/pages/account/ChangePassword";
import Support from "@/pages/account/Support";

// SMS pages
import HoraSeguranca from "@/pages/sms/HoraSeguranca";
import Desvios from "@/pages/sms/Desvios";
import Treinamentos from "@/pages/sms/Treinamentos";
import MedidasDisciplinares from "@/pages/sms/MedidasDisciplinares";
import InspecaoSMS from "@/pages/sms/InspecaoSMS";
import Ocorrencias from "@/pages/sms/Ocorrencias";

// Tarefas pages
import Tarefas from "@/pages/tarefas/Tarefas";

// Relatorios pages
import Relatorios from "@/pages/relatorios/Relatorios";
import IDSMS from "@/pages/relatorios/IDSMS";

// Admin pages
import AdminUsuarios from "@/pages/admin/AdminUsuarios";
import CriarUsuario from "@/pages/admin/CriarUsuario";
import EditarUsuario from "@/pages/admin/EditarUsuario";
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
import AdminModelosInspecao from "@/pages/admin/AdminModelosInspecao";

// GRO pages
import GROPerigos from "@/pages/gro/GROPerigos";
import GROAvaliacao from "@/pages/gro/GROAvaliacao";
import GROPGR from "@/pages/gro/GROPGR";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <SidebarProvider>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          
                          {/* Account routes */}
                          <Route path="/account/profile" element={<Profile />} />
                          <Route path="/account/settings" element={<Settings />} />
                          <Route path="/account/change-password" element={<ChangePassword />} />
                          <Route path="/account/support" element={<Support />} />
                          
                          {/* SMS routes */}
                          <Route path="/hora-seguranca/*" element={<HoraSeguranca />} />
                          <Route path="/desvios/*" element={<Desvios />} />
                          <Route path="/treinamentos/*" element={<Treinamentos />} />
                          <Route path="/medidas-disciplinares/*" element={<MedidasDisciplinares />} />
                          <Route path="/inspecao-sms/*" element={<InspecaoSMS />} />
                          <Route path="/ocorrencias/*" element={<Ocorrencias />} />

                          {/* Tarefas routes */}
                          <Route path="/tarefas/*" element={<Tarefas />} />

                          {/* Relatorios routes */}
                          <Route path="/relatorios/*" element={<Relatorios />} />
                          <Route path="/idsms/*" element={<IDSMS />} />

                          {/* Admin routes */}
                          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                          <Route path="/admin/usuarios/criar" element={<CriarUsuario />} />
                          <Route path="/admin/usuarios/editar/:id" element={<EditarUsuario />} />
                          <Route path="/admin/perfis" element={<AdminPerfis />} />
                          <Route path="/admin/empresas" element={<AdminEmpresas />} />
                          <Route path="/admin/ccas" element={<AdminCCAs />} />
                          <Route path="/admin/engenheiros" element={<AdminEngenheiros />} />
                          <Route path="/admin/supervisores" element={<AdminSupervisores />} />
                          <Route path="/admin/funcionarios" element={<AdminFuncionarios />} />
                          <Route path="/admin/hht" element={<AdminHHT />} />
                          <Route path="/admin/metas-indicadores" element={<AdminMetasIndicadores />} />
                          <Route path="/admin/templates" element={<AdminTemplates />} />
                          <Route path="/admin/logo" element={<AdminLogo />} />
                          <Route path="/admin/modelos-inspecao" element={<AdminModelosInspecao />} />

                          {/* GRO routes */}
                          <Route path="/gro/perigos" element={<GROPerigos />} />
                          <Route path="/gro/avaliacao" element={<GROAvaliacao />} />
                          <Route path="/gro/pgr" element={<GROPGR />} />
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </SidebarProvider>
                  </AuthGuard>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
