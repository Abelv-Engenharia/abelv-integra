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
      const {
        data,
        error
      } = await signIn(email, password);
      if (error) {
        throw error;
      }
      if (data?.user) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema"
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
  return <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{
    backgroundImage: `url('/lovable-uploads/2929fa74-d69a-47b3-aeee-d6c913144292.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}>
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-black/30">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
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
                <Input id="email" type="email" placeholder="seu.email@empresa.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="p-0 text-sm" type="button" onClick={() => navigate("/auth/forgot-password")}>
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>;
};
export default Login;