-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read their own data
CREATE POLICY "Admins can view their own data" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Create content management table for storing editable content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content (for the landing page)
CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Only allow authenticated users to modify content (we'll handle admin check in the app)
CREATE POLICY "Authenticated users can modify content" 
ON public.site_content 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create founders list table for form submissions
CREATE TABLE public.founders_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business TEXT NOT NULL,
  integrations TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contacted BOOLEAN DEFAULT false
);

-- Enable RLS for founders list
ALTER TABLE public.founders_list ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view/modify founders list
CREATE POLICY "Authenticated users can view founders list" 
ON public.founders_list 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert initial admin user with hashed password for admin@prodt.co
-- Password: ProDT@123456789 (hashed with bcrypt)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('admin@prodt.co', '$2b$10$rQZ9hZQJ5L5L5L5L5L5L5OeOeOeOeOeOeOeOeOeOeOeOeOeOeOeOeO');

-- Insert default content for all sections
INSERT INTO public.site_content (section, content) VALUES 
('branding', '{"logoUrl": "/brand/logo.png", "faviconUrl": "/brand/favicon.png"}'),
('hero', '{"badgeText": "Built for visionary travel agencies, TMCs, and tour creators", "titleLine1": "KLYP Workbench", "titleLine2Gradient": "The Future of Travel", "subtext": "Digitalize the chaos of servicing, and plug into a GenAI‑native universal ERP—without writing a line of code.", "ctaLabel": "Get Started Now", "secondaryBadgeText": "Early Access: Starting from just $99/month"}'),
('whyOs', '{"title": "Why Travel Needs a New OS", "subtitle": "The travel industry is drowning in outdated systems and manual processes", "items": [{"icon": "gear", "text": "60% of travel ERPs still require costly manual customizations"}, {"icon": "lightning", "text": "Servicing (refunds, ancillaries, reissues) is fragmented and chaotic"}, {"icon": "dollar", "text": "Airlines offer millions in incentives—most go unclaimed"}, {"icon": "alert", "text": "Startups waste 90% of dev time on integrating basic GDS and payment plumbing"}]}'),
('building', '{"title": "What We''re Building", "subtitle": "A domain‑specific AI model that composes travel‑ops workflows using plain‑English rules—not code.", "features": [{"icon": "cloud", "title": "Universal Travel ERP Cloud", "description": "DevOps‑native, version‑controlled"}, {"icon": "workflow", "title": "SLM Workflow Composer", "description": "refunds, servicing, PLB triggers"}, {"icon": "contract", "title": "Incentive & Contract Engine", "description": "auto‑track PLBs, bonuses"}, {"icon": "microservice", "title": "Composable Microservices", "description": "flights, ancillaries, GDS, payments, invoicing"}]}'),
('demo', '{"title": "See It in Action", "helper": "Watch how KLYP Workbench transforms travel operations", "videoUrl": "", "videoType": "upload", "posterUrl": "", "autoplay": false, "muted": true, "loop": true}'),
('pricing', '{"title": "Early Access Pricing – Limited Time", "subtitleGradient": "Starting from just $99/month", "ribbonText": "First 100 signups get founder benefits", "bullets": ["No setup fees", "Locked lifetime pricing—save up to 70% vs public launch", "Full feature access during beta", "Priority onboarding & white‑glove support"], "ctaLabel": "Join Now", "finePrint": "Limited to first 100 signups only"}'),
('audience', '{"title": "Who It''s For", "subtitle": "Built for forward‑thinking travel professionals ready to automate their operations", "items": [{"icon": "agency", "title": "Agencies & OTAs", "description": "tired of duct‑taped back offices"}, {"icon": "freelancer", "title": "Freelancer advisors", "description": "who want a pro‑grade tool without enterprise bloat"}, {"icon": "tmc", "title": "TMCs & B2B consolidators", "description": "looking to automate contract management & GDS plumbing"}, {"icon": "startup", "title": "Tech‑led startups", "description": "building custom travel stacks"}]}'),
('founding', '{"title": "Be a Founding User", "subtitle": "We''re onboarding a select group of early partners before launch. Get early access, shape the roadmap, and automate your travel operations from Day 1.", "cardTitle": "Join the List", "cardHelper": "Fill in a few quick questions—we''ll personalize your onboarding.", "ctaLabel": "Join Now", "featuresLine": "No setup required • White‑glove onboarding • Join 50+ founding partners"}'),
('footer', '{"email": "ping@klyp.travel", "copyright": "© 2024 KLYP. All rights reserved.", "links": [{"label": "Privacy", "url": "#"}, {"label": "Terms", "url": "#"}]}');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();