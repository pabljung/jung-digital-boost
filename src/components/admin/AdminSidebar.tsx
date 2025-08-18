import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Code, 
  Globe, 
  FileText, 
  Tag, 
  Settings, 
  FileSearch,
  Shield
} from "lucide-react";

type AdminSection = 'scripts-global' | 'scripts-pages' | 'pixels' | 'meta' | 'settings' | 'logs';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const menuItems = [
  {
    id: 'scripts-global' as AdminSection,
    label: 'Scripts Globais',
    icon: Globe,
    description: 'Head e Footer globais'
  },
  {
    id: 'scripts-pages' as AdminSection,
    label: 'Scripts por Página',
    icon: FileText,
    description: 'Scripts específicos por página'
  },
  {
    id: 'pixels' as AdminSection,
    label: 'Pixels & Tags',
    icon: Tag,
    description: 'GA4, Meta Pixel, etc.'
  },
  {
    id: 'meta' as AdminSection,
    label: 'Metadados & OG',
    icon: Code,
    description: 'SEO e Open Graph'
  },
  {
    id: 'settings' as AdminSection,
    label: 'Configurações',
    icon: Settings,
    description: 'Backup e configurações'
  },
  {
    id: 'logs' as AdminSection,
    label: 'Logs de Auditoria',
    icon: FileSearch,
    description: 'Histórico de alterações'
  }
];

export function AdminSidebar({ currentSection, onSectionChange }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-jung-pink rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Jung Voice & Performance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  isActive 
                    ? "bg-jung-pink hover:bg-jung-pink/90 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    isActive ? "text-white/80" : "text-gray-500"
                  }`}>
                    {item.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Versão 1.0.0</p>
          <p className="mt-1">Acesso restrito e monitorado</p>
        </div>
      </div>
    </div>
  );
}