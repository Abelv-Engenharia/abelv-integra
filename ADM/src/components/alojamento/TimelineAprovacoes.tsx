import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineAprovacoesProps {
  blocoAtual: string;
}

const etapas = [
  { id: 'cadastro', label: 'Cadastro' },
  { id: 'validacao_adm', label: 'Adm. Matricial' },
  { id: 'validacao_financeiro', label: 'Financeiro' },
  { id: 'validacao_documentacao', label: 'Documentação' },
  { id: 'validacao_superintendencia', label: 'Superintendência' },
  { id: 'aguardando_assinatura', label: 'Assinatura' },
  { id: 'concluido', label: 'Concluído' },
];

export function TimelineAprovacoes({ blocoAtual }: TimelineAprovacoesProps) {
  const etapaAtualIndex = etapas.findIndex(e => e.id === blocoAtual);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {etapas.map((etapa, index) => {
          const isConcluido = index < etapaAtualIndex;
          const isAtual = index === etapaAtualIndex;
          const isPendente = index > etapaAtualIndex;

          return (
            <div key={etapa.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div 
                    className={`flex-1 h-1 ${
                      isConcluido ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
                <div className="relative">
                  {isConcluido && (
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {isAtual && (
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {isPendente && (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <Circle className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                {index < etapas.length - 1 && (
                  <div 
                    className={`flex-1 h-1 ${
                      isConcluido ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <p className={`mt-2 text-xs text-center ${
                isAtual ? 'font-semibold text-yellow-600' : 
                isConcluido ? 'text-green-600' : 
                'text-gray-500'
              }`}>
                {etapa.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
