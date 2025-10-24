import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

type AtividadeCadastrada = {
  id: string
  nome: string
  descricao: string | null
}

interface AtividadeSelectorProps {
  atividades: AtividadeCadastrada[]
  atividadeSelecionada: string
  onAtividadeSelect: (atividadeId: string) => void
  children: React.ReactNode
  modulo?: 'mecanica' | 'eletrica'
}

export function AtividadeSelector({ 
  atividades, 
  atividadeSelecionada, 
  onAtividadeSelect, 
  children,
  modulo = 'mecanica'
}: AtividadeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [busca, setBusca] = useState("")
  const navigate = useNavigate()

  const atividadesFiltradas = atividades.filter(atividade =>
    atividade.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (atividade.descricao && atividade.descricao.toLowerCase().includes(busca.toLowerCase()))
  )

  const handleSelect = (atividadeId: string) => {
    onAtividadeSelect(atividadeId)
    setOpen(false)
    setBusca("")
  }

  const handleGerenciarAtividades = () => {
    setOpen(false)
    navigate(modulo === 'eletrica' ? '/operacional/eletrica-atividades' : '/operacional/atividades')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Atividade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="busca">Buscar Atividade</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Digite para buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {atividadesFiltradas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade encontrada
              </p>
            ) : (
              atividadesFiltradas.map((atividade) => (
                <Button
                  key={atividade.id}
                  variant={atividadeSelecionada === atividade.id ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleSelect(atividade.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{atividade.nome}</div>
                    {atividade.descricao && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {atividade.descricao}
                      </div>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGerenciarAtividades}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar Atividades
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelect("")}
              className="flex-1"
            >
              Limpar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}