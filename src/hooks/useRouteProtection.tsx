import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';

// Mapeamento de rotas para permissões necessárias
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Admin/Sistema
  '/admin/usuarios': ['sistema_usuarios'],
  '/admin/usuarios-auth': ['sistema_usuarios'],
  '/admin/perfis': ['sistema_perfis'],
  '/admin/ccas': ['sistema_ccas'],
  '/admin/empresas': ['sistema_empresas'],
  '/admin/engenheiros': ['sistema_engenheiros'],
  '/admin/supervisores': ['sistema_supervisores'],
  '/admin/funcionarios': ['sistema_funcionarios'],
  '/admin/encarregados': ['sistema_funcionarios'],
  '/admin/logo': ['sistema_logo'],
  '/admin/templates': ['sistema_templates'],
  '/admin/metas-indicadores': ['sistema_metas_indicadores'],
  '/admin/registro-hht': ['sistema_hht'],
  '/admin/checklists': ['sistema_modelos_inspecao'],
  
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