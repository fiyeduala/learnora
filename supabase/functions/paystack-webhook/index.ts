import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body      = await req.text()
  const signature = req.headers.get('x-paystack-signature') ?? ''

  // Verify HMAC-SHA512 signature
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''
  const keyData = new TextEncoder().encode(secret)
  const msgData = new TextEncoder().encode(body)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']
  )
  const sigBuf  = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
  const hexSig  = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  if (hexSig !== signature) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)

  // Only handle successful charges
  if (event.event !== 'charge.success') {
    return new Response('OK', { status: 200 })
  }

  const { reference, amount: amountKobo } = event.data
  const amountPaid = amountKobo / 100 // Paystack amounts are in kobo

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find invoice by paystack_reference
  const { data: invoice, error: findErr } = await supabase
    .from('invoices')
    .select('id, amount, paid_amount')
    .eq('paystack_reference', reference)
    .maybeSingle()

  if (findErr || !invoice) {
    console.error('[paystack-webhook] Invoice not found:', reference, findErr?.message)
    return new Response('Invoice not found', { status: 404 })
  }

  const newPaid   = Math.min((invoice as any).amount, ((invoice as any).paid_amount ?? 0) + amountPaid)
  const newStatus = newPaid >= (invoice as any).amount ? 'paid' : 'partial'

  const { error: updateErr } = await supabase
    .from('invoices')
    .update({ paid_amount: newPaid, status: newStatus })
    .eq('id', (invoice as any).id)

  if (updateErr) {
    console.error('[paystack-webhook] Update failed:', updateErr.message)
    return new Response('Update failed', { status: 500 })
  }

  console.log(`[paystack-webhook] Invoice ${(invoice as any).id} → ${newStatus} (₦${newPaid})`)
  return new Response('OK', { status: 200 })
})
