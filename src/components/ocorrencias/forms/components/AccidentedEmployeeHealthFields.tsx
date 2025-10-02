import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadCatFileToBucket } from "@/utils/uploadCatFileToBucket";

interface AccidentedEmployeeHealthFieldsProps {
  index: number;
  funcionarios: any[];
  partesCorpo: any[];
  lateralidades: any[];
  agentesCausadores: any[];
  situacoesGeradoras: any[];
  naturezasLesao: any[];
  selectedEmpresaId?: string;
}

const AccidentedEmployeeHealthFields: React.FC<AccidentedEmployeeHealthFieldsProps> = ({
  index,
  funcionarios,
  partesCorpo,
  lateralidades,
  agentesCausadores,
  situacoesGeradoras,
  naturezasLesao,
  selectedEmpresaId,
}) => {
  const { control, watch, setValue } = useFormContext();
  const [uploadingCat, setUploadingCat] = React.useState(false);
  
  const isAbelvSelecionada = selectedEmpresaId === "6";
  const colaboradorId = watch(`colaboradores_acidentados.${index}.colaborador`);
  const dataOcorrencia = watch("data") as Date | null;

  // Auto-popular função e matrícula quando colaborador for selecionado (ABELV)
  React.useEffect(() => {
    if (isAbelvSelecionada && colaboradorId && funcionarios.length > 0) {
      const funcionario = funcionarios.find(f => f.id.toString() === colaboradorId);
      if (funcionario) {
        setValue(`colaboradores_acidentados.${index}.funcao`, funcionario.funcao || "");
        setValue(`colaboradores_acidentados.${index}.matricula`, funcionario.matricula || "");
      }
    }
  }, [colaboradorId, funcionarios, setValue, index, isAbelvSelecionada]);

  // Buscar nome do colaborador para upload
  let colaboradorNome: string = "";
  if (isAbelvSelecionada && colaboradorId) {
    const found = funcionarios.find((f: any) => f.id?.toString() === colaboradorId?.toString());
    colaboradorNome = found?.nome || colaboradorId;
  } else {
    colaboradorNome = colaboradorId || `colaborador_${index + 1}`;
  }

  const houveAfastamento = watch(`colaboradores_acidentados.${index}.houve_afastamento`);

  return (
    <div className="space-y-4">
      {/* Colaborador, Função e Matrícula */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.colaborador`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">
                    Colaborador *
                  </FormLabel>
                  {isAbelvSelecionada ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={!field.value ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione o colaborador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {funcionarios.map((funcionario) => (
                          <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                            {funcionario.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input
                        placeholder="Digite o nome do colaborador"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        className={!field.value ? "border-red-500" : ""}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.funcao`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">
                    Função *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={isAbelvSelecionada}
                      disabled={isAbelvSelecionada}
                      placeholder={!isAbelvSelecionada ? "Digite a função" : ""}
                      onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
                      className={!field.value ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.matricula`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-500">
                    Matrícula *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={isAbelvSelecionada}
                      disabled={isAbelvSelecionada}
                      placeholder={!isAbelvSelecionada ? "Digite a matrícula" : ""}
                      onChange={!isAbelvSelecionada ? (e) => field.onChange(e.target.value.toUpperCase()) : field.onChange}
                      className={!field.value ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Houve Afastamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.houve_afastamento`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Houve afastamento?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.dias_perdidos`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias perdidos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      disabled={houveAfastamento !== "Sim"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.dias_debitados`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias debitados</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      disabled={houveAfastamento !== "Sim"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Parte do corpo e Lateralidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.parte_corpo_atingida`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parte do corpo atingida</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {partesCorpo.map((parte) => (
                        <SelectItem key={parte.id} value={parte.id.toString()}>
                          {parte.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.lateralidade`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lateralidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lateralidades.map((lat) => (
                        <SelectItem key={lat.id} value={lat.id.toString()}>
                          {lat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Agente Causador */}
          <FormField
            control={control}
            name={`colaboradores_acidentados.${index}.agente_causador`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agente causador</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {agentesCausadores.map((agente) => (
                      <SelectItem key={agente.id} value={agente.id.toString()}>
                        {agente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Situação Geradora */}
          <FormField
            control={control}
            name={`colaboradores_acidentados.${index}.situacao_geradora`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação geradora</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {situacoesGeradoras.map((situacao) => (
                      <SelectItem key={situacao.id} value={situacao.id.toString()}>
                        {situacao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Natureza da Lesão */}
          <FormField
            control={control}
            name={`colaboradores_acidentados.${index}.natureza_lesao`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Natureza da lesão</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {naturezasLesao.map((natureza) => (
                      <SelectItem key={natureza.id} value={natureza.id.toString()}>
                        {natureza.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CAT e CID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.numero_cat`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da CAT</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`colaboradores_acidentados.${index}.cid`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CID</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Ex: M54.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Anexar CAT */}
          <Controller
            control={control}
            name={`colaboradores_acidentados.${index}.arquivo_cat`}
            render={({ field: { value, onChange, ...field } }) => (
              <div className="grid w-full gap-1.5">
                <Label htmlFor={`cat-upload-${index}`}>Anexar CAT (PDF, máx. 2MB)</Label>
                <Input
                  id={`cat-upload-${index}`}
                  type="file"
                  accept=".pdf"
                  {...field}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 2 * 1024 * 1024) {
                      if (!dataOcorrencia || !colaboradorNome) {
                        alert("Preencha a data da ocorrência e o colaborador antes de anexar o CAT.");
                        return;
                      }
                      setUploadingCat(true);
                      const url = await uploadCatFileToBucket(file, dataOcorrencia, colaboradorNome);
                      setUploadingCat(false);
                      if (url) {
                        onChange(url);
                      } else {
                        alert("Erro ao fazer upload do arquivo CAT.");
                      }
                    } else if (file) {
                      alert("O arquivo deve ter no máximo 2MB");
                    }
                  }}
                />
                {uploadingCat && (
                  <span className="text-sm text-gray-500">Enviando arquivo...</span>
                )}
                {value && typeof value === "string" && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      asChild
                      type="button"
                      size="sm"
                      variant="default"
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        Visualizar CAT anexada
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onChange(null);
                        setValue(`colaboradores_acidentados.${index}.arquivo_cat`, null);
                      }}
                      className="text-xs px-2 py-0.5 h-7"
                    >
                      Remover CAT
                    </Button>
                  </div>
                )}
              </div>
            )}
          />
    </div>
  );
};

export default AccidentedEmployeeHealthFields;
