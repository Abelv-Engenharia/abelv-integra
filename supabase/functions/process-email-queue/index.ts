
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  id: string;
  destinatario: string;
  assunto: string;
  corpo: string;
  anexos: any[];
  tentativas: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar emails pendentes
    const { data: emails, error: fetchError } = await supabaseClient
      .from('emails_pendentes')
      .select('*')
      .eq('enviado', false)
      .lt('tentativas', 3)
      .order('criado_em', { ascending: true })
      .limit(10) // Processar até 10 emails por vez

    if (fetchError) {
      console.error('Erro ao buscar emails:', fetchError)
      throw fetchError
    }

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Nenhum email pendente encontrado',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    console.log(`Processando ${emails.length} emails...`)

    let sucessos = 0
    let falhas = 0

    // Processar cada email
    for (const email of emails) {
      try {
        const success = await sendEmail(email, supabaseClient)
        if (success) {
          sucessos++
        } else {
          falhas++
        }
        
        // Pequena pausa entre envios
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Erro ao processar email ${email.id}:`, error)
        falhas++
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processamento concluído. Sucessos: ${sucessos}, Falhas: ${falhas}`,
      processed: emails.length,
      sucessos,
      falhas
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro no processamento da fila:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function sendEmail(emailData: EmailData, supabaseClient: any): Promise<boolean> {
  try {
    console.log(`Enviando email para ${emailData.destinatario} - Assunto: ${emailData.assunto}`)
    
    // Usar Resend para enviar o email
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY não configurada')
      return false
    }

    const emailPayload = {
      from: 'Sistema SMS <noreply@yourdomain.com>',
      to: [emailData.destinatario],
      subject: emailData.assunto,
      html: emailData.corpo,
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })

    if (response.ok) {
      console.log(`Email enviado com sucesso para ${emailData.destinatario}`)
      
      // Marcar como enviado no banco
      await supabaseClient
        .from('emails_pendentes')
        .update({ 
          enviado: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', emailData.id)

      return true
    } else {
      const errorText = await response.text()
      console.error(`Erro ao enviar email para ${emailData.destinatario}:`, errorText)
      
      // Incrementar tentativas
      await supabaseClient
        .from('emails_pendentes')
        .update({ 
          tentativas: emailData.tentativas + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', emailData.id)

      return false
    }
  } catch (error) {
    console.error(`Erro ao enviar email para ${emailData.destinatario}:`, error)
    
    // Incrementar tentativas
    await supabaseClient
      .from('emails_pendentes')
      .update({ 
        tentativas: emailData.tentativas + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', emailData.id)

    return false
  }
}
