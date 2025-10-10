import { useState } from "react";
import { ChevronRight, Package, Home, Settings, FileText, Upload, Download, ArrowLeftRight, Wrench } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarSectionSuprimentosProps {
  isOpen: { [key: string]: boolean };
  toggleMenu: (key: string) => void;
  onLinkClick?: () => void;
}

const estoqueMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/suprimentos/estoque/dashboard",
  },
  {
    title: "Apoio",
    icon: Settings,
    items: [
      { title: "EAP", href: "/suprimentos/estoque/apoio/eap" },
      { title: "Almoxarifados", href: "/suprimentos/estoque/apoio/almoxarifados" },
      { title: "Configurações do Arcabouço", href: "/suprimentos/estoque/apoio/configuracoes-arcabouco" },
      {
        title: "Relatórios",
        items: [
          { title: "Relatório de EAP", href: "/suprimentos/estoque/apoio/relatorio-eap" },
          { title: "Relação de almoxarifados", href: "/suprimentos/estoque/apoio/relacao-almoxarifados" },
        ],
      },
    ],
  },
  {
    title: "Entradas",
    icon: Upload,
    items: [
      { title: "Entrada de Materiais", href: "/suprimentos/estoque/entradas/entrada-materiais" },
      {
        title: "Relatórios",
        items: [
          { title: "Relatório de entrada", href: "/suprimentos/estoque/entradas/relatorio-entrada" },
          { title: "Relação de entradas", href: "/suprimentos/estoque/entradas/relacao-entradas" },
        ],
      },
    ],
  },
  {
    title: "Requisições",
    icon: Download,
    items: [
      { title: "Requisição de Materiais", href: "/suprimentos/estoque/requisicoes/requisicao-materiais" },
      { title: "Devolução de Materiais", href: "/suprimentos/estoque/requisicoes/devolucao-materiais" },
      {
        title: "Relatórios",
        items: [
          { title: "Relatório de requisição", href: "/suprimentos/estoque/requisicoes/relatorio-requisicao" },
          { title: "Relação de requisições", href: "/suprimentos/estoque/requisicoes/relacao-requisicoes" },
          { title: "Relação de devoluções", href: "/suprimentos/estoque/requisicoes/relacao-devolucoes" },
        ],
      },
    ],
  },
  {
    title: "Transferências",
    icon: ArrowLeftRight,
    items: [
      { title: "Transferência entre almoxarifados", href: "/suprimentos/estoque/transferencias/transferencia-almoxarifados" },
      { title: "Transferência entre CCAs", href: "/suprimentos/estoque/transferencias/transferencia-ccas" },
      {
        title: "Relatórios",
        items: [
          { title: "Relatório de transferências", href: "/suprimentos/estoque/transferencias/relatorio-transferencias" },
          { title: "Relação de transferências", href: "/suprimentos/estoque/transferencias/relacao-transferencias" },
        ],
      },
    ],
  },
  {
    title: "Beneficiamento",
    icon: Wrench,
    items: [
      { title: "Envio para beneficiamento", href: "/suprimentos/estoque/beneficiamento/envio-beneficiamento" },
      { title: "Retorno de beneficiamento", href: "/suprimentos/estoque/beneficiamento/retorno-beneficiamento" },
      { title: "Relação de materiais em beneficiamento", href: "/suprimentos/estoque/beneficiamento/relacao-materiais-beneficiamento" },
    ],
  },
];

export const SidebarSectionSuprimentos = ({
  isOpen,
  toggleMenu,
  onLinkClick,
}: SidebarSectionSuprimentosProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActiveRoute = (href: string) => currentPath === href;

  const hasActiveChild = (items: any[]): boolean => {
    return items.some((item) => {
      if (item.href && isActiveRoute(item.href)) return true;
      if (item.items) return hasActiveChild(item.items);
      return false;
    });
  };

  const renderSubMenu = (items: any[], level: number = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.items && item.items.length > 0;
      const menuKey = `estoque-${item.title}-${level}-${index}`;
      const isActive = item.href ? isActiveRoute(item.href) : false;
      const hasActiveDescendant = hasChildren ? hasActiveChild(item.items) : false;
      const shouldBeOpen = isOpen[menuKey] || hasActiveDescendant;

      if (hasChildren) {
        return (
          <Collapsible
            key={menuKey}
            open={shouldBeOpen}
            onOpenChange={() => toggleMenu(menuKey)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className={cn("w-full justify-between", level > 0 && "pl-6")}>
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    shouldBeOpen && "rotate-90"
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="ml-2">
                {renderSubMenu(item.items, level + 1)}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        );
      }

      return (
        <SidebarMenuItem key={menuKey}>
          <SidebarMenuButton asChild isActive={isActive}>
            <Link
              to={item.href}
              onClick={onLinkClick}
              className={cn("w-full", level > 0 && "pl-6")}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Collapsible
      open={isOpen["suprimentos-estoque"]}
      onOpenChange={() => toggleMenu("suprimentos-estoque")}
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Suprimentos - Estoque
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen["suprimentos-estoque"] && "rotate-90"
            )}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="ml-2">
          {renderSubMenu(estoqueMenuItems)}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
};
