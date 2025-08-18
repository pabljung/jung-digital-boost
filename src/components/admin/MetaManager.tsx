import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Code, 
  Save,
  Globe,
  FileText,
  Image,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MetaConfig {
  id?: string;
  page_slug?: string;
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  favicon?: string;
  apple_touch_icon?: string;
  additional_meta?: any;
  is_active: boolean;
}

const commonPages = [
  { slug: null, name: 'Global (todas as páginas)' },
  { slug: '/', name: 'Página Inicial' },
  { slug: '/about', name: 'Sobre' },
  { slug: '/contact', name: 'Contato' },
  { slug: '/services', name: 'Serviços' },
  { slug: '/blog', name: 'Blog' },
];

export function MetaManager() {
  const [configs, setConfigs] = useState<MetaConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const { toast } = useToast();

  const [globalMeta, setGlobalMeta] = useState<MetaConfig>({
    is_active: true,
    title: '',
    description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    favicon: '/favicon.ico',
    apple_touch_icon: '/apple-touch-icon.png',
    additional_meta: {}
  });

  const [pageMetas, setPageMetas] = useState<MetaConfig[]>([]);

  useEffect(() => {
    loadMetaConfigs();
  }, []);

  const loadMetaConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meta_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const global = data?.find(config => !config.page_slug) || {
        is_active: true,
        title: '',
        description: '',
        og_title: '',
        og_description: '',
        og_image: '',
        favicon: '/favicon.ico',
        apple_touch_icon: '/apple-touch-icon.png',
        additional_meta: {}
      };

      const pages = data?.filter(config => config.page_slug) || [];

      setGlobalMeta(global);
      setPageMetas(pages);
      setConfigs(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar configurações de metadados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlobal = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('meta_configs')
        .upsert({
          ...globalMeta,
          page_slug: null
        });

      if (error) throw error;

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'update_global_meta',
          resource_type: 'meta_config',
          details: {
            title: globalMeta.title,
            description: globalMeta.description?.substring(0, 100)
          }
        });

      toast({
        title: "Metadados salvos",
        description: "Metadados globais salvos com sucesso.",
      });

      loadMetaConfigs();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar metadados globais.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePageMeta = async (pageMeta: MetaConfig) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('meta_configs')
        .upsert(pageMeta);

      if (error) throw error;

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'update_page_meta',
          resource_type: 'meta_config',
          resource_id: pageMeta.id,
          details: {
            page_slug: pageMeta.page_slug,
            title: pageMeta.title
          }
        });

      toast({
        title: "Metadados salvos",
        description: `Metadados da página "${pageMeta.page_slug}" salvos com sucesso.`,
      });

      loadMetaConfigs();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar metadados da página.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addPageMeta = (pageSlug: string) => {
    const pageName = commonPages.find(p => p.slug === pageSlug)?.name || pageSlug;
    const newPageMeta: MetaConfig = {
      page_slug: pageSlug,
      title: '',
      description: '',
      og_title: '',
      og_description: '',
      og_image: '',
      is_active: true,
      additional_meta: {}
    };
    setPageMetas(prev => [...prev, newPageMeta]);
  };

  const updatePageMeta = (index: number, updates: Partial<MetaConfig>) => {
    setPageMetas(prev => prev.map((meta, i) => 
      i === index ? { ...meta, ...updates } : meta
    ));
  };

  const removePageMeta = async (index: number) => {
    const pageMeta = pageMetas[index];
    if (pageMeta.id) {
      try {
        await supabase
          .from('meta_configs')
          .delete()
          .eq('id', pageMeta.id);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover metadados da página.",
        });
        return;
      }
    }
    setPageMetas(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-jung-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando metadados...</p>
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
            <Code className="w-6 h-6 mr-2 text-jung-pink" />
            Metadados & Open Graph
          </h1>
          <p className="text-gray-600 mt-1">
            Configure SEO, Open Graph e ícones do site
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Globais</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Por Página</span>
          </TabsTrigger>
        </TabsList>

        {/* Global Meta */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Metadados Globais
                  </CardTitle>
                  <CardDescription>
                    Configurações padrão aplicadas a todas as páginas
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className={`w-4 h-4 ${globalMeta.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  <Switch
                    checked={globalMeta.is_active}
                    onCheckedChange={(checked) => setGlobalMeta({...globalMeta, is_active: checked})}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic SEO */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">SEO Básico</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="global-title">Título Padrão</Label>
                    <Input
                      id="global-title"
                      value={globalMeta.title || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, title: e.target.value})}
                      placeholder="Jung Voice & Performance - Agência de Performance Marketing"
                      maxLength={60}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Recomendado: máximo 60 caracteres</span>
                      <span>{(globalMeta.title || '').length}/60</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-description">Descrição Padrão</Label>
                    <Textarea
                      id="global-description"
                      value={globalMeta.description || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, description: e.target.value})}
                      placeholder="Transforme cliques em faturamento com estratégias afiadas de performance marketing. 5 anos de experiência, R$ 31M+ gerados em vendas."
                      maxLength={160}
                      rows={3}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Recomendado: máximo 160 caracteres</span>
                      <span>{(globalMeta.description || '').length}/160</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Open Graph (Redes Sociais)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="global-og-title">Título do Open Graph</Label>
                    <Input
                      id="global-og-title"
                      value={globalMeta.og_title || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, og_title: e.target.value})}
                      placeholder="Deixe vazio para usar o título padrão"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-og-description">Descrição do Open Graph</Label>
                    <Textarea
                      id="global-og-description"
                      value={globalMeta.og_description || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, og_description: e.target.value})}
                      placeholder="Deixe vazio para usar a descrição padrão"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-og-image">Imagem do Open Graph</Label>
                    <Input
                      id="global-og-image"
                      value={globalMeta.og_image || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, og_image: e.target.value})}
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <p className="text-xs text-gray-500">
                      Recomendado: 1200x630px (formato 1.91:1)
                    </p>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Ícones
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="global-favicon">Favicon</Label>
                    <Input
                      id="global-favicon"
                      value={globalMeta.favicon || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, favicon: e.target.value})}
                      placeholder="/favicon.ico"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="global-apple-icon">Apple Touch Icon</Label>
                    <Input
                      id="global-apple-icon"
                      value={globalMeta.apple_touch_icon || ''}
                      onChange={(e) => setGlobalMeta({...globalMeta, apple_touch_icon: e.target.value})}
                      placeholder="/apple-touch-icon.png"
                    />
                    <p className="text-xs text-gray-500">
                      Recomendado: 180x180px
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveGlobal} 
                disabled={saving}
                className="bg-jung-pink hover:bg-jung-pink/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Metadados Globais"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Specific Meta */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Metadados Específicos por Página</CardTitle>
                  <CardDescription>
                    Sobrescreva os metadados globais para páginas específicas
                  </CardDescription>
                </div>
                <Select onValueChange={(value) => value !== 'select' && addPageMeta(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Adicionar página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select" disabled>Selecione uma página</SelectItem>
                    {commonPages.filter(page => page.slug && !pageMetas.find(p => p.page_slug === page.slug)).map(page => (
                      <SelectItem key={page.slug} value={page.slug!}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {pageMetas.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma página específica</h3>
                  <p className="text-gray-500">
                    Adicione metadados específicos para páginas individuais
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pageMetas.map((pageMeta, index) => {
                    const pageName = commonPages.find(p => p.slug === pageMeta.page_slug)?.name || pageMeta.page_slug;
                    
                    return (
                      <Card key={index} className="border-l-4 border-l-jung-pink">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{pageName}</CardTitle>
                              <CardDescription className="font-mono text-sm">
                                {pageMeta.page_slug}
                              </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className={`w-4 h-4 ${pageMeta.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                              <Switch
                                checked={pageMeta.is_active}
                                onCheckedChange={(checked) => updatePageMeta(index, {is_active: checked})}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removePageMeta(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label>Título</Label>
                              <Input
                                value={pageMeta.title || ''}
                                onChange={(e) => updatePageMeta(index, {title: e.target.value})}
                                placeholder="Deixe vazio para usar o título global"
                                maxLength={60}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Textarea
                                value={pageMeta.description || ''}
                                onChange={(e) => updatePageMeta(index, {description: e.target.value})}
                                placeholder="Deixe vazio para usar a descrição global"
                                maxLength={160}
                                rows={2}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>OG Título</Label>
                                <Input
                                  value={pageMeta.og_title || ''}
                                  onChange={(e) => updatePageMeta(index, {og_title: e.target.value})}
                                  placeholder="Título para redes sociais"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>OG Imagem</Label>
                                <Input
                                  value={pageMeta.og_image || ''}
                                  onChange={(e) => updatePageMeta(index, {og_image: e.target.value})}
                                  placeholder="URL da imagem"
                                />
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleSavePageMeta(pageMeta)} 
                            disabled={saving}
                            size="sm"
                            className="bg-jung-pink hover:bg-jung-pink/90"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}