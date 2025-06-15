
import { useState } from "react";
import MedidaDisciplinarForm from "@/components/medidas-disciplinares/MedidaDisciplinarForm";
import MedidaDisciplinarSuccess from "@/components/medidas-disciplinares/MedidaDisciplinarSuccess";
import { Card } from "@/components/ui/card";

export default function MedidasDisciplinaresCadastro() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Medida Disciplinar</h1>
      <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 shadow-md">
        {success ? (
          <MedidaDisciplinarSuccess onNew={() => setSuccess(false)} />
        ) : (
          <MedidaDisciplinarForm onSuccess={() => setSuccess(true)} />
        )}
      </Card>
    </div>
  );
}
