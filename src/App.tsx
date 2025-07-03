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
import DesviosForm from "./pages/desvios/DesviosForm";
import DesviosDashboard from "./pages/desvios/DesviosDashboard";
import TreinamentosDashboard from "./pages/treinamentos/TreinamentosDashboard";
import TreinamentosForm from "./pages/treinamentos/TreinamentosForm";
import OcorrenciasDashboard from "./pages/ocorrencias/OcorrenciasDashboard";
import OcorrenciasForm from "./pages/ocorrencias/OcorrenciasForm";
import UsuariosDashboard from "./pages/usuarios/UsuariosDashboard";
import UsuariosForm from "./pages/usuarios/UsuariosForm";
import HoraSegurancaDashboard from "./pages/hora-seguranca/HoraSegurancaDashboard";
import IDSMSDashboard from "./pages/idsms/IDSMSDashboard";

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
              <Route path="/" element={<Index />} />
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
                
                {/* Treinamentos */}
                <Route path="/treinamentos" element={<TreinamentosDashboard />} />
                <Route path="/treinamentos/novo" element={<TreinamentosForm />} />
                <Route path="/treinamentos/editar/:id" element={<TreinamentosForm />} />
                
                {/* Ocorrências */}
                <Route path="/ocorrencias" element={<OcorrenciasDashboard />} />
                <Route path="/ocorrencias/novo" element={<OcorrenciasForm />} />
                <Route path="/ocorrencias/editar/:id" element={<OcorrenciasForm />} />
                
                {/* Usuários */}
                <Route path="/usuarios" element={<UsuariosDashboard />} />
                <Route path="/usuarios/novo" element={<UsuariosForm />} />
                <Route path="/usuarios/editar/:id" element={<UsuariosForm />} />

                {/* Hora da Segurança */}
                <Route path="/hora-seguranca" element={<HoraSegurancaDashboard />} />

                {/* IDSMS */}
                <Route path="/idsms" element={<IDSMSDashboard />} />
                
                {/* Relatórios */}
                <Route path="/relatorios" element={<RelatoriosDashboard />} />
                <Route path="/relatorios/desvios" element={<RelatoriosDesvios />} />
                <Route path="/relatorios/treinamentos" element={<RelatoriosTreinamentos />} />
                <Route path="/relatorios/ocorrencias" element={<RelatoriosOcorrencias />} />
                <Route path="/relatorios/idsms" element={<RelatoriosIDSMS />} />
                <Route path="/relatorios/hsa" element={<RelatoriosHSA />} />
                
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
