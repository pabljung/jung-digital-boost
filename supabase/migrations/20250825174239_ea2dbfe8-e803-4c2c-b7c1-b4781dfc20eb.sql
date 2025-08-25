-- Remove admin_users table and fix security issue
-- The admin_users table is not being used and represents a security risk

-- First, remove foreign key constraints that reference admin_users
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE config_versions DROP CONSTRAINT IF EXISTS config_versions_created_by_fkey;
ALTER TABLE meta_configs DROP CONSTRAINT IF EXISTS meta_configs_created_by_fkey;
ALTER TABLE pixel_configs DROP CONSTRAINT IF EXISTS pixel_configs_created_by_fkey;
ALTER TABLE script_configs DROP CONSTRAINT IF EXISTS script_configs_created_by_fkey;

-- Update created_by columns to reference auth.users instead
-- These will now store auth.uid() values directly
ALTER TABLE audit_logs 
  ADD CONSTRAINT audit_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE config_versions 
  ADD CONSTRAINT config_versions_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE meta_configs 
  ADD CONSTRAINT meta_configs_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE pixel_configs 
  ADD CONSTRAINT pixel_configs_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE script_configs 
  ADD CONSTRAINT script_configs_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop the problematic admin_users table
DROP TABLE IF EXISTS admin_users CASCADE;

-- Update RLS policies to use auth.uid() directly since we're using Supabase Auth
-- Update audit_logs policy
DROP POLICY IF EXISTS "Admin users can view all audit logs" ON audit_logs;
CREATE POLICY "Admin users can view all audit logs" 
ON audit_logs 
FOR SELECT 
USING (public.is_admin_user());

-- Update other policies that referenced admin_users
DROP POLICY IF EXISTS "Admin users can manage all configs" ON script_configs;
CREATE POLICY "Admin users can manage all configs" 
ON script_configs 
FOR ALL 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage all pixel configs" ON pixel_configs;
CREATE POLICY "Admin users can manage all pixel configs" 
ON pixel_configs 
FOR ALL 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage all meta configs" ON meta_configs;
CREATE POLICY "Admin users can manage all meta configs" 
ON meta_configs 
FOR ALL 
USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin users can manage all versions" ON config_versions;
CREATE POLICY "Admin users can manage all versions" 
ON config_versions 
FOR ALL 
USING (public.is_admin_user());

-- Add comment explaining the security model
COMMENT ON FUNCTION public.is_admin_user() IS 'Security definer function that verifies if the current authenticated user is an admin by checking their email against admin@jungcria.com in auth.users table. This is the single source of truth for admin authentication.';