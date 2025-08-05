-- Atualizar registros existentes com nome nulo
UPDATE public.profiles 
SET nome = 'Usuário' 
WHERE nome IS NULL;

-- Adicionar campo telefone
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telefone text;