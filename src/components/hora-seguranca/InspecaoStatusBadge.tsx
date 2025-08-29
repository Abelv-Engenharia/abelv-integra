
import React from "react";
import { Badge } from "@/components/ui/badge";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "CONCLUÍDA":
    case "CONFORME":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "REALIZADA (NÃO PROGRAMADA)":
      return "bg-orange-500 hover:bg-orange-600 text-white";
    case "A REALIZAR":
      return "bg-blue-500 hover:bg-blue-600 text-white";
    case "NÃO REALIZADA":
      return "bg-red-500 hover:bg-red-600 text-white";
    case "CANCELADA":
      return "bg-gray-500 hover:bg-gray-600 text-white";
    default:
      return "";
  }
};

interface InspecaoStatusBadgeProps {
  status: string;
}

export function InspecaoStatusBadge({ status }: InspecaoStatusBadgeProps) {
  return (
    <Badge
      className={
        getStatusBadgeClass(status) +
        " text-[9px] px-2 py-0.5 h-5 min-h-0 leading-tight"
      }
    >
      <span className="text-[9px] font-semibold">
        {status === "REALIZADA (NÃO PROGRAMADA)" ? "REALIZADA (NÃO PROG.)" : status}
      </span>
    </Badge>
  );
}
