import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Destinatario {
  id: number;
  obra: string;
  responsavel: string;
  email: string;
  cargo: string;
}

export default function DestinatariosAlimentacao() {
  const [emailsCCA, setEmailsCCA] = useState<string[]>([
    'email1@empresa.com',
    'email2@empresa.com',
    'email3@empresa.com'
  ]);

  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([
    {
      id: 1,
      obra: "CCA 001 - Projeto Alpha",
      responsavel: "João Silva",
      email: "joao.silva@empresa.com",
      cargo: "Coordenador de Obra"
    },
    {
      id: 2,
      obra: "CCA 002 - Projeto Beta",
      responsavel: "Maria Santos",
      email: "maria.santos@empresa.com",
      cargo: "Engenheira Responsável"
    },
    {
      id: 3,
      obra: "CCA 003 - Projeto Gamma",
      responsavel: "Carlos Oliveira",
      email: "carlos.oliveira@empresa.com",
      cargo: "Gerente de Projeto"
    }
  ]);

  const [novoEmailCCA, setNovoEmailCCA] = useState('');
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  
  const [novoDestinatario, setNovoDestinatario] = useState({
    obra: '',
    responsavel: '',
    email: '',
    cargo: ''
  });
  const [openDestinatarioDialog, setOpenDestinatarioDialog] = useState(false);

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleAdicionarEmailCCA = () => {
    if (!novoEmailCCA.trim()) {
      toast.error('Por favor, insira um e-mail');
      return;
    }

    // Process multiple emails (comma or newline separated)
    const emailList = novoEmailCCA.split(/[,\n]/).map(e => e.trim().toLowerCase()).filter(e => e.length > 0);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast.error(`E-mails inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Check for duplicates
    const duplicados = emailList.filter(email => emailsCCA.includes(email));
    if (duplicados.length > 0) {
      toast.error(`E-mails já cadastrados: ${duplicados.join(', ')}`);
      return;
    }

    setEmailsCCA([...emailsCCA, ...emailList]);
    setNovoEmailCCA('');
    setOpenEmailDialog(false);
    toast.success(`${emailList.length} e-mail(s) adicionado(s) com sucesso`);
  };

  const handleExcluirEmailCCA = (email: string) => {
    setEmailsCCA(emailsCCA.filter(e => e !== email));
    toast.success('E-mail removido com sucesso');
  };

  const handleAdicionarDestinatario = () => {
    if (!novoDestinatario.obra || !novoDestinatario.responsavel || !novoDestinatario.email || !novoDestinatario.cargo) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // Process multiple emails (comma or newline separated)
    const emailList = novoDestinatario.email.split(/[,\n]/).map(e => e.trim().toLowerCase()).filter(e => e.length > 0);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast.error(`E-mails inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Check for duplicates
    const duplicados = emailList.filter(email => 
      destinatarios.some(d => d.obra === novoDestinatario.obra && d.email === email)
    );
    if (duplicados.length > 0) {
      toast.error(`E-mails já cadastrados: ${duplicados.join(', ')}`);
      return;
    }

    // Add new recipients
    const newId = destinatarios.length > 0 ? Math.max(...destinatarios.map(d => d.id)) + 1 : 1;
    const novosDestinatarios = emailList.map((email, index) => ({
      id: newId + index,
      obra: novoDestinatario.obra,
      responsavel: novoDestinatario.responsavel,
      email: email,
      cargo: novoDestinatario.cargo
    }));

    setDestinatarios([...destinatarios, ...novosDestinatarios]);
    setNovoDestinatario({ obra: '', responsavel: '', email: '', cargo: '' });
    setOpenDestinatarioDialog(false);
    toast.success(`${novosDestinatarios.length} destinatário(s) adicionado(s) com sucesso`);
  };

  const handleExcluirDestinatario = (id: number) => {
    setDestinatarios(destinatarios.filter(d => d.id !== id));
    toast.success('Destinatário removido com sucesso');
  };
  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuração de Destinatários - Alimentação</h1>
            <p className="text-muted-foreground">Cadastro de responsáveis por obra para recebimento de alertas de alimentação</p>
          </div>
        </div>

        {/* Destinatários CCA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Destinatários CCA
            </CardTitle>
            <CardDescription>
              Lista de destinatários para alertas gerais do sistema de alimentação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar E-mail
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar E-mail CCA</DialogTitle>
                    <DialogDescription>
                      Adicione um novo e-mail para receber alertas gerais do sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-cca">E-mail(s)</Label>
                      <Textarea
                        id="email-cca"
                        placeholder="email1@exemplo.com, email2@exemplo.com&#10;ou um por linha"
                        value={novoEmailCCA}
                        onChange={(e) => setNovoEmailCCA(e.target.value)}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separe múltiplos e-mails por vírgula ou quebra de linha
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenEmailDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAdicionarEmailCCA}>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailsCCA.map((email, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{email}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExcluirEmailCCA(email)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuração de Destinatários
            </CardTitle>
            <CardDescription>
              Cadastro de responsáveis por obra para recebimento de alertas de alimentação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={openDestinatarioDialog} onOpenChange={setOpenDestinatarioDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Adicionar Destinatário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Destinatário</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo responsável por obra para recebimento de alertas de alimentação
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="obra">Obra/CCA</Label>
                      <Input
                        id="obra"
                        placeholder="CCA 001 - Nome do Projeto"
                        value={novoDestinatario.obra}
                        onChange={(e) => setNovoDestinatario({ ...novoDestinatario, obra: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável</Label>
                      <Input
                        id="responsavel"
                        placeholder="Nome do responsável"
                        value={novoDestinatario.responsavel}
                        onChange={(e) => setNovoDestinatario({ ...novoDestinatario, responsavel: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-dest">E-mail(s)</Label>
                      <Textarea
                        id="email-dest"
                        placeholder="email1@exemplo.com, email2@exemplo.com&#10;ou um por linha"
                        value={novoDestinatario.email}
                        onChange={(e) => setNovoDestinatario({ ...novoDestinatario, email: e.target.value })}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Separe múltiplos e-mails por vírgula ou quebra de linha
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        placeholder="Cargo do responsável"
                        value={novoDestinatario.cargo}
                        onChange={(e) => setNovoDestinatario({ ...novoDestinatario, cargo: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDestinatarioDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAdicionarDestinatario}>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obra/CCA</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinatarios.map((destinatario) => (
                    <TableRow key={destinatario.id}>
                      <TableCell className="font-medium">{destinatario.obra}</TableCell>
                      <TableCell>{destinatario.responsavel}</TableCell>
                      <TableCell className="font-mono text-sm">{destinatario.email}</TableCell>
                      <TableCell>{destinatario.cargo}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleExcluirDestinatario(destinatario.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
