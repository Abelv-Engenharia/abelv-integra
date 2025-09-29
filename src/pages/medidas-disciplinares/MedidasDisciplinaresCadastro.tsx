
import { useState } from "react";
import { useLocation } from "react-router-dom";
import MedidaDisciplinarForm from "@/components/medidas-disciplinares/MedidaDisciplinarForm";
import MedidaDisciplinarSuccess from "@/components/medidas-disciplinares/MedidaDisciplinarSuccess";
import { Card } from "@/components/ui/card";

export default function MedidasDisciplinaresCadastro() {
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const medidaDisciplinarData = location.state;

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 py-8 flex flex-col items-center">
      {medidaDisciplinarData?.fromDesvio && (
        <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ℹ️ Cadastro de medida disciplinar vinculada ao desvio registrado anteriormente.
            </p>
          </div>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4">Cadastro de Medida Disciplinar</h1>
      <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 shadow-md">
        {success ? (
          <MedidaDisciplinarSuccess onNew={() => setSuccess(false)} />
        ) : (
          <MedidaDisciplinarForm 
            onSuccess={() => setSuccess(true)} 
            initialData={medidaDisciplinarData}
          />
        )}
      </Card>
    </div>
  );
}
