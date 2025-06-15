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

        const style = `
          <style>
            @page { size: A4; margin: 0; }
            body {
              margin: 0;
              background: #f3f3f3;
              font-family: Arial, Helvetica, sans-serif;
              color: #222;
            }
            .cracha-box {
              background: #fff;
              width: 360px;
              min-height: 525px;
              margin: 30px auto;
              border-radius: 9px;
              border: 1.5px solid #e5e7eb;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: stretch;
            }
            .cracha-title {
              background: #2563eb;
              color: #fff;
              font-size: 1.15rem;
              text-align: center;
              padding: 18px 0 14px 0;
              border-radius: 9px 9px 0 0;
              font-weight: 700;
              letter-spacing: 0.03em;
            }
            .cracha-upper {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 20px;
              padding: 20px 20px 8px 20px;
              border-bottom: none;
            }
            .cracha-logo {
              width: 80px;
              height: 80px;
              object-fit: contain;
              background: none;
              border-radius: 100%;
              flex-shrink: 0;
              border: 1px solid #f1f1f1;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
            }
            .cracha-funcionario-info {
              display: flex;
              flex-direction: column;
              justify-content: center;
              flex: 1;
            }
            .cracha-nome {
              font-weight: bold;
              font-size: 1.17rem;
              text-transform: uppercase;
              margin-bottom: 3px;
              word-break: break-word;
            }
            .cracha-funcao {
              font-size: 1rem;
              font-weight: 500;
              color: #404040;
              margin-bottom: 2px;
              text-transform: none;
              word-break: break-word;
            }
            .cracha-matricula {
              font-size: 0.98rem;
              color: #7b7b7b;
              margin-bottom: 0;
              font-weight: normal;
              letter-spacing: 0.02em;
            }
            .cracha-divider {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 10px 20px 0 20px;
            }
            .cracha-table-section {
              margin: 0 0 0 0;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .cracha-table-title {
              text-align: center;
              font-weight: bold;
              margin: 24px 0 7px 0;
              font-size: 1.05rem;
              letter-spacing: 0.01em;
              color: #222;
            }
            .cracha-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.97rem;
              margin: 0;
              background: #fff;
            }
            .cracha-table thead tr th {
              font-weight: bold;
              border-bottom: 1.3px solid #d4d4d4;
              font-size: 0.97rem;
              padding: 7px 8px;
              background: #fff;
              color: #111;
              text-align: left;
            }
            .cracha-table th:last-child, .cracha-table td:last-child {
              text-align: right;
            }
            .cracha-table tbody td {
              border-bottom: 1px solid #ececec;
              padding: 7px 8px 7px 8px;
              vertical-align: top;
              color: #333;
            }
            .cracha-table tbody tr:last-child td {
              border-bottom: none;
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
          </style>
        `;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Crachá de Capacitação - ${funcionario.nome}</title>
            ${style}
          </head>
          <body>
            <div class="cracha-box">
              <div class="cracha-title">CRACHÁ DE CAPACITAÇÃO</div>
              <div class="cracha-upper">
                <img class="cracha-logo" src="${logoUrl || ''}" alt="Logo do Sistema" />
                <div class="cracha-funcionario-info">
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
