import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CadastroFluidos from "./pages/CadastroFluidos";
import CadastroLinhas from "./pages/CadastroLinhas";
import CadastroJuntas from "./pages/CadastroJuntas";
import CadastroCCAs from "./pages/CadastroCCAs";
import CadastroEncarregados from "./pages/CadastroEncarregados";
import CadastroAtividades from "./pages/CadastroAtividades";
import ImportacaoCSV from "./pages/ImportacaoCSV";
import MecanicaTubulacao from "./pages/MecanicaTubulacao";
import Registros from "./pages/Registros";
import RelatoriosMecanica from "./pages/RelatoriosMecanica";
import ListaRegistros from "./pages/ListaRegistros";
import CadastroParametros from "./pages/CadastroParametros";
import AreasProjecto from "./pages/AreasProjecto";
import NotFound from "./pages/NotFound";

// Páginas do módulo Elétrica/Instrumentação
import EletricaRegistros from "./pages/EletricaRegistros";
import EletricaListaRegistros from "./pages/EletricaListaRegistros";
import EletricaRelatorios from "./pages/EletricaRelatorios";

import EletricaEncarregados from "./pages/EletricaEncarregados";
import EletricaAtividades from "./pages/EletricaAtividades";
import EletricaDesenhos from "./pages/EletricaDesenhos";
import EletricaInfraestrutura from "./pages/EletricaInfraestrutura";
import EletricaCabos from "./pages/EletricaCabos";
import EletricaInstrumentos from "./pages/EletricaInstrumentos";
import EletricaEquipamentos from "./pages/EletricaEquipamentos";
import EletricaLuminárias from "./pages/EletricaLuminárias";
import EletricaTiposInfraestrutura from "./pages/EletricaTiposInfraestrutura";
import EletricaDisciplinas from "./pages/EletricaDisciplinas";
import CadastroEquipamentosMecanicos from "./pages/CadastroEquipamentosMecanicos";
import CadastroValvulas from "./pages/CadastroValvulas";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadastro-ccas" element={<CadastroCCAs />} />
          <Route path="/ccas" element={<CadastroCCAs />} />
          <Route path="/encarregados" element={<CadastroEncarregados />} />
          <Route path="/fluidos" element={<CadastroFluidos />} />
          <Route path="/linhas" element={<CadastroLinhas />} />
          <Route path="/juntas" element={<CadastroJuntas />} />
          <Route path="/atividades" element={<CadastroAtividades />} />
          <Route path="/importacao-csv" element={<ImportacaoCSV />} />
          <Route path="/mecanica-tubulacao" element={<MecanicaTubulacao />} />
          <Route path="/registros" element={<Registros />} />
          
          <Route path="/relatorios-mecanica" element={<RelatoriosMecanica />} />
          <Route path="/lista-registros" element={<ListaRegistros />} />
          <Route path="/parametros" element={<CadastroParametros />} />
          <Route path="/areas-projeto" element={<AreasProjecto />} />
          
          {/* Rotas do módulo Elétrica/Instrumentação */}
          <Route path="/eletrica-registros" element={<EletricaRegistros />} />
          <Route path="/eletrica-lista-registros" element={<EletricaListaRegistros />} />
          <Route path="/eletrica-relatorios" element={<EletricaRelatorios />} />
          
          <Route path="/eletrica-encarregados" element={<EletricaEncarregados />} />
          <Route path="/eletrica-atividades" element={<EletricaAtividades />} />
          <Route path="/eletrica-disciplinas" element={<EletricaDisciplinas />} />
          <Route path="/eletrica-desenhos" element={<EletricaDesenhos />} />
          <Route path="/eletrica-infraestrutura" element={<EletricaInfraestrutura />} />
          <Route path="/eletrica-tipos-infraestrutura" element={<EletricaTiposInfraestrutura />} />
          <Route path="/eletrica-cabos" element={<EletricaCabos />} />
          <Route path="/eletrica-instrumentos" element={<EletricaInstrumentos />} />
          <Route path="/eletrica-equipamentos" element={<EletricaEquipamentos />} />
          <Route path="/eletrica-luminarias" element={<EletricaLuminárias />} />
          <Route path="/equipamentos-mecanicos" element={<CadastroEquipamentosMecanicos />} />
          <Route path="/valvulas" element={<CadastroValvulas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
