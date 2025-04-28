
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockTarefas = [
  {
    id: '1',
    descricao: 'Revisão do procedimento de segurança',
    responsavel: { id: '1', nome: 'João Silva' },
    dataConclusao: new Date('2025-05-10'),
    status: 'pendente',
    criticidade: 'alta'
  },
  {
    id: '2',
    descricao: 'Treinamento da equipe técnica',
    responsavel: { id: '2', nome: 'Maria Santos' },
    dataConclusao: new Date('2025-05-08'),
    status: 'em-andamento',
    criticidade: 'media'
  },
  {
    id: '3',
    descricao: 'Atualização do manual de operações',
    responsavel: { id: '3', nome: 'Pedro Costa' },
    dataConclusao: new Date('2025-05-05'),
    status: 'concluida',
    criticidade: 'baixa'
  },
  {
    id: '4',
    descricao: 'Inspeção dos equipamentos',
    responsavel: { id: '4', nome: 'Ana Oliveira' },
    dataConclusao: new Date('2025-05-15'),
    status: 'programada',
    criticidade: 'critica'
  },
  {
    id: '5',
    descricao: 'Reunião com fornecedores de EPI',
    responsavel: { id: '5', nome: 'Carlos Pereira' },
    dataConclusao: new Date('2025-05-12'),
    status: 'pendente',
    criticidade: 'media'
  }
];

const getStatusBadge = (status) => {
  const styles = {
    'concluida': 'bg-green-100 text-green-800',
    'em-andamento': 'bg-blue-100 text-blue-800',
    'pendente': 'bg-yellow-100 text-yellow-800',
    'programada': 'bg-gray-100 text-gray-800',
  };
  
  return (
    <Badge variant="outline" className={styles[status]}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

const getCriticidadeBadge = (criticidade) => {
  const styles = {
    'critica': 'bg-red-100 text-red-800',
    'alta': 'bg-orange-100 text-orange-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'baixa': 'bg-green-100 text-green-800',
  };
  
  return (
    <Badge variant="outline" className={styles[criticidade]}>
      {criticidade}
    </Badge>
  );
};

const TarefasRecentTable = () => {
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
        {mockTarefas.map((tarefa) => (
          <TableRow key={tarefa.id}>
            <TableCell className="font-medium">{tarefa.descricao}</TableCell>
            <TableCell>{tarefa.responsavel.nome}</TableCell>
            <TableCell>{format(tarefa.dataConclusao, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
            <TableCell>{getStatusBadge(tarefa.status)}</TableCell>
            <TableCell>{getCriticidadeBadge(tarefa.criticidade)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TarefasRecentTable;
