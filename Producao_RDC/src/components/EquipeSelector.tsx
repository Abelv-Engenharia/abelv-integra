import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Minus, Users } from "lucide-react"

export type FuncaoEquipe = {
  funcao: string
  quantidade: number
}

type EquipeSelectorProps = {
  value: FuncaoEquipe[]
  onChange: (equipe: FuncaoEquipe[]) => void
}

const funcoesDisponiveis = [
  "Soldador",
  "Encanador", 
  "Mecânico",
  "Meio Oficial",
  "Ajudante",
  "Pintor"
]

export function EquipeSelector({ value, onChange }: EquipeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFuncaoToggle = (funcao: string, checked: boolean) => {
    if (checked) {
      const novaFuncao: FuncaoEquipe = { funcao, quantidade: 1 }
      onChange([...value, novaFuncao])
    } else {
      onChange(value.filter(f => f.funcao !== funcao))
    }
  }

  const handleQuantidadeChange = (funcao: string, delta: number) => {
    onChange(value.map(f => 
      f.funcao === funcao 
        ? { ...f, quantidade: Math.max(1, f.quantidade + delta) }
        : f
    ))
  }

  const isFuncaoSelecionada = (funcao: string) => {
    return value.some(f => f.funcao === funcao)
  }

  const getQuantidade = (funcao: string) => {
    const funcaoObj = value.find(f => f.funcao === funcao)
    return funcaoObj?.quantidade || 1
  }

  const getDisplayText = () => {
    if (value.length === 0) return "Selecionar equipe"
    return value.map(f => `${f.quantidade} ${f.funcao}`).join(", ")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="min-w-[200px] justify-start text-left"
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="truncate">{getDisplayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Selecionar Equipe</h4>
              
              <div className="space-y-3">
                {funcoesDisponiveis.map((funcao) => (
                  <div key={funcao} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={funcao}
                        checked={isFuncaoSelecionada(funcao)}
                        onCheckedChange={(checked) => 
                          handleFuncaoToggle(funcao, checked as boolean)
                        }
                      />
                      <Label htmlFor={funcao} className="text-sm">
                        {funcao}
                      </Label>
                    </div>
                    
                    {isFuncaoSelecionada(funcao) && (
                      <div className="flex items-center space-x-2 ml-6">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
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
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantidadeChange(funcao, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}