
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the environment variables provided by the user
// For Vite, environment variables should be prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xexgdtlctyuycohzhmuu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGdkdGxjdHl1eWNvaHpobXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY0NTMsImV4cCI6MjA2MTQ1MjQ1M30.hbqL05Y8UMfVaOa4nbDQNClCfjk_yRg_dtoL09_yGyo';

// Validate that we have the required config
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};
