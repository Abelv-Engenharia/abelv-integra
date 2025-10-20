import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, AlertTriangle, ClipboardList, User, CreditCard, MapPin } from "lucide-react";
import { ConsultaVeiculosTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaVeiculosTab";
import { ConsultaMultasTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaMultasTab";
import { ConsultaChecklistTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaChecklistTab";
import { ConsultaCondutoresTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaCondutoresTab";
import { ConsultaCartoesTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaCartoesTab";
import { ConsultaPedagiosTab } from "@/components/gestao-pessoas/veiculos/consultas/ConsultaPedagiosTab";

export default function ConsultasVeiculos() {
  const [abaAtiva, setAbaAtiva] = useState(() => {
    return localStorage.getItem("consultaAbaAtiva") || "veiculos";
  });

  const handleAbaChange = (value: string) => {
    setAbaAtiva(value);
    localStorage.setItem("consultaAbaAtiva", value);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4 text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt;
        <span className="text-foreground font-medium"> Consultas</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Consultas de Veículos</h1>
        <p className="text-muted-foreground mt-2">
          Visualize e gerencie todos os registros do sistema
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={abaAtiva} onValueChange={handleAbaChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="veiculos" className="gap-2">
            <Car className="h-4 w-4" />
            Veículos
          </TabsTrigger>
          <TabsTrigger value="multas" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Multas
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="condutores" className="gap-2">
            <User className="h-4 w-4" />
            Condutores
          </TabsTrigger>
          <TabsTrigger value="cartoes" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Cartões
          </TabsTrigger>
          <TabsTrigger value="pedagogios" className="gap-2">
            <MapPin className="h-4 w-4" />
            Pedágios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="veiculos">
          <ConsultaVeiculosTab />
        </TabsContent>

        <TabsContent value="multas">
          <ConsultaMultasTab />
        </TabsContent>

        <TabsContent value="checklist">
          <ConsultaChecklistTab />
        </TabsContent>

        <TabsContent value="condutores">
          <ConsultaCondutoresTab />
        </TabsContent>

        <TabsContent value="cartoes">
          <ConsultaCartoesTab />
        </TabsContent>

        <TabsContent value="pedagogios">
          <ConsultaPedagiosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}