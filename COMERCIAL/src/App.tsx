import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

import NotFound from "./pages/NotFound";
import DocumentRepository from "./pages/DocumentRepository";
import DocumentList from "./pages/DocumentList";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentCategories from "./pages/DocumentCategories";
import DocumentSearch from "./pages/DocumentSearch";
import CategoryView from "./pages/CategoryView";
import SubcategoryView from "./pages/SubcategoryView";
import CommercialSpreadsheet from "./pages/CommercialSpreadsheet";
import CommercialForm from "./pages/CommercialForm";
import CommercialDashboard from "./pages/CommercialDashboard";
import AnnualGoalsForm from "./pages/AnnualGoalsForm";
import CommercialRecords from "./pages/CommercialRecords";
import ConsolidationDetails from "./pages/ConsolidationDetails";
import CommercialReports from "./pages/CommercialReports";
import SegmentManagement from "./pages/SegmentManagement";
import VendedorManagement from "./pages/VendedorManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CommercialDashboard />} />
            <Route path="/repositorio" element={<DocumentRepository />} />
            <Route path="/repositorio/documentos" element={<DocumentList />} />
            <Route path="/repositorio/upload" element={<DocumentUpload />} />
            <Route path="/repositorio/categorias" element={<DocumentCategories />} />
            <Route path="/repositorio/busca" element={<DocumentSearch />} />
            <Route path="/repositorio/categoria/:categoriaId" element={<CategoryView />} />
            <Route path="/repositorio/categoria/:categoriaId/subcategoria/:subcategoriaId" element={<SubcategoryView />} />
            <Route path="/comercial" element={<CommercialSpreadsheet />} />
            <Route path="/comercial/cadastro" element={<CommercialForm />} />
            <Route path="/comercial/editar/:id" element={<CommercialForm />} />
            <Route path="/comercial/dashboard" element={<CommercialDashboard />} />
            <Route path="/comercial/metas" element={<AnnualGoalsForm />} />
            <Route path="/comercial/registros" element={<CommercialRecords />} />
            <Route path="/comercial/relatorios" element={<CommercialReports />} />
            <Route path="/comercial/consolidacao/:id" element={<ConsolidationDetails />} />
            <Route path="/comercial/cadastros/segmentos" element={<SegmentManagement />} />
            <Route path="/comercial/cadastros/vendedores" element={<VendedorManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
