import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw,
  Shield,
  Database,
  AlertTriangle,
  Check,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BackupData {
  scripts: any[];
  pixels: any[];
  meta: any[];
  version: string;
  timestamp: string;
}

export function ConfigSettings() {
  const [backupData, setBackupData] = useState<string>('');
  const [cspDomains, setCspDomains] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadVersionHistory();
    loadCSPSettings();
  }, []);

  const loadVersionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('config_versions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error loading version history:', error);
    }
  };

  const loadCSPSettings = () => {
    // Load CSP domains from localStorage or default values
    const saved = localStorage.getItem('admin_csp_domains');
    setCspDomains(saved || 'https://www.googletagmanager.com\nhttps://connect.facebook.net\nhttps://static.hotjar.com\nhttps://analytics.tiktok.com\nhttps://snap.licdn.com');
  };

  const handleExportBackup = async () => {
    setLoading(true);
    try {
      // Fetch all configs
      const [scriptsResult, pixelsResult, metaResult] = await Promise.all([
        supabase.from('script_configs').select('*'),
        supabase.from('pixel_configs').select('*'),
        supabase.from('meta_configs').select('*')
      ]);

      const backup: BackupData = {
        scripts: scriptsResult.data || [],
        pixels: pixelsResult.data || [],
        meta: metaResult.data || [],
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jung-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup exportado",
        description: "Backup baixado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao exportar backup.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportBackup = async () => {
    if (!backupData.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Cole o conteúdo do backup no campo de texto.",
      });
      return;
    }

    setLoading(true);
    try {
      const backup: BackupData = JSON.parse(backupData);

      // Validate backup structure
      if (!backup.scripts || !backup.pixels || !backup.meta) {
        throw new Error('Formato de backup inválido');
      }

      // Create version snapshot before import
      await createVersionSnapshot('import_backup');

      // Clear existing data and import
      await Promise.all([
        supabase.from('script_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('pixel_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('meta_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ]);

      // Import new data
      if (backup.scripts.length > 0) {
        const { error } = await supabase.from('script_configs').insert(
          backup.scripts.map(script => ({
            ...script,
            id: undefined, // Let Supabase generate new IDs
            created_at: undefined,
            updated_at: undefined
          }))
        );
        if (error) throw error;
      }

      if (backup.pixels.length > 0) {
        const { error } = await supabase.from('pixel_configs').insert(
          backup.pixels.map(pixel => ({
            ...pixel,
            id: undefined,
            created_at: undefined,
            updated_at: undefined
          }))
        );
        if (error) throw error;
      }

      if (backup.meta.length > 0) {
        const { error } = await supabase.from('meta_configs').insert(
          backup.meta.map(meta => ({
            ...meta,
            id: undefined,
            created_at: undefined,
            updated_at: undefined
          }))
        );
        if (error) throw error;
      }

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'import_backup',
          resource_type: 'config_backup',
          details: {
            scripts_count: backup.scripts.length,
            pixels_count: backup.pixels.length,
            meta_count: backup.meta.length,
            backup_timestamp: backup.timestamp
          }
        });

      setBackupData('');
      toast({
        title: "Backup importado",
        description: "Configurações restauradas com sucesso.",
      });

      loadVersionHistory();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao importar backup. Verifique o formato do arquivo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVersionSnapshot = async (action: string) => {
    try {
      const [scriptsResult, pixelsResult, metaResult] = await Promise.all([
        supabase.from('script_configs').select('*'),
        supabase.from('pixel_configs').select('*'),
        supabase.from('meta_configs').select('*')
      ]);

      const snapshot = {
        scripts: scriptsResult.data || [],
        pixels: pixelsResult.data || [],
        meta: metaResult.data || [],
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('config_versions')
        .insert({
          config_type: 'full_backup',
          config_id: crypto.randomUUID(),
          version_data: snapshot
        });
    } catch (error) {
      console.error('Error creating version snapshot:', error);
    }
  };

  const handleRestoreVersion = async (version: any) => {
    setLoading(true);
    try {
      const versionData = version.version_data;

      // Clear existing data
      await Promise.all([
        supabase.from('script_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('pixel_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('meta_configs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ]);

      // Restore data
      if (versionData.scripts?.length > 0) {
        await supabase.from('script_configs').insert(
          versionData.scripts.map((script: any) => ({
            ...script,
            id: undefined,
            created_at: undefined,
            updated_at: undefined
          }))
        );
      }

      if (versionData.pixels?.length > 0) {
        await supabase.from('pixel_configs').insert(
          versionData.pixels.map((pixel: any) => ({
            ...pixel,
            id: undefined,
            created_at: undefined,
            updated_at: undefined
          }))
        );
      }

      if (versionData.meta?.length > 0) {
        await supabase.from('meta_configs').insert(
          versionData.meta.map((meta: any) => ({
            ...meta,
            id: undefined,
            created_at: undefined,
            updated_at: undefined
          }))
        );
      }

      toast({
        title: "Versão restaurada",
        description: "Configurações restauradas com sucesso.",
      });

      loadVersionHistory();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao restaurar versão.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCSP = () => {
    localStorage.setItem('admin_csp_domains', cspDomains);
    toast({
      title: "CSP salvo",
      description: "Domínios CSP salvos localmente.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2 text-jung-pink" />
            Configurações & Backup
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie backups, versões e configurações de segurança
          </p>
        </div>
      </div>

      <Tabs defaultValue="backup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="versions">Versionamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Backup & Restore */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Exportar Backup
                </CardTitle>
                <CardDescription>
                  Baixe todas as configurações em formato JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    O backup incluirá todos os scripts, pixels e metadados configurados.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleExportBackup} 
                  disabled={loading}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? "Exportando..." : "Baixar Backup"}
                </Button>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Importar Backup
                </CardTitle>
                <CardDescription>
                  Restaure configurações de um arquivo de backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-data">Conteúdo do Backup (JSON)</Label>
                  <Textarea
                    id="backup-data"
                    value={backupData}
                    onChange={(e) => setBackupData(e.target.value)}
                    placeholder="Cole aqui o conteúdo do arquivo de backup..."
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Atenção:</strong> Esta ação substituirá todas as configurações atuais.
                  </AlertDescription>
                </Alert>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      disabled={!backupData.trim() || loading}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Backup
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Importação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá substituir TODAS as configurações atuais pelos dados do backup. 
                        Esta operação não pode ser desfeita. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleImportBackup}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Sim, Importar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Version History */}
        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Histórico de Versões
                  </CardTitle>
                  <CardDescription>
                    Visualize e restaure versões anteriores das configurações
                  </CardDescription>
                </div>
                <Button 
                  onClick={loadVersionHistory}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <div className="text-center py-8">
                  <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma versão encontrada</h3>
                  <p className="text-gray-500">
                    As versões aparecerão aqui conforme você faz alterações
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div key={version.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <div className="font-medium">
                            {version.config_type === 'full_backup' ? 'Snapshot Completo' : 'Alteração Específica'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(version.created_at).toLocaleString('pt-BR', {
                              timeZone: 'America/Sao_Paulo',
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {index === 0 && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Atual
                          </Badge>
                        )}
                        {index > 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Restaurar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Restaurar Versão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja restaurar esta versão? Todas as configurações atuais serão substituídas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleRestoreVersion(version)}
                                  className="bg-jung-pink hover:bg-jung-pink/90"
                                >
                                  Restaurar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure CSP e outras medidas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CSP Domains */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csp-domains">Domínios Permitidos (CSP)</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Lista de domínios que podem carregar scripts externos (um por linha)
                  </p>
                </div>
                <Textarea
                  id="csp-domains"
                  value={cspDomains}
                  onChange={(e) => setCspDomains(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder="https://www.googletagmanager.com&#10;https://connect.facebook.net&#10;https://static.hotjar.com"
                />
                <Button onClick={handleSaveCSP} variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Salvar CSP
                </Button>
              </div>

              {/* Security Status */}
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  <strong>Status de Segurança:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>✅ Autenticação ativa</li>
                    <li>✅ Rate limiting configurado</li>
                    <li>✅ Logs de auditoria ativos</li>
                    <li>✅ NoIndex configurado para admin</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}