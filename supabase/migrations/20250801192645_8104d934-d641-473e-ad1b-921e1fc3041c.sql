-- Adicionar campo 'sabor' na tabela produtos (faltante do formulário de produção)
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS sabor text;

-- Adicionar campo 'nota_fiscal' na tabela lotes_producao (faltante do formulário de produção)
ALTER TABLE public.lotes_producao ADD COLUMN IF NOT EXISTS nota_fiscal text;

-- Criar tabela para regiões de entrega (para o formulário de distribuição)
CREATE TABLE IF NOT EXISTS public.regioes_entrega (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  estado text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela regioes_entrega
ALTER TABLE public.regioes_entrega ENABLE ROW LEVEL SECURITY;

-- Criar políticas para regioes_entrega
CREATE POLICY "Todos podem ver regiões" ON public.regioes_entrega FOR SELECT USING (true);
CREATE POLICY "Todos podem criar regiões" ON public.regioes_entrega FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar regiões" ON public.regioes_entrega FOR UPDATE USING (true);

-- Criar tabela de relacionamento entre distribuições e regiões
CREATE TABLE IF NOT EXISTS public.distribuicao_regioes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distribuicao_id uuid NOT NULL REFERENCES public.distribuicoes(id) ON DELETE CASCADE,
  regiao_nome text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela distribuicao_regioes
ALTER TABLE public.distribuicao_regioes ENABLE ROW LEVEL SECURITY;

-- Criar políticas para distribuicao_regioes
CREATE POLICY "Todos podem ver distribuição regiões" ON public.distribuicao_regioes FOR SELECT USING (true);
CREATE POLICY "Todos podem criar distribuição regiões" ON public.distribuicao_regioes FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar distribuição regiões" ON public.distribuicao_regioes FOR UPDATE USING (true);

-- Inserir regiões padrão do sistema
INSERT INTO public.regioes_entrega (nome, estado) VALUES
('Grande SP', 'SP'),
('Interior de SP', 'SP'),
('Sul de MG', 'MG'),
('Centro RJ', 'RJ'),
('Zona Sul RJ', 'RJ'),
('Norte RJ', 'RJ'),
('BH', 'MG'),
('Interior MG', 'MG'),
('Sul do País', 'RS'),
('Centro-Oeste', 'MT')
ON CONFLICT DO NOTHING;