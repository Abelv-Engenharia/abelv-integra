
import { useState } from "react";
import MedidaDisciplinarForm from "@/components/medidas-disciplinares/MedidaDisciplinarForm";
import MedidaDisciplinarSuccess from "@/components/medidas-disciplinares/MedidaDisciplinarSuccess";
import { Card } from "@/components/ui/card";

export default function MedidasDisciplinaresCadastro() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro de Medida Disciplinar</h1>
      <Card className="p-6 shadow-md">
        {success ? (
          <MedidaDisciplinarSuccess onNew={() => setSuccess(false)} />
        ) : (
          <MedidaDisciplinarForm onSuccess={() => setSuccess(true)} />
        )}
      </Card>
    </div>
  );
}
