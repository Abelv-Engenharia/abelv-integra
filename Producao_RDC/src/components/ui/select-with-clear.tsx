import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectWithClearProps {
  value?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
  clearable?: boolean
  placeholder?: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

const SelectWithClear = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  SelectWithClearProps
>(({ 
  value, 
  onValueChange, 
  onClear, 
  clearable = false, 
  placeholder,
  children,
  disabled,
  className,
  ...props 
}, ref) => {
  const showClearButton = clearable && value && value.trim() !== "" && !disabled

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClear?.()
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled} {...props}>
      <div className="relative">
        <SelectTrigger ref={ref} className={cn("pr-8", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none disabled:pointer-events-none"
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Limpar seleção</span>
          </button>
        )}
      </div>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
})

SelectWithClear.displayName = "SelectWithClear"

export { SelectWithClear }