import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Info, CheckCircle2 } from "lucide-react";

interface ChecklistASOTabProps {
  validacaoId: string | null;
  onComplete: (ok: boolean) => void;
}

export default function ChecklistASOTab({ validacaoId, onComplete }: ChecklistASOTabProps) {
  const { toast } = useToast();
  const [asoLiberado, setAsoLiberado] = useState(false);
  const [dataAsoLiberado, setDataAsoLiberado] = useState("");

  // Carregar dados se já existir ou limpar se for null
  useEffect(() => {
    if (validacaoId) {
      const carregarDados = async () => {
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('aso_liberado, data_aso_liberado')
          .eq('id', validacaoId)
          .single();

        if (data && !error) {
          setAsoLiberado(data.aso_liberado || false);
          setDataAsoLiberado(data.data_aso_liberado || "");
          onComplete(data.aso_liberado || false);
        }
      };
      carregarDados();
    } else {
      // Se validacaoId for null, limpar tudo
      setAsoLiberado(false);
      setDataAsoLiberado("");
      onComplete(false);
    }
  }, [validacaoId]);

  const handleAsoLiberadoChange = async (checked: boolean) => {
    setAsoLiberado(checked);

    if (!validacaoId) {
      toast({ title: "Erro", description: "Salve os dados do colaborador primeiro", variant: "destructive" });
      return;
    }

    try {
      const updateData: any = {
        aso_liberado: checked,
        aso_ok: checked
      };

      // Se está marcando como liberado e ainda não tem data, usa a data atual
      if (checked && !dataAsoLiberado) {
        const hoje = new Date().toISOString().split('T')[0];
        updateData.data_aso_liberado = hoje;
        setDataAsoLiberado(hoje);
      } else if (!checked) {
        // Se desmarca, limpa a data
        updateData.data_aso_liberado = null;
        setDataAsoLiberado("");
      }

      const { error } = await supabase
        .from('validacao_admissao')
        .update(updateData)
        .eq('id', validacaoId);

      if (error) throw error;

      if (checked) {
        onComplete(true);
        toast({ title: "Sucesso ✓", description: "ASO validado como liberado!" });
      } else {
        onComplete(false);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleDataChange = async (novaData: string) => {
    setDataAsoLiberado(novaData);

    if (!validacaoId) return;

    try {
      const { error } = await supabase
        .from('validacao_admissao')
        .update({ data_aso_liberado: novaData })
        .eq('id', validacaoId);

      if (error) throw error;

      toast({ title: "Sucesso", description: "Data de liberação do ASO atualizada!" });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          O documento ASO deve estar anexado na página <strong>"Relação de Documentos e Prazos"</strong>. 
          Esta aba serve apenas para confirmar que o ASO foi liberado pela clínica médica.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Checklist ASO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="aso-liberado" 
              checked={asoLiberado} 
              onCheckedChange={(checked) => handleAsoLiberadoChange(checked as boolean)}
            />
            <label 
              htmlFor="aso-liberado" 
              className={`text-sm font-medium cursor-pointer ${!asoLiberado ? 'text-destructive' : ''}`}
            >
              ASO liberado pela clínica médica? *
            </label>
          </div>

          {asoLiberado && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-aso" className={!dataAsoLiberado ? 'text-destructive' : ''}>
                  Data de liberação do ASO *
                </Label>
                <Input
                  id="data-aso"
                  type="date"
                  value={dataAsoLiberado}
                  onChange={(e) => handleDataChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  ✓ ASO validado como liberado
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
