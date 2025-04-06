
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import DesviosForm from "./pages/DesviosForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Gestão de SMS routes */}
            <Route path="/desvios/dashboard" element={<PlaceholderPage />} />
            <Route path="/desvios/cadastro" element={<DesviosForm />} />
            <Route path="/desvios/consulta" element={<PlaceholderPage />} />
            <Route path="/desvios/nao-conformidade" element={<PlaceholderPage />} />
            
            <Route path="/treinamentos/dashboard" element={<PlaceholderPage />} />
            <Route path="/treinamentos/normativo" element={<PlaceholderPage />} />
            <Route path="/treinamentos/consulta" element={<PlaceholderPage />} />
            <Route path="/treinamentos/execucao" element={<PlaceholderPage />} />
            <Route path="/treinamentos/cracha" element={<PlaceholderPage />} />
            
            <Route path="/hora-seguranca/dashboard" element={<PlaceholderPage />} />
            <Route path="/hora-seguranca/inspecoes" element={<PlaceholderPage />} />
            <Route path="/hora-seguranca/inspecao-nao-programada" element={<PlaceholderPage />} />
            <Route path="/hora-seguranca/acompanhamento" element={<PlaceholderPage />} />
            
            <Route path="/ocorrencias/dashboard" element={<PlaceholderPage />} />
            <Route path="/ocorrencias/cadastro" element={<PlaceholderPage />} />
            <Route path="/ocorrencias/consulta" element={<PlaceholderPage />} />
            
            <Route path="/medidas-disciplinares/dashboard" element={<PlaceholderPage />} />
            <Route path="/medidas-disciplinares/cadastro" element={<PlaceholderPage />} />
            <Route path="/medidas-disciplinares/consulta" element={<PlaceholderPage />} />
            
            {/* Tarefas routes */}
            <Route path="/tarefas/dashboard" element={<PlaceholderPage />} />
            <Route path="/tarefas/minhas-tarefas" element={<PlaceholderPage />} />
            <Route path="/tarefas/cadastro" element={<PlaceholderPage />} />
            
            {/* Gestão da Rotina routes */}
            <Route path="/gestao-rotina/dssms" element={<PlaceholderPage />} />
            <Route path="/gestao-rotina/rms" element={<PlaceholderPage />} />
            <Route path="/gestao-rotina/ift" element={<PlaceholderPage />} />
            <Route path="/gestao-rotina/ficha-epi" element={<PlaceholderPage />} />
            
            {/* Relatórios routes */}
            <Route path="/relatorios" element={<PlaceholderPage />} />
            
            {/* Administração routes */}
            <Route path="/admin/usuarios" element={<PlaceholderPage />} />
            <Route path="/admin/perfis" element={<PlaceholderPage />} />
            <Route path="/admin/funcionarios" element={<PlaceholderPage />} />
            <Route path="/admin/hht" element={<PlaceholderPage />} />
            <Route path="/admin/templates" element={<PlaceholderPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
