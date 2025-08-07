-- Adicionar campo distribuidor_destinatario_id na tabela lotes_producao
ALTER TABLE public.lotes_producao 
ADD COLUMN distribuidor_destinatario_id UUID REFERENCES public.distribuidores(id);

-- Criar índice para melhor performance
CREATE INDEX idx_lotes_producao_distribuidor_destinatario 
ON public.lotes_producao(distribuidor_destinatario_id);