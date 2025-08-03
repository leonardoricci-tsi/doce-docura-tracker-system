-- Remover a coluna produto_id da tabela lotes_producao (não é mais necessária)
ALTER TABLE public.lotes_producao DROP COLUMN IF EXISTS produto_id;

-- Remover a coluna quantidade_produzida da tabela lotes_producao (agora fica nos itens)
ALTER TABLE public.lotes_producao DROP COLUMN IF EXISTS quantidade_produzida;