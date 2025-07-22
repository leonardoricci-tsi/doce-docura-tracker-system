-- Adicionar política para permitir deletar convites
CREATE POLICY "Admin pode deletar convites" 
ON public.sign_up_invitations
FOR DELETE 
USING (true);