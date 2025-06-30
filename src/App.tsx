
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
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

// Account pages
import Profile from "@/pages/account/Profile";
import Settings from "@/pages/account/Settings";
import ChangePassword from "@/pages/account/ChangePassword";
import Support from "@/pages/account/Support";

// SMS pages
import PlaceholderPage from "@/pages/PlaceholderPage";

// Admin pages
import AdminUsuarios from "@/pages/admin/AdminUsuarios";
import CriarUsuario from "@/pages/admin/CriarUsuario";
import AdminPerfis from "@/pages/admin/AdminPerfis";
import AdminEmpresas from "@/pages/admin/AdminEmpresas";
import AdminCCAs from "@/pages/admin/AdminCCAs";
import AdminEngenheiros from "@/pages/admin/AdminEngenheiros";
import AdminSupervisores from "@/pages/admin/AdminSupervisores";
import AdminLogo from "@/pages/admin/AdminLogo";
import AdminModelosInspecao from "@/pages/admin/AdminModelosInspecao";
import CadastroFuncionarios from "@/pages/admin/CadastroFuncionarios";

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
                      <Layout />
                    </SidebarProvider>
                  </AuthGuard>
                }
              >
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Account routes */}
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/settings" element={<Settings />} />
                <Route path="account/change-password" element={<ChangePassword />} />
                <Route path="account/support" element={<Support />} />
                
                {/* SMS routes - using placeholder for now */}
                <Route path="hora-seguranca/*" element={<PlaceholderPage />} />
                <Route path="desvios/*" element={<PlaceholderPage />} />
                <Route path="treinamentos/*" element={<PlaceholderPage />} />
                <Route path="medidas-disciplinares/*" element={<PlaceholderPage />} />
                <Route path="inspecao-sms/*" element={<PlaceholderPage />} />
                <Route path="ocorrencias/*" element={<PlaceholderPage />} />

                {/* Tarefas routes */}
                <Route path="tarefas/*" element={<PlaceholderPage />} />

                {/* Relatorios routes */}
                <Route path="relatorios/*" element={<PlaceholderPage />} />
                <Route path="idsms/*" element={<PlaceholderPage />} />

                {/* Admin routes */}
                <Route path="admin/usuarios" element={<AdminUsuarios />} />
                <Route path="admin/usuarios/criar" element={<CriarUsuario />} />
                <Route path="admin/usuarios/editar/:id" element={<PlaceholderPage />} />
                <Route path="admin/perfis" element={<AdminPerfis />} />
                <Route path="admin/empresas" element={<AdminEmpresas />} />
                <Route path="admin/ccas" element={<AdminCCAs />} />
                <Route path="admin/engenheiros" element={<AdminEngenheiros />} />
                <Route path="admin/supervisores" element={<AdminSupervisores />} />
                <Route path="admin/funcionarios" element={<CadastroFuncionarios />} />
                <Route path="admin/hht" element={<PlaceholderPage />} />
                <Route path="admin/metas-indicadores" element={<PlaceholderPage />} />
                <Route path="admin/templates" element={<PlaceholderPage />} />
                <Route path="admin/logo" element={<AdminLogo />} />
                <Route path="admin/modelos-inspecao" element={<AdminModelosInspecao />} />

                {/* GRO routes */}
                <Route path="gro/perigos" element={<PlaceholderPage />} />
                <Route path="gro/avaliacao" element={<PlaceholderPage />} />
                <Route path="gro/pgr" element={<PlaceholderPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
