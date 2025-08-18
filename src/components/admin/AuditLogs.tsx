import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  FileSearch, 
  Calendar,
  Filter,
  RefreshCw,
  Download,
  User,
  Activity,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const logsPerPage = 50;
  const { toast } = useToast();

  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, actionFilter, resourceFilter, dateFrom, dateTo]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * logsPerPage, currentPage * logsPerPage - 1);

      // Apply filters
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }
      
      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo + 'T23:59:59.999Z');
      }

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%,details->name.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setLogs((data || []) as AuditLog[]);
      setTotalLogs(count || 0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar logs de auditoria.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async () => {
    try {
      // Export all logs (not paginated)
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply same filters
      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }
      
      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo + 'T23:59:59.999Z');
      }

      const { data, error } = await query;
      if (error) throw error;

      // Create CSV content
      const csvContent = [
        ['Data/Hora', 'Ação', 'Tipo de Recurso', 'IP', 'Detalhes'].join(','),
        ...data.map(log => [
          new Date(log.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          log.action,
          log.resource_type,
          log.ip_address || 'N/A',
          JSON.stringify(log.details || {}).replace(/,/g, ';')
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Logs exportados",
        description: "Logs de auditoria exportados em formato CSV.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao exportar logs.",
      });
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('create')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'script_config':
        return '📝';
      case 'pixel_config':
        return '📊';
      case 'meta_config':
        return '🏷️';
      default:
        return '📄';
    }
  };

  const formatDetails = (details: any) => {
    if (!details) return 'N/A';
    
    const important = [];
    if (details.name) important.push(`Nome: ${details.name}`);
    if (details.page_slug) important.push(`Página: ${details.page_slug}`);
    if (details.pixel_type) important.push(`Tipo: ${details.pixel_type}`);
    if (details.is_active !== undefined) important.push(`Ativo: ${details.is_active ? 'Sim' : 'Não'}`);
    
    return important.length > 0 ? important.join(' | ') : 'Detalhes disponíveis';
  };

  const uniqueActions = [...new Set(logs.map(log => log.action))];
  const uniqueResources = [...new Set(logs.map(log => log.resource_type))];

  const totalPages = Math.ceil(totalLogs / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileSearch className="w-6 h-6 mr-2 text-jung-pink" />
            Logs de Auditoria
          </h1>
          <p className="text-gray-600 mt-1">
            Histórico completo de todas as alterações no sistema
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={loadAuditLogs}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={handleExportLogs}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar nos logs..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ação</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Recurso</Label>
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueResources.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Data (De)</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              {totalLogs} registros encontrados
            </div>
            <Button
              onClick={() => {
                setSearchTerm('');
                setActionFilter('all');
                setResourceFilter('all');
                setDateFrom('');
                setDateTo('');
                setCurrentPage(1);
              }}
              variant="outline"
              size="sm"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Registros de Atividade
            </span>
            <Badge variant="outline" className="text-sm">
              Página {currentPage} de {totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-jung-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-500">
                Ajuste os filtros ou aguarde novas atividades no sistema
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Data/Hora
                      </TableHead>
                      <TableHead>
                        <Activity className="w-4 h-4 inline mr-2" />
                        Ação
                      </TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.created_at).toLocaleString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionBadgeColor(log.action)}>
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{getResourceIcon(log.resource_type)}</span>
                            <span className="text-sm">
                              {log.resource_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-sm text-gray-600">
                          {formatDetails(log.details)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500">
                          {log.ip_address || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Exibindo {(currentPage - 1) * logsPerPage + 1} a {Math.min(currentPage * logsPerPage, totalLogs)} de {totalLogs} registros
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}