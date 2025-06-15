
import React from "react";
import { Bell, Settings, User, LogOut, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificacoesDropdown from "@/components/notificacoes/NotificacoesDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";

// Utilitário para pegar as iniciais do nome
function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { url: avatarUrl } = useProfileAvatarUrl(profile?.avatar_url);

  // Estado local para detectar se a imagem deu erro ao carregar
  const [imgError, setImgError] = React.useState(false);

  // Limpa o erro caso o avatarUrl mude (ex: user troca de imagem)
  React.useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth/login");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">GESTÃO DE SMS ABELV</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificacoesDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Se der erro ou não houver url, mostra fallback! */}
                  {avatarUrl && !imgError ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={profile?.nome || "avatar"}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center">
                      <ImageIcon size={16} className="mr-1" />
                      {getInitials(profile?.nome)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate("/account/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/account/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
