import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type JuntaSelecionada = {
  id: string
  numero_junta: string
}

export type JuntaMultiSelectorProps = {
  value: string[]
  onChange: (juntasIds: string[]) => void
  juntasDisponiveis: { id: string; numero_junta: string; linha_id: string }[]
  juntasBloqueadas: string[]
  disabled?: boolean
}

export function JuntaMultiSelector({ 
  value, 
  onChange, 
  juntasDisponiveis, 
  juntasBloqueadas,
  disabled = false 
}: JuntaMultiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleJuntaToggle = (juntaId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, juntaId])
    } else {
      onChange(value.filter(id => id !== juntaId))
    }
  }

  const removerJunta = (juntaId: string) => {
    onChange(value.filter(id => id !== juntaId))
  }

  const juntasSelecionadas = juntasDisponiveis.filter(junta => value.includes(junta.id))

  const getDisplayText = () => {
    if (value.length === 0) return "Selecionar juntas"
    if (value.length === 1) return `${juntasSelecionadas[0]?.numero_junta || "1 junta"}`
    return `${value.length} juntas selecionadas`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="min-w-[200px] justify-between"
          disabled={disabled}
        >
          <span className="truncate">{getDisplayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium">Selecionar Juntas</div>
          
          {/* Juntas selecionadas */}
          {juntasSelecionadas.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Selecionadas:</div>
              <div className="flex flex-wrap gap-1">
                {juntasSelecionadas.map((junta) => (
                  <Badge
                    key={junta.id}
                    variant="secondary"
                    className="text-xs pr-1"
                  >
                    {junta.numero_junta}
                    <button
                      onClick={() => removerJunta(junta.id)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Lista de juntas disponíveis */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {juntasDisponiveis.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhuma junta disponível
              </div>
            ) : (
              juntasDisponiveis.map((junta) => {
                const isSelected = value.includes(junta.id)
                const isBloqueada = juntasBloqueadas.includes(junta.id)
                
                return (
                  <div
                    key={junta.id}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md hover:bg-accent",
                      isBloqueada && "opacity-50"
                    )}
                  >
                    <Checkbox
                      id={`junta-${junta.id}`}
                      checked={isSelected}
                      disabled={isBloqueada}
                      onCheckedChange={(checked) =>
                        handleJuntaToggle(junta.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`junta-${junta.id}`}
                      className={cn(
                        "text-sm font-medium cursor-pointer flex-1",
                        isBloqueada && "text-destructive line-through"
                      )}
                    >
                      {junta.numero_junta}
                      {isBloqueada && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Bloqueada)
                        </span>
                      )}
                    </label>
                  </div>
                )
              })
            )}
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}