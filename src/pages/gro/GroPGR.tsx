import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import PGRMedidasForm from "@/components/gro/PGRMedidasForm";
import { toast } from "@/hooks/use-toast";
import { PGRDashboardIndicadores } from "@/components/gro/PGRDashboardIndicadores";

type Plano = {
  id: string;
  nome: string;
  descricao?: string;
  criado_em: string;
};

export default function GroPGR() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregarPlanos() {
    setCarregando(true);
    const { data, error } = await supabase
      .from('pgr_planos')
      .select('*')
      .order('criado_em', { ascending: false });
    if (data) setPlanos(data);
    if (error) {
      toast({
        title: 'Erro ao listar PGRs',
        description: error.message,
        variant: 'destructive',
      });
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function criarPGR(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('pgr_planos')
      .insert([{ nome, descricao }])
      .select()
      .single();

    if (data) {
      toast({
        title: 'Plano criado!',
        description: data.nome,
        variant: 'default',
      });
      setNome('');
      setDescricao('');
      carregarPlanos();
    } else if (error) {
      toast({
        title: 'Erro ao criar Plano',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <PGRDashboardIndicadores />

      <h1 className="text-2xl font-bold mb-2">Programa de Gerenciamento de Riscos (PGR)</h1>
      <p className="mb-6 text-muted-foreground">
        Acompanhe o Plano de Ação com cadastro de medidas de controle para cada risco identificado.
      </p>
      <Card className="p-5 mb-8">
        <form className="flex flex-col gap-3" onSubmit={criarPGR}>
          <Input
            placeholder="Nome do Plano (ex: PGR - Oficina 2025)"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <Textarea
            placeholder="Descrição, finalidade ou considerações..."
            rows={2}
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
          <Button type="submit" disabled={!nome}>
            Criar Novo PGR
          </Button>
        </form>
      </Card>

      <h2 className="font-semibold mb-2 text-lg">Planos Cadastrados</h2>
      {carregando && <div>Carregando...</div>}
      <div className="space-y-5">
        {planos.map((plano) => (
          <Card key={plano.id} className="p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <div className="font-bold">{plano.nome}</div>
                <div className="text-xs text-muted-foreground">
                  Criado em {new Date(plano.criado_em).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              {plano.descricao}
            </div>
            <PGRMedidasForm planoId={plano.id} />
          </Card>
        ))}
        {planos.length === 0 && !carregando && (
          <div className="text-sm text-muted-foreground">Nenhum plano cadastrado ainda.</div>
        )}
      </div>
    </div>
  );
}
