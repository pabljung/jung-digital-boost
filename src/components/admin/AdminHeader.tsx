import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  User, 
  Eye, 
  ExternalLink,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function AdminHeader() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com sucesso.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
      });
    }
  };

  const getEnvironmentBadge = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return <Badge variant="outline" className="text-green-600 border-green-600">DEV</Badge>;
    } else if (hostname.includes('staging') || hostname.includes('preview')) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">STAGE</Badge>;
    } else {
      return <Badge variant="outline" className="text-red-600 border-red-600">PROD</Badge>;
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Painel de Administração
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {getEnvironmentBadge()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Preview Site Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/", "_blank")}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Site</span>
              <ExternalLink className="w-3 h-3" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-jung-pink text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start space-x-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">Administrator</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@jung.com.br
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Ver Site</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowLogoutDialog(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja encerrar sua sessão administrativa? Você precisará fazer login novamente para acessar o painel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Fazer Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}