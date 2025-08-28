'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '../supabase/server'

export async function createPoll(formData: FormData) {
  const question = String(formData.get('question') || '').trim()
  const options = (String(formData.get('options') || '') || '')
    .split('\n')
    .map((o) => o.trim())
    .filter((o) => o.length > 0)

  const allowMultiple = formData.get('allowMultiple') === 'on'
  const requireLogin = formData.get('requireLogin') === 'on'
  const endDateRaw = String(formData.get('endDate') || '').trim()

  if (!question) {
    throw new Error('Question is required')
  }
  if (options.length < 2) {
    throw new Error('Please provide at least 2 options')
  }

  const supabase = createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const createdBy = user?.id || null

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      question,
      created_by: createdBy,
      allow_multiple: allowMultiple,
      require_login: requireLogin,
      expires_at: endDateRaw ? new Date(endDateRaw).toISOString() : null,
    })
    .select()
    .single()

  if (pollError) {
    throw new Error(pollError.message)
  }

  const optionsPayload = options.map((text: string) => ({
    poll_id: poll.id,
    text,
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsPayload)

  if (optionsError) {
    throw new Error(optionsError.message)
  }

  revalidatePath('/polls')
  redirect(`/polls/${poll.id}`)
}


