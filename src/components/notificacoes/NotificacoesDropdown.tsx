
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck } from "lucide-react";
import { notificacoesService } from "@/services/notificacoesService";
import { Notificacao } from "@/types/notificacoes";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const NotificacoesDropdown = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const carregarNotificacoes = async () => {
    setLoading(true);
    try {
      const data = await notificacoesService.getNotificacoes();
      setNotificacoes(data);
      
      const count = await notificacoesService.contarNaoLidas();
      setNaoLidas(count);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const marcarComoLida = async (id: string) => {
    try {
      await notificacoesService.marcarComoLida(id);
      carregarNotificacoes();
      toast.success("Notificação marcada como lida");
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      toast.error("Erro ao marcar notificação como lida");
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      await notificacoesService.marcarTodasComoLidas();
      carregarNotificacoes();
      toast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      toast.error("Erro ao marcar todas as notificações como lidas");
    }
  };

  const handleNotificacaoClick = async (notificacao: Notificacao) => {
    // Marcar como lida se não estiver lida
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id);
    }

    // Navegar para a página apropriada baseada no tipo
    switch (notificacao.tipo) {
      case 'tarefa':
        if (notificacao.tarefa_id) {
          navigate(`/tarefas/${notificacao.tarefa_id}`);
        } else {
          navigate('/tarefas/minhas-tarefas');
        }
        break;
      case 'desvio':
        navigate('/desvios/consulta');
        break;
      case 'ocorrencia':
        navigate('/ocorrencias/consulta');
        break;
      case 'treinamento':
        navigate('/treinamentos/consulta');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold">Notificações</h3>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={marcarTodasComoLidas}
              className="h-8 px-2"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Carregando notificações...
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma notificação encontrada
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notificacoes.slice(0, 10).map((notificacao) => (
              <DropdownMenuItem
                key={notificacao.id}
                className={`p-3 cursor-pointer ${
                  !notificacao.lida ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificacaoClick(notificacao)}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notificacao.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notificacao.mensagem}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatarData(notificacao.created_at)}
                      </p>
                    </div>
                    {!notificacao.lida && (
                      <div className="ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            marcarComoLida(notificacao.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificacoesDropdown;
