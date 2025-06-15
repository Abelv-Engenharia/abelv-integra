import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ccaService } from "@/services/treinamentos/ccaService";
import { 
  Funcionario,
  TreinamentoNormativo,
  Treinamento
} from "@/types/treinamentos";
import { calcularStatusTreinamento, formatarData, fetchFuncionarios, fetchTreinamentos, getNomeTreinamento } from "@/utils/treinamentosUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import FuncionarioSelector from "@/components/treinamentos/FuncionarioSelector";
import FuncionarioInfoCard from "@/components/treinamentos/FuncionarioInfoCard";
import CrachaPreview from "@/components/treinamentos/CrachaPreview";
import FuncionarioTreinamentosValidosCard from "@/components/treinamentos/FuncionarioTreinamentosValidosCard";

import { useSystemLogoUrl } from "@/components/common/useSystemLogoUrl";

const TreinamentosCracha = () => {
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | undefined>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [treinamentosValidos, setTreinamentosValidos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentosInfo, setTreinamentosInfo] = useState<Treinamento[]>([]);
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const crachaRef = useRef<HTMLDivElement | null>(null);
  const logoUrl = useSystemLogoUrl();

  // Fetch funcionarios data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [funcionariosData, treinamentosData, ccasData] = await Promise.all([
          fetchFuncionarios(),
          fetchTreinamentos(),
          ccaService.getAll(),
        ]);
        setFuncionarios(funcionariosData);
        setTreinamentosInfo(treinamentosData);
        setCcas(ccasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Ordenar CCAs pelo campo 'codigo' em ordem crescente antes de mostrar as opções
  const ccasOrdenados = [...ccas].sort((a, b) => {
    if (!a.codigo || !b.codigo) return 0;
    // Se for numérico, compara como número. Se não, compara como string.
    const numA = Number(a.codigo);
    const numB = Number(b.codigo);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    } else {
      return a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true });
    }
  });

  // Lista de funcionários filtrada por CCA selecionado
  const funcionariosFiltrados = selectedCcaId
    ? funcionarios.filter((f) => f.cca_id === selectedCcaId)
    : [];

  // Ao trocar o CCA, limpa seleção de funcionário e info dependentes
  const handleCcaChange = (ccaId: string) => {
    setSelectedCcaId(Number(ccaId));
    setSelectedFuncionarioId(undefined);
    setFuncionario(null);
    setTreinamentosValidos([]);
  };

  const handleFuncionarioChange = async (funcionarioId: string) => {
    setSelectedFuncionarioId(funcionarioId);
    setIsLoading(true);
    
    try {
      const selectedFuncionario = funcionariosFiltrados.find(f => f.id === funcionarioId);
      setFuncionario(selectedFuncionario || null);
      
      // Get valid trainings for this funcionario from Supabase
      const { data: treinamentosData, error } = await supabase
        .from('treinamentos_normativos')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .eq('arquivado', false);
      
      if (error) {
        console.error("Erro ao buscar treinamentos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os treinamentos do funcionário",
          variant: "destructive",
        });
        setTreinamentosValidos([]);
        return;
      }
      
      // Process trainings
      const treinamentosProcessados = await Promise.all(treinamentosData.map(async (t) => {
        const dataRealizacao = t.data_realizacao;
        const dataValidade = t.data_validade;
        const status = calcularStatusTreinamento(new Date(dataValidade));
        const treinamentoNome = await getNomeTreinamento(t.treinamento_id);
        
        return {
          id: t.id,
          funcionario_id: t.funcionario_id,
          treinamento_id: t.treinamento_id,
          tipo: t.tipo as 'Formação' | 'Reciclagem',
          data_realizacao: dataRealizacao,
          data_validade: dataValidade,
          certificado_url: t.certificado_url,
          status: status,
          arquivado: t.arquivado,
          treinamentoNome
        };
      }));
      
      // Filter valid or about to expire trainings
      const treinamentosValidos = treinamentosProcessados
        .filter(t => t.status === "Válido" || t.status === "Próximo ao vencimento")
        .sort((a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime());
      
      setTreinamentosValidos(treinamentosValidos);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados",
        variant: "destructive",
      });
      setTreinamentosValidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!funcionario) {
      toast({
        title: "Aviso",
        description: "Selecione um funcionário para gerar o crachá",
        variant: "destructive",
      });
      return;
    }
    
    if (treinamentosValidos.length === 0) {
      toast({
        title: "Aviso",
        description: "O funcionário não possui treinamentos válidos para emissão de crachá",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Imprimindo",
      description: "Enviando crachá para impressão...",
    });
    
    if (crachaRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        
        const style = document.createElement('style');
        style.innerHTML = `
          @page { size: A4; margin: 0; }
          body {
            margin: 0;
            background: #f3f3f3;
            font-family: Arial, Helvetica, sans-serif;
            color: #222;
          }
          .cracha-container {
            background: #fff;
            width: 400px;
            min-height: 600px;
            margin: 30px auto;
            box-shadow: 0 2px 8px #0002;
            border-radius: 4px;
            padding: 0;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .cracha-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 500;
            color: #b0b0b0;
            padding-top: 28px;
            margin-bottom: 18px;
            letter-spacing: 0.01em;
          }
          .cracha-header-row {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding: 0 32px 0 30px;
            margin-bottom: 18px;
            gap: 14px;
          }
          .cracha-logo {
            width: 96px;
            height: 96px;
            margin-right: 16px;
            margin-top: 4px;
            object-fit: contain;
            background: none;
            border-radius: 0;
          }
          .cracha-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 5px;
            min-width: 0;
            flex: 1;
          }
          .cracha-nome {
            font-weight: bold;
            font-size: 1.25rem;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.01em;
            word-break: break-word;
          }
          .cracha-funcao {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 6px;
            word-break: break-word;
          }
          .cracha-matricula {
            font-size: 1rem;
            margin-bottom: 0;
          }
          .cracha-divider {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 10px 25px 0 25px;
          }
          .cracha-table-section {
            margin: 10px 25px 0 25px;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
          }
          .cracha-table-title {
            text-align: center;
            font-weight: bold;
            margin: 15px 0 10px 0;
            font-size: 1.05rem;
            letter-spacing: 0.01em;
          }
          .cracha-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.98rem;
          }
          .cracha-table thead tr th {
            font-weight: bold;
            border-bottom: 1px solid #bbb;
            font-size: 1rem;
            padding: 5px;
            background: none;
            text-align: left;
          }
          .cracha-table th:last-child, .cracha-table td:last-child {
            text-align: right;
          }
          .cracha-table tbody td {
            border-bottom: 1px solid #efefef;
            padding: 4px 5px 3px 5px;
            vertical-align: top;
          }
          .cracha-no-training {
            text-align: center;
            color: #888;
            font-size: 1rem;
            padding: 14px 0;
          }
          .cracha-emissao {
            text-align: center;
            color: #777;
            font-size: 1rem;
            margin: 30px 0 14px 0;
          }
        `;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Crachá de Capacitação - ${funcionario.nome}</title>
            ${style.outerHTML}
          </head>
          <body>
            <div class="cracha-container">
              <div class="cracha-title">Crachá de Capacitação</div>
              <div class="cracha-header-row">
                <img class="cracha-logo" src="${logoUrl || ''}" alt="Logo do Sistema" />
                <div class="cracha-info">
                  <div class="cracha-nome">${funcionario.nome}</div>
                  <div class="cracha-funcao">${funcionario.funcao}</div>
                  <div class="cracha-matricula">Matrícula: ${funcionario.matricula}</div>
                </div>
              </div>
              <hr class="cracha-divider" />
              <div class="cracha-table-section">
                <div class="cracha-table-title">Certificações Válidas</div>
                ${
                  treinamentosValidos.length > 0
                    ? `<table class="cracha-table">
                        <thead>
                          <tr>
                            <th>Treinamento</th>
                            <th>Validade</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${treinamentosValidos
                            .map(
                              (treinamento) => `
                            <tr>
                              <td>${treinamento.treinamentoNome || "Treinamento não encontrado"}</td>
                              <td>${formatarData(treinamento.data_validade)}</td>
                            </tr>
                          `
                            )
                            .join("")}
                        </tbody>
                      </table>`
                    : `<div class="cracha-no-training">Sem treinamentos válidos</div>`
                }
              </div>
              <div class="cracha-emissao">
                Emitido em ${format(new Date(), "dd/MM/yyyy")}
              </div>
            </div>
          </body>
          </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Emissão de Crachá de Capacitação</h1>
      </div>

      {isLoading && !selectedFuncionarioId ? (
        <div className="flex justify-center items-center py-8">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          <FuncionarioSelector
            ccasOrdenados={ccasOrdenados}
            selectedCcaId={selectedCcaId}
            handleCcaChange={handleCcaChange}
            funcionariosFiltrados={funcionariosFiltrados}
            selectedFuncionarioId={selectedFuncionarioId}
            handleFuncionarioChange={handleFuncionarioChange}
            funcionario={funcionario}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FuncionarioTreinamentosValidosCard
              funcionario={funcionario}
              treinamentosValidos={treinamentosValidos}
              isLoading={isLoading}
            />

            <CrachaPreview
              funcionario={funcionario}
              treinamentosValidos={treinamentosValidos}
              isLoading={isLoading}
              onPrint={handlePrint}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TreinamentosCracha;
