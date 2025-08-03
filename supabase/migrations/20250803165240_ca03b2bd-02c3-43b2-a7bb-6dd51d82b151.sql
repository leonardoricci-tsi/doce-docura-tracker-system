-- Criar política para permitir deletar lotes de produção
CREATE POLICY "Todos podem deletar lotes" 
ON lotes_producao 
FOR DELETE 
USING (true);