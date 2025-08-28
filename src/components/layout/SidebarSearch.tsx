
import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type MenuItem = {
  name: string;
  path: string;
  category: string;
};

type Props = {
  menusSidebar?: string[];
};

export default function SidebarSearch({ menusSidebar = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Todos os itens de menu disponíveis
  const allMenuItems: MenuItem[] = [
    // Dashboard
    { name: "Dashboard", path: "/dashboard", category: "Dashboard" },
    
    // SMS
    { name: "Desvios Dashboard", path: "/desvios/dashboard", category: "SMS" },
    { name: "Desvios Cadastro", path: "/desvios/cadastro", category: "SMS" },
    { name: "Treinamentos Dashboard", path: "/treinamentos/dashboard", category: "SMS" },
    { name: "Treinamentos Execução", path: "/treinamentos/execucao", category: "SMS" },
    { name: "Hora Segurança Dashboard", path: "/hora-seguranca/dashboard", category: "SMS" },
    { name: "Inspeção SMS Dashboard", path: "/inspecao-sms/dashboard", category: "SMS" },
    { name: "Ocorrências Dashboard", path: "/ocorrencias/dashboard", category: "SMS" },
    { name: "Medidas Disciplinares Dashboard", path: "/medidas-disciplinares/dashboard", category: "SMS" },
    
    // ADM MATRICIAL
    { name: "ADM Dashboard", path: "/adm/dashboard", category: "ADM MATRICIAL" },
    { name: "ADM Configurações", path: "/adm/configuracoes", category: "ADM MATRICIAL" },
    { name: "ADM Usuários", path: "/adm/usuarios", category: "ADM MATRICIAL" },
    { name: "ADM Empresas", path: "/adm/empresas", category: "ADM MATRICIAL" },
    { name: "ADM Perfis", path: "/adm/perfis", category: "ADM MATRICIAL" },
    
    // ORÇAMENTOS
    { name: "Orçamentos Dashboard", path: "/orcamentos/dashboard", category: "ORÇAMENTOS" },
    { name: "Orçamentos Projetos", path: "/orcamentos/projetos", category: "ORÇAMENTOS" },
    { name: "Orçamentos Custos", path: "/orcamentos/custos", category: "ORÇAMENTOS" },
    { name: "Orçamentos Análises", path: "/orcamentos/analises", category: "ORÇAMENTOS" },
    
    // PRODUÇÃO
    { name: "Produção Dashboard", path: "/producao/dashboard", category: "PRODUÇÃO" },
    { name: "Produção Planejamento", path: "/producao/planejamento", category: "PRODUÇÃO" },
    { name: "Produção Ordens", path: "/producao/ordens-producao", category: "PRODUÇÃO" },
    { name: "Produção Controle", path: "/producao/controle-qualidade", category: "PRODUÇÃO" },
    
    // QUALIDADE
    { name: "Qualidade Dashboard", path: "/qualidade/dashboard", category: "QUALIDADE" },
    { name: "Qualidade Controle", path: "/qualidade/controle", category: "QUALIDADE" },
    { name: "Qualidade Auditorias", path: "/qualidade/auditorias", category: "QUALIDADE" },
    { name: "Qualidade Indicadores", path: "/qualidade/indicadores", category: "QUALIDADE" },
    
    // SUPRIMENTOS
    { name: "Suprimentos Dashboard", path: "/suprimentos/dashboard", category: "SUPRIMENTOS" },
    { name: "Suprimentos Fornecedores", path: "/suprimentos/fornecedores", category: "SUPRIMENTOS" },
    { name: "Suprimentos Materiais", path: "/suprimentos/materiais", category: "SUPRIMENTOS" },
    { name: "Suprimentos Compras", path: "/suprimentos/compras", category: "SUPRIMENTOS" },
    
    // TAREFAS
    { name: "Tarefas Dashboard", path: "/tarefas/dashboard", category: "TAREFAS" },
    { name: "Minhas Tarefas", path: "/tarefas/minhas-tarefas", category: "TAREFAS" },
    { name: "Cadastro de Tarefas", path: "/tarefas/cadastro", category: "TAREFAS" },
    
    // RELATÓRIOS
    { name: "Relatórios Dashboard", path: "/relatorios/dashboard", category: "RELATÓRIOS" },
    { name: "Relatórios ID SMS", path: "/relatorios/idsms", category: "RELATÓRIOS" },
    
    // ADMINISTRAÇÃO
    { name: "Admin Usuários", path: "/admin/usuarios", category: "ADMINISTRAÇÃO" },
    { name: "Admin Perfis", path: "/admin/perfis", category: "ADMINISTRAÇÃO" },
    { name: "Admin Empresas", path: "/admin/empresas", category: "ADMINISTRAÇÃO" },
    { name: "Importação Funcionários", path: "/admin/importacao-funcionarios", category: "ADMINISTRAÇÃO" },
    { name: "Importação Execução Treinamentos", path: "/admin/importacao-execucao-treinamentos", category: "ADMINISTRAÇÃO" },
    { name: "Perfil", path: "/account/profile", category: "CONTA" },
    { name: "Configurações", path: "/account/settings", category: "CONTA" },
  ];

  // Filtrar itens baseado na busca
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return allMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8); // Limitar a 8 resultados
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  return (
    <div className="px-2 py-2">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar menus..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-8 pr-8 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-slate-500"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Resultados da busca */}
        {isSearchOpen && searchTerm && filteredItems.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={clearSearch}
                className="block px-3 py-2 text-sm text-white hover:bg-slate-700 border-b border-slate-700 last:border-b-0"
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-400">{item.category}</div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Mensagem quando não há resultados */}
        {isSearchOpen && searchTerm && filteredItems.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 p-3">
            <div className="text-sm text-gray-400 text-center">
              Nenhum resultado encontrado
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
