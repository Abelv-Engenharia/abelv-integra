
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/authUtils";

export const signIn = async (email: string, password: string) => {
  try {
    // Clean up existing auth state before signing in
    cleanupAuthState();
    
    // Try to sign out any existing session
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.error("Error during sign out before login:", err);
    }
    
    // Sign in with email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Login error:", error);
    return { data: null, error };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    // Clean up existing auth state
    cleanupAuthState();
    
    // Sign up with email/password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null, error };
  }
};
