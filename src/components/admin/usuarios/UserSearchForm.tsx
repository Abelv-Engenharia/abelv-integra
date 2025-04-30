
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormControl 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchFormValues, searchFormSchema } from "@/types/users";

interface UserSearchFormProps {
  onSearch: (data: SearchFormValues) => void;
}

export const UserSearchForm = ({ onSearch }: UserSearchFormProps) => {
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <Form {...searchForm}>
      <form 
        onSubmit={searchForm.handleSubmit(onSearch)} 
        className="flex space-x-2 mb-6"
      >
        <FormField
          control={searchForm.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Buscar</Button>
      </form>
    </Form>
  );
};
