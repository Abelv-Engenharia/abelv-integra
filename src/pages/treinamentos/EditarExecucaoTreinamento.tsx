import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento, Treinamento } from "@/types/treinamentos";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ccaService } from "@/services/treinamentos/ccaService";
import { treinamentosService } from "@/services/treinamentos/treinamentosService";
import { processoTreinamentoService } from "@/services/treinamentos/processoTreinamentoService";
import { tipoTreinamentoService } from "@/services/treinamentos/tipoTreinamentoService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const EditarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [ccaOptions, setCcaOptions] = useState<any[]>([]);
  const [treinamentoOptions, setTreinamentoOptions] = useState<Treinamento[]>([]);
  const [processoOptions, setProcessoOptions] = useState<any[]>([]);
  const [tipoOptions, setTipoOptions] = useState<any[]>([]);

  // Novo estado para arquivo lista de presença
  const [listaPresencaFile, setListaPresencaFile] = useState<File | null>(null);

  useEffect(() => {
    // Carregar opções
    const loadOptions = async () => {
      const [ccas, treins, processos, tipos] = await Promise.all([
        ccaService.getAll(),
        treinamentosService.getAll(),
        processoTreinamentoService.getAll(),
        tipoTreinamentoService.getAll(),
      ]);
      setCcaOptions(ccas);
      setTreinamentoOptions(treins);
      setProcessoOptions(processos);
      setTipoOptions(tipos);
    };
    loadOptions();
  }, []);

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

  // Handlers para selects
  const handleSelectChange = (name: string, value: any) => {
    if (!execucao) return;
    setExecucao({ ...execucao, [name]: value });
  };

  // Handler especial para treinamento (quando seleciona "outro")
  const handleTreinamentoChange = (value: string) => {
    if (!execucao) return;
    let newTreinamento: Partial<ExecucaoTreinamento> = {
      treinamento_id: value !== "outro" ? value : undefined,
      treinamento_nome: value === "outro" ? "" : undefined,
    };

    if (value !== "outro") {
      // Preencher nome e carga horária
      const t = treinamentoOptions.find((t) => t.id === value);
      newTreinamento.treinamento_nome = t?.nome;
      if (t?.carga_horaria != null) newTreinamento.carga_horaria = t.carga_horaria;
    }
    setExecucao({
      ...execucao,
      ...newTreinamento,
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        Carregando execução...
      </div>
    );
  if (!execucao)
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        Execução não encontrada.
      </div>
    );

  return (
    <div className="w-full h-full p-0 overflow-auto">
      <Card className="w-full h-full shadow-none border-none rounded-none">
        <CardHeader>
          <CardTitle>Editar Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!execucao?.id) return;
            setSaving(true);
            try {
              let lista_presenca_url = execucao.lista_presenca_url;
              // Se um novo arquivo foi anexado, faça upload aqui
              if (listaPresencaFile) {
                // Você pode implementar a lógica de upload para Supabase Storage aqui
                // Por enquanto apenas usamos um valor genérico para ilustrar
                // Depois troque este trecho pelo upload real
                lista_presenca_url = `uploads/${listaPresencaFile.name}`;
              }

              await execucaoTreinamentoService.update(execucao.id, {
                ...execucao,
                lista_presenca_url,
              });
              toast({
                title: "Execução atualizada",
                description: "A execução foi salva com sucesso.",
                variant: "default",
              });
              navigate(`/treinamentos/consulta`);
            } catch {
              toast({
                title: "Erro",
                description: "Erro ao atualizar execução.",
                variant: "destructive",
              });
            } finally {
              setSaving(false);
            }
          }}>
            {/* CCA */}
            <div>
              <Label htmlFor="cca_id">CCA</Label>
              <Select
                value={execucao.cca_id ? String(execucao.cca_id) : ""}
                onValueChange={(value) => {
                  const selected = ccaOptions.find((c) => String(c.id) === value);
                  handleSelectChange("cca_id", selected ? selected.id : null);
                  handleSelectChange("cca", selected ? `${selected.codigo} - ${selected.nome}` : "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CCA" />
                </SelectTrigger>
                <SelectContent>
                  {ccaOptions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.codigo} - {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* TREINAMENTO */}
            <div>
              <Label htmlFor="treinamento_id">Treinamento</Label>
              <Select
                value={
                  execucao.treinamento_id
                    ? String(execucao.treinamento_id)
                    : execucao.treinamento_nome && execucao.treinamento_nome !== ""
                    ? "outro"
                    : ""
                }
                onValueChange={handleTreinamentoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o treinamento" />
                </SelectTrigger>
                <SelectContent>
                  {treinamentoOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome}
                    </SelectItem>
                  ))}
                  <SelectItem value="outro">Outro (informar manualmente)</SelectItem>
                </SelectContent>
              </Select>
              {/* Campo manual se for outro */}
              {((!execucao.treinamento_id && execucao.treinamento_nome) || execucao.treinamento_id === "outro") && (
                <div className="mt-2">
                  <Input
                    name="treinamento_nome"
                    id="treinamento_nome"
                    value={execucao.treinamento_nome || ""}
                    onChange={handleChange}
                    placeholder="Nome do treinamento"
                    required
                  />
                </div>
              )}
            </div>
            {/* PROCESSO e TIPO */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="processo_treinamento_id">Processo</Label>
                <Select
                  value={execucao.processo_treinamento_id ? String(execucao.processo_treinamento_id) : ""}
                  onValueChange={(value) => {
                    const selected = processoOptions.find((p) => String(p.id) === value);
                    handleSelectChange("processo_treinamento_id", selected ? selected.id : "");
                    handleSelectChange("processo_treinamento", selected ? selected.nome : "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Processo" />
                  </SelectTrigger>
                  <SelectContent>
                    {processoOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="tipo_treinamento_id">Tipo</Label>
                <Select
                  value={execucao.tipo_treinamento_id ? String(execucao.tipo_treinamento_id) : ""}
                  onValueChange={(value) => {
                    const selected = tipoOptions.find((t) => String(t.id) === value);
                    handleSelectChange("tipo_treinamento_id", selected ? selected.id : "");
                    handleSelectChange("tipo_treinamento", selected ? selected.nome : "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoOptions.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* CARGA HORÁRIA, EFETIVOS, HORAS TOTAIS */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
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
              <div className="flex-1">
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
              <div className="flex-1">
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
              <div className="flex-1">
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

            {/* Campo de upload de lista de presença, só se não estiver anexado */}
            {(!execucao.lista_presenca_url || execucao.lista_presenca_url === "") && (
              <div>
                <Label htmlFor="listaPresenca">Anexar lista de presença (PDF, máx. 2MB)</Label>
                <Input
                  id="listaPresenca"
                  type="file"
                  accept=".pdf"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setListaPresencaFile(e.target.files[0]);
                    } else {
                      setListaPresencaFile(null);
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground mt-1">Apenas arquivos PDF, máximo 2MB.</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
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
