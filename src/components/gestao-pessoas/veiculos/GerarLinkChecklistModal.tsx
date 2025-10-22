import { useState } from "react";
import { Link2, Copy, QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { useChecklistTokens } from "@/hooks/gestao-pessoas/useChecklistTokens";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export function GerarLinkChecklistModal() {
  const { gerarToken, isGerandoToken } = useChecklistTokens();
  const [open, setOpen] = useState(false);
  const [linkGerado, setLinkGerado] = useState<string>("");
  const [placa, setPlaca] = useState("");
  const [marcaModelo, setMarcaModelo] = useState("");
  const [condutorNome, setCondutorNome] = useState("");
  const [tipoOperacao, setTipoOperacao] = useState<"Retirada" | "Devolução">("Retirada");

  const handleGerar = () => {
    if (!placa.trim() || !marcaModelo.trim() || !condutorNome.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para gerar o link",
        variant: "destructive",
      });
      return;
    }

    gerarToken(
      {
        placa: placa.toUpperCase(),
        marca_modelo: marcaModelo,
        condutor_nome: condutorNome,
        tipo_operacao: tipoOperacao,
      },
      {
        onSuccess: (data) => {
          const link = `${window.location.origin}/checklist-publico/${data.token}`;
          setLinkGerado(link);
        },
      }
    );
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkGerado);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência",
    });
  };

  const resetForm = () => {
    setPlaca("");
    setMarcaModelo("");
    setCondutorNome("");
    setTipoOperacao("Retirada");
    setLinkGerado("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Link2 className="h-4 w-4" />
          Gerar Link Público
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Link Público para Checklist</DialogTitle>
          <DialogDescription>
            Crie um link temporário (válido por 1 hora) para que o condutor preencha o checklist sem precisar fazer login
          </DialogDescription>
        </DialogHeader>

        {!linkGerado ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="placa" className={!placa.trim() ? "text-destructive" : ""}>
                Placa *
              </Label>
              <Input
                id="placa"
                placeholder="ABC-1234"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                className={!placa.trim() ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca-modelo" className={!marcaModelo.trim() ? "text-destructive" : ""}>
                Marca/Modelo *
              </Label>
              <Input
                id="marca-modelo"
                placeholder="Ex: Toyota Corolla"
                value={marcaModelo}
                onChange={(e) => setMarcaModelo(e.target.value)}
                className={!marcaModelo.trim() ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condutor" className={!condutorNome.trim() ? "text-destructive" : ""}>
                Nome do Condutor *
              </Label>
              <Input
                id="condutor"
                placeholder="Nome completo do condutor"
                value={condutorNome}
                onChange={(e) => setCondutorNome(e.target.value)}
                className={!condutorNome.trim() ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Operação *</Label>
              <RadioGroup value={tipoOperacao} onValueChange={(value) => setTipoOperacao(value as "Retirada" | "Devolução")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Retirada" id="tipo-retirada" />
                  <Label htmlFor="tipo-retirada">Retirada do Veículo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Devolução" id="tipo-devolucao" />
                  <Label htmlFor="tipo-devolucao">Devolução do Veículo</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleGerar} disabled={isGerandoToken} className="w-full">
              {isGerandoToken ? "Gerando..." : "Gerar Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Card className="p-6 space-y-4">
              <div className="flex justify-center">
                <QRCode value={linkGerado} size={200} />
              </div>

              <div className="space-y-2">
                <Label>Link de Acesso (válido por 1 hora)</Label>
                <div className="flex gap-2">
                  <Input value={linkGerado} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={copiarLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                <p><strong>Placa:</strong> {placa}</p>
                <p><strong>Veículo:</strong> {marcaModelo}</p>
                <p><strong>Condutor:</strong> {condutorNome}</p>
                <p><strong>Operação:</strong> {tipoOperacao}</p>
              </div>
            </Card>

            <Button onClick={resetForm} variant="outline" className="w-full">
              Gerar Novo Link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
