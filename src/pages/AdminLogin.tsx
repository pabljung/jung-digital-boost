import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user is admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@jungcria.com";
        if (session.user.email === adminEmail) {
          setIsAuthenticated(true);
        }
      }
    };
    checkAuth();
  }, []);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTime && lockoutTime > Date.now()) {
      const interval = setInterval(() => {
        if (lockoutTime <= Date.now()) {
          setLockoutTime(null);
          setLoginAttempts(0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const isLocked = lockoutTime && lockoutTime > Date.now();
  const remainingTime = isLocked ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        variant: "destructive",
        title: "Conta bloqueada",
        description: `Aguarde ${remainingTime} segundos para tentar novamente.`,
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          const lockTime = Date.now() + (30 * 60 * 1000); // 30 minutes
          setLockoutTime(lockTime);
          toast({
            variant: "destructive",
            title: "Muitas tentativas de login",
            description: "Conta bloqueada por 30 minutos por segurança.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: `Credenciais inválidas. ${5 - newAttempts} tentativas restantes.`,
          });
        }
        return;
      }

      // Check if user is authorized admin
      const adminEmail = process.env.ADMIN_EMAIL || "admin@jungcria.com";
      if (data.user?.email !== adminEmail) {
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
        });
        return;
      }

      setLoginAttempts(0);
      setLockoutTime(null);
      setIsAuthenticated(true);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jung-dark via-gray-900 to-jung-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-jung-pink/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-jung-pink" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">Acesso restrito - Jung Voice & Performance</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Login Administrativo</CardTitle>
            <CardDescription className="text-gray-300">
              Entre com suas credenciais de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLocked && (
              <Alert className="mb-6 border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">
                  Conta bloqueada por segurança. Aguarde {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} para tentar novamente.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isLocked}
                  className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 focus:border-jung-pink"
                  placeholder="admin@jungcria.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || isLocked}
                  className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 focus:border-jung-pink"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || isLocked}
                className="w-full bg-jung-pink hover:bg-jung-pink/90 text-white"
              >
                {loading ? "Entrando..." : "Entrar no Painel"}
              </Button>

              {loginAttempts > 0 && !isLocked && (
                <p className="text-sm text-orange-400 text-center">
                  {5 - loginAttempts} tentativas restantes
                </p>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                Esta área é restrita. Todos os acessos são registrados e monitorados.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            ← Voltar ao site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;