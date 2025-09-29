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
      // Simple credential check since we can't use bcrypt in browser
      if (email === 'admin@prodt.co' && password === 'ProDT@123456789') {
        // Query admin_users table to get user data
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          console.error('Database error:', error);
          throw new Error('Database error');
        }

        // If no user found in DB, create one
        if (!data) {
          const { data: newUser, error: insertError } = await supabase
            .from('admin_users')
            .insert({
              email: email,
              password_hash: 'temp_hash' // Placeholder since we're not using bcrypt
            })
            .select()
            .single();

          if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error('Failed to create admin user');
          }

          const adminUser: AdminUser = {
            id: newUser.id,
            email: newUser.email,
            created_at: newUser.created_at,
            last_login: newUser.last_login
          };

          localStorage.setItem('admin_user', JSON.stringify(adminUser));
          setUser(adminUser);
          return { success: true };
        }

        // User exists, proceed with login
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
      console.error('Login error:', error);
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