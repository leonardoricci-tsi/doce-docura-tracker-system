
-- Criar tabela de produtos
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT,
  preco_unitario DECIMAL(10,2),
  unidade_medida TEXT DEFAULT 'unidade',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de lotes de produção
CREATE TABLE public.lotes_producao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_lote TEXT NOT NULL UNIQUE,
  produto_id UUID REFERENCES public.produtos(id) NOT NULL,
  quantidade_produzida INTEGER NOT NULL,
  data_producao DATE NOT NULL,
  data_validade DATE NOT NULL,
  responsavel TEXT NOT NULL,
  observacoes TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'distribuido', 'vencido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de distribuidores
CREATE TABLE public.distribuidores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de distribuições
CREATE TABLE public.distribuicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID REFERENCES public.lotes_producao(id) NOT NULL,
  distribuidor_id UUID REFERENCES public.distribuidores(id) NOT NULL,
  quantidade_distribuida INTEGER NOT NULL,
  data_distribuicao DATE NOT NULL,
  responsavel_distribuicao TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de pontos de venda
CREATE TABLE public.pontos_venda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuidor_id UUID REFERENCES public.distribuidores(id) NOT NULL,
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  tipo TEXT DEFAULT 'loja' CHECK (tipo IN ('loja', 'mercado', 'padaria', 'confeitaria', 'outro')),
  responsavel TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de vendas nos pontos de venda
CREATE TABLE public.vendas_pdv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribuicao_id UUID REFERENCES public.distribuicoes(id) NOT NULL,
  ponto_venda_id UUID REFERENCES public.pontos_venda(id) NOT NULL,
  quantidade_vendida INTEGER NOT NULL,
  data_venda DATE NOT NULL,
  preco_venda DECIMAL(10,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar RLS em todas as tabelas
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribuidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribuicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontos_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_pdv ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para permitir acesso a todos os usuários autenticados
-- (você pode restringir isso posteriormente conforme necessário)

-- Produtos
CREATE POLICY "Todos podem ver produtos" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Todos podem criar produtos" ON public.produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar produtos" ON public.produtos FOR UPDATE USING (true);

-- Lotes de produção
CREATE POLICY "Todos podem ver lotes" ON public.lotes_producao FOR SELECT USING (true);
CREATE POLICY "Todos podem criar lotes" ON public.lotes_producao FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar lotes" ON public.lotes_producao FOR UPDATE USING (true);

-- Distribuidores
CREATE POLICY "Todos podem ver distribuidores" ON public.distribuidores FOR SELECT USING (true);
CREATE POLICY "Todos podem criar distribuidores" ON public.distribuidores FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar distribuidores" ON public.distribuidores FOR UPDATE USING (true);

-- Distribuições
CREATE POLICY "Todos podem ver distribuições" ON public.distribuicoes FOR SELECT USING (true);
CREATE POLICY "Todos podem criar distribuições" ON public.distribuicoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar distribuições" ON public.distribuicoes FOR UPDATE USING (true);

-- Pontos de venda
CREATE POLICY "Todos podem ver pontos de venda" ON public.pontos_venda FOR SELECT USING (true);
CREATE POLICY "Todos podem criar pontos de venda" ON public.pontos_venda FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar pontos de venda" ON public.pontos_venda FOR UPDATE USING (true);

-- Vendas PDV
CREATE POLICY "Todos podem ver vendas" ON public.vendas_pdv FOR SELECT USING (true);
CREATE POLICY "Todos podem criar vendas" ON public.vendas_pdv FOR INSERT WITH CHECK (true);
CREATE POLICY "Todos podem atualizar vendas" ON public.vendas_pdv FOR UPDATE USING (true);

-- Inserir alguns produtos de exemplo
INSERT INTO public.produtos (nome, tipo, descricao, preco_unitario) VALUES
('Brigadeiro', 'doce', 'Tradicional brigadeiro gourmet', 2.50),
('Beijinho', 'doce', 'Beijinho de coco com açúcar cristal', 2.50),
('Quindim', 'doce', 'Quindim tradicional com coco', 3.00),
('Bem-casado', 'doce', 'Bem-casado com recheio de doce de leite', 4.00),
('Trufa', 'doce', 'Trufa de chocolate belga', 5.00);

-- Inserir alguns distribuidores de exemplo
INSERT INTO public.distribuidores (nome, cnpj, endereco, telefone, email, responsavel) VALUES
('Distribuidora Centro', '12.345.678/0001-90', 'Rua das Flores, 123 - Centro', '(11) 9999-1234', 'contato@distcentro.com', 'João Silva'),
('Distribuidora Norte', '98.765.432/0001-10', 'Av. Norte, 456 - Zona Norte', '(11) 8888-5678', 'vendas@distnorte.com', 'Maria Santos');
