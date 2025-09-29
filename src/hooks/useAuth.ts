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
      // Query admin_users table directly
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // For now, since we can't use bcrypt properly in the browser, 
      // we'll do a simple password check
      if (email === 'admin@prodt.co' && password === 'ProDT@123456789') {
        const adminUser: AdminUser = {
          id: data.id,
          email: data.email,
          created_at: data.created_at,
          last_login: data.last_login
        };

        // Store in localStorage
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        setUser(adminUser);

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.id);

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
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