import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ScheduleEmailRequest {
  name: string;
  email: string;
  whatsapp: string;
  preferredTime?: string;
}

const getPreferredTimeText = (preferredTime: string | undefined) => {
  switch (preferredTime) {
    case "morning":
      return "Manhã (8h às 12h)";
    case "afternoon":
      return "Tarde (12h às 18h)";
    case "evening":
      return "Noite (18h às 20h)";
    case "flexible":
      return "Horário flexível";
    default:
      return "Não informado";
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, whatsapp, preferredTime }: ScheduleEmailRequest = await req.json();

    console.log("Sending schedule email for:", { name, email, whatsapp, preferredTime });

    const emailResponse = await resend.emails.send({
      from: "JungCria <contato@jungcria.com>",
      to: ["fernanda@jungcria.com"],
      subject: "Novo Agendamento de Diagnóstico Gratuito",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">
            Novo Agendamento de Diagnóstico Gratuito
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Dados do Cliente:</h3>
            
            <p style="margin: 10px 0;">
              <strong>Nome:</strong> ${name}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>E-mail:</strong> ${email}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>WhatsApp:</strong> ${whatsapp}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Melhor horário para contato:</strong> ${getPreferredTimeText(preferredTime)}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;">
              <strong>Ação necessária:</strong> Entre em contato com o cliente para agendar o diagnóstico gratuito.
            </p>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Este e-mail foi enviado automaticamente pelo sistema de agendamento da JungCria.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-schedule-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);