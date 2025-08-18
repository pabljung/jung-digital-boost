import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  Eye, 
  Code, 
  AlertTriangle,
  Globe,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GlobalScript {
  id?: string;
  head_content: string;
  footer_content: string;
  is_active: boolean;
  environment: string[];
}

export function ScriptsGlobals() {
  const [scripts, setScripts] = useState<GlobalScript>({
    head_content: '',
    footer_content: '',
    is_active: true,
    environment: ['prod']
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Load existing global scripts
  useEffect(() => {
    loadGlobalScripts();
  }, []);

  const loadGlobalScripts = async () => {
    setLoading(true);
    try {
      const { data: headScript } = await supabase
        .from('script_configs')
        .select('*')
        .eq('type', 'global_head')
        .maybeSingle();

      const { data: footerScript } = await supabase
        .from('script_configs')
        .select('*')
        .eq('type', 'global_footer')
        .maybeSingle();

      setScripts({
        id: headScript?.id || footerScript?.id,
        head_content: headScript?.content || '',
        footer_content: footerScript?.content || '',
        is_active: headScript?.is_active ?? true,
        environment: headScript?.environment || ['prod']
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar scripts globais.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save head script
      if (scripts.head_content.trim()) {
        await supabase
          .from('script_configs')
          .upsert({
            name: 'Global Head Scripts',
            type: 'global_head',
            content: scripts.head_content,
            is_active: scripts.is_active,
            environment: scripts.environment
          });
      }

      // Save footer script
      if (scripts.footer_content.trim()) {
        await supabase
          .from('script_configs')
          .upsert({
            name: 'Global Footer Scripts',
            type: 'global_footer',
            content: scripts.footer_content,
            is_active: scripts.is_active,
            environment: scripts.environment
          });
      }

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'update_global_scripts',
          resource_type: 'script_config',
          details: {
            head_length: scripts.head_content.length,
            footer_length: scripts.footer_content.length,
            is_active: scripts.is_active,
            environment: scripts.environment
          }
        });

      toast({
        title: "Scripts salvos",
        description: "Scripts globais salvos com sucesso.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar scripts globais.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (field: 'head_content' | 'footer_content', value: string) => {
    setScripts(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const toggleEnvironment = (env: string) => {
    setScripts(prev => ({
      ...prev,
      environment: prev.environment.includes(env)
        ? prev.environment.filter(e => e !== env)
        : [...prev.environment, env]
    }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-jung-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando scripts globais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Globe className="w-6 h-6 mr-2 text-jung-pink" />
            Scripts Globais
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie códigos que serão aplicados em todas as páginas do site
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${scripts.is_active ? 'text-green-500' : 'text-gray-400'}`} />
            <Switch
              checked={scripts.is_active}
              onCheckedChange={(checked) => {
                setScripts(prev => ({ ...prev, is_active: checked }));
                setHasChanges(true);
              }}
            />
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-jung-pink hover:bg-jung-pink/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Environment Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ambientes Ativos</CardTitle>
          <CardDescription>
            Selecione em quais ambientes estes scripts devem ser executados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {[
              { key: 'dev', label: 'Desenvolvimento', color: 'bg-green-100 text-green-800' },
              { key: 'stage', label: 'Homologação', color: 'bg-yellow-100 text-yellow-800' },
              { key: 'prod', label: 'Produção', color: 'bg-red-100 text-red-800' }
            ].map(({ key, label, color }) => (
              <Badge
                key={key}
                className={`cursor-pointer transition-opacity ${
                  scripts.environment.includes(key) ? color : 'bg-gray-100 text-gray-400'
                }`}
                onClick={() => toggleEnvironment(key)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scripts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Head Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Scripts do Head
            </CardTitle>
            <CardDescription>
              Códigos inseridos antes do fechamento da tag &lt;/head&gt;
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="head-script">Conteúdo do Head</Label>
              <Textarea
                id="head-script"
                value={scripts.head_content}
                onChange={(e) => handleContentChange('head_content', e.target.value)}
                placeholder={`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>`}
                className="font-mono text-sm min-h-[200px]"
              />
              <div className="text-xs text-gray-500">
                {scripts.head_content.length} caracteres
              </div>
            </div>

            {scripts.head_content && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Importante:</strong> Scripts no head podem afetar o tempo de carregamento. 
                  Use async/defer quando possível.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Scripts do Footer
            </CardTitle>
            <CardDescription>
              Códigos inseridos antes do fechamento da tag &lt;/body&gt;
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer-script">Conteúdo do Footer</Label>
              <Textarea
                id="footer-script"
                value={scripts.footer_content}
                onChange={(e) => handleContentChange('footer_content', e.target.value)}
                placeholder={`<!-- Hotjar -->
<script>
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:XXXXXXX,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`}
                className="font-mono text-sm min-h-[200px]"
              />
              <div className="text-xs text-gray-500">
                {scripts.footer_content.length} caracteres
              </div>
            </div>

            {scripts.footer_content && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Dica:</strong> Scripts no footer são carregados após o conteúdo, 
                  melhorando a performance percebida.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Button */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <p className="font-medium text-orange-900">Alterações não salvas</p>
                  <p className="text-sm text-orange-700">Salve suas alterações para aplicá-las ao site</p>
                </div>
              </div>
              <Button variant="outline" className="border-orange-300 text-orange-700">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}