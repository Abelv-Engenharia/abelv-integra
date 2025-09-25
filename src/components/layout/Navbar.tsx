import { Bell, User, ChevronDown, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import NotificacoesDropdown from "@/components/notificacoes/NotificacoesDropdown";
import SystemLogo from "@/components/common/SystemLogo";
import { SidebarTrigger } from "@/components/ui/sidebar";
const Navbar = () => {
  const {
    profile
  } = useProfile();
  const {
    url: avatarUrl
  } = useProfileAvatarUrl(profile?.avatar_url);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema."
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive"
      });
    }
  };
  return <nav className="bg-white border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Botão de toggle da sidebar - visível em telas pequenas */}
          <div className="md:hidden">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <SystemLogo className="h-6 sm:h-8 flex-shrink-0" />
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="h-8 w-8 p-0"
                title="Página inicial"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Páginas favoritas"
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <NotificacoesDropdown />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 h-auto p-1 sm:p-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src={avatarUrl || undefined} alt={profile?.nome || "User"} />
                  <AvatarFallback>
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {profile?.nome || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email || "email@exemplo.com"}
                  </p>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuItem asChild>
                <Link to="/account/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account/settings" className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>;
};
export default Navbar;