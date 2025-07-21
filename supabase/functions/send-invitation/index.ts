import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  tipo_usuario: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    const { email, tipo_usuario }: InvitationRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Formato de e-mail inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if invitation already exists
    const { data: existingInvitation } = await supabase
      .from("sign_up_invitations")
      .select("id")
      .eq("email", email)
      .single();

    let result;
    
    if (existingInvitation) {
      // Update existing invitation
      result = await supabase
        .from("sign_up_invitations")
        .update({
          code,
          consumed: false,
          consumed_at: null,
          tipo_usuario,
          created_at: new Date().toISOString(),
        })
        .eq("email", email);
    } else {
      // Create new invitation
      result = await supabase
        .from("sign_up_invitations")
        .insert({
          email,
          code,
          tipo_usuario,
        });
    }

    if (result.error) {
      console.error("Database error:", result.error);
      throw new Error("Erro ao salvar convite no banco de dados");
    }

    // Send email with invitation code
    const emailResponse = await resend.emails.send({
      from: "Sistema <onboarding@resend.dev>",
      to: [email],
      subject: "Seu código de convite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Convite para Cadastro</h2>
          <p>Olá!</p>
          <p>Aqui está seu código de convite: <strong style="font-size: 24px; color: #007bff;">${code}</strong></p>
          <p>Use-o para continuar seu cadastro.</p>
          <p>Este código é válido e pode ser usado para criar sua conta no sistema.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou este convite, pode ignorar este e-mail.
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Email error:", emailResponse.error);
      throw new Error("Erro ao enviar e-mail de convite");
    }

    console.log("Invitation sent successfully:", { email, code });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Convite enviado com sucesso!",
        email 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro interno do servidor" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);