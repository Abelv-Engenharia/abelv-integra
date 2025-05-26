
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TreinamentoFormValues } from "@/hooks/useTreinamentoForm";

interface DateTimeFieldsProps {
  form: UseFormReturn<TreinamentoFormValues>;
}

const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormField
        control={form.control}
        name="data"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Data</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem className="flex-1">
        <FormLabel>Mês</FormLabel>
        <Input 
          value={form.watch("data") ? format(form.watch("data"), "MMMM") : ""} 
          disabled 
        />
      </FormItem>
      
      <FormItem className="flex-1">
        <FormLabel>Ano</FormLabel>
        <Input 
          value={form.watch("data") ? format(form.watch("data"), "yyyy") : ""} 
          disabled 
        />
      </FormItem>
    </div>
  );
};

export default DateTimeFields;
