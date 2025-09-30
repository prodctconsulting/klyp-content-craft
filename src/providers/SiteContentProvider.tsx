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
      
      // Apply branding colors if available
      const brandingContent = contentMap['branding'];
      if (brandingContent?.primaryColor || brandingContent?.secondaryColor) {
        applyBrandColors(brandingContent.primaryColor, brandingContent.secondaryColor);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const applyBrandColors = (primaryColor?: string, secondaryColor?: string) => {
    const toHsl = (val?: string) => {
      if (!val) return '';
      if (val.startsWith('#')) {
        // hex -> hsl string
        const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
        if (!res) return '';
        const r = parseInt(res[1], 16) / 255;
        const g = parseInt(res[2], 16) / 255;
        const b = parseInt(res[3], 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      }
      return val;
    };

    const root = document.documentElement;
    const p = toHsl(primaryColor);
    const s = toHsl(secondaryColor);
    if (p) root.style.setProperty('--brand-pink', p);
    if (s) root.style.setProperty('--brand-purple', s);
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