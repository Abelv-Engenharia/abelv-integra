
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import DesviosDashboard from '@/pages/DesviosDashboard';
import DesviosConsulta from '@/pages/DesviosConsulta';
import DesviosForm from '@/pages/DesviosForm';
import TreinamentosDashboard from '@/pages/treinamentos/TreinamentosDashboard';
import TreinamentosConsulta from '@/pages/treinamentos/TreinamentosConsulta';
import TreinamentosExecucao from '@/pages/treinamentos/TreinamentosExecucao';
import TreinamentosNormativo from '@/pages/treinamentos/TreinamentosNormativo';
import TreinamentosCracha from '@/pages/treinamentos/TreinamentosCracha';
import RelatoriosDashboard from '@/pages/relatorios/RelatoriosDashboard';
import RelatoriosDesvios from '@/pages/relatorios/RelatoriosDesvios';
import RelatoriosTreinamentos from '@/pages/relatorios/RelatoriosTreinamentos';
import RelatoriosOcorrencias from '@/pages/relatorios/RelatoriosOcorrencias';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotFound from '@/pages/NotFound';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/auth/LoginPage';
import Index from './pages/Index';

// Create a client for React Query
const queryClient = new QueryClient();

// Fixed ProtectedRoute component to properly handle TypeScript props
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-b-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Desvios routes */}
            <Route 
              path="/desvios/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DesviosDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/desvios/consulta" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DesviosConsulta />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/desvios/cadastro" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DesviosForm />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Treinamentos routes */}
            <Route 
              path="/treinamentos/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TreinamentosDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/treinamentos/consulta" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TreinamentosConsulta />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/treinamentos/execucao" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TreinamentosExecucao />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/treinamentos/normativo" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TreinamentosNormativo />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/treinamentos/cracha" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <TreinamentosCracha />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Relatórios routes */}
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <RelatoriosDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios/desvios" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <RelatoriosDesvios />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios/treinamentos" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <RelatoriosTreinamentos />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios/ocorrencias" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <RelatoriosOcorrencias />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
