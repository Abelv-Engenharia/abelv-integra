import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DocsLayout } from "@/layouts/docs"
import { ExamplesLayout } from "@/layouts/examples"
import { MarketingLayout } from "@/layouts/marketing"
import { Home } from "@/pages/home"
import { DocsPage } from "@/pages/docs"
import { ExamplesPage } from "@/pages/examples"
import { PricingPage } from "@/pages/pricing"
import { LoginPage } from "@/pages/login"
import { RegisterPage } from "@/pages/register"
import { DashboardPage } from "@/pages/dashboard"
import { OcorrenciasPage } from "@/pages/ocorrencias"
import { AdminPage } from "@/pages/admin"
import { HoraSegurancaDashboard } from "@/pages/hora-seguranca/Dashboard"
import InspecoesCadastro from "@/pages/hora-seguranca/InspecoesCadastro"
import InspecoesNaoProgramadas from "@/pages/hora-seguranca/InspecoesNaoProgramadas"
import AdminModelosInspecao from "@/pages/admin/AdminModelosInspecao";

import InspecaoSMSCadastro from "@/pages/inspecao-sms/InspecaoSMSCadastro";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
          <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
          <Route path="/login" element={<MarketingLayout><LoginPage /></MarketingLayout>} />
          <Route path="/register" element={<MarketingLayout><RegisterPage /></MarketingLayout>} />
          <Route path="/dashboard" element={<ExamplesLayout><DashboardPage /></ExamplesLayout>} />
          <Route path="/ocorrencias" element={<ExamplesLayout><OcorrenciasPage /></ExamplesLayout>} />
          <Route path="/admin" element={<ExamplesLayout><AdminPage /></ExamplesLayout>} />
          <Route path="/admin/modelos-inspecao" element={<ExamplesLayout><AdminModelosInspecao /></ExamplesLayout>} />

          {/* Hora Segurança Routes */}
          <Route path="/hora-seguranca">
            <Route path="dashboard" element={<ExamplesLayout><HoraSegurancaDashboard /></ExamplesLayout>} />
            <Route path="inspecoes-cadastro" element={<ExamplesLayout><InspecoesCadastro /></ExamplesLayout>} />
            <Route path="inspecoes-nao-programadas" element={<ExamplesLayout><InspecoesNaoProgramadas /></ExamplesLayout>} />
          </Route>
          
          {/* Inspeção SMS Routes */}
          <Route path="/inspecao-sms">
            <Route path="cadastrar" element={<InspecaoSMSCadastro />} />
          </Route>

          <Route path="/docs">
            <Route index element={<DocsLayout><DocsPage /></DocsLayout>} />
            <Route path=":page" element={<DocsLayout><DocsPage /></DocsLayout>} />
          </Route>
          <Route path="/examples">
            <Route index element={<ExamplesLayout><ExamplesPage /></ExamplesLayout>} />
            <Route path=":page" element={<ExamplesLayout><ExamplesPage /></ExamplesLayout>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
