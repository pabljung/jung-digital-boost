import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Activity,
  AlertTriangle,
  Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PixelConfig {
  id?: string;
  name: string;
  pixel_type: string;
  pixel_id: string;
  is_active: boolean;
  environment: string[];
  additional_config?: any;
}

const pixelTypes = [
  {
    key: 'google_gtag',
    name: 'Google Analytics (GA4)',
    description: 'Google Analytics 4',
    placeholder: 'G-XXXXXXXXXX',
    icon: '📊'
  },
  {
    key: 'google_ads',
    name: 'Google Ads',
    description: 'Google Ads Conversion Tracking',
    placeholder: 'AW-XXXXXXXXXX',
    icon: '🎯'
  },
  {
    key: 'meta_pixel',
    name: 'Meta Pixel (Facebook)',
    description: 'Facebook/Instagram Pixel',
    placeholder: '123456789012345',
    icon: '📘'
  },
  {
    key: 'linkedin_insight',
    name: 'LinkedIn Insight Tag',
    description: 'LinkedIn Conversion Tracking',
    placeholder: '12345',
    icon: '💼'
  },
  {
    key: 'tiktok_pixel',
    name: 'TikTok Pixel',
    description: 'TikTok Ads Pixel',
    placeholder: 'C4XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    icon: '🎵'
  },
  {
    key: 'hotjar',
    name: 'Hotjar',
    description: 'Heatmaps e Session Recording',
    placeholder: '1234567',
    icon: '🔥'
  }
];

export function PixelManager() {
  const [pixels, setPixels] = useState<PixelConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPixel, setEditingPixel] = useState<PixelConfig | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPixels();
  }, []);

  const loadPixels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pixel_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPixels(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar pixels.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePixelCode = (pixel: PixelConfig): string => {
    switch (pixel.pixel_type) {
      case 'google_gtag':
        return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixel.pixel_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixel.pixel_id}');
</script>`;

      case 'google_ads':
        return `<!-- Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixel.pixel_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixel.pixel_id}');
</script>`;

      case 'meta_pixel':
        return `<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel.pixel_id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixel.pixel_id}&ev=PageView&noscript=1"
/></noscript>`;

      case 'linkedin_insight':
        return `<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
_linkedin_partner_id = "${pixel.pixel_id}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${pixel.pixel_id}&fmt=gif" />
</noscript>`;

      case 'tiktok_pixel':
        return `<!-- TikTok Pixel -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${pixel.pixel_id}');
  ttq.page();
}(window, document, 'ttq');
</script>`;

      case 'hotjar':
        return `<!-- Hotjar -->
<script>
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:${pixel.pixel_id},hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`;

      default:
        return `<!-- Custom Pixel: ${pixel.name} -->
