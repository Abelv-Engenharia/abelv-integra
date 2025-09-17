import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SystemLogo from "@/components/common/SystemLogo";
import { signInWithAzure } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleAzureLogin = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await signInWithAzure();
      if (error) {
        throw error;
      }
      // O redirecionamento será tratado automaticamente pelo Azure OAuth
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login com Azure";
      if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  return <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{
    backgroundImage: `url('/fundo-login.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }}>
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-black/30">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Abelv Integra</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta Azure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Use sua conta corporativa da Microsoft para acessar o sistema
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={handleAzureLogin} className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Redirecionando..." : "Entrar com Microsoft Azure"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Login;