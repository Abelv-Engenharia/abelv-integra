import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORIAS_CODIGOS } from "@/services/contratos/substituicaoCodigosContratoService";
import { toast } from "sonner";

export function CodigosDisponiveis() {
  const [copiado, setCopiado] = useState<string | null>(null);

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    toast.success('Código copiado!');
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Códigos disponíveis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Use estes códigos no modelo do contrato (.docx). Eles serão substituídos automaticamente pelos dados do prestador.
      </p>
      
      <Accordion type="multiple" className="w-full">
        {Object.entries(CATEGORIAS_CODIGOS).map(([categoria, codigos]) => (
          <AccordionItem key={categoria} value={categoria}>
            <AccordionTrigger className="text-sm font-medium">
              {categoria} ({codigos.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {codigos.map((codigo) => (
                  <div
                    key={codigo}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <code className="text-xs font-mono">{codigo}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copiarCodigo(codigo)}
                      className="h-7 w-7 p-0"
                    >
                      {copiado === codigo ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
