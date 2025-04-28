
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

// Protected route component
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
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
  
  return element;
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
                <ProtectedRoute 
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  } 
                />
              } 
            />
            
            {/* Desvios routes */}
            <Route 
              path="/desvios/dashboard" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <DesviosDashboard />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/desvios/consulta" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <DesviosConsulta />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/desvios/cadastro" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <DesviosForm />
                    </Layout>
                  } 
                />
              } 
            />
            
            {/* Treinamentos routes */}
            <Route 
              path="/treinamentos/dashboard" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <TreinamentosDashboard />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/treinamentos/consulta" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <TreinamentosConsulta />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/treinamentos/execucao" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <TreinamentosExecucao />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/treinamentos/normativo" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <TreinamentosNormativo />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/treinamentos/cracha" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <TreinamentosCracha />
                    </Layout>
                  } 
                />
              } 
            />
            
            {/* Relatórios routes */}
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <RelatoriosDashboard />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/relatorios/desvios" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <RelatoriosDesvios />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/relatorios/treinamentos" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <RelatoriosTreinamentos />
                    </Layout>
                  } 
                />
              } 
            />
            <Route 
              path="/relatorios/ocorrencias" 
              element={
                <ProtectedRoute 
                  element={
                    <Layout>
                      <RelatoriosOcorrencias />
                    </Layout>
                  } 
                />
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
