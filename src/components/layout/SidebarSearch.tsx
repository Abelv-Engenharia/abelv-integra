import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type MenuItem = {
  name: string;
  path: string;
  category: string;
  slug: string; // <-- usado para checar permissão
};

type Props = {
  menusSidebar?: string[];
};

export default function SidebarSearch({ menusSidebar = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Predicado de permissão baseado no whitelist menus_sidebar
  const canSee = useMemo(() => {
    const set = new Set(menusSidebar ?? []);
    return (slug: string) => set.has(slug);
  }, [menusSidebar]);

  // Todos os itens de menu disponíveis (agora com slug correspondente ao menus_sidebar)
  const allMenuItems: MenuItem[] = [
    // Dashboard
    { name: "Dashboard", path: "/dashboard", category: "Dashboard", slug: "dashboard" },

    // SMS / Desvios
    { name: "Desvios Dashboard", path: "/desvios/dashboard", category: "SMS", slug: "desvios_dashboard" },
    { name: "Desvios Cadastro", path: "/desvios/cadastro", category: "SMS", slug: "desvios_cadastro" },

    // Treinamentos
    { name: "Treinamentos Dashboard", path: "/treinamentos/dashboard", category: "SMS", slug: "treinamentos_dashboard" },
    { name: "Treinamentos Execução", path: "/treinamentos/execucao", category: "SMS", slug: "treinamentos_execucao" },

    // Hora de Segurança
    { name: "Hora Segurança Dashboard", path: "/hora-seguranca/dashboard", category: "SMS", slug: "hora_seguranca_dashboard" },

    // Inspeção SMS
    { name: "Inspeção SMS Dashboard", path: "/inspecao-sms/dashboard", category: "SMS", slug: "inspecao_sms_dashboard" },

    // Ocorrências
    { name: "Ocorrências Dashboard", path: "/ocorrencias/dashboard", category: "SMS", slug: "ocorrencias_dashboard" },

    // Medidas Disciplinares
    { name: "Medidas Disciplinares Dashboard", path: "/medidas-disciplinares/dashboard", category: "SMS", slug: "medidas_disciplinares_dashboard" },

    // ADM MATRICIAL (slugs “adm_*”, como no seu JSON)
    { name: "ADM Dashboard", path: "/adm/dashboard", category: "ADM MATRICIAL", slug: "adm_dashboard" },
    { name: "ADM Configurações", path: "/adm/configuracoes", category: "ADM MATRICIAL", slug: "adm_configuracoes" },
    { name: "ADM Usuários", path: "/adm/usuarios", category: "ADM MATRICIAL", slug: "adm_usuarios" },
    { name: "ADM Empresas", path: "/adm/empresas", category: "ADM MATRICIAL", slug: "adm_empresas" },
    { name: "ADM Perfis", path: "/admin/usuarios-direct", category: "ADM MATRICIAL", slug: "admin_usuarios" },

    // ORÇAMENTOS
    { name: "Orçamentos Dashboard", path: "/orcamentos/dashboard", category: "ORÇAMENTOS", slug: "orcamentos_dashboard" },
    { name: "Orçamentos Projetos", path: "/orcamentos/projetos", category: "ORÇAMENTOS", slug: "orcamentos_projetos" },
    { name: "Orçamentos Custos", path: "/orcamentos/custos", category: "ORÇAMENTOS", slug: "orcamentos_custos" },
    { name: "Orçamentos Análises", path: "/orcamentos/analises", category: "ORÇAMENTOS", slug: "orcamentos_analises" },

    // PRODUÇÃO
    { name: "Produção Dashboard", path: "/producao/dashboard", category: "PRODUÇÃO", slug: "producao_dashboard" },
    { name: "Produção Planejamento", path: "/producao/planejamento", category: "PRODUÇÃO", slug: "producao_planejamento" },
    { name: "Produção Ordens", path: "/producao/ordens-producao", category: "PRODUÇÃO", slug: "producao_ordens_producao" },
    { name: "Produção Controle", path: "/producao/controle-qualidade", category: "PRODUÇÃO", slug: "producao_controle_qualidade" },

    // QUALIDADE
    { name: "Qualidade Dashboard", path: "/qualidade/dashboard", category: "QUALIDADE", slug: "qualidade_dashboard" },
    { name: "Qualidade Controle", path: "/qualidade/controle", category: "QUALIDADE", slug: "qualidade_controle" },
    { name: "Qualidade Auditorias", path: "/qualidade/auditorias", category: "QUALIDADE", slug: "qualidade_auditorias" },
    { name: "Qualidade Indicadores", path: "/qualidade/indicadores", category: "QUALIDADE", slug: "qualidade_indicadores" },

    // SUPRIMENTOS
    { name: "Suprimentos Dashboard", path: "/suprimentos/dashboard", category: "SUPRIMENTOS", slug: "suprimentos_dashboard" },
    { name: "Suprimentos Fornecedores", path: "/suprimentos/fornecedores", category: "SUPRIMENTOS", slug: "suprimentos_fornecedores" },
    { name: "Suprimentos Materiais", path: "/suprimentos/materiais", category: "SUPRIMENTOS", slug: "suprimentos_materiais" },
    { name: "Suprimentos Compras", path: "/suprimentos/compras", category: "SUPRIMENTOS", slug: "suprimentos_compras" },

    // TAREFAS
    { name: "Tarefas Dashboard", path: "/tarefas/dashboard", category: "TAREFAS", slug: "tarefas_dashboard" },
    { name: "Minhas Tarefas", path: "/tarefas/minhas-tarefas", category: "TAREFAS", slug: "tarefas_minhas_tarefas" },
    { name: "Cadastro de Tarefas", path: "/tarefas/cadastro", category: "TAREFAS", slug: "tarefas_cadastro" },

    // RELATÓRIOS
    { name: "Relatórios Dashboard", path: "/relatorios/dashboard", category: "RELATÓRIOS", slug: "relatorios_dashboard" },
    { name: "Relatórios ID SMS", path: "/relatorios/idsms", category: "RELATÓRIOS", slug: "relatorios_idsms" },

    // ADMINISTRAÇÃO (slugs “admin_*”, como no seu JSON)
    { name: "Admin Usuários", path: "/admin/usuarios-direct", category: "ADMINISTRAÇÃO", slug: "admin_usuarios" },
    { name: "Admin Empresas", path: "/admin/empresas", category: "ADMINISTRAÇÃO", slug: "admin_empresas" },
    { name: "Importação Funcionários", path: "/admin/importacao-funcionarios", category: "ADMINISTRAÇÃO", slug: "admin_importacao_funcionarios" },
    { name: "Importação Execução Treinamentos", path: "/admin/importacao-execucao-treinamentos", category: "ADMINISTRAÇÃO", slug: "admin_importacao_execucao_treinamentos" },

    // Conta
    { name: "Perfil", path: "/account/profile", category: "CONTA", slug: "account_profile" },
    { name: "Configurações", path: "/account/settings", category: "CONTA", slug: "account_settings" },
  ];

  // Filtrar por permissão + termo buscado
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];

    // 1) aplica whitelist
    const permitted = allMenuItems.filter((i) => canSee(i.slug));

    // 2) aplica busca (nome ou categoria)
    return permitted
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8); // limitar a 8 resultados
  }, [searchTerm, canSee]);

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

        {/* Resultados */}
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

        {/* Sem resultados */}
        {isSearchOpen && searchTerm && filteredItems.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 p-3">
            <div className="text-sm text-gray-400 text-center">Nenhum resultado encontrado</div>
          </div>
        )}
      </div>
    </div>
  );
}
