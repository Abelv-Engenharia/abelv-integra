import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import OrdemServicoList from "./pages/OrdemServicoList";
import NovaOrdemServico from "./pages/NovaOrdemServico";
import DetalhesOrdemServico from "./pages/DetalhesOrdemServico";
import OSAbertas from "./pages/OSAbertas";
import OSEmPlanejamento from "./pages/OSEmPlanejamento";
import OSAguardandoAceite from "./pages/OSAguardandoAceite";
import OSEmExecucao from "./pages/OSEmExecucao";
import OSAguardandoAceiteFechamento from "./pages/OSAguardandoAceiteFechamento";
import OSConcluidas from "./pages/OSConcluidas";

import Relatorios from "./pages/Relatorios";
import RelatoriosHH from "./pages/RelatoriosHH";
import RelatoriosEMEletrica from "./pages/RelatoriosEMEletrica";
import RelatoriosEMMecanica from "./pages/RelatoriosEMMecanica";
import RelatoriosEMDepartamento from "./pages/RelatoriosEMDepartamento";
import RelatoriosAnual from "./pages/RelatoriosAnual";
import AdminUsuarios from "./pages/AdminUsuarios";
import OSEmFechamento from "./pages/OSEmFechamento";
import OSReplanejamento from "./pages/OSReplanejamento";
import OSAguardandoAceiteReplanejamento from "./pages/OSAguardandoAceiteReplanejamento";
import ImportarOS from "./pages/ImportarOS";
import ImportarOSMecanica from "./pages/ImportarOSMecanica";
import ImportarOS25041 from "./pages/ImportarOS25041";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/os" element={<OrdemServicoList />} />
            <Route path="/os/nova" element={<NovaOrdemServico />} />
            <Route path="/os/:id" element={<DetalhesOrdemServico />} />
            <Route path="/os-abertas" element={<OSAbertas />} />
            <Route path="/os-em-planejamento" element={<OSEmPlanejamento />} />
            <Route path="/os-aguardando-aceite" element={<OSAguardandoAceite />} />
            <Route path="/os-em-execucao" element={<OSEmExecucao />} />
            <Route path="/os-em-fechamento" element={<OSEmFechamento />} />
            <Route path="/os-replanejamento" element={<OSReplanejamento />} />
            <Route path="/os-aguardando-aceite-replanejamento" element={<OSAguardandoAceiteReplanejamento />} />
            <Route path="/os-aguardando-aceite-fechamento" element={<OSAguardandoAceiteFechamento />} />
            <Route path="/os-concluidas" element={<OSConcluidas />} />
          <Route path="/os/importar" element={<ImportarOS />} />
          <Route path="/os/importar-mecanica" element={<ImportarOSMecanica />} />
          <Route path="/os/importar-25041" element={<ImportarOS25041 />} />
            
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/relatorios/hh" element={<RelatoriosHH />} />
            <Route path="/relatorios-em-eletrica" element={<RelatoriosEMEletrica />} />
            <Route path="/relatorios-em-mecanica" element={<RelatoriosEMMecanica />} />
            <Route path="/relatorios-em-departamento" element={<RelatoriosEMDepartamento />} />
            <Route path="/relatorios-anual" element={<RelatoriosAnual />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
