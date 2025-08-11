
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MetaIndicador {
  id?: string;
  ano: number;
  meta_taxa_frequencia_ac_cpd: number;
  meta_taxa_frequencia_ac_spd: number;
  meta_taxa_gravidade: number;
}

const MetasIndicadores = () => {
  const { toast } = useToast();
  const [metas, setMetas] = useState<MetaIndicador[]>([]);
  const [novaMetaAno, setNovaMetaAno] = useState<number>(new Date().getFullYear());
  const [novaMetaAcCpd, setNovaMetaAcCpd] = useState<number>(0);
  const [novaMetaAcSpd, setNovaMetaAcSpd] = useState<number>(0);
  const [novaMetaGravidade, setNovaMetaGravidade] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarMetas();
  }, []);

  const carregarMetas = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('metas_indicadores')
        .select('*')
        .order('ano', { ascending: false });

      if (error) throw error;
      setMetas(data || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar metas dos indicadores",
        variant: "destructive"
      });
    }
  };

  const salvarMeta = async () => {
    if (!novaMetaAno) {
      toast({
        title: "Erro",
        description: "Ano é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const metaExistente = metas.find(m => m.ano === novaMetaAno);
      
      if (metaExistente) {
        // Atualizar meta existente
        const { error } = await (supabase as any)
          .from('metas_indicadores')
          .update({
            meta_taxa_frequencia_ac_cpd: novaMetaAcCpd,
            meta_taxa_frequencia_ac_spd: novaMetaAcSpd,
            meta_taxa_gravidade: novaMetaGravidade
          })
          .eq('id', metaExistente.id);

        if (error) throw error;
      } else {
        // Criar nova meta
        const { error } = await (supabase as any)
          .from('metas_indicadores')
          .insert({
            ano: novaMetaAno,
            meta_taxa_frequencia_ac_cpd: novaMetaAcCpd,
            meta_taxa_frequencia_ac_spd: novaMetaAcSpd,
            meta_taxa_gravidade: novaMetaGravidade
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Meta salva com sucesso"
      });

      // Limpar formulário
      setNovaMetaAno(new Date().getFullYear() + 1);
      setNovaMetaAcCpd(0);
      setNovaMetaAcSpd(0);
      setNovaMetaGravidade(0);
      
      // Recarregar metas
      carregarMetas();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar meta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const excluirMeta = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('metas_indicadores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Meta excluída com sucesso"
      });

      carregarMetas();
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir meta",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Metas de Indicadores</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={novaMetaAno}
                onChange={(e) => setNovaMetaAno(parseInt(e.target.value))}
                min={2020}
                max={2050}
              />
            </div>

            <div>
              <Label htmlFor="metaAcCpd">Meta Taxa Frequência AC CPD</Label>
              <Input
                id="metaAcCpd"
                type="number"
                step="0.01"
                value={novaMetaAcCpd}
                onChange={(e) => setNovaMetaAcCpd(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="metaAcSpd">Meta Taxa Frequência AC SPD</Label>
              <Input
                id="metaAcSpd"
                type="number"
                step="0.01"
                value={novaMetaAcSpd}
                onChange={(e) => setNovaMetaAcSpd(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="metaGravidade">Meta Taxa Gravidade</Label>
              <Input
                id="metaGravidade"
                type="number"
                step="0.01"
                value={novaMetaGravidade}
                onChange={(e) => setNovaMetaGravidade(parseFloat(e.target.value) || 0)}
              />
            </div>

            <Button 
              onClick={salvarMeta} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Salvando..." : "Salvar Meta"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metas.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma meta cadastrada</p>
              ) : (
                metas.map((meta) => (
                  <div key={meta.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Ano {meta.ano}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => meta.id && excluirMeta(meta.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>AC CPD: {meta.meta_taxa_frequencia_ac_cpd}</p>
                      <p>AC SPD: {meta.meta_taxa_frequencia_ac_spd}</p>
                      <p>Gravidade: {meta.meta_taxa_gravidade}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetasIndicadores;
