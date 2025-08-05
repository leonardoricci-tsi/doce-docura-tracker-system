-- Corrigir função handle_new_user para usar search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tipo_usuario, nome, telefone)
  VALUES (
    NEW.id, 
    NEW.email, 
    'distribuidor',
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', NULL)
  );
  RETURN NEW;
END;
$$;

-- Corrigir função update_updated_at_column para usar search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;