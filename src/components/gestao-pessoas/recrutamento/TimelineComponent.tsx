import { StatusVaga } from "@/types/vaga";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineComponentProps {
  currentStatus: StatusVaga;
  className?: string;
}

export function TimelineComponent({ currentStatus, className = "" }: TimelineComponentProps) {
  const timelineSteps = [
    { status: StatusVaga.SOLICITACAO_ABERTA, label: 'Solicitação Aberta' },
    { status: StatusVaga.APROVADA, label: 'Aprovada' },
    { status: StatusVaga.DIVULGACAO_FEITA, label: 'Divulgação Feita' },
    { status: StatusVaga.EM_SELECAO, label: 'Em Seleção' },
    { status: StatusVaga.FINALIZADA, label: 'Finalizada' }
  ];

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex(step => step.status === currentStatus);
  };

  const currentIndex = getCurrentStepIndex();

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentIndex) {
      return <CheckCircle className="h-5 w-5 text-primary" />;
    } else if (stepIndex === currentIndex) {
      return <Clock className="h-5 w-5 text-primary animate-pulse" />;
    } else {
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepColor = (stepIndex: number) => {
    if (stepIndex <= currentIndex) {
      return "text-primary";
    }
    return "text-muted-foreground";
  };

  const getLineColor = (stepIndex: number) => {
    if (stepIndex < currentIndex) {
      return "bg-primary";
    }
    return "bg-muted";
  };

  return (
    <div className={`py-4 ${className}`}>
      <div className="relative">
        {timelineSteps.map((step, index) => (
          <div key={step.status} className="flex items-center mb-6 last:mb-0">
            {/* Ícone do step */}
            <div className="flex-shrink-0 z-10">
              {getStepIcon(index)}
            </div>
            
            {/* Linha conectora */}
            {index < timelineSteps.length - 1 && (
              <div 
                className={`absolute left-2.5 w-0.5 h-6 top-6 ${getLineColor(index)}`}
                style={{ top: `${(index * 6) + 1.5}rem` }}
              />
            )}
            
            {/* Label do step */}
            <div className="ml-4">
              <p className={`text-sm font-medium ${getStepColor(index)}`}>
                {step.label}
              </p>
              {index === currentIndex && (
                <p className="text-xs text-muted-foreground mt-1">
                  Status atual
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}