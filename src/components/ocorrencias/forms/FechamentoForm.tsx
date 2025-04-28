
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
import { Textarea } from "@/components/ui/textarea";
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
  
  const investigacaoRealizada = watch("investigacaoRealizada");
  const licoesAprendidasEnviada = watch("licoesAprendidasEnviada");
  const status = watch("status") || "";
  
  // Mock action plan items for display
  const planoAcaoItems = [
    {
      descricao: "Realizar revisão dos procedimentos de segurança",
      responsavel: "Carlos Oliveira",
      dataAdequacao: "20/05/2023",
      status: "Concluído"
    },
    {
      descricao: "Implementar novas medidas preventivas",
      responsavel: "Maria Santos",
      dataAdequacao: "15/06/2023",
      status: "Em andamento"
    },
    {
      descricao: "Treinar equipe sobre novos procedimentos",
      responsavel: "João Silva",
      dataAdequacao: "30/06/2023",
      status: "Pendente"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status do plano de ação */}
      <div>
        <h3 className="font-medium mb-3">Status do plano de ação</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {planoAcaoItems.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.descricao}</p>
                      <p className="text-sm text-muted-foreground">
                        Responsável: {item.responsavel} | Prazo: {item.dataAdequacao}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Concluído' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'Em andamento'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'Concluído' && <Check className="w-3 h-3 mr-1" />}
                        {item.status === 'Em andamento' && <Clock className="w-3 h-3 mr-1" />}
                        {item.status === 'Pendente' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Investigação */}
      <FormField
        control={control}
        name="investigacaoRealizada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investigação realizada em acordo com o PRO-SMS-08?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      
      {investigacaoRealizada === "Sim" && (
        <>
          <FormField
            control={control}
            name="informePreliminar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informe preliminar</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4} 
                    placeholder="Descreva o informe preliminar" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Controller
            control={control}
            name="relatorioAnalise"
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
        name="licoesAprendidasEnviada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lições aprendidas enviada?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      
      {licoesAprendidasEnviada === "Sim" && (
        <Controller
          control={control}
          name="arquivoLicoesAprendidas"
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
