
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AbsenceFields = () => {
  const { control, watch } = useFormContext();
  const houveAfastamento = watch("houveAfastamento");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="houveAfastamento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Houve afastamento?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="diasPerdidos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dias perdidos</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                disabled={houveAfastamento !== "Sim"} 
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="diasDebitados"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dias debitados</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                disabled={houveAfastamento !== "Sim"} 
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AbsenceFields;
