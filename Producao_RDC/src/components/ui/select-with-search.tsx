import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface SelectWithSearchProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}

export function SelectWithSearch({
  value,
  onValueChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Digite para buscar...",
  options,
  disabled
}: SelectWithSearchProps) {
  const [searchText, setSearchText] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredOptions = React.useMemo(() => {
    if (!searchText) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [options, searchText])

  // Resetar busca ao fechar o dropdown
  React.useEffect(() => {
    if (!open) {
      setSearchText("")
    }
  }, [open])

  // Garantir foco quando o dropdown abre
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Timeout para garantir que o DOM foi renderizado
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  return (
    <Select value={value} onValueChange={onValueChange} open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Campo de busca fixo no topo */}
        <div className="flex items-center border-b px-3 pb-2 pt-2 sticky top-0 bg-popover z-10">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        
        {/* Lista de opções filtradas */}
        <SelectPrimitive.Viewport className="p-1 max-h-[300px] overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma linha encontrada
            </div>
          ) : (
            filteredOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectPrimitive.Viewport>
      </SelectContent>
    </Select>
  )
}
