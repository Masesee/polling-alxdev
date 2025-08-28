'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '../supabase/server'

export type CreatePollResult =
  | { success: true; pollId: string }
  | { success: false; fieldErrors?: { question?: string; options?: string }; message?: string }

export async function createPoll(_prevState: unknown, formData: FormData): Promise<CreatePollResult> {
  try {
    const question = String(formData.get('question') || '').trim()
    const options = (String(formData.get('options') || '') || '')
      .split('\n')
      .map((o) => o.trim())
      .filter((o) => o.length > 0)

    const allowMultiple = formData.get('allowMultiple') === 'on'
    const requireLogin = formData.get('requireLogin') === 'on'
    const endDateRaw = String(formData.get('endDate') || '').trim()

    const fieldErrors: { question?: string; options?: string } = {}
    if (!question) {
      fieldErrors.question = 'Question is required'
    }
    if (options.length < 2) {
      fieldErrors.options = 'Please provide at least 2 options'
    }
    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, fieldErrors }
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

    if (pollError || !poll) {
      return { success: false, message: pollError?.message || 'Failed to create poll' }
    }

    const optionsPayload = options.map((text: string) => ({
      poll_id: poll.id,
      text,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsPayload)

    if (optionsError) {
      return { success: false, message: optionsError.message }
    }

    revalidatePath('/polls')
    return { success: true, pollId: poll.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return { success: false, message }
  }
}


