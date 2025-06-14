
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Printer } from "lucide-react";
import { formatarData } from "@/utils/treinamentosUtils";
import { Funcionario, TreinamentoNormativo } from "@/types/treinamentos";

interface Props {
  funcionario: Funcionario | null;
  treinamentosValidos: TreinamentoNormativo[];
  isLoading: boolean;
  selectedFuncionarioId: string | undefined;
  onPrint: () => void;
}

const FuncionarioInfoCard: React.FC<Props> = ({
  funcionario,
  treinamentosValidos,
  isLoading,
  selectedFuncionarioId,
  onPrint,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Informações do Funcionário</CardTitle>
      <CardDescription>
        Dados do funcionário e treinamentos válidos
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {isLoading && selectedFuncionarioId ? (
        <div className="flex justify-center items-center py-8">
          <p>Carregando dados do funcionário...</p>
        </div>
      ) : funcionario ? (
        <>
          <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
              {funcionario.foto ? (
                <img
                  src={funcionario.foto}
                  alt={funcionario.nome}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{funcionario.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Função</p>
                <p>{funcionario.funcao}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Matrícula</p>
                <p>{funcionario.matricula}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Treinamentos Válidos</h3>
            {treinamentosValidos.length > 0 ? (
              <ul className="space-y-2">
                {treinamentosValidos.map(treinamento => (
                  <li key={treinamento.id} className="flex justify-between items-center">
                    <span>{treinamento.treinamentoNome}</span>
                    <span className="text-sm">
                      Válido até {formatarData(treinamento.data_validade)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Este funcionário não possui treinamentos válidos.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-muted-foreground">
            Selecione um funcionário para ver suas informações
          </p>
        </div>
      )}
    </CardContent>
    {funcionario && treinamentosValidos.length > 0 && (
      <CardFooter>
        <Button onClick={onPrint} className="gap-1">
          <Printer className="h-4 w-4" />
          Gerar crachá de capacitação
        </Button>
      </CardFooter>
    )}
  </Card>
);

export default FuncionarioInfoCard;
