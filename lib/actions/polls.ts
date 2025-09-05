'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '../supabase/server'
import type { Poll } from '../types'

// -----------------------------------------------------------------------------
// Standardized action result types
// -----------------------------------------------------------------------------
type FieldErrors = Record<string, string>
type ActionFailure = { success: false; message: string; fieldErrors?: FieldErrors }
type ActionSuccess<TData> = { success: true; data: TData }
type ActionResult<TData> = ActionFailure | ActionSuccess<TData>

// Helper to standardize failures
function fail(message: string, fieldErrors?: FieldErrors): ActionFailure {
  return { success: false, message, fieldErrors }
}

// -----------------------------------------------------------------------------
// Input typing and parsing
// -----------------------------------------------------------------------------
interface CreatePollInput {
  question: string
  options: string[]
  allowMultiple: boolean
  requireLogin: boolean
  endDateRaw: string
}

function parseCreatePollForm(formData: FormData): CreatePollInput {
  const question = String(formData.get('question') || '').trim()
  const options = (String(formData.get('options') || '') || '')
    .split('\n')
    .map((o) => o.trim())
    .filter((o) => o.length > 0)
  const allowMultiple = formData.get('allowMultiple') === 'on'
  const requireLogin = formData.get('requireLogin') === 'on'
  const endDateRaw = String(formData.get('endDate') || '').trim()
  return { question, options, allowMultiple, requireLogin, endDateRaw }
}

function validateCreatePollInput(input: CreatePollInput): FieldErrors | null {
  const fieldErrors: FieldErrors = {}
  if (!input.question) {
    fieldErrors.question = 'Question is required'
  }
  if (input.options.length < 2) {
    fieldErrors.options = 'Please provide at least 2 options'
  }
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
}

// -----------------------------------------------------------------------------
// Supabase and auth helpers
// -----------------------------------------------------------------------------
function getSupabase() {
  return createServerSupabase()
}

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = getSupabase()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// -----------------------------------------------------------------------------
// Poll persistence helpers
// -----------------------------------------------------------------------------
type InsertedPoll = Pick<Poll, 'id'>

async function insertPoll(input: CreatePollInput, createdBy: string | null): Promise<InsertedPoll> {
  const supabase = getSupabase()
  const { data: poll, error } = await supabase
    .from('polls')
    .insert({
      question: input.question,
      created_by: createdBy,
      allow_multiple: input.allowMultiple,
      require_login: input.requireLogin,
      expires_at: input.endDateRaw ? new Date(input.endDateRaw).toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !poll) {
    throw new Error(error?.message || 'Failed to create poll')
  }

  return { id: poll.id }
}

async function insertPollOptions(pollId: string, options: string[]): Promise<void> {
  const supabase = getSupabase()
  const payload = options.map((text) => ({ poll_id: pollId, text }))
  const { error } = await supabase.from('poll_options').insert(payload)
  if (error) {
    throw new Error(error.message)
  }
}

// -----------------------------------------------------------------------------
// Server action
// -----------------------------------------------------------------------------
export type CreatePollResult = ActionResult<{ pollId: string }>

export async function createPoll(_prevState: unknown, formData: FormData): Promise<CreatePollResult> {
  try {
    const input = parseCreatePollForm(formData)
    const fieldErrors = validateCreatePollInput(input)
    if (fieldErrors) {
      return fail('Invalid input', fieldErrors)
    }

    const userId = await getAuthenticatedUserId()
    const { id: pollId } = await insertPoll(input, userId)
    await insertPollOptions(pollId, input.options)

    revalidatePath('/polls')
    return { success: true, data: { pollId } }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return fail(message)
  }
}

