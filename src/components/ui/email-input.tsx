import { useState, KeyboardEvent } from "react";
import { X, Mail } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface EmailInputProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const EmailInput = ({
  emails,
  onEmailsChange,
  placeholder = "Digite um e-mail e pressione Enter",
  className,
}: EmailInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail && isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      onEmailsChange([...emails, trimmedEmail]);
      setInputValue("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {emails.map((email) => (
          <Badge
            key={email}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <Mail className="h-3 w-3" />
            {email}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEmail(email)}
              className="h-4 w-4 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={emails.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[200px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Digite um e-mail e pressione Enter para adicionar
      </p>
    </div>
  );
};