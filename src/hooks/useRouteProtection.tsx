import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';

// Mapeamento de rotas para permissões necessárias
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Admin/Sistema
  '/admin/usuarios': ['admin_usuarios'],
  '/admin/usuarios-auth': ['admin_usuarios'],
  '/admin/perfis': ['admin_perfis'],
  '/admin/ccas': ['admin_ccas'],
  '/admin/empresas': ['admin_empresas'],
  '/admin/engenheiros': ['admin_engenheiros'],
  '/admin/supervisores': ['admin_supervisores'],
  '/admin/funcionarios': ['admin_funcionarios'],
  '/admin/encarregados': ['admin_funcionarios'],
  '/admin/logo': ['admin_logo'],
  '/admin/templates': ['admin_templates'],
  '/admin/metas-indicadores': ['admin_metas_indicadores'],
  '/admin/registro-hht': ['admin_hht'],
  '/admin/checklists': ['admin_modelos_inspecao'],
  '/admin/importacao-funcionarios': ['admin_funcionarios'],
  '/admin/configuracoes': ['admin_funcionarios'],
  '/admin/configuracao-emails': ['admin_usuarios'],
  '/admin/exportacao-dados': ['admin_usuarios'],
  '/admin/upload-tutorial': ['admin_usuarios'],
  '/admin/importacao-execucao-treinamentos': ['admin_funcionarios'],
  '/admin/importacao-hsa': ['admin_funcionarios'],
  
  // Tarefas
  '/tarefas/dashboard': ['tarefas_dashboard'],
  '/tarefas/cadastro': ['tarefas_cadastro'],
  '/tarefas/minhas-tarefas': ['tarefas_minhas_tarefas'],
  
  // Treinamentos
  '/treinamentos/dashboard': ['treinamentos_dashboard'],
  '/treinamentos/execucao': ['treinamentos_execucao'],
  '/treinamentos/consulta': ['treinamentos_consulta'],
  '/treinamentos/cracha': ['treinamentos_cracha'],
  '/treinamentos/normativo': ['treinamentos_normativo'],
  
  // Desvios
  '/desvios/dashboard': ['desvios_dashboard'],
  '/desvios/cadastro': ['desvios_cadastro'],
  '/desvios/consulta': ['desvios_consulta'],
  '/desvios/nao-conformidade': ['desvios_nao_conformidade'],
  
  // Ocorrências
  '/ocorrencias/dashboard': ['ocorrencias_dashboard'],
  '/ocorrencias/cadastro': ['ocorrencias_cadastro'],
  '/ocorrencias/consulta': ['ocorrencias_consulta'],
  
  // Hora da Segurança
  '/hora-seguranca/dashboard': ['hora_seguranca_dashboard'],
  '/hora-seguranca/inspecoes-cadastro': ['hora_seguranca_cadastro'],
  '/hora-seguranca/inspecoes-acompanhamento': ['hora_seguranca_acompanhamento'],
  '/hora-seguranca/agenda-hsa': ['hora_seguranca_agenda'],
  
  // Relatórios
  '/relatorios/dashboard': ['relatorios_dashboard'],
  
  // Medidas Disciplinares
  '/medidas-disciplinares/dashboard': ['medidas_disciplinares_dashboard'],
  '/medidas-disciplinares/cadastro': ['medidas_disciplinares_cadastro'],
  '/medidas-disciplinares/consulta': ['medidas_disciplinares_consulta'],
  
  // IDSMS
  '/idsms/dashboard': ['idsms_dashboard'],
  '/idsms/indicadores': ['idsms_formularios'],
  
  // Inspeção SMS
  '/inspecao-sms/dashboard': ['inspecao_sms_dashboard'],
  '/inspecao-sms/cadastrar': ['inspecao_sms_cadastro'],
  '/inspecao-sms/consulta': ['inspecao_sms_consulta'],
  
  // GRO
  '/gro/dashboard': ['gro_dashboard'],
  '/gro/cadastro-perigos': ['gro_cadastro'],
  '/gro/consulta': ['gro_consulta'],
  '/gro/pgr': ['gro_pgr'],
  '/gro/avaliacao-riscos': ['gro_avaliacao_riscos']
};

export const useRouteProtection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasMenuAccess, hasPermission, isLoading } = usePermissions();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;
    const requiredPermissions = ROUTE_PERMISSIONS[currentPath];

    if (requiredPermissions) {
      const hasAccess = requiredPermissions.some(permission => 
        hasMenuAccess(permission) || hasPermission(permission)
      );

      if (!hasAccess) {
        console.warn(`Acesso negado para rota: ${currentPath}. Permissões necessárias:`, requiredPermissions);
        
        toast({
          title: "Acesso Negado",
          description: `Você não tem permissão para acessar: ${currentPath}`,
          variant: "destructive",
        });

        // Redirecionar para o dashboard
        navigate('/dashboard', { 
          replace: true,
          state: { unauthorizedAccess: currentPath }
        });

        return;
      }
    }
  }, [location.pathname, hasMenuAccess, hasPermission, isLoading, navigate, toast]);

  return {
    isLoading
  };
};