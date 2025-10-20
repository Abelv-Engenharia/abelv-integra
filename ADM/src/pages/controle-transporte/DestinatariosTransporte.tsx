import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DestinatariosTransporte() {
  const [destinatarios, setDestinatarios] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ccaCodigo, setCcaCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDestinatarios();
  }, []);

  const carregarDestinatarios = async () => {
    try {
      const { data, error } = await supabase
        .from('destinatarios_transporte')
        .select('*')
        .order('nome');

      if (error) throw error;
      setDestinatarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar destinatários:', error);
      toast.error('Erro ao carregar destinatários');
    }
  };

  const handleAdicionar = async () => {
    if (!nome || !email || !ccaCodigo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('destinatarios_transporte')
        .insert({
          nome,
          email,
          cca_codigo: ccaCodigo,
          ativo: true
        });

      if (error) throw error;

      toast.success('Destinatário adicionado com sucesso');
      setNome('');
      setEmail('');
      setCcaCodigo('');
      carregarDestinatarios();
    } catch (error) {
      console.error('Erro ao adicionar destinatário:', error);
      toast.error('Erro ao adicionar destinatário');
    } finally {
      setLoading(false);
    }
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este destinatário?')) return;

    try {
      const { error } = await supabase
        .from('destinatarios_transporte')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Destinatário removido com sucesso');
      carregarDestinatarios();
    } catch (error) {
      console.error('Erro ao remover destinatário:', error);
      toast.error('Erro ao remover destinatário');
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('destinatarios_transporte')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Destinatário ${!ativo ? 'ativado' : 'desativado'} com sucesso`);
      carregarDestinatarios();
    } catch (error) {
      console.error('Erro ao atualizar destinatário:', error);
      toast.error('Erro ao atualizar destinatário');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Destinatários - Transporte</h1>
        <p className="text-muted-foreground">
          Gerenciar destinatários dos alertas de medição de transporte por CCA
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Destinatário
          </CardTitle>
          <CardDescription>
            Cada destinatário receberá alertas no dia 1º de cada mês para lançar a medição do seu CCA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-red-500">Nome *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className={!nome ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-red-500">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className={!email ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cca" className="text-red-500">Cca *</Label>
              <Select value={ccaCodigo} onValueChange={setCcaCodigo}>
                <SelectTrigger className={!ccaCodigo ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Selecionar CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24021">Abelv 24021 - Rousselot - Canindé</SelectItem>
                  <SelectItem value="24022">Abelv 24022 - Obra Beta</SelectItem>
                  <SelectItem value="24023">Abelv 24023 - Obra Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleAdicionar} disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Destinatários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cca</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinatarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum destinatário cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                destinatarios.map((dest) => (
                  <TableRow key={dest.id}>
                    <TableCell className="font-medium">{dest.nome}</TableCell>
                    <TableCell>{dest.email}</TableCell>
                    <TableCell>{dest.cca_codigo}</TableCell>
                    <TableCell>
                      <Badge variant={dest.ativo ? "default" : "secondary"}>
                        {dest.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAtivo(dest.id, dest.ativo)}
                        >
                          {dest.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemover(dest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}