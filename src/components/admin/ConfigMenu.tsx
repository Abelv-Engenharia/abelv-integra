
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Upload, Settings, FileText } from "lucide-react";

const configMenuItems = [
  {
    title: "Cadastro de Funcionários",
    href: "/admin/funcionarios",
    icon: Users,
    description: "Gerenciar funcionários do sistema"
  },
  {
    title: "Importação de Funcionários",
    href: "/admin/importacao-funcionarios",
    icon: Upload,
    description: "Importar funcionários via arquivo CSV"
  }
];

export const ConfigMenu: React.FC = () => {
  const location = useLocation();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {configMenuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-6 text-left transition-all hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <h3 className="font-semibold">{item.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
