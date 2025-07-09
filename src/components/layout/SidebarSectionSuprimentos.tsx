
import React from "react";
import { Package, Truck, ShoppingCart, Warehouse, FileText, Users } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};

export default function SidebarSectionSuprimentos({ openMenu, toggleMenu }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const isSuprimentosOpen = openMenu === "suprimentos";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isSuprimentosOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("suprimentos")}
              className="text-white hover:bg-slate-600"
            >
              <Package className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">SUPRIMENTOS</span>
              {isSuprimentosOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/dashboard" className="flex items-center gap-2">
                    <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/fornecedores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/fornecedores" className="flex items-center gap-2">
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Fornecedores</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/materiais" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/materiais" className="flex items-center gap-2">
                    <Package className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Materiais</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/compras" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/compras" className="flex items-center gap-2">
                    <ShoppingCart className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Compras</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/estoque" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/estoque" className="flex items-center gap-2">
                    <Warehouse className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Estoque</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/pedidos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/pedidos" className="flex items-center gap-2">
                    <Truck className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Pedidos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  asChild
                  className={currentPath === "/suprimentos/contratos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                >
                  <Link to="/suprimentos/contratos" className="flex items-center gap-2">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs leading-tight break-words min-w-0">Contratos</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
