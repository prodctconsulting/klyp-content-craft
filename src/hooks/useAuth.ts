import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// Note: Password comparison done directly for simplicity

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_login?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (check localStorage for session)
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Quick, reliable check using the provided admin credentials
      if (email === 'admin@prodt.co' && password === 'ProDT@123456789') {
        const adminUser: AdminUser = {
          id: 'local-admin',
          email,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        // Persist lightweight session locally
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        setUser(adminUser);

        // Try to establish a Supabase auth session (non-blocking)
        // This enables saving protected content (site_content updates require auth)
        supabase.auth.signInWithPassword({ email, password }).catch(async () => {
          // If the user doesn't exist in auth, try to sign them up
          await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
        });

        return { success: true };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}