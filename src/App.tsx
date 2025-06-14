
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/layout/Layout";

// Auth pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Main pages
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tarefas pages
import TarefasDashboard from "./pages/tarefas/TarefasDashboard";
import CadastroTarefas from "./pages/tarefas/CadastroTarefas";
import MinhasTarefas from "./pages/tarefas/MinhasTarefas";
import EditarTarefa from "./pages/tarefas/EditarTarefa";
import DetalheTarefa from "./pages/tarefas/DetalheTarefa";

// Ocorrencias pages
import OcorrenciasDashboard from "./pages/ocorrencias/OcorrenciasDashboard";

// Account pages
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route element={<AuthGuard><Layout /></AuthGuard>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/index" element={<Index />} />
                
                {/* Tarefas routes */}
                <Route path="/tarefas/dashboard" element={<TarefasDashboard />} />
                <Route path="/tarefas/cadastro" element={<CadastroTarefas />} />
                <Route path="/tarefas/minhas-tarefas" element={<MinhasTarefas />} />
                <Route path="/tarefas/editar/:id" element={<EditarTarefa />} />
                <Route path="/tarefas/detalhes/:id" element={<DetalheTarefa />} />
                
                {/* Ocorrencias routes */}
                <Route path="/ocorrencias/dashboard" element={<OcorrenciasDashboard />} />

                {/* Account routes */}
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/settings" element={<Settings />} />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
