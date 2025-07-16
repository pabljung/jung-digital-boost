import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// Input validation schema
const validateInput = (data: any) => {
  const { name, email, whatsapp, preferredTime } = data;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    throw new Error('Nome deve ter entre 2 e 100 caracteres');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 254) {
    throw new Error('Email inválido');
  }
  
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  if (!whatsapp || !phoneRegex.test(whatsapp)) {
    throw new Error('WhatsApp deve estar no formato (XX) XXXXX-XXXX');
  }
  
  const validTimeSlots = ['morning', 'afternoon', 'evening', 'flexible'];
  if (preferredTime && !validTimeSlots.includes(preferredTime)) {
    throw new Error('Horário preferido inválido');
  }
  
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    whatsapp: whatsapp.trim(),
    preferredTime: preferredTime || 'flexible'
  };
};

// Rate limiting function
const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitStore.get(ip);
  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// Sanitize HTML input
const sanitizeHtml = (input: string) => {
  return input.replace(/[<>]/g, '');
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
    // Extract IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Muitas tentativas. Tente novamente em uma hora." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate authorization header (basic security check)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Token de autorização necessário" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate request body
    const requestBody = await req.json();
    const validatedData = validateInput(requestBody);
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeHtml(validatedData.name),
      email: sanitizeHtml(validatedData.email),
      whatsapp: sanitizeHtml(validatedData.whatsapp),
      preferredTime: validatedData.preferredTime
    };

    console.log("Sending schedule email for validated request from IP:", clientIP);

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
              <strong>Nome:</strong> ${sanitizedData.name}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>E-mail:</strong> ${sanitizedData.email}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>WhatsApp:</strong> ${sanitizedData.whatsapp}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Melhor horário para contato:</strong> ${getPreferredTimeText(sanitizedData.preferredTime)}
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

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-schedule-email function:", error.message);
    
    // Return generic error message to prevent information leakage
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor. Tente novamente mais tarde." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);