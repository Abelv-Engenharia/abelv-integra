
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { tarefasService } from "@/services/tarefasService";

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
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const data = await tarefasService.getRecentTasks(5);
        setTarefas(data);
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
              <TableCell>{tarefa.responsaveis?.map(r => r.nome).join(', ') || 'Sem responsável'}</TableCell>
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
