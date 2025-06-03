
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

const FechamentoForm = () => {
  const { control, watch } = useFormContext();
  
  const investigacao_realizada = watch("investigacao_realizada");
  const licoes_aprendidas_enviada = watch("licoes_aprendidas_enviada");
  const acoes = watch("acoes") || [];
  
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
                  Informe preliminar (PDF, máx. 2MB)
                </Label>
                <Input
                  id="informe-upload"
                  type="file"
                  accept=".pdf"
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                      onChange(file);
                    } else if (file) {
                      alert("O arquivo deve ter no máximo 2MB");
                    }
                  }}
                />
              </div>
            )}
          />
          
          <Controller
            control={control}
            name="relatorio_analise"
            render={({ field: { value, onChange, ...field } }) => (
              <div className="grid w-full gap-1.5">
                <Label htmlFor="rai-upload">
                  Relatório de análise e investigação - RAI (PDF, máx. 2MB)
                </Label>
                <Input
                  id="rai-upload"
                  type="file"
                  accept=".pdf"
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                      onChange(file);
                    } else if (file) {
                      alert("O arquivo deve ter no máximo 2MB");
                    }
                  }}
                />
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
                Anexar lições aprendidas (PDF, máx. 2MB)
              </Label>
              <Input
                id="licoes-upload"
                type="file"
                accept=".pdf"
                {...field}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                    onChange(file);
                  } else if (file) {
                    alert("O arquivo deve ter no máximo 2MB");
                  }
                }}
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default FechamentoForm;
