-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela para itens do lote (múltiplos produtos por lote)
CREATE TABLE public.lote_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lote_id UUID NOT NULL,
  produto_id UUID NOT NULL,
  quantidade_produzida INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_lote_itens_lote FOREIGN KEY (lote_id) REFERENCES public.lotes_producao(id) ON DELETE CASCADE,
  CONSTRAINT fk_lote_itens_produto FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.lote_itens ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para lote_itens
CREATE POLICY "Todos podem ver itens do lote" 
ON public.lote_itens 
FOR SELECT 
USING (true);

CREATE POLICY "Todos podem criar itens do lote" 
ON public.lote_itens 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos podem atualizar itens do lote" 
ON public.lote_itens 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos podem deletar itens do lote" 
ON public.lote_itens 
FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at na tabela lote_itens
CREATE TRIGGER update_lote_itens_updated_at
BEFORE UPDATE ON public.lote_itens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();