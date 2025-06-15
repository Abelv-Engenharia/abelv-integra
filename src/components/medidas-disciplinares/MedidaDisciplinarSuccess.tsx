
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MedidaDisciplinarSuccess({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <CheckCircle2 className="text-green-500 w-16 h-16 mb-2" />
      <h2 className="text-xl font-bold">Medida disciplinar registrada com sucesso!</h2>
      <Button onClick={onNew}>Registrar nova medida</Button>
      <Button variant="secondary" asChild>
        <a href="/">Voltar ao Dashboard</a>
      </Button>
    </div>
  );
}
