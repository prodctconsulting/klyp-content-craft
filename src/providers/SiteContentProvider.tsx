import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContentRow {
  id: string;
  section: string;
  content: any;
  updated_at: string;
}

interface SiteContentContextType {
  content: Record<string, any>;
  loading: boolean;
  error: string | null;
  get: (section: string, key: string, defaultValue?: any) => any;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap: Record<string, any> = {};
      (data || []).forEach((row: SiteContentRow) => {
        contentMap[row.section] = row.content || {};
      });

      setContent(contentMap);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const get = (section: string, key: string, defaultValue: any = null) => {
    return content[section]?.[key] ?? defaultValue;
  };

  const refresh = async () => {
    setLoading(true);
    await fetchContent();
  };

  return (
    <SiteContentContext.Provider value={{ content, loading, error, get, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}