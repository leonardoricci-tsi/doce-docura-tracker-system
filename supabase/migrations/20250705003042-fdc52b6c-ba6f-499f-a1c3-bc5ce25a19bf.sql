
-- Adicionar política para permitir INSERT na tabela profiles durante o cadastro
CREATE POLICY "Permitir criação de perfil durante cadastro"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
