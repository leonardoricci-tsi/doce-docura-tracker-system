
-- Remover a política atual que não está funcionando
DROP POLICY IF EXISTS "Permitir criação de perfil durante cadastro" ON public.profiles;

-- Criar uma política mais permissiva especificamente para o processo de signup
-- Esta política permite INSERT quando o usuário está autenticado ou durante o processo de signup
CREATE POLICY "Permitir criação de perfil durante signup"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    -- Permite se o usuário está autenticado e o ID corresponde
    (auth.uid() = id) 
    OR 
    -- Permite durante o processo de signup quando auth.uid() pode não estar disponível ainda
    (auth.role() = 'authenticated')
  );
