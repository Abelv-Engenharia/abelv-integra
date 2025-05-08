
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { fetchCCAs, CCAOption } from "@/services/treinamentos/ccaService";
import { fetchProcessosTreinamento, ProcessoTreinamentoOption } from "@/services/treinamentos/processoTreinamentoService";
import { fetchTiposTreinamento, TipoTreinamentoOption } from "@/services/treinamentos/tipoTreinamentoService";
import { fetchTreinamentos } from "@/utils/treinamentosUtils";
import { Treinamento } from "@/types/treinamentos";

// Import refactored components
import SuccessCard from "@/components/treinamentos/execucao/SuccessCard";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import CCASelector from "@/components/treinamentos/execucao/CCASelector";
import ProcessoTipoFields from "@/components/treinamentos/execucao/ProcessoTipoFields";
import TreinamentoSelector from "@/components/treinamentos/execucao/TreinamentoSelector";
import CargaHorariaEfetivoFields from "@/components/treinamentos/execucao/CargaHorariaEfetivoFields";
import ObservacoesAnexoFields from "@/components/treinamentos/execucao/ObservacoesAnexoFields";
import { useTreinamentoForm } from "@/hooks/useTreinamentoForm";

const TreinamentosExecucao: React.FC = () => {
  // Estado para as opções dos selects
  const [ccaOptions, setCCAOptions] = useState<CCAOption[]>([]);
  const [processoOptions, setProcessoOptions] = useState<ProcessoTreinamentoOption[]>([]);
  const [tipoOptions, setTipoOptions] = useState<TipoTreinamentoOption[]>([]);
  const [treinamentosOptions, setTreinamentosOptions] = useState<Treinamento[]>([]);
  
  const { 
    form, 
    isLoading, 
    isSubmitSuccess, 
    isOutroTreinamento,
    treinamentoSelecionado,
    horasTotais,
    onSubmit,
    resetForm,
    updateCargaHorariaFromTreinamento
  } = useTreinamentoForm();
  
  // Buscar dados das tabelas
  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const [ccas, processos, tipos, treinamentos] = await Promise.all([
          fetchCCAs(),
          fetchProcessosTreinamento(),
          fetchTiposTreinamento(),
          fetchTreinamentos()
        ]);
        
        setCCAOptions(ccas);
        setProcessoOptions(processos);
        setTipoOptions(tipos);
        setTreinamentosOptions(treinamentos);
      } catch (error) {
        console.error("Erro ao carregar opções do formulário:", error);
      }
    };
    
    loadFormOptions();
  }, []);
  
  // Atualiza carga horária quando um treinamento é selecionado
  useEffect(() => {
    updateCargaHorariaFromTreinamento(treinamentosOptions);
  }, [treinamentoSelecionado, treinamentosOptions]);

  if (isSubmitSuccess) {
    return <SuccessCard onReset={resetForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Execução de Treinamentos</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações do Treinamento</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para registrar a execução de um treinamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <p>Carregando...</p>
            </div>
          )}
          
          {!isLoading && (
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <DateTimeFields form={form} />
                
                <CCASelector form={form} ccaOptions={ccaOptions} />
                
                <ProcessoTipoFields 
                  form={form} 
                  processoOptions={processoOptions} 
                  tipoOptions={tipoOptions} 
                />

                <TreinamentoSelector 
                  form={form} 
                  treinamentosOptions={treinamentosOptions} 
                  isOutroTreinamento={isOutroTreinamento} 
                />

                <CargaHorariaEfetivoFields 
                  form={form} 
                  horasTotais={horasTotais}
                  isOutroTreinamento={isOutroTreinamento}
                  treinamentoSelecionado={treinamentoSelecionado}
                />
                
                <ObservacoesAnexoFields form={form} />

                <div className="flex justify-end">
                  <Button type="submit" className="gap-1" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Salvando..." : "Salvar registro"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosExecucao;
