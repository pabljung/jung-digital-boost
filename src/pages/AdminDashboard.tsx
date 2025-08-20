import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ScriptsGlobals } from "@/components/admin/ScriptsGlobals";
import { ScriptsPerPage } from "@/components/admin/ScriptsPerPage";
import { PixelManager } from "@/components/admin/PixelManager";
import { MetaManager } from "@/components/admin/MetaManager";
import { ConfigSettings } from "@/components/admin/ConfigSettings";
import { AuditLogs } from "@/components/admin/AuditLogs";

type AdminSection = 'scripts-global' | 'scripts-pages' | 'pixels' | 'meta' | 'settings' | 'logs';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentSection, setCurrentSection] = useState<AdminSection>('scripts-global');
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          return;
        }

        // Check if user is authorized admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@jungcria.com";
        if (session.user.email === adminEmail) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin@jungcria.com";
        if (session.user?.email === adminEmail) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          await supabase.auth.signOut();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-jung-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jung-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'scripts-global':
        return <ScriptsGlobals />;
      case 'scripts-pages':
        return <ScriptsPerPage />;
      case 'pixels':
        return <PixelManager />;
      case 'meta':
        return <MetaManager />;
      case 'settings':
        return <ConfigSettings />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <ScriptsGlobals />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />
      
      <div className="flex-1">
        <AdminHeader />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Security Headers - Hidden but present for SEO blocking */}
      <div style={{ display: 'none' }}>
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex" />
        <meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet,noimageindex" />
      </div>
    </div>
  );
};

export default AdminDashboard;