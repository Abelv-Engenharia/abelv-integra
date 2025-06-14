
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const EditarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    execucaoTreinamentoService.getById(id)
      .then(data => setExecucao(data))
      .catch(() => setExecucao(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!execucao) return;
    setExecucao({ ...execucao, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!execucao?.id) return;
    setSaving(true);
    try {
      await execucaoTreinamentoService.update(execucao.id, execucao);
      toast({
        title: "Execução atualizada",
        description: "A execução foi salva com sucesso.",
        variant: "default"
      });
      navigate(`/treinamentos/consulta`);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar execução.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20">Carregando execução...</div>;
  if (!execucao) return <div className="flex justify-center py-20">Execução não encontrada.</div>;

  return (
    <div className="container max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <Input name="treinamento_nome" value={execucao.treinamento_nome || ""} onChange={handleChange} placeholder="Treinamento" required />
            <Input name="cca" value={execucao.cca} onChange={handleChange} placeholder="CCA" required />
            <Input name="processo_treinamento" value={execucao.processo_treinamento} onChange={handleChange} placeholder="Processo" required />
            <Input name="tipo_treinamento" value={execucao.tipo_treinamento} onChange={handleChange} placeholder="Tipo" required />
            <Input name="carga_horaria" value={execucao.carga_horaria} type="number" min={0} onChange={handleChange} placeholder="Carga Horária" required />
            <Input name="efetivo_mod" value={execucao.efetivo_mod ?? 0} type="number" min={0} onChange={handleChange} placeholder="Efetivo MOD" required />
            <Input name="efetivo_moi" value={execucao.efetivo_moi ?? 0} type="number" min={0} onChange={handleChange} placeholder="Efetivo MOI" required />
            <Input name="horas_totais" value={execucao.horas_totais ?? 0} type="number" min={0} onChange={handleChange} placeholder="Horas Totais" required />
            <Input name="observacoes" value={execucao.observacoes ?? ""} onChange={handleChange} placeholder="Observações" />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
              <Button variant="outline" asChild>
                <Link to="/treinamentos/consulta">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarExecucaoTreinamento;
