import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadInformePreliminarToBucket } from "@/utils/uploadInformePreliminarToBucket";
import { uploadRAIToBucket } from "@/utils/uploadRAIToBucket";
import { uploadLicoesAprendidasToBucket } from "@/utils/uploadLicoesAprendidasToBucket";

const FechamentoForm = () => {
  const { control, watch, setValue, getValues } = useFormContext();
  
  const investigacao_realizada = watch("investigacao_realizada");
  const licoes_aprendidas_enviada = watch("licoes_aprendidas_enviada");
  const acoes = watch("acoes") || [];
  
  // Corrigir os nomes para snake_case conforme schema dos dados
  const dataOcorrencia = watch("data") as Date | null;
  const classificacaoOcorrencia = watch("classificacao_ocorrencia") || null; // corrigido para snake_case
  const selectedCcaId = watch("cca") || null;
  const ccas = watch("ccas") || [];
  let codigoCca: string | null = null;
  if (selectedCcaId && ccas.length > 0) {
    const foundCca = ccas.find((c: any) => (c.id?.toString() ?? c.id) === selectedCcaId?.toString());
    codigoCca = foundCca?.codigo || null;
  }

  // Corrigido: buscar colaboradores_acidentados corretamente (evita erro TS2304)
  const colaboradores_acidentados = watch("colaboradores_acidentados");
  let colaboradorAcidentadoId: string | null = null;
  if (colaboradores_acidentados && colaboradores_acidentados.length > 0) {
    if (typeof colaboradores_acidentados[0] === "object" && colaboradores_acidentados[0] !== null) {
      colaboradorAcidentadoId = colaboradores_acidentados[0].colaborador || null;
    } else {
      colaboradorAcidentadoId = colaboradores_acidentados[0] || null;
    }
  }
  // Buscar nome do colaborador pelo id selecionado
  const funcionarios = watch("funcionarios") || [];
  let colaboradorAcidentadoNome: string | null = null;
  if (colaboradorAcidentadoId && funcionarios.length > 0) {
    const found = funcionarios.find((f: any) => f.id?.toString() === colaboradorAcidentadoId?.toString());
    colaboradorAcidentadoNome = found?.nome || colaboradorAcidentadoId;
  } else if (colaboradorAcidentadoId) {
    colaboradorAcidentadoNome = colaboradorAcidentadoId;
  }

  return (
    <div className="space-y-6">
      {/* Status do plano de ação */}
      <div>
        <h3 className="font-medium mb-3">Status do plano de ação</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {acoes.length > 0 ? (
                acoes.map((acao, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Ação #{index + 1}: {acao.tratativa_aplicada?.substring(0, 50) || 'Sem descrição'}...</p>
                        <p className="text-sm text-muted-foreground">
                          Responsável: {acao.responsavel_acao || 'Não definido'} | Prazo: {acao.data_adequacao ? new Date(acao.data_adequacao).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          acao.status === 'CONCLUÍDO' 
                            ? 'bg-green-100 text-green-800' 
                            : acao.status === 'EM ANDAMENTO'
                            ? 'bg-blue-100 text-blue-800' 
                            : acao.status === 'PLANEJADO'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {acao.status === 'CONCLUÍDO' && <Check className="w-3 h-3 mr-1" />}
                          {acao.status === 'EM ANDAMENTO' && <Clock className="w-3 h-3 mr-1" />}
                          {acao.status === 'PLANEJADO' && <Clock className="w-3 h-3 mr-1" />}
                          {acao.status === 'PENDENTE' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {acao.status || 'Não definido'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma ação cadastrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Investigação */}
      <FormField
        control={control}
        name="investigacao_realizada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investigação realizada em acordo com o PRO-SMS-08?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {investigacao_realizada === "Sim" && (
        <>
          <Controller
            control={control}
            name="informe_preliminar"
            render={({ field: { value, onChange, ...field } }) => (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="informe-upload">
                  Informe preliminar (PDF, máx. 5MB)
                </Label>
                <Input
                  id="informe-upload"
                  type="file"
                  accept=".pdf"
                  {...field}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    // Usar getValues para garantir dados fresh
                    const values = getValues([
                      "data",
                      "classificacao_ocorrencia",
                      "cca",
                      "ccas"
                    ]);
                    const dataOcorrencia = values[0] as Date | null;
                    const classificacaoOcorrencia = values[1] || null;
                    const selectedCcaId = values[2] || null;
                    const ccas = values[3] || [];
                    let codigoCca: string | null = null;
                    if (selectedCcaId && ccas.length > 0) {
                      const foundCca = ccas.find((c: any) => (c.id?.toString() ?? c.id) === selectedCcaId?.toString());
                      codigoCca = foundCca?.codigo || null;
                    }
                    // Logs para debug
                    console.log("UP-INFORME: Data:", dataOcorrencia, "Classificacao:", classificacaoOcorrencia, "selectedCcaId:", selectedCcaId, "codigoCca:", codigoCca);
                    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                      if (!dataOcorrencia || !classificacaoOcorrencia || !codigoCca) {
                        alert("Preencha a data da ocorrência, a classificação e o CCA antes de anexar o informe.");
                        return;
                      }
                      const url = await uploadInformePreliminarToBucket(
                        file, dataOcorrencia, classificacaoOcorrencia, codigoCca
                      );
                      if (url) {
                        onChange(url);
                        setValue("informe_preliminar", url);
                      } else {
                        alert("Erro ao fazer upload do arquivo do informe preliminar.");
                      }
                    } else if (file) {
                      alert("O arquivo deve ter no máximo 5MB");
                    }
                  }}
                />
                {value && typeof value === "string" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      asChild
                      type="button"
                      size="sm"
                      variant="default"
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visualizar informe anexado
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onChange(null);
                        setValue("informe_preliminar", null);
                      }}
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      Remover informe
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="relatorio_analise"
            render={({ field: { value, onChange, ...field } }) => (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="rai-upload">
                  Relatório de análise e investigação - RAI (PDF, máx. 5MB)
                </Label>
                <Input
                  id="rai-upload"
                  type="file"
                  accept=".pdf"
                  {...field}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    // Usar getValues para garantir dados atualizados
                    const values = getValues([
                      "data",
                      "classificacao_ocorrencia",
                      "cca",
                      "ccas"
                    ]);
                    const dataOcorrencia = values[0] as Date | null;
                    const classificacaoOcorrencia = values[1] || null;
                    const selectedCcaId = values[2] || null;
                    const ccas = values[3] || [];
                    let codigoCca: string | null = null;
                    if (selectedCcaId && ccas.length > 0) {
                      const foundCca = ccas.find((c: any) => (c.id?.toString() ?? c.id) === selectedCcaId?.toString());
                      codigoCca = foundCca?.codigo || null;
                    }
                    console.log("UP-RAI: Data:", dataOcorrencia, "Classificacao:", classificacaoOcorrencia, "selectedCcaId:", selectedCcaId, "codigoCca:", codigoCca);
                    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                      if (!dataOcorrencia || !classificacaoOcorrencia || !codigoCca) {
                        alert("Preencha a data da ocorrência, a classificação e o CCA antes de anexar o RAI.");
                        return;
                      }
                      const url = await uploadRAIToBucket(
                        file, dataOcorrencia, classificacaoOcorrencia, codigoCca
                      );
                      if (url) {
                        onChange(url);
                        setValue("relatorio_analise", url);
                      } else {
                        alert("Erro ao fazer upload do arquivo RAI.");
                      }
                    } else if (file) {
                      alert("O arquivo deve ter no máximo 5MB");
                    }
                  }}
                />
                {value && typeof value === "string" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      asChild
                      type="button"
                      size="sm"
                      variant="default"
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visualizar RAI anexado
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onChange(null);
                        setValue("relatorio_analise", null);
                      }}
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      Remover RAI
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
        </>
      )}
      
      {/* Lições aprendidas */}
      <FormField
        control={control}
        name="licoes_aprendidas_enviada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lições aprendidas enviada?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {licoes_aprendidas_enviada === "Sim" && (
        <Controller
          control={control}
          name="arquivo_licoes_aprendidas"
          render={({ field: { value, onChange, ...field } }) => (
            <div className="grid w-full gap-1.5">
              <Label htmlFor="licoes-upload">
                Anexar lições aprendidas (PDF, máx. 5MB)
              </Label>
              <Input
                id="licoes-upload"
                type="file"
                accept=".pdf"
                {...field}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  // Pega valores com getValues (garante frescor dos dados)
                  const values = getValues([
                    "data",
                    "classificacao_ocorrencia",
                    "cca",
                    "ccas"
                  ]);
                  const dataOcorrencia = values[0] as Date | null;
                  const classificacaoOcorrencia = values[1] || null;
                  const selectedCcaId = values[2] || null;
                  const ccas = values[3] || [];
                  let codigoCca: string | null = null;
                  if (selectedCcaId && ccas.length > 0) {
                    const foundCca = ccas.find((c: any) => (c.id?.toString() ?? c.id) === selectedCcaId?.toString());
                    codigoCca = foundCca?.codigo || null;
                  }
                  console.log("UP-LICOES: Data:", dataOcorrencia, "Classificacao:", classificacaoOcorrencia, "selectedCcaId:", selectedCcaId, "codigoCca:", codigoCca);
                  if (file && file.size <= 5 * 1024 * 1024) {
                    if (!dataOcorrencia || !classificacaoOcorrencia || !codigoCca) {
                      alert("Preencha a data da ocorrência, a classificação e o CCA antes de anexar o arquivo de lições aprendidas.");
                      return;
                    }
                    const url = await uploadLicoesAprendidasToBucket(
                      file, dataOcorrencia, classificacaoOcorrencia, codigoCca
                    );
                    if (url) {
                      onChange(url);
                      setValue("arquivo_licoes_aprendidas", url);
                    } else {
                      alert("Erro ao fazer upload do arquivo de lições aprendidas.");
                    }
                  } else if (file) {
                    alert("O arquivo deve ter no máximo 5MB");
                  }
                }}
              />
              {value && typeof value === "string" && (
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    asChild
                    type="button"
                    size="sm"
                    variant="default"
                    className="text-xs px-2 py-0.5 h-7"
                  >
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visualizar lições anexadas
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      onChange(null);
                      setValue("arquivo_licoes_aprendidas", null);
                    }}
                    className="text-xs px-2 py-0.5 h-7"
                  >
                    Remover lições
                  </Button>
                </div>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default FechamentoForm;
