-- Fix security issue: Ensure configuration tables are only accessible by admin users
-- Drop existing policies and recreate with explicit SELECT restrictions

-- script_configs table
DROP POLICY IF EXISTS "Admin users can manage all configs" ON script_configs;

CREATE POLICY "Admin users can select script configs" ON script_configs
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admin users can insert script configs" ON script_configs
FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can update script_configs" ON script_configs
FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admin users can delete script_configs" ON script_configs
FOR DELETE USING (is_admin_user());

-- meta_configs table  
DROP POLICY IF EXISTS "Admin users can manage all meta configs" ON meta_configs;

CREATE POLICY "Admin users can select meta configs" ON meta_configs
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admin users can insert meta configs" ON meta_configs
FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can update meta configs" ON meta_configs
FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admin users can delete meta configs" ON meta_configs
FOR DELETE USING (is_admin_user());

-- pixel_configs table
DROP POLICY IF EXISTS "Admin users can manage all pixel configs" ON pixel_configs;

CREATE POLICY "Admin users can select pixel configs" ON pixel_configs
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admin users can insert pixel configs" ON pixel_configs
FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can update pixel configs" ON pixel_configs
FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admin users can delete pixel configs" ON pixel_configs
FOR DELETE USING (is_admin_user());

-- config_versions table (also mentioned in security scan)
DROP POLICY IF EXISTS "Admin users can manage all versions" ON config_versions;

CREATE POLICY "Admin users can select config versions" ON config_versions
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admin users can insert config versions" ON config_versions
FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admin users can update config versions" ON config_versions
FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admin users can delete config versions" ON config_versions
FOR DELETE USING (is_admin_user());