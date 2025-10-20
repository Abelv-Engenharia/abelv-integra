import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadDemonstrativoPDF } from "./GenerateDemonstrativoPDF";

interface EnviarDemonstrativoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demonstrativo: {
    prestador: string;
    email: string;
    periodo: string;
    servico: string;
    centroCusto: string;
    valorBruto: number;
    descontos: number;
    valorLiquido: number;
  };
}

export function EnviarDemonstrativoModal({
  open,
  onOpenChange,
  demonstrativo,
}: EnviarDemonstrativoModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState(demonstrativo.email);
  const [assunto, setAssunto] = useState(
    `Demonstrativo de Prestação de Serviço - ${demonstrativo.periodo}`
  );
  const [mensagem, setMensagem] = useState(
    `Olá ${demonstrativo.prestador},\n\nSegue em anexo o demonstrativo de prestação de serviço referente ao período ${demonstrativo.periodo}.\n\nAtenciosamente,\nDepartamento Pessoal`
  );
  const [enviando, setEnviando] = useState(false);

  const handleDownload = () => {
    const pdfData = {
      prestador: demonstrativo.prestador,
      email: demonstrativo.email,
      periodo: demonstrativo.periodo,
      items: [
        { codigo: '001', descricao: 'Base (Salário)', proventos: demonstrativo.valorBruto, descontos: 0 },
        { codigo: '002', descricao: 'Descontos Diversos', proventos: 0, descontos: demonstrativo.descontos },
      ],
    };
    
    downloadDemonstrativoPDF(pdfData);
    
    toast({
      title: "Download concluído",
      description: "O demonstrativo foi baixado com sucesso.",
    });
  };

  const handleEnviar = async () => {
    if (!email || !email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
      });
      return;
    }

    setEnviando(true);
    
    // Simular envio de email (futuramente integrar com backend/Supabase)
    setTimeout(() => {
      toast({
        title: "Demonstrativo enviado",
        description: `O demonstrativo foi enviado para ${email} com sucesso.`,
      });
      setEnviando(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Demonstrativo
          </DialogTitle>
          <DialogDescription>
            Envie o demonstrativo de prestação de serviço por email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações do Demonstrativo */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Prestador:</span>
              <span className="text-sm">{demonstrativo.prestador}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Período:</span>
              <span className="text-sm">{demonstrativo.periodo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Valor Líquido:</span>
              <span className="text-sm font-bold text-primary">
                R$ {(demonstrativo.valorLiquido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Do Prestador</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className={!email ? "border-red-500" : ""}
            />
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto</Label>
            <Input
              id="assunto"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className={!assunto ? "border-red-500" : ""}
            />
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={6}
              placeholder="Digite a mensagem que acompanhará o demonstrativo..."
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={enviando}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Pdf
          </Button>
          <Button
            onClick={handleEnviar}
            disabled={enviando || !email || !assunto}
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando ? "Enviando..." : "Enviar Demonstrativo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
