
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    isAuthenticated: !!context.user,
    user: context.user,
    session: context.session,
    loading: context.loading
  };
};
