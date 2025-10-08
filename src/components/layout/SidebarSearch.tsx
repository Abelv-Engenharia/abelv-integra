import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";

type MenuItem = {
  name: string;
  path: string;
  category: string;
  slug: string; // <-- usado para checar permissão
};

export default function SidebarSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { hasPermission } = usePermissionsDirect();

  // Predicado de permissão baseado no sistema direto
  const canSee = (slug: string) => hasPermission(slug);

  // Todos os itens de menu disponíveis (agora com slug correspondente ao menus_sidebar)
  const allMenuItems: MenuItem[] = [
    // Dashboard
    { name: "Dashboard", path: "/dashboard", category: "Dashboard", slug: "dashboard" },

    // SMS / Desvios
    { name: "Dashboard SMS", path: "/sms/dashboard", category: "SMS", slug: "sms_dashboard" },
    { name: "Desvios Dashboard", path: "/desvios/dashboard", category: "SMS", slug: "desvios_dashboard" },
    { name: "Desvios Cadastro", path: "/desvios/cadastro", category: "SMS", slug: "desvios_cadastro" },
    { name: "Desvios Consulta", path: "/desvios/consulta", category: "SMS", slug: "desvios_consulta" },
    { name: "Desvios Não Conformidade", path: "/desvios/nao-conformidade", category: "SMS", slug: "desvios_nao_conformidade" },

    // Treinamentos
    { name: "Treinamentos Dashboard", path: "/treinamentos/dashboard", category: "SMS", slug: "treinamentos_dashboard" },
    { name: "Treinamentos Execução", path: "/treinamentos/execucao", category: "SMS", slug: "treinamentos_execucao" },
    { name: "Treinamentos Consulta", path: "/treinamentos/consulta", category: "SMS", slug: "treinamentos_consulta" },
    { name: "Treinamentos Normativo", path: "/treinamentos/normativo", category: "SMS", slug: "treinamentos_normativo" },
    { name: "Treinamentos Crachá", path: "/treinamentos/cracha", category: "SMS", slug: "treinamentos_cracha" },

    // Hora da Segurança
    { name: "HSA Dashboard", path: "/hora-seguranca/dashboard", category: "SMS", slug: "hora_seguranca_dashboard" },
    { name: "HSA Cadastro", path: "/hora-seguranca/inspecao-cadastro-hsa", category: "SMS", slug: "hora_seguranca_inspecoes_cadastro" },
    { name: "HSA Agenda", path: "/hora-seguranca/agenda-hsa", category: "SMS", slug: "hora_seguranca_agenda_hsa" },
    { name: "HSA Acompanhamento", path: "/hora-seguranca/inspecoes-acompanhamento", category: "SMS", slug: "hora_seguranca_inspecoes_acompanhamento" },
    { name: "HSA Não Programada", path: "/hora-seguranca/inspecao-nao-programada-hsa", category: "SMS", slug: "hora_seguranca_inspecoes_nao_programadas" },
    { name: "Hora da Segurança", path: "/inspecao-sms/hora-seguranca", category: "SMS", slug: "inspecao_sms_cadastrar" },
    { name: "Painel Execução HSA", path: "/hora-seguranca/painel-execucao-hsa", category: "SMS", slug: "hora_seguranca_painel_execucao" },

    // IDSMS
    { name: "IDSMS Dashboard", path: "/idsms/dashboard", category: "SMS", slug: "idsms_dashboard" },
    { name: "IDSMS Indicadores", path: "/idsms/indicadores", category: "SMS", slug: "idsms_indicadores" },
    { name: "IDSMS HT", path: "/idsms/ht", category: "SMS", slug: "idsms_ht" },
    { name: "IDSMS HSA", path: "/idsms/hsa", category: "SMS", slug: "idsms_hsa" },
    { name: "IDSMS IID", path: "/idsms/iid", category: "SMS", slug: "idsms_iid" },
    { name: "IDSMS IPOM", path: "/idsms/ipom", category: "SMS", slug: "idsms_ipom" },
    { name: "IDSMS Índice Reativo", path: "/idsms/indice-reativo", category: "SMS", slug: "idsms_indice_reativo" },
    { name: "IDSMS Inspeção Alta Liderança", path: "/idsms/inspecao-alta-lideranca", category: "SMS", slug: "idsms_inspecao_alta_lideranca" },
    { name: "IDSMS Inspeção Gestão SMS", path: "/idsms/inspecao-gestao-sms", category: "SMS", slug: "idsms_inspecao_gestao_sms" },

    // Inspeção SMS
    { name: "Inspeção SMS Dashboard", path: "/inspecao-sms/dashboard", category: "SMS", slug: "inspecao_sms_dashboard" },
    { name: "Inspeção SMS Cadastro", path: "/inspecao-sms/cadastrar", category: "SMS", slug: "inspecao_sms_cadastrar" },
    { name: "Inspeção SMS Consulta", path: "/inspecao-sms/consulta", category: "SMS", slug: "inspecao_sms_consulta" },

    // Ocorrências
    { name: "Ocorrências Dashboard", path: "/ocorrencias/dashboard", category: "SMS", slug: "ocorrencias_dashboard" },
    { name: "Ocorrências Cadastro", path: "/ocorrencias/cadastro", category: "SMS", slug: "ocorrencias_cadastro" },
    { name: "Ocorrências Consulta", path: "/ocorrencias/consulta", category: "SMS", slug: "ocorrencias_consulta" },

    // Medidas Disciplinares
    { name: "Medidas Disciplinares Dashboard", path: "/medidas-disciplinares/dashboard", category: "SMS", slug: "medidas_disciplinares_dashboard" },
    { name: "Medidas Disciplinares Cadastro", path: "/medidas-disciplinares/cadastro", category: "SMS", slug: "medidas_disciplinares_cadastro" },
    { name: "Medidas Disciplinares Consulta", path: "/medidas-disciplinares/consulta", category: "SMS", slug: "medidas_disciplinares_consulta" },

    // GRO
    { name: "GRO Dashboard", path: "/gro/dashboard", category: "SMS", slug: "gro_dashboard" },
    { name: "GRO Cadastro Perigos", path: "/gro/cadastro-perigos", category: "SMS", slug: "gro_cadastro_perigos" },
    { name: "GRO Avaliação Riscos", path: "/gro/avaliacao-riscos", category: "SMS", slug: "gro_avaliacao_riscos" },
    { name: "GRO PGR", path: "/gro/pgr", category: "SMS", slug: "gro_pgr" },
    { name: "GRO Cadastro", path: "/gro/cadastro", category: "SMS", slug: "gro_cadastro" },
    { name: "GRO Consulta", path: "/gro/consulta", category: "SMS", slug: "gro_consulta" },

    // Prevenção Incêndio
    { name: "Prevenção Incêndio Dashboard", path: "/prevencao-incendio/dashboard", category: "SMS", slug: "prevencao_incendio_dashboard" },
    { name: "Cadastro Extintores", path: "/prevencao-incendio/cadastro-extintores", category: "SMS", slug: "prevencao_incendio_cadastro_extintores" },
    { name: "Inspeção Extintores", path: "/prevencao-incendio/inspecao-extintores", category: "SMS", slug: "prevencao_incendio_inspecao_extintores" },
    { name: "Consulta Inspeções", path: "/prevencao-incendio/consulta-inspecoes", category: "SMS", slug: "prevencao_incendio_consulta_inspecoes" },

    // TAREFAS
    { name: "Tarefas Dashboard", path: "/tarefas/dashboard", category: "TAREFAS", slug: "tarefas_dashboard" },
    { name: "Minhas Tarefas", path: "/tarefas/minhas-tarefas", category: "TAREFAS", slug: "tarefas_minhas_tarefas" },
    { name: "Cadastro de Tarefas", path: "/tarefas/cadastro", category: "TAREFAS", slug: "tarefas_cadastro" },

    // RELATÓRIOS
    { name: "Relatórios Dashboard", path: "/relatorios/dashboard", category: "RELATÓRIOS", slug: "relatorios_dashboard" },
    { name: "Relatórios IDSMS", path: "/relatorios/idsms", category: "RELATÓRIOS", slug: "relatorios_idsms" },
    { name: "Relatórios HSA", path: "/relatorios/hsa", category: "RELATÓRIOS", slug: "relatorios_hsa" },
    { name: "Relatórios Ocorrências", path: "/relatorios/ocorrencias", category: "RELATÓRIOS", slug: "relatorios_ocorrencias" },
    { name: "Relatórios Desvios", path: "/relatorios/desvios", category: "RELATÓRIOS", slug: "relatorios_desvios" },
    { name: "Relatórios Treinamentos", path: "/relatorios/treinamentos", category: "RELATÓRIOS", slug: "relatorios_treinamentos" },

    // SEGURANÇA
    { name: "Administradores Sistema", path: "/admin/admin-sistema", category: "SEGURANÇA", slug: "admin_sistema" },
    { name: "Perfis de Acesso", path: "/admin/perfis", category: "SEGURANÇA", slug: "admin_perfis" },
    { name: "Associar Perfis", path: "/admin/usuarios-perfis", category: "SEGURANÇA", slug: "admin_usuarios_perfis" },
    { name: "Gerenciar CCAs", path: "/admin/usuarios-ccas", category: "SEGURANÇA", slug: "admin_usuarios_ccas" },
    { name: "Usuários", path: "/admin/usuarios-direct", category: "SEGURANÇA", slug: "admin_usuarios" },
    { name: "Criar Usuário", path: "/admin/criar-usuario-direct", category: "SEGURANÇA", slug: "admin_criar_usuario" },

    // APOIO GERAL
    { name: "Empresas", path: "/admin/empresas", category: "APOIO GERAL", slug: "admin_empresas" },
    { name: "CCAs", path: "/admin/ccas", category: "APOIO GERAL", slug: "admin_ccas" },
    { name: "Unidades de Medidas", path: "/admin/unidades-medidas", category: "APOIO GERAL", slug: "admin_unidades_medidas" },

    // ADMINISTRAÇÃO
    { name: "Engenheiros", path: "/admin/engenheiros", category: "ADMINISTRAÇÃO", slug: "admin_engenheiros" },
    { name: "Supervisores", path: "/admin/supervisores", category: "ADMINISTRAÇÃO", slug: "admin_supervisores" },
    { name: "Encarregados", path: "/admin/encarregados", category: "ADMINISTRAÇÃO", slug: "admin_encarregados" },
    { name: "Funcionários", path: "/admin/funcionarios", category: "ADMINISTRAÇÃO", slug: "admin_funcionarios" },
    { name: "Upload Tutoriais", path: "/admin/upload-tutoriais", category: "ADMINISTRAÇÃO", slug: "upload_tutoriais" },
    { name: "Configuração Emails", path: "/admin/configuracao-emails", category: "ADMINISTRAÇÃO", slug: "configuracao_emails" },
    { name: "Checklists", path: "/admin/checklists", category: "ADMINISTRAÇÃO", slug: "admin_checklists" },
    { name: "Templates", path: "/admin/templates", category: "ADMINISTRAÇÃO", slug: "admin_templates" },
    { name: "Logo", path: "/admin/logo", category: "ADMINISTRAÇÃO", slug: "admin_logo" },
    { name: "Registro HHT", path: "/admin/registro-hht", category: "ADMINISTRAÇÃO", slug: "admin_registro_hht" },
    { name: "Metas & Indicadores", path: "/admin/metas-indicadores", category: "ADMINISTRAÇÃO", slug: "admin_metas_indicadores" },
    { name: "Exportação de Dados", path: "/admin/exportacao-dados", category: "ADMINISTRAÇÃO", slug: "admin_exportacao_dados" },
    
    // IMPORTAÇÃO DE DADOS
    { name: "Importação Funcionários", path: "/admin/importacao/funcionarios", category: "IMPORTAÇÃO", slug: "admin_importacao_funcionarios" },
    { name: "Importação Treinamentos", path: "/admin/importacao/execucao-treinamentos", category: "IMPORTAÇÃO", slug: "admin_importacao_execucao_treinamentos" },
    { name: "Importação Desvios", path: "/admin/importacao/desvios", category: "IMPORTAÇÃO", slug: "admin_importacao_desvios" },
    { name: "Importação Ocorrências", path: "/admin/importacao/ocorrencias", category: "IMPORTAÇÃO", slug: "admin_importacao_ocorrencias" },
    { name: "Importação HHT", path: "/admin/importacao/hht", category: "IMPORTAÇÃO", slug: "admin_importacao_hht" },

    // Comunicados
    { name: "Comunicados Cadastro", path: "/admin/comunicados/cadastro", category: "COMUNICADOS", slug: "comunicados_cadastro" },
    { name: "Comunicados Consulta", path: "/admin/comunicados/consulta", category: "COMUNICADOS", slug: "comunicados_consulta" },
    { name: "Meus Comunicados", path: "/comunicados/meus-comunicados", category: "COMUNICADOS", slug: "comunicados_meus_comunicados" },

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
  }, [searchTerm, hasPermission]);

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