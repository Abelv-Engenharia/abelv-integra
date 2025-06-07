
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import SystemLogo from "@/components/common/SystemLogo";
import { signIn } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema",
        });
        
        // Force page reload to ensure a clean state
        window.location.href = "/";
      }
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-abelv-blue-light">
      <div className="flex w-full max-w-6xl mx-auto p-6 gap-8">
        {/* Left side - Logo */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <SystemLogo className="h-32 mb-6" defaultTitle="Abelv Engenharia" />
            <h1 className="text-4xl font-bold text-white mb-4">Abelv Engenharia</h1>
            <p className="text-white/80 text-lg">Sistema de Gestão Integrada</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center">Sistema de Gestão Abelv Engenharia</CardTitle>
              <CardDescription className="text-center">
                Faça login para acessar o sistema
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu.email@empresa.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Button 
                      variant="link" 
                      className="p-0 text-sm"
                      type="button"
                      onClick={() => navigate("/auth/forgot-password")}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <div className="text-center text-sm">
                  Não possui uma conta?{" "}
                  <Button variant="link" className="p-0" type="button" onClick={() => navigate("/auth/signup")}>
                    Cadastre-se
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
