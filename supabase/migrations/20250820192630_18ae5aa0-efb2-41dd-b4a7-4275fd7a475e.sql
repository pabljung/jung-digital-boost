-- Fix function search path security warning
-- Update the is_admin_user function to have a secure search path

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;