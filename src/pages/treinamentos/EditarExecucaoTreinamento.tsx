import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  if (loading) return <div className="flex justify-center items-center h-full min-h-[300px]">Carregando execução...</div>;
  if (!execucao) return <div className="flex justify-center items-center h-full min-h-[300px]">Execução não encontrada.</div>;

  return (
    <div className="w-full h-full p-0 overflow-auto">
      <Card className="w-full h-full shadow-none border-none rounded-none">
        <CardHeader>
          <CardTitle>Editar Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <Label htmlFor="cca">CCA</Label>
              <Input
                name="cca"
                id="cca"
                value={execucao.cca}
                onChange={handleChange}
                placeholder="CCA"
                required
              />
            </div>
            <div>
              <Label htmlFor="treinamento_nome">Treinamento</Label>
              <Input
                name="treinamento_nome"
                id="treinamento_nome"
                value={execucao.treinamento_nome || ""}
                onChange={handleChange}
                placeholder="Treinamento"
                required
              />
            </div>
            <div>
              <Label htmlFor="processo_treinamento">Processo</Label>
              <Input
                name="processo_treinamento"
                id="processo_treinamento"
                value={execucao.processo_treinamento}
                onChange={handleChange}
                placeholder="Processo"
                required
              />
            </div>
            <div>
              <Label htmlFor="tipo_treinamento">Tipo</Label>
              <Input
                name="tipo_treinamento"
                id="tipo_treinamento"
                value={execucao.tipo_treinamento}
                onChange={handleChange}
                placeholder="Tipo"
                required
              />
            </div>
            <div>
              <Label htmlFor="carga_horaria">Carga Horária</Label>
              <Input
                name="carga_horaria"
                id="carga_horaria"
                value={execucao.carga_horaria}
                type="number"
                min={0}
                onChange={handleChange}
                placeholder="Carga Horária"
                required
              />
            </div>
            <div>
              <Label htmlFor="efetivo_mod">Efetivo MOD</Label>
              <Input
                name="efetivo_mod"
                id="efetivo_mod"
                value={execucao.efetivo_mod ?? 0}
                type="number"
                min={0}
                onChange={handleChange}
                placeholder="Efetivo MOD"
                required
              />
            </div>
            <div>
              <Label htmlFor="efetivo_moi">Efetivo MOI</Label>
              <Input
                name="efetivo_moi"
                id="efetivo_moi"
                value={execucao.efetivo_moi ?? 0}
                type="number"
                min={0}
                onChange={handleChange}
                placeholder="Efetivo MOI"
                required
              />
            </div>
            <div>
              <Label htmlFor="horas_totais">Horas Totais</Label>
              <Input
                name="horas_totais"
                id="horas_totais"
                value={execucao.horas_totais ?? 0}
                type="number"
                min={0}
                onChange={handleChange}
                placeholder="Horas Totais"
                required
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                name="observacoes"
                id="observacoes"
                value={execucao.observacoes ?? ""}
                onChange={handleChange}
                placeholder="Observações"
              />
            </div>
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
