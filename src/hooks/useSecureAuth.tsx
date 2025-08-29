import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { validateAdminAccess, rateLimiter } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useSecureAuth() {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener with security checks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        // Rate limit auth attempts
        const clientId = session?.user?.id || 'anonymous';
        if (!rateLimiter.isAllowed(`auth_${clientId}`, 10, 60000)) {
          toast({
            title: "Too many authentication attempts",
            description: "Please wait before trying again",
            variant: "destructive"
          });
          return;
        }

        const user = session?.user ?? null;
        const isAdmin = validateAdminAccess(user?.email);

        // Log security events
        if (event === 'SIGNED_IN' && user) {
          console.log('User signed in:', { 
            id: user.id, 
            email: user.email,
            isAdmin,
            timestamp: new Date().toISOString()
          });
          
          if (isAdmin) {
            toast({
              title: "Admin access granted",
              description: "Welcome to the admin dashboard"
            });
          }
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Clear any cached data on logout
          localStorage.removeItem('admin_cache');
        }

        setAuthState({
          user,
          session,
          loading: false,
          isAdmin
        });
      }
    );

    // Check for existing session with security validation
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        const user = session?.user ?? null;
        const isAdmin = validateAdminAccess(user?.email);

        setAuthState({
          user,
          session,
          loading: false,
          isAdmin
        });
      } catch (error) {
        console.error('Session initialization error:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [toast]);

  const secureSignOut = async () => {
    try {
      // Clear any sensitive data before signing out
      localStorage.removeItem('admin_cache');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out successfully",
        description: "You have been securely logged out"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out error",
        description: "There was an issue signing out",
        variant: "destructive"
      });
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Rate limit login attempts
      if (!rateLimiter.isAllowed(`login_${email}`, 5, 300000)) {
        throw new Error('Too many login attempts. Please wait 5 minutes.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  return {
    ...authState,
    secureSignOut,
    secureSignIn
  };
}