
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Account pages
import Profile from "@/pages/account/Profile";
import EditProfile from "@/pages/account/EditProfile";
import Settings from "@/pages/account/Settings";
import Support from "@/pages/account/Support";

// Desvios pages
import DesviosConsulta from "@/pages/DesviosConsulta";
import DesviosForm from "@/pages/DesviosForm";

// Treinamentos pages
import TreinamentosConsulta from "@/pages/treinamentos/TreinamentosConsulta";
import TreinamentosExecucao from "@/pages/treinamentos/TreinamentosExecucao";

// Ocorrencias pages
import OcorrenciasConsulta from "@/pages/ocorrencias/OcorrenciasConsulta";
import OcorrenciasForm from "@/pages/ocorrencias/OcorrenciasCadastro";

// Tarefas pages
import TarefasDashboard from "@/pages/tarefas/TarefasDashboard";
import MinhasTarefas from "@/pages/tarefas/MinhasTarefas";
import TarefasDetalhes from "@/pages/tarefas/DetalheTarefa";

// Relatorios pages
import RelatoriosDashboard from "@/pages/relatorios/RelatoriosDashboard";
import RelatoriosTreinamentos from "@/pages/relatorios/RelatoriosTreinamentos";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Account routes */}
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/edit-profile" element={<EditProfile />} />
                <Route path="account/settings" element={<Settings />} />
                <Route path="account/support" element={<Support />} />
                
                {/* Desvios routes */}
                <Route path="desvios/consulta" element={<DesviosConsulta />} />
                <Route path="desvios/novo" element={<DesviosForm />} />
                
                {/* Treinamentos routes */}
                <Route path="treinamentos/consulta" element={<TreinamentosConsulta />} />
                <Route path="treinamentos/execucao" element={<TreinamentosExecucao />} />
                
                {/* Ocorrencias routes */}
                <Route path="ocorrencias/consulta" element={<OcorrenciasConsulta />} />
                <Route path="ocorrencias/novo" element={<OcorrenciasForm />} />
                
                {/* Tarefas routes */}
                <Route path="tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="tarefas/minhas-tarefas" element={<MinhasTarefas />} />
                <Route path="tarefas/detalhes/:id" element={<TarefasDetalhes />} />
                
                {/* Relatorios routes */}
                <Route path="relatorios/dashboard" element={<RelatoriosDashboard />} />
                <Route path="relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
