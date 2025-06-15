
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";

const DateTimeFields = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Campo de data com input manual + calendar */}
      <FormField
        control={control}
        name="data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data da ocorrência *</FormLabel>
            <FormControl>
              <DatePickerWithManualInput
                value={field.value}
                onChange={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hora"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora *</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mês</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="ano"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ano</FormLabel>
            <FormControl>
              <Input {...field} readOnly disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeFields;

