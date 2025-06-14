
import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerWithManualInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: (date: Date) => boolean;
}

export function DatePickerWithManualInput({ value, onChange, disabled }: DatePickerWithManualInputProps) {
  const [open, setOpen] = React.useState(false);
  const [dateString, setDateString] = React.useState<string>(
    value && isValid(value) ? format(value, "dd/MM/yyyy") : ""
  );

  React.useEffect(() => {
    const newDateString = value && isValid(value) ? format(value, "dd/MM/yyyy") : "";
    if (newDateString !== dateString) {
      setDateString(newDateString);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setDateString(str);
    
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const parsedDate = parse(str, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate) && (!disabled || !disabled(parsedDate))) {
        onChange(parsedDate);
      } else {
        onChange(undefined);
      }
    } else {
      onChange(undefined);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const str = e.target.value;
    const parsedDate = parse(str, "dd/MM/yyyy", new Date());

    if (!isValid(parsedDate) || (disabled && disabled(parsedDate))) {
        if (value && isValid(value)) {
            setDateString(format(value, "dd/MM/yyyy"));
        } else {
            setDateString("");
        }
    }
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    if(selectedDate && isValid(selectedDate)) {
        setDateString(format(selectedDate, "dd/MM/yyyy"));
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <Input
          placeholder="dd/MM/yyyy"
          value={dateString}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="pr-10"
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className="absolute right-0 top-0 h-full rounded-l-none px-3"
          >
            <CalendarIcon className="h-4 w-4 opacity-50" />
            <span className="sr-only">Abrir calendário</span>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
