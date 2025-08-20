-- Fix admin_users table security issue
-- The current RLS policy incorrectly assumes admin_users.id matches auth.uid()
-- Since admin auth is done via email checking, we need a proper security function

-- First, create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user's email matches the admin email
  -- This function safely checks against auth.users table
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@jung.com.br'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop the existing problematic RLS policy
DROP POLICY IF EXISTS "Admin users can manage their own data" ON public.admin_users;

-- Create a new, properly secured RLS policy
CREATE POLICY "Only verified admin can access admin_users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin_user());

-- Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Add a comment explaining the security model
COMMENT ON TABLE public.admin_users IS 'Admin user data table. Access restricted to verified admin users only via email verification in is_admin_user() function.';
COMMENT ON FUNCTION public.is_admin_user() IS 'Security definer function that verifies if the current authenticated user is an admin by checking their email against the admin email.';