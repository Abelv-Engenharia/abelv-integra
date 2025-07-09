
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSession } from '@/services/authService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          // Check if user is still active
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('ativo')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching user profile:", profileError);
              setSession(null);
              setUser(null);
              return;
            }
            
            if (!profile?.ativo) {
              console.log("User is inactive, signing out");
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              return;
            }
          } catch (error) {
            console.error("Error checking user status:", error);
            setSession(null);
            setUser(null);
            return;
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false after we have processed the auth state
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 100);
        }
      }
    );

    // THEN check for existing session with faster timeout
    const initializeAuth = async () => {
      try {
        const { session } = await getCurrentSession();
        if (mounted) {
          if (session?.user) {
            // Check if user is active
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('ativo')
                .eq('id', session.user.id)
                .single();
              
              if (profileError || !profile?.ativo) {
                console.log("User is inactive during initialization");
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
                setLoading(false);
                return;
              }
            } catch (error) {
              console.error("Error checking user status during init:", error);
              setSession(null);
              setUser(null);
              setLoading(false);
              return;
            }
          }
          
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
