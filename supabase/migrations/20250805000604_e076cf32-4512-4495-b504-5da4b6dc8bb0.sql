-- Adicionar campos nome e telefone na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telefone text;

-- O campo nome já existe, mas vamos garantir que seja obrigatório
ALTER TABLE public.profiles 
ALTER COLUMN nome SET NOT NULL;