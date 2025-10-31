-- Fix for public.eval function search_path vulnerability
-- This migration addresses the security issue where the function has mutable search_path

-- First, drop the existing function if it exists
DROP FUNCTION IF EXISTS public.eval(text);

-- Recreate the function with proper search_path setting
CREATE OR REPLACE FUNCTION public.eval(input text)
RETURNS text
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  -- Schema-qualify all object references to prevent search_path hijacking
  INSERT INTO public.logs VALUES (input);
  RETURN 'Success';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users (adjust as needed)
GRANT EXECUTE ON FUNCTION public.eval(text) TO authenticated;