<!-- ID: ${pixel.pixel_id} -->`;
    }
  };

  const handleSavePixel = async (pixel: PixelConfig) => {
    setSaving(true);
    try {
      // Generate the pixel code
      const generatedCode = generatePixelCode(pixel);

      const pixelData = {
        name: pixel.name,
        pixel_type: pixel.pixel_type,
        pixel_id: pixel.pixel_id,
        is_active: pixel.is_active,
        environment: pixel.environment,
        additional_config: { generated_code: generatedCode }
      };

      let result;
      if (pixel.id) {
        result = await supabase
          .from('pixel_configs')
          .update(pixelData)
          .eq('id', pixel.id);
      } else {
        result = await supabase
          .from('pixel_configs')
          .insert(pixelData);
      }

      if (result.error) throw result.error;

      // Also create a script config entry for the generated code
      await supabase
        .from('script_configs')
        .upsert({
          name: `${pixel.name} - Pixel`,
          type: 'global_head',
          content: generatedCode,
          is_active: pixel.is_active,
          environment: pixel.environment
        });

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: pixel.id ? 'update_pixel' : 'create_pixel',
          resource_type: 'pixel_config',
          resource_id: pixel.id,
          details: {
            name: pixel.name,
            pixel_type: pixel.pixel_type,
            is_active: pixel.is_active
          }
        });

      toast({
        title: "Pixel salvo",
        description: `${pixel.name} configurado com sucesso.`,
      });

      setShowDialog(false);
      setEditingPixel(null);
      loadPixels();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar pixel.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePixel = async (pixel: PixelConfig) => {
    try {
      await supabase
        .from('pixel_configs')
        .delete()
        .eq('id', pixel.id);

      // Also remove related script config
      await supabase
        .from('script_configs')
        .delete()
        .eq('name', `${pixel.name} - Pixel`);

      toast({
        title: "Pixel removido",
        description: `${pixel.name} removido com sucesso.`,
      });

      loadPixels();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao remover pixel.",
      });
    }
  };

  const openEditDialog = (pixel?: PixelConfig) => {
    setEditingPixel(pixel || {
      name: '',
      pixel_type: '',
      pixel_id: '',
      is_active: true,
      environment: ['prod']
    });
    setShowDialog(true);
  };

  const getPixelTypeInfo = (type: string) => {
    return pixelTypes.find(p => p.key === type) || pixelTypes[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-jung-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando pixels...</p>
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
            <Tag className="w-6 h-6 mr-2 text-jung-pink" />
            Pixels & Tags
          </h1>
          <p className="text-gray-600 mt-1">
            Configure pixels de tracking de forma rápida e fácil
          </p>
        </div>
        
        <Button onClick={() => openEditDialog()} className="bg-jung-pink hover:bg-jung-pink/90">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pixel
        </Button>
      </div>

      {/* Quick Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pixelTypes.slice(0, 6).map((type) => {
          const existingPixel = pixels.find(p => p.pixel_type === type.key);
          
          return (
            <Card key={type.key} className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => openEditDialog(existingPixel)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <CardTitle className="text-sm">{type.name}</CardTitle>
                      <CardDescription className="text-xs">{type.description}</CardDescription>
                    </div>
                  </div>
                  {existingPixel ? (
                    <div className={`w-3 h-3 rounded-full ${existingPixel.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              {existingPixel && (
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">{existingPixel.pixel_id}</span>
                    <div className="flex space-x-1">
                      {existingPixel.environment.map(env => (
                        <Badge key={env} variant="outline" className="text-xs px-1">
                          {env.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Active Pixels List */}
      {pixels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pixels Configurados</CardTitle>
            <CardDescription>
              Gerencie todos os pixels ativos no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pixels.map((pixel) => {
                const typeInfo = getPixelTypeInfo(pixel.pixel_type);
                
                return (
                  <div key={pixel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{typeInfo.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{pixel.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${pixel.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{pixel.pixel_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {pixel.environment.map(env => (
                          <Badge key={env} variant="outline" className="text-xs">
                            {env.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(pixel)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePixel(pixel)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPixel?.id ? 'Editar Pixel' : 'Adicionar Pixel'}
            </DialogTitle>
            <DialogDescription>
              Configure um pixel de tracking para coletar dados de conversão
            </DialogDescription>
          </DialogHeader>

          {editingPixel && (
            <div className="space-y-6">
              {/* Pixel Type */}
              <div className="space-y-2">
                <Label htmlFor="pixel-type">Tipo de Pixel</Label>
                <Select
                  value={editingPixel.pixel_type}
                  onValueChange={(value) => {
                    const typeInfo = getPixelTypeInfo(value);
                    setEditingPixel({
                      ...editingPixel, 
                      pixel_type: value,
                      name: editingPixel.name || typeInfo.name
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de pixel" />
                  </SelectTrigger>
                  <SelectContent>
                    {pixelTypes.map(type => (
                      <SelectItem key={type.key} value={type.key}>
                        <div className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name and ID */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pixel-name">Nome</Label>
                  <Input
                    id="pixel-name"
                    value={editingPixel.name}
                    onChange={(e) => setEditingPixel({...editingPixel, name: e.target.value})}
                    placeholder="Nome descritivo para este pixel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixel-id">ID do Pixel</Label>
                  <Input
                    id="pixel-id"
                    value={editingPixel.pixel_id}
                    onChange={(e) => setEditingPixel({...editingPixel, pixel_id: e.target.value})}
                    placeholder={getPixelTypeInfo(editingPixel.pixel_type).placeholder}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    {getPixelTypeInfo(editingPixel.pixel_type).description}
                  </p>
                </div>
              </div>

              {/* Environment Selection */}
              <div className="space-y-2">
                <Label>Ambientes Ativos</Label>
                <div className="flex space-x-4">
                  {[
                    { key: 'dev', label: 'DEV' },
                    { key: 'stage', label: 'STAGE' }, 
                    { key: 'prod', label: 'PROD' }
                  ].map(({ key, label }) => (
                    <Badge
                      key={key}
                      className={`cursor-pointer ${
                        editingPixel.environment.includes(key) 
                          ? 'bg-jung-pink text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => setEditingPixel({
                        ...editingPixel,
                        environment: editingPixel.environment.includes(key)
                          ? editingPixel.environment.filter(e => e !== key)
                          : [...editingPixel.environment, key]
                      })}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className={`w-4 h-4 ${editingPixel.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  <Label>Pixel Ativo</Label>
                </div>
                <Switch
                  checked={editingPixel.is_active}
                  onCheckedChange={(checked) => setEditingPixel({...editingPixel, is_active: checked})}
                />
              </div>

              {/* Code Preview */}
              {editingPixel.pixel_type && editingPixel.pixel_id && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Prévia do código que será gerado:</strong>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {generatePixelCode(editingPixel).substring(0, 200)}...
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => editingPixel && handleSavePixel(editingPixel)}
              className="bg-jung-pink hover:bg-jung-pink/90"
              disabled={!editingPixel?.name || !editingPixel?.pixel_type || !editingPixel?.pixel_id || saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Pixel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}