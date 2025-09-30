// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { id, section, content } = await req.json();

    if (!content || (typeof content !== 'object')) {
      return new Response(JSON.stringify({ error: 'Invalid content payload' }), { status: 400 });
    }

    let result: any;

    if (id) {
      const { data, error } = await adminClient
        .from('site_content')
        .update({ content })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      result = data;
    } else if (section) {
      const { data, error } = await adminClient
        .from('site_content')
        .upsert({ section, content }, { onConflict: 'section' })
        .select('*')
        .maybeSingle();
      if (error) throw error;
      result = data;
    } else {
      return new Response(JSON.stringify({ error: 'Provide id or section' }), { status: 400 });
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
});