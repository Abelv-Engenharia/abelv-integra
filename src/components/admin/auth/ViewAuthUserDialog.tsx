
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, User } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthUser, Profile } from "@/types/users";
import { 
  fetchUserById, 
  updateUser, 
  getUserRoles,
  updateUserRole
} from "@/services/authAdminService";

interface ViewAuthUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  profiles: Profile[];
  onUserUpdated: () => void;
}

export const ViewAuthUserDialog = ({
  open,
  onOpenChange,
  user,
  profiles,
  onUserUpdated,
}: ViewAuthUserDialogProps) => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch complete user data
          const userData = await fetchUserById(user.id);
          setUserData(userData);
          
          // Fetch user roles
          const roles = await getUserRoles(user.id);
          setUserRoles(roles);
          
          // Set selected role if exists
          if (roles && roles.length > 0) {
            setSelectedRole(roles[0].perfil_id.toString());
          } else {
            setSelectedRole("");
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os detalhes do usuário.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [open, user, toast]);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  const isUserConfirmed = () => {
    return userData?.email_confirmed_at !== null;
  };

  const isUserBlocked = () => {
    return userData?.banned_until !== null;
  };

  const handleConfirmUser = async () => {
    if (!userData) return;
    
    setIsUpdating(true);
    try {
      await updateUser(userData.id, {
        email_confirm: true,
      });
      
      // Refresh user data
      const updatedUser = await fetchUserById(userData.id);
      setUserData(updatedUser);
      
      toast({
        title: "Usuário confirmado",
        description: "O email do usuário foi confirmado com sucesso.",
      });
      
      onUserUpdated();
    } catch (error) {
      console.error("Erro ao confirmar usuário:", error);
      toast({
        title: "Erro ao confirmar usuário",
        description: "Não foi possível confirmar o email do usuário.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockUser = async () => {
    if (!userData) return;
    
    setIsUpdating(true);
    try {
      // Block for 100 years (effectively permanent)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 100);
      
      await updateUser(userData.id, {
        banned_until: futureDate.toISOString(),
      });
      
      // Refresh user data
      const updatedUser = await fetchUserById(userData.id);
      setUserData(updatedUser);
      
      toast({
        title: "Usuário bloqueado",
        description: "O usuário foi bloqueado com sucesso.",
      });
      
      onUserUpdated();
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
      toast({
        title: "Erro ao bloquear usuário",
        description: "Não foi possível bloquear o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!userData) return;
    
    setIsUpdating(true);
    try {
      await updateUser(userData.id, {
        banned_until: null,
      });
      
      // Refresh user data
      const updatedUser = await fetchUserById(userData.id);
      setUserData(updatedUser);
      
      toast({
        title: "Usuário desbloqueado",
        description: "O usuário foi desbloqueado com sucesso.",
      });
      
      onUserUpdated();
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
      toast({
        title: "Erro ao desbloquear usuário",
        description: "Não foi possível desbloquear o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!userData || !selectedRole) return;
    
    setIsUpdating(true);
    try {
      await updateUserRole(userData.id, parseInt(selectedRole));
      
      // Refresh user roles
      const roles = await getUserRoles(userData.id);
      setUserRoles(roles);
      
      toast({
        title: "Perfil atualizado",
        description: "O perfil do usuário foi atualizado com sucesso.",
      });
      
      onUserUpdated();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar o perfil do usuário.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          userData && (
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="roles">Perfil</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/50 p-3 rounded-full">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{userData.email}</h3>
                    <p className="text-sm text-muted-foreground">ID: {userData.id}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Criado em</h4>
                    <p>{formatDate(userData.created_at)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Último login</h4>
                    <p>{formatDate(userData.last_sign_in_at)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Email confirmado em</h4>
                    <p>{formatDate(userData.email_confirmed_at)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Provedor</h4>
                    <p>{userData.app_metadata?.provider || "Email/Senha"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <Badge 
                      variant={isUserBlocked() ? "destructive" : isUserConfirmed() ? "default" : "outline"}
                    >
                      {isUserBlocked() 
                        ? "Bloqueado" 
                        : isUserConfirmed() 
                          ? "Confirmado" 
                          : "Pendente"}
                    </Badge>
                  </div>
                </div>
                
                {/* Metadata section */}
                {userData.user_metadata && Object.keys(userData.user_metadata).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Metadados do Usuário</h4>
                      <pre className="p-2 bg-muted rounded-md text-xs overflow-auto max-h-[200px]">
                        {JSON.stringify(userData.user_metadata, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="status" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Gerenciar Status</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Altere o status de confirmação ou bloqueio do usuário.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {!isUserConfirmed() && (
                      <Button 
                        variant="outline"
                        onClick={handleConfirmUser} 
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        Confirmar Email
                      </Button>
                    )}
                    
                    {isUserBlocked() ? (
                      <Button 
                        variant="outline" 
                        onClick={handleUnblockUser}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        Desbloquear Usuário
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        onClick={handleBlockUser}
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                        Bloquear Usuário
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="roles" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Perfil do Usuário</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Atribua um perfil ao usuário para definir suas permissões.
                  </p>
                  
                  {userRoles.length > 0 ? (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Perfil Atual:</h4>
                      {userRoles.map((role, index) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <div className="font-medium">{role.perfis?.nome || "Perfil sem nome"}</div>
                          {role.perfis?.permissoes && (
                            <div className="mt-2">
                              <h5 className="text-xs font-semibold mb-1">Permissões:</h5>
                              <div className="grid grid-cols-2 gap-1">
                                {Object.entries(role.perfis.permissoes).map(([key, value]: [string, any]) => (
                                  <div key={key} className="flex items-center gap-1 text-xs">
                                    <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span>{key}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-muted rounded-md text-sm text-muted-foreground">
                      Este usuário não possui perfil atribuído.
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Selecione um Perfil
                      </label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id.toString()}>
                              {profile.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleUpdateRole} 
                      disabled={isUpdating || !selectedRole}
                    >
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Atualizar Perfil
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
