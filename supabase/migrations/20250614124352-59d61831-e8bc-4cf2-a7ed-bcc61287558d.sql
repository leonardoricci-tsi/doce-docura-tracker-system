
-- Criação da tabela de convites para cadastro por e-mail
CREATE TABLE public.sign_up_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  consumed_at TIMESTAMP WITH TIME ZONE
);

-- Ativar RLS na tabela de convites
ALTER TABLE public.sign_up_invitations ENABLE ROW LEVEL SECURITY;

-- Permite que admin veja todos os convites (ajuste a policy conforme sua lógica de admin)
CREATE POLICY "Admin pode visualizar convites"
  ON public.sign_up_invitations
  FOR SELECT
  USING (true);

-- Permite que qualquer pessoa crie convite (ajuste, pois depois vamos permitir apenas por admin/app)
CREATE POLICY "Admin pode criar convite"
  ON public.sign_up_invitations
  FOR INSERT
  WITH CHECK (true);

-- Permite atualizar apenas para consumir o convite (apenas marcada como consumida pelo próprio dono do e-mail)
CREATE POLICY "Usuário pode consumir o próprio convite"
  ON public.sign_up_invitations
  FOR UPDATE
  USING (auth.role() = 'authenticated' AND email = auth.email())
  WITH CHECK (auth.role() = 'authenticated' AND email = auth.email());
