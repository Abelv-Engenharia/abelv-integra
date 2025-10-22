import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Minus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type FuncaoEquipeEletrica = {
  funcao: string
  quantidade: number
}

interface EquipeSeletorEletricaProps {
  value: FuncaoEquipeEletrica[]
  onChange: (equipe: FuncaoEquipeEletrica[]) => void
}

const funcoesDisponiveis = [
  "Montador",
  "Força e Controle", 
  "Meio Oficial",
  "Ajudante",
  "Instrumentista",
  "Técnico de Elétrica",
  "Líder de Elétrica",
  "Soldador",
  "Pintor"
]

export function EquipeSeletorEletrica({ value, onChange }: EquipeSeletorEletricaProps) {
  const [open, setOpen] = useState(false)

  const handleFuncaoToggle = (funcao: string, checked: boolean) => {
    if (checked) {
      // Adicionar função com quantidade 1
      onChange([...value, { funcao, quantidade: 1 }])
    } else {
      // Remover função
      onChange(value.filter(item => item.funcao !== funcao))
    }
  }

  const handleQuantidadeChange = (funcao: string, delta: number) => {
    onChange(value.map(item => {
      if (item.funcao === funcao) {
        const novaQuantidade = Math.max(1, item.quantidade + delta)
        return { ...item, quantidade: novaQuantidade }
      }
      return item
    }))
  }

  const isFuncaoSelecionada = (funcao: string) => {
    return value.some(item => item.funcao === funcao)
  }

  const getQuantidade = (funcao: string) => {
    const item = value.find(item => item.funcao === funcao)
    return item?.quantidade || 1
  }

  const getDisplayText = () => {
    if (value.length === 0) return "Selecione as funções da equipe..."
    
    return value.map(item => `${item.funcao} (${item.quantidade})`).join(", ")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            value.length === 0 && "text-muted-foreground"
          )}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 space-y-4">
          <div className="font-medium text-sm">Selecione as funções da equipe:</div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {funcoesDisponiveis.map((funcao) => (
              <div key={funcao} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={funcao}
                    checked={isFuncaoSelecionada(funcao)}
                    onCheckedChange={(checked) => handleFuncaoToggle(funcao, checked as boolean)}
                  />
                  <Label 
                    htmlFor={funcao} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {funcao}
                  </Label>
                </div>
                
                {isFuncaoSelecionada(funcao) && (
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantidadeChange(funcao, -1)}
                      disabled={getQuantidade(funcao) <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">
                      {getQuantidade(funcao)}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantidadeChange(funcao, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}