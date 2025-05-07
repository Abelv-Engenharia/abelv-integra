
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface Tarefa {
  id: string;
  descricao: string;
  responsavel: { id: string; nome: string };
  dataConclusao: Date;
  status: string;
  criticidade: string;
}

const getStatusBadge = (status: string) => {
  const styles = {
    'concluida': 'bg-green-100 text-green-800',
    'em-andamento': 'bg-blue-100 text-blue-800',
    'pendente': 'bg-yellow-100 text-yellow-800',
    'programada': 'bg-gray-100 text-gray-800',
  };
  
  return (
    <Badge variant="outline" className={styles[status] || styles['pendente']}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getCriticidadeBadge = (criticidade: string) => {
  const styles = {
    'critica': 'bg-red-100 text-red-800',
    'alta': 'bg-orange-100 text-orange-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'baixa': 'bg-green-100 text-green-800',
  };
  
  return (
    <Badge variant="outline" className={styles[criticidade] || styles['media']}>
      {criticidade}
    </Badge>
  );
};

const TarefasRecentTable = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        // Buscar tarefas do Supabase
        const { data: tarefasData, error } = await supabase
          .from('tarefas')
          .select(`
            id,
            descricao,
            status,
            data_conclusao,
            configuracao,
            responsavel_id
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Erro ao carregar tarefas:', error);
          return;
        }

        // Obter informações dos responsáveis
        const responsaveisIds = tarefasData
          .filter(t => t.responsavel_id)
          .map(t => t.responsavel_id);
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('id', responsaveisIds);
        
        // Mapear para o formato esperado pelo componente
        const formattedTarefas = tarefasData.map(tarefa => {
          // Garantir que configuracao seja tratado corretamente
          let criticidade = 'media';
          if (tarefa.configuracao && typeof tarefa.configuracao === 'object') {
            criticidade = (tarefa.configuracao as any).criticidade || 'media';
          }

          return {
            id: tarefa.id,
            descricao: tarefa.descricao,
            responsavel: {
              id: tarefa.responsavel_id || '',
              nome: profiles?.find(p => p.id === tarefa.responsavel_id)?.nome || 'Não atribuído'
            },
            dataConclusao: tarefa.data_conclusao ? new Date(tarefa.data_conclusao) : new Date(),
            status: tarefa.status || 'pendente',
            criticidade
          };
        });

        setTarefas(formattedTarefas);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarefas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Data Limite</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criticidade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <TableRow key={tarefa.id}>
              <TableCell className="font-medium">{tarefa.descricao}</TableCell>
              <TableCell>{tarefa.responsavel.nome}</TableCell>
              <TableCell>{format(tarefa.dataConclusao, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
              <TableCell>{getStatusBadge(tarefa.status)}</TableCell>
              <TableCell>{getCriticidadeBadge(tarefa.criticidade)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              Nenhuma tarefa encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TarefasRecentTable;
