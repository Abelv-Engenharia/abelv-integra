
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DesviosForm from "./pages/DesviosForm";
import DesviosDashboard from "./pages/DesviosDashboard";
import DesviosConsulta from "./pages/DesviosConsulta";
import DesviosNaoConformidade from "./pages/DesviosNaoConformidade";
import AdminTemplates from "./pages/AdminTemplates";

// Treinamentos pages
import TreinamentosDashboard from "./pages/treinamentos/TreinamentosDashboard";
import TreinamentosNormativo from "./pages/treinamentos/TreinamentosNormativo";
import TreinamentosExecucao from "./pages/treinamentos/TreinamentosExecucao";
import TreinamentosCracha from "./pages/treinamentos/TreinamentosCracha";
import TreinamentosConsulta from "./pages/treinamentos/TreinamentosConsulta";

// Hora da Segurança pages
import HoraSegurancaDashboard from "./pages/hora-seguranca/HoraSegurancaDashboard";
import InspecoesCadastro from "./pages/hora-seguranca/InspecoesCadastro";
import InspecoesNaoProgramadas from "./pages/hora-seguranca/InspecoesNaoProgramadas";
import InspecoesAcompanhamento from "./pages/hora-seguranca/InspecoesAcompanhamento";

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
            <Route path="/desvios/dashboard" element={<DesviosDashboard />} />
            <Route path="/desvios/cadastro" element={<DesviosForm />} />
            <Route path="/desvios/consulta" element={<DesviosConsulta />} />
            <Route path="/desvios/nao-conformidade" element={<DesviosNaoConformidade />} />
            
            {/* Treinamentos routes */}
            <Route path="/treinamentos/dashboard" element={<TreinamentosDashboard />} />
            <Route path="/treinamentos/normativo" element={<TreinamentosNormativo />} />
            <Route path="/treinamentos/consulta" element={<TreinamentosConsulta />} />
            <Route path="/treinamentos/execucao" element={<TreinamentosExecucao />} />
            <Route path="/treinamentos/cracha" element={<TreinamentosCracha />} />
            
            {/* Hora-seguranca routes */}
            <Route path="/hora-seguranca/dashboard" element={<HoraSegurancaDashboard />} />
            <Route path="/hora-seguranca/inspecoes" element={<InspecoesCadastro />} />
            <Route path="/hora-seguranca/inspecao-nao-programada" element={<InspecoesNaoProgramadas />} />
            <Route path="/hora-seguranca/acompanhamento" element={<InspecoesAcompanhamento />} />
            
            {/* Ocorrencias routes */}
            <Route path="/ocorrencias/dashboard" element={<Dashboard />} />
            <Route path="/ocorrencias/cadastro" element={<Dashboard />} />
            <Route path="/ocorrencias/consulta" element={<Dashboard />} />
            
            {/* Medidas-disciplinares routes */}
            <Route path="/medidas-disciplinares/dashboard" element={<Dashboard />} />
            <Route path="/medidas-disciplinares/cadastro" element={<Dashboard />} />
            <Route path="/medidas-disciplinares/consulta" element={<Dashboard />} />
            
            {/* Tarefas routes */}
            <Route path="/tarefas/dashboard" element={<Dashboard />} />
            <Route path="/tarefas/minhas-tarefas" element={<Dashboard />} />
            <Route path="/tarefas/cadastro" element={<Dashboard />} />
            
            {/* Gestão da Rotina routes */}
            <Route path="/gestao-rotina/dssms" element={<Dashboard />} />
            <Route path="/gestao-rotina/rms" element={<Dashboard />} />
            <Route path="/gestao-rotina/ift" element={<Dashboard />} />
            <Route path="/gestao-rotina/ficha-epi" element={<Dashboard />} />
            
            {/* Relatórios routes */}
            <Route path="/relatorios" element={<Dashboard />} />
            
            {/* Administração routes */}
            <Route path="/admin/usuarios" element={<Dashboard />} />
            <Route path="/admin/perfis" element={<Dashboard />} />
            <Route path="/admin/funcionarios" element={<Dashboard />} />
            <Route path="/admin/hht" element={<Dashboard />} />
            <Route path="/admin/templates" element={<AdminTemplates />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
