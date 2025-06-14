
-- Adicionar coluna tipo_usuario na tabela de convites
ALTER TABLE public.sign_up_invitations 
ADD COLUMN tipo_usuario TEXT NOT NULL DEFAULT 'distribuidor';

-- Adicionar constraint para validar os tipos permitidos
ALTER TABLE public.sign_up_invitations 
ADD CONSTRAINT check_tipo_usuario 
CHECK (tipo_usuario IN ('fabrica', 'distribuidor'));
