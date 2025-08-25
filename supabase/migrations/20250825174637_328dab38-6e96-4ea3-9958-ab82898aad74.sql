-- Fix audit_logs security issue
-- Current issue: Only SELECT policy exists, missing INSERT/UPDATE/DELETE policies
-- This could allow unauthorized data manipulation

-- Add comprehensive RLS policies for audit_logs table

-- Policy for INSERT: Only allow admins to insert audit logs
CREATE POLICY "Only admins can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

-- Policy for UPDATE: Prevent any updates to audit logs (immutable for security)
CREATE POLICY "Audit logs cannot be updated" 
ON public.audit_logs 
FOR UPDATE 
TO authenticated
USING (false);

-- Policy for DELETE: Only allow admins to delete old audit logs if necessary
CREATE POLICY "Only admins can delete audit logs" 
ON public.audit_logs 
FOR DELETE 
TO authenticated
USING (public.is_admin_user());

-- Ensure the existing SELECT policy is properly restrictive
DROP POLICY IF EXISTS "Admin users can view all audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

-- Add security comments
COMMENT ON TABLE public.audit_logs IS 'Audit logs table containing sensitive user activity data, IP addresses, and system actions. Access strictly limited to verified admin users only.';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'User IP address - sensitive data, admin access only';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'User agent string - sensitive data, admin access only';
COMMENT ON COLUMN public.audit_logs.details IS 'Action details in JSON format - may contain sensitive data, admin access only';