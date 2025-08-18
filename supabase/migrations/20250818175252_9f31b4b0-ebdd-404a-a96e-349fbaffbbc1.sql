-- Fix function search path issue by using CASCADE to drop and recreate
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Recreate all the triggers that were dropped
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