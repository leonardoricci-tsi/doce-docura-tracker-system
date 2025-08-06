-- Primeiro, vamos remover a política atual que permite todos verem distribuições
DROP POLICY IF EXISTS "Todos podem ver distribuições" ON public.distribuicoes;

-- Criar nova política que permite distribuidor ver apenas suas próprias distribuições
CREATE POLICY "Distribuidores podem ver apenas suas próprias distribuições" 
ON public.distribuicoes 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.distribuidores d
    INNER JOIN public.profiles p ON p.email = d.email
    WHERE d.id = distribuicoes.distribuidor_id 
    AND p.id = auth.uid()
    AND p.tipo_usuario = 'distribuidor'
  )
);

-- Política para permitir que fábrica veja todas as distribuições
CREATE POLICY "Fábrica pode ver todas as distribuições" 
ON public.distribuicoes 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.tipo_usuario = 'fabrica'
  )
);

-- Atualizar política de criação de distribuições para ser mais restritiva
DROP POLICY IF EXISTS "Todos podem criar distribuições" ON public.distribuicoes;

CREATE POLICY "Distribuidores podem criar suas próprias distribuições" 
ON public.distribuicoes 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.distribuidores d
    INNER JOIN public.profiles p ON p.email = d.email
    WHERE d.id = distribuicoes.distribuidor_id 
    AND p.id = auth.uid()
    AND p.tipo_usuario = 'distribuidor'
  )
);

-- Política para permitir que fábrica crie distribuições
CREATE POLICY "Fábrica pode criar distribuições" 
ON public.distribuicoes 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.tipo_usuario = 'fabrica'
  )
);

-- Atualizar política de atualização de distribuições
DROP POLICY IF EXISTS "Todos podem atualizar distribuições" ON public.distribuicoes;

CREATE POLICY "Distribuidores podem atualizar suas próprias distribuições" 
ON public.distribuicoes 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.distribuidores d
    INNER JOIN public.profiles p ON p.email = d.email
    WHERE d.id = distribuicoes.distribuidor_id 
    AND p.id = auth.uid()
    AND p.tipo_usuario = 'distribuidor'
  )
);

-- Política para permitir que fábrica atualize distribuições
CREATE POLICY "Fábrica pode atualizar distribuições" 
ON public.distribuicoes 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.tipo_usuario = 'fabrica'
  )
);