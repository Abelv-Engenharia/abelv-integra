import { OrigemCandidato } from "@/types/gestao-pessoas/candidato";
import { Users, Briefcase, Building, MessageCircle, HelpCircle, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrigemIconProps {
  origem: OrigemCandidato;
  showLabel?: boolean;
}

export const OrigemIcon = ({ origem, showLabel = true }: OrigemIconProps) => {
  const getOrigemConfig = (origem: OrigemCandidato) => {
    switch (origem) {
      case OrigemCandidato.LINKEDIN:
        return { icon: Linkedin, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case OrigemCandidato.INDEED:
        return { icon: Briefcase, color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case OrigemCandidato.INDICACAO:
        return { icon: Users, color: "bg-green-50 text-green-700 border-green-200" };
      case OrigemCandidato.SITE_ABELV:
        return { icon: Building, color: "bg-purple-50 text-purple-700 border-purple-200" };
      case OrigemCandidato.SOLIDES:
        return { icon: Briefcase, color: "bg-pink-50 text-pink-700 border-pink-200" };
      case OrigemCandidato.WHATSAPP:
        return { icon: MessageCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case OrigemCandidato.OUTROS:
        return { icon: HelpCircle, color: "bg-gray-50 text-gray-700 border-gray-200" };
      default:
        return { icon: HelpCircle, color: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  const config = getOrigemConfig(origem);
  const Icon = config.icon;

  if (showLabel) {
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        <span>{origem}</span>
      </Badge>
    );
  }

  return <Icon className="h-4 w-4" />;
};
