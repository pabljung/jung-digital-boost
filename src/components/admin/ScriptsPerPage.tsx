import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Plus, 
  FileText, 
  Edit, 
  Trash2,
  Save,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput } from "@/utils/security";

interface PageScript {
  id?: string;
  name: string;
  page_slug: string;
  head_content: string;
  footer_content: string;
  is_active: boolean;
  environment: string[];
}

const commonPages = [
  { slug: '/', name: 'Página Inicial' },
  { slug: '/about', name: 'Sobre' },
  { slug: '/contact', name: 'Contato' },
  { slug: '/services', name: 'Serviços' },
  { slug: '/blog', name: 'Blog' },
];

export function ScriptsPerPage() {
  const [scripts, setScripts] = useState<PageScript[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingScript, setEditingScript] = useState<PageScript | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPageScripts();
  }, []);

  const loadPageScripts = async () => {
    setLoading(true);
    try {
      const { data: headScripts } = await supabase
        .from('script_configs')
        .select('*')
        .eq('type', 'page_head')
        .order('created_at', { ascending: false });

      const { data: footerScripts } = await supabase
        .from('script_configs')
        .select('*')
        .eq('type', 'page_footer')
        .order('created_at', { ascending: false });

      // Group scripts by page_slug
      const groupedScripts: { [key: string]: PageScript } = {};

      headScripts?.forEach(script => {
        if (!groupedScripts[script.page_slug]) {
          groupedScripts[script.page_slug] = {
            id: script.id,
            name: script.name,
            page_slug: script.page_slug,
            head_content: '',
            footer_content: '',
            is_active: script.is_active,
            environment: script.environment
          };
        }
        groupedScripts[script.page_slug].head_content = script.content;
      });

      footerScripts?.forEach(script => {
        if (!groupedScripts[script.page_slug]) {
          groupedScripts[script.page_slug] = {
            id: script.id,
            name: script.name,
            page_slug: script.page_slug,
            head_content: '',
            footer_content: '',
            is_active: script.is_active,
            environment: script.environment
          };
        }
        groupedScripts[script.page_slug].footer_content = script.content;
      });

      setScripts(Object.values(groupedScripts));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar scripts por página.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScript = async (script: PageScript) => {
    try {
      // Save head script if exists
      if (script.head_content.trim()) {
        await supabase
          .from('script_configs')
          .upsert({
            name: `${script.name} - Head`,
            type: 'page_head',
            page_slug: script.page_slug,
            content: script.head_content,
            is_active: script.is_active,
            environment: script.environment
          });
      }

      // Save footer script if exists
      if (script.footer_content.trim()) {
        await supabase
          .from('script_configs')
          .upsert({
            name: `${script.name} - Footer`,
            type: 'page_footer',
            page_slug: script.page_slug,
            content: script.footer_content,
            is_active: script.is_active,
            environment: script.environment
          });
      }

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: script.id ? 'update_page_script' : 'create_page_script',
          resource_type: 'script_config',
          resource_id: script.id,
          details: {
            page_slug: script.page_slug,
            name: script.name,
            is_active: script.is_active
          }
        });

      toast({
        title: "Script salvo",
        description: `Scripts da página "${script.name}" salvos com sucesso.`,
      });

      setShowDialog(false);
      setEditingScript(null);
      loadPageScripts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar script da página.",
      });
    }
  };

  const handleDeleteScript = async (script: PageScript) => {
    try {
      // Delete head and footer scripts for this page
      await supabase
        .from('script_configs')
        .delete()
        .or(`and(type.eq.page_head,page_slug.eq.${script.page_slug}),and(type.eq.page_footer,page_slug.eq.${script.page_slug})`);

      // Log audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'delete_page_script',
          resource_type: 'script_config',
          resource_id: script.id,
          details: {
            page_slug: script.page_slug,
            name: script.name
          }
        });

      toast({
        title: "Script removido",
        description: `Scripts da página "${script.name}" removidos com sucesso.`,
      });

      loadPageScripts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao remover script da página.",
      });
    }
  };

  const openEditDialog = (script?: PageScript) => {
    setEditingScript(script || {
      name: '',
      page_slug: '/',
      head_content: '',
      footer_content: '',
      is_active: true,
      environment: ['prod']
    });
    setShowDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-jung-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando scripts por página...</p>
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
            <FileText className="w-6 h-6 mr-2 text-jung-pink" />
            Scripts por Página
          </h1>
          <p className="text-gray-600 mt-1">
            Adicione scripts específicos para páginas individuais
          </p>
        </div>
        
        <Button onClick={() => openEditDialog()} className="bg-jung-pink hover:bg-jung-pink/90">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Script
        </Button>
      </div>

      {/* Scripts List */}
      <div className="grid gap-4">
        {scripts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum script por página</h3>
              <p className="text-gray-500 mb-4">
                Comece adicionando scripts específicos para páginas individuais
              </p>
              <Button onClick={() => openEditDialog()} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Script
              </Button>
            </CardContent>
          </Card>
        ) : (
          scripts.map((script) => (
            <Card key={script.page_slug}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${script.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <CardTitle className="text-lg">{script.name}</CardTitle>
                      <CardDescription className="font-mono text-sm">
                        {script.page_slug}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {script.environment.map(env => (
                      <Badge key={env} variant="outline" className="text-xs">
                        {env.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Head: {script.head_content ? `${script.head_content.length} chars` : 'Vazio'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Footer: {script.footer_content ? `${script.footer_content.length} chars` : 'Vazio'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(script)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir os scripts da página "{script.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteScript(script)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingScript?.id ? 'Editar Script da Página' : 'Adicionar Script da Página'}
            </DialogTitle>
            <DialogDescription>
              Configure scripts específicos que serão executados apenas nesta página
            </DialogDescription>
          </DialogHeader>

          {editingScript && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="script-name">Nome do Script</Label>
                  <Input
                    id="script-name"
                    value={editingScript.name}
                    onChange={(e) => setEditingScript({...editingScript, name: e.target.value})}
                    placeholder="Ex: Scripts da Página de Contato"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-slug">Página (URL)</Label>
                  <Select
                    value={editingScript.page_slug}
                    onValueChange={(value) => setEditingScript({...editingScript, page_slug: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma página" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonPages.map(page => (
                        <SelectItem key={page.slug} value={page.slug}>
                          {page.name} ({page.slug})
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Personalizada...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom URL Input */}
              {editingScript.page_slug === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-slug">URL Personalizada</Label>
                  <Input
                    id="custom-slug"
                    value={editingScript.page_slug}
                    onChange={(e) => setEditingScript({...editingScript, page_slug: e.target.value})}
                    placeholder="/minha-pagina-customizada"
                  />
                </div>
              )}

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
                        editingScript.environment.includes(key) 
                          ? 'bg-jung-pink text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => setEditingScript({
                        ...editingScript,
                        environment: editingScript.environment.includes(key)
                          ? editingScript.environment.filter(e => e !== key)
                          : [...editingScript.environment, key]
                      })}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Scripts */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="head-content">Script do Head</Label>
                  <Textarea
                    id="head-content"
                    value={editingScript.head_content}
                    onChange={(e) => setEditingScript({...editingScript, head_content: sanitizeInput(e.target.value)})}
                    placeholder="<!-- Scripts que serão inseridos no <head> desta página -->"
                    className="font-mono text-sm min-h-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer-content">Script do Footer</Label>
                  <Textarea
                    id="footer-content"
                    value={editingScript.footer_content}
                    onChange={(e) => setEditingScript({...editingScript, footer_content: sanitizeInput(e.target.value)})}
                    placeholder="<!-- Scripts que serão inseridos no <footer> desta página -->"
                    className="font-mono text-sm min-h-[150px]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className={`w-4 h-4 ${editingScript.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                  <Label>Script Ativo</Label>
                </div>
                <Switch
                  checked={editingScript.is_active}
                  onCheckedChange={(checked) => setEditingScript({...editingScript, is_active: checked})}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => editingScript && handleSaveScript(editingScript)}
              className="bg-jung-pink hover:bg-jung-pink/90"
              disabled={!editingScript?.name || !editingScript?.page_slug}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}