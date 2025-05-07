
import { Bell, LifeBuoy, LogOut, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SystemLogo from "@/components/common/SystemLogo";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { signOut } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema"
      });
      
      // Force page reload to ensure a clean state
      window.location.href = "/login";
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <SidebarTrigger />
        
        <div className="flex-1 md:flex-none">
          <SystemLogo className="h-8" />
        </div>
        
        <div className="flex-1 hidden md:flex">
          <form className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full bg-background pl-8"
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma notificação no momento.
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/account/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                  {user && <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account/support")}>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Suporte</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
