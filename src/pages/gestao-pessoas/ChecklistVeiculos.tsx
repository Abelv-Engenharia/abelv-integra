import { VehicleChecklist } from "@/components/gestao-pessoas/veiculos/VehicleChecklist";
import { GerarLinkChecklistModal } from "@/components/gestao-pessoas/veiculos/GerarLinkChecklistModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

const ChecklistVeiculos = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Checklist de Veículos
            </CardTitle>
            <GerarLinkChecklistModal />
          </div>
        </CardHeader>
      </Card>
      <VehicleChecklist />
    </div>
  );
};

export default ChecklistVeiculos;