import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContentData {
  [section: string]: {
    [key: string]: any;
  };
}

interface SiteContentContextType {
  content: SiteContentData;
  get: (section: string, key: string, defaultValue?: any) => any;
  updateContent: (section: string, newContent: any) => Promise<void>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContentData>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap: SiteContentData = {};
      (data || []).forEach((row: any) => {
        contentMap[row.section] = row.content || {};
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching site content:', error);
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

  const updateContent = async (section: string, newContent: any) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section,
          content: newContent,
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      // Update local state
      setContent(prev => ({
        ...prev,
        [section]: newContent
      }));
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchContent();
  };

  return (
    <SiteContentContext.Provider value={{
      content,
      get,
      updateContent,
      loading,
      refetch
    }}>
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