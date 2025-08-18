-- Create admin users table for authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE
);

-- Create script_configs table for managing scripts
CREATE TABLE IF NOT EXISTS public.script_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('global_head', 'global_footer', 'page_head', 'page_footer')),
  page_slug TEXT, -- null for global scripts
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  environment TEXT[] DEFAULT ARRAY['prod'], -- ['dev', 'stage', 'prod']
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create pixel_configs table for quick pixel setup
CREATE TABLE IF NOT EXISTS public.pixel_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pixel_type TEXT NOT NULL CHECK (pixel_type IN ('google_gtag', 'google_ads', 'meta_pixel', 'linkedin_insight', 'tiktok_pixel', 'hotjar', 'custom')),
  pixel_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  environment TEXT[] DEFAULT ARRAY['prod'],
  additional_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create meta_configs table for metadata management
CREATE TABLE IF NOT EXISTS public.meta_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT, -- null for global meta
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  favicon TEXT,
  apple_touch_icon TEXT,
  additional_meta JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create config_versions table for version control
CREATE TABLE IF NOT EXISTS public.config_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_type TEXT NOT NULL CHECK (config_type IN ('script', 'pixel', 'meta')),
  config_id UUID NOT NULL,
  version_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admin_users(id)
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pixel_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access only
CREATE POLICY "Admin users can manage their own data" ON public.admin_users
FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can manage all configs" ON public.script_configs
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id::text = auth.uid()::text));

CREATE POLICY "Admin users can manage all pixel configs" ON public.pixel_configs
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id::text = auth.uid()::text));

CREATE POLICY "Admin users can manage all meta configs" ON public.meta_configs
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id::text = auth.uid()::text));

CREATE POLICY "Admin users can manage all versions" ON public.config_versions
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id::text = auth.uid()::text));

CREATE POLICY "Admin users can view all audit logs" ON public.audit_logs
FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id::text = auth.uid()::text));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_script_configs_type_page ON public.script_configs(type, page_slug);
CREATE INDEX IF NOT EXISTS idx_script_configs_active ON public.script_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_pixel_configs_active ON public.pixel_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_meta_configs_page ON public.meta_configs(page_slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Function to update timestamps
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

CREATE TRIGGER update_script_configs_updated_at
    BEFORE UPDATE ON public.script_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pixel_configs_updated_at
    BEFORE UPDATE ON public.pixel_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meta_configs_updated_at
    BEFORE UPDATE ON public.meta_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();