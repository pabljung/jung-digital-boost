-- Fix audit_logs security - check existing policies first and add missing ones

-- Drop and recreate all policies to ensure consistency
DROP POLICY IF EXISTS "Admin users can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs cannot be updated" ON public.audit_logs;
DROP POLICY IF EXISTS "Only admins can delete audit logs" ON public.audit_logs;

-- Create comprehensive security policies
-- SELECT: Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

-- INSERT: Only admins can insert audit logs  
CREATE POLICY "Only admins can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

-- UPDATE: Audit logs are immutable for security
CREATE POLICY "Audit logs are immutable" 
ON public.audit_logs 
FOR UPDATE 
TO authenticated
USING (false);

-- DELETE: Only admins can delete audit logs if necessary
CREATE POLICY "Only admins can delete audit logs" 
ON public.audit_logs 
FOR DELETE 
TO authenticated
USING (public.is_admin_user());

-- Add security documentation
COMMENT ON TABLE public.audit_logs IS 'Immutable audit logs containing sensitive user activity, IP addresses, and system actions. Strictly restricted to verified admin users only.';

-- Verify RLS is enabled
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;