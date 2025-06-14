
import { Badge } from "@/components/ui/badge";

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "TRIVIAL":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "TOLERÁVEL":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "MODERADO":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "SUBSTANCIAL":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "INTOLERÁVEL":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const RiskBadge = ({ risk }: { risk?: string }) => (
  <Badge variant="secondary" className={getRiskColor(risk || "")}>
    {risk || "N/A"}
  </Badge>
);

export default RiskBadge;
