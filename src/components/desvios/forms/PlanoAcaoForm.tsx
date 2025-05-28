
import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PlanoAcaoForm = () => {
  const { watch } = useFormContext();
  const acoes = watch("acoes") || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plano de Ação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Ações Corretivas</h3>
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ação
          </Button>
        </div>

        {acoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma ação adicionada ainda.</p>
            <p className="text-sm">Clique em "Adicionar Ação" para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {acoes.map((acao: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium">Ação {index + 1}</h4>
                <p className="text-sm text-gray-600 mt-1">{acao.descricao || "Sem descrição"}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Instruções</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Defina ações específicas para corrigir o desvio</li>
            <li>• Estabeleça responsáveis e prazos para cada ação</li>
            <li>• Priorize ações que eliminem a causa raiz</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanoAcaoForm;
