
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const TIPOS = [
  { value: "eliminação", label: "Eliminação" },
  { value: "substituição", label: "Substituição" },
  { value: "engenharia", label: "Medida de Engenharia" },
  { value: "administrativa", label: "Administrativa" },
  { value: "epi", label: "EPI" },
];

const STATUS = [
  { value: "pendente", label: "Pendente" },
  { value: "em andamento", label: "Em Andamento" },
  { value: "concluída", label: "Concluída" },
  { value: "não eficaz", label: "Não Eficaz" },
];

type Medida = {
  id: string;
  tipo: string;
  descricao: string;
  responsavel_id: string | null;
  prazo: string | null;
  status: string;
  eficacia: string | null;
};

type PGRMedidasFormProps = {
  planoId: string;
};

export default function PGRMedidasForm({ planoId }: PGRMedidasFormProps) {
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [status, setStatus] = useState("pendente");
  const [eficacia, setEficacia] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function carregarMedidas() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("pgr_medidas")
      .select("*")
      .eq("plano_id", planoId)
      .order("prazo", { ascending: true });
    if (data) setMedidas(data);
    if (error) toast({ title: "Erro ao listar medidas", description: error.message, variant: "destructive" });
    setCarregando(false);
  }

  useEffect(() => {
    carregarMedidas();
    // eslint-disable-next-line
  }, [planoId]);

  async function salvarMedida(e: React.FormEvent) {
    e.preventDefault();
    if (!tipo || !descricao) return;
    if (!editId) {
      const { error } = await supabase.from("pgr_medidas").insert([{
        plano_id: planoId,
        tipo,
        descricao,
        prazo: prazo || null,
        status,
        eficacia: eficacia || null
      }]);
      if (!error) {
        toast({ title: "Medida cadastrada!", variant: "default" });
      } else {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase.from("pgr_medidas")
        .update({ tipo, descricao, prazo: prazo || null, status, eficacia: eficacia || null })
        .eq("id", editId);
      if (!error) {
        toast({ title: "Medida atualizada!", variant: "default" });
        setEditId(null);
      } else {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      }
    }

    setTipo("");
    setDescricao("");
    setPrazo("");
    setStatus("pendente");
    setEficacia("");
    carregarMedidas();
  }

  function prepararEdicao(medida: Medida) {
    setTipo(medida.tipo);
    setDescricao(medida.descricao);
    setPrazo(medida.prazo ?? "");
    setStatus(medida.status);
    setEficacia(medida.eficacia ?? "");
    setEditId(medida.id);
  }

  async function excluirMedida(id: string) {
    if (!window.confirm("Excluir medida?")) return;
    const { error } = await supabase.from("pgr_medidas").delete().eq("id", id);
    if (!error) {
      toast({ title: "Medida excluída.", variant: "default" });
      carregarMedidas();
    } else {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div>
      <form className="flex flex-wrap md:flex-nowrap gap-2 items-end mb-4" onSubmit={salvarMedida}>
        <div className="w-full md:w-1/5 min-w-[140px]">
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Descrição da medida"
          value={descricao}
          className="w-full md:w-2/5"
          onChange={e => setDescricao(e.target.value)}
          required
        />
        <Input
          type="date"
          value={prazo}
          onChange={e => setPrazo(e.target.value)}
          className="w-full md:w-1/6"
          title="Prazo"
        />
        <div className="w-full md:w-1/5 min-w-[120px]">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map(st => (
                <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Eficácia (opcional)"
          value={eficacia}
          className="w-full md:w-1/5"
          onChange={e => setEficacia(e.target.value)}
        />
        <Button type="submit" className="ml-2">
          {editId ? "Atualizar" : "Adicionar"}
        </Button>
        {editId && (
          <Button
            type="button"
            variant="outline"
            className="ml-1"
            onClick={() => {
              setTipo("");
              setDescricao("");
              setPrazo("");
              setStatus("pendente");
              setEficacia("");
              setEditId(null);
            }}>
            Cancelar
          </Button>
        )}
      </form>
      <div>
        <h4 className="mb-1 font-semibold text-sm text-muted-foreground">Ações/Mediadas de Controle</h4>
        {carregando ? (
          <div className="text-xs">Carregando...</div>
        ) : (
          <ul className="space-y-2">
            {medidas.map(m => (
              <li key={m.id} className="bg-muted rounded px-2 py-1 flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs group">
                <div className="font-bold min-w-[80px]">{TIPOS.find(t => t.value === m.tipo)?.label}</div>
                <div className="flex-1">{m.descricao}</div>
                <div>{m.prazo ? (
                  <span title="Prazo">Prazo: {new Date(m.prazo).toLocaleDateString()}</span>
                ) : (
                  <span className="text-muted-foreground">Sem prazo</span>
                )}</div>
                <div>
                  <span className="font-semibold">Status:</span> {STATUS.find(s => s.value === m.status)?.label}
                </div>
                {m.eficacia && (
                  <span title="Eficácia" className="italic">
                    Eficácia: {m.eficacia}
                  </span>
                )}
                <div className="flex gap-1">
                  <Button size="xs" type="button" variant="outline" onClick={() => prepararEdicao(m)}>
                    Editar
                  </Button>
                  <Button size="xs" type="button" variant="destructive" onClick={() => excluirMedida(m.id)}>
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
            {medidas.length === 0 && (
              <li className="text-muted-foreground px-2">Nenhuma medida cadastrada.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
