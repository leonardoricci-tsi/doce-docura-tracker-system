
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
  console.log("=== Send Invitation Function Started ===");
  console.log("Method:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("CORS preflight request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    console.log("Environment variables check:");
    console.log("SUPABASE_URL:", supabaseUrl ? "✓ Present" : "✗ Missing");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceRoleKey ? "✓ Present" : "✗ Missing");
    console.log("RESEND_API_KEY:", resendApiKey ? "✓ Present" : "✗ Missing");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    console.log("Supabase and Resend clients initialized");

    const requestBody = await req.json();
    console.log("Request body received:", requestBody);

    const { email, tipo_usuario }: InvitationRequest = requestBody;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
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
    console.log("Generated code:", code);

    // Check if invitation already exists
    console.log("Checking for existing invitation for email:", email);
    const { data: existingInvitation, error: selectError } = await supabase
      .from("sign_up_invitations")
      .select("id")
      .eq("email", email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Error checking existing invitation:", selectError);
    }

    console.log("Existing invitation:", existingInvitation ? "Found" : "Not found");

    let result;

    if (existingInvitation) {
      console.log("Updating existing invitation");
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
      console.log("Creating new invitation");
      // Create new invitation
      result = await supabase
        .from("sign_up_invitations")
        .insert({
          email,
          code,
          tipo_usuario,
        });
    }

    console.log("Database operation result:", result);

    if (result.error) {
      console.error("Database error:", result.error);
      throw new Error("Erro ao salvar convite no banco de dados");
    }

    console.log("=== Attempting to send email ===");
    console.log("Email details:");
    console.log("- To:", email);
    console.log("- Code:", code);
    console.log("- User type:", tipo_usuario);

    // Send email with invitation code
    const emailResponse = await resend.emails.send({
      from: "MaplyRastro <onboarding@resend.dev>",
      to: [email],
      subject: `Seu código de convite para acessar ${tipo_usuario}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0;">🎉 Convite para Cadastro</h1>
            <p style="font-size: 18px; color: #e74c3c; font-weight: bold; text-transform: uppercase; text-align: center;">
              Acesso: ${tipo_usuario}
            </p>
          </div>

          <p style="font-size: 16px; color: #444;">Olá!</p>
          <p style="font-size: 16px; color: #444;">Você recebeu um código de convite para criar sua conta no sistema, na aba ${tipo_usuario}.</p>
          
          <div style="background-color: #ffffff; border: 1px dashed #007bff; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
            <p style="font-size: 18px; color: #333; margin: 0;">Seu código de convite é:</p>
            <p style="font-size: 32px; font-weight: bold; color: #007bff; margin: 10px 0;">${code}</p>
          </div>

          <p style="font-size: 16px; color: #444;">Use esse código para continuar seu cadastro no nosso sistema. Ele é válido por tempo limitado.</p>
          <p style="font-size: 16px; color: #444;">Se você não solicitou este convite, pode ignorar este e-mail com segurança.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px soliad #ddd;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} - MaplyRastro. Todos os direitos reservados.
          </p>
        </div>
      `,
    });

    console.log("=== Email sending result ===");
    console.log("Success:", emailResponse.data ? "✓" : "✗");
    console.log("Email ID:", emailResponse.data?.id);
    console.log("Error:", emailResponse.error);

    if (emailResponse.error) {
      console.error("Email error details:", emailResponse.error);
      throw new Error(`Erro ao enviar e-mail: ${emailResponse.error.message}`);
    }

    console.log("=== Function completed successfully ===");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Convite enviado com sucesso!",
        email,
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("=== Error in send-invitation function ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);

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
