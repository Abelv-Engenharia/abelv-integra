import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit, RefreshCw, Trash2 } from "lucide-react";
import { getAllOcorrencias, deleteOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import useOverdueActionsMonitor from "@/hooks/useOverdueActionsMonitor";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const OcorrenciasConsulta = () => {
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [ocorrenciaToDeleteId, setOcorrenciaToDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: userCCAs = [], isLoading: ccasLoading } = useUserCCAs();

  // Ativar monitoramento de ações em atraso
  useOverdueActionsMonitor();

  const loadOcorrencias = async () => {
    if (ccasLoading) return;
    
    setLoading(true);
    try {
      const data = await getAllOcorrencias();
      console.log('Ocorrências carregadas:', data);
      
      // Filtrar ocorrências baseado nos CCAs permitidos ao usuário
      if (userCCAs.length > 0) {
        const userCCAIds = userCCAs.map(cca => cca.id.toString());
        const filteredData = data.filter(ocorrencia => 
          userCCAIds.includes(ocorrencia.cca)
        );
        console.log('Ocorrências filtradas por CCA do usuário:', filteredData);
        setOcorrencias(filteredData);
      } else {
        // Se o usuário não tem CCAs permitidos, não mostra nenhuma ocorrência
        setOcorrencias([]);
      }
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      toast.error("Erro ao carregar ocorrências");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOcorrencias();
  }, [userCCAs, ccasLoading]);

  // Recarregar dados quando a página recebe foco (útil quando volta de outras páginas)
  useEffect(() => {
    const handleFocus = () => {
      if (!ccasLoading) {
        loadOcorrencias();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && !ccasLoading) {
        loadOcorrencias();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [ccasLoading]);

  const handleRefresh = () => {
    loadOcorrencias();
  };

  const handleView = (id: string) => {
    navigate(`/ocorrencias/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/ocorrencias/${id}/editar`);
  };

  const handleUpdateStatus = (id: string) => {
    navigate(`/ocorrencias/${id}/atualizar-status`);
  };

  const handleDelete = (id: string) => {
    setOcorrenciaToDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (ocorrenciaToDeleteId) {
      try {
        await deleteOcorrencia(ocorrenciaToDeleteId);
        setOcorrencias(ocorrencias.filter(ocorrencia => ocorrencia.id !== ocorrenciaToDeleteId));
        toast.success("Ocorrência excluída com sucesso!");
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        toast.error("Erro ao excluir ocorrência");
      } finally {
        setDeleteConfirmationOpen(false);
        setOcorrenciaToDeleteId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Consulta de Ocorrências</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => navigate("/ocorrencias/cadastro")}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Ocorrência
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ocorrências Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : ocorrencias.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma ocorrência encontrada para os CCAs autorizados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">CCA</th>
                    <th className="text-left p-2">Empresa</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Risco</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrencias.map((ocorrencia) => (
                    <tr key={ocorrencia.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(ocorrencia.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">
                        {ocorrencia.cca_codigo && ocorrencia.cca_nome 
                          ? `${ocorrencia.cca_codigo} - ${ocorrencia.cca_nome}`
                          : ocorrencia.cca || '-'}
                      </td>
                      <td className="p-2">{ocorrencia.empresa}</td>
                      <td className="p-2">{ocorrencia.tipo_ocorrencia}</td>
                      <td className="p-2">
                        {/* Verificar se há ações atrasadas para mostrar indicador visual */}
                        {(() => {
                          const temAcoesAtrasadas = ocorrencia.acoes && 
                            Array.isArray(ocorrencia.acoes) && 
                            ocorrencia.acoes.some((acao: any) => 
                              acao.status?.toUpperCase() === 'ATRASADO'
                            );
                          
                          return (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                ocorrencia.status === 'Concluído' 
                                  ? 'bg-green-100 text-green-800' 
                                  : ocorrencia.status === 'Em execução'
                                  ? 'bg-blue-100 text-blue-800'
                                  : temAcoesAtrasadas
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {temAcoesAtrasadas ? 'Pendente' : (ocorrencia.status || 'Em tratativa')}
                              </span>
                              {temAcoesAtrasadas && (
                                <span className="text-red-600 text-xs" title="Contém ações em atraso">
                                  ⚠️
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-2">
                        {ocorrencia.classificacao_risco && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            ocorrencia.classificacao_risco === 'TRIVIAL' ? 'bg-blue-100 text-blue-800' :
                            ocorrencia.classificacao_risco === 'TOLERÁVEL' ? 'bg-green-100 text-green-800' :
                            ocorrencia.classificacao_risco === 'MODERADO' ? 'bg-yellow-100 text-yellow-800' :
                            ocorrencia.classificacao_risco === 'SUBSTANCIAL' ? 'bg-orange-100 text-orange-800' :
                            ocorrencia.classificacao_risco === 'INTOLERÁVEL' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ocorrencia.classificacao_risco}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(ocorrencia.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(ocorrencia.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(ocorrencia.id)}
                            title="Atualizar Status"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(ocorrencia.id)}
                            title="Excluir"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta ocorrência? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOcorrenciaToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OcorrenciasConsulta;
