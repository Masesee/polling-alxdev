'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '../supabase/server'
import type { Poll } from '../types'

// -----------------------------------------------------------------------------
// Standardized action result types
// -----------------------------------------------------------------------------
/**
 * Defines the structure for field-specific errors.
 */
type FieldErrors = Record<string, string>

/**
 * Represents a failed action result.
 * @property success Always false for a failure.
 * @property message A general error message.
 * @property fieldErrors Optional, an object containing specific field validation errors.
 */
type ActionFailure = { success: false; message: string; fieldErrors?: FieldErrors }

/**
 * Represents a successful action result.
 * @property success Always true for a success.
 * @property data The data returned by the successful action.
 */
type ActionSuccess<TData> = { success: true; data: TData }

/**
 * A union type for any action result, which can be either a success or a failure.
 */
type ActionResult<TData> = ActionFailure | ActionSuccess<TData>

/**
 * Helper function to create a standardized failure response.
 * @param message The main error message.
 * @param fieldErrors Optional, an object of field-specific errors.
 * @returns An ActionFailure object.
 */
function fail(message: string, fieldErrors?: FieldErrors): ActionFailure {
  return { success: false, message, fieldErrors }
}

// -----------------------------------------------------------------------------
// Input typing and parsing
// -----------------------------------------------------------------------------
/**
 * Defines the expected structure of input when creating a poll.
 */
interface CreatePollInput {
  question: string
  options: string[]
  allowMultiple: boolean
  requireLogin: boolean
  endDateRaw: string
}

/**
 * Parses form data into a structured CreatePollInput object.
 * Extracts and cleans up values from the FormData object.
 * @param formData The FormData object submitted from the client.
 * @returns A CreatePollInput object.
 */
function parseCreatePollForm(formData: FormData): CreatePollInput {
  const question = String(formData.get('question') || '').trim()
  // Split options by newline, trim each, and filter out empty strings.
  const options = (String(formData.get('options') || '') || '')
    .split('\n')
    .map((o) => o.trim())
    .filter((o) => o.length > 0)
  // Checkbox values are 'on' if checked, otherwise null/undefined.
  const allowMultiple = formData.get('allowMultiple') === 'on'
  const requireLogin = formData.get('requireLogin') === 'on'
  const endDateRaw = String(formData.get('endDate') || '').trim()
  return { question, options, allowMultiple, requireLogin, endDateRaw }
}

/**
 * Validates the parsed CreatePollInput.
 * @param input The parsed poll input data.
 * @returns An object of field errors if validation fails, otherwise null.
 */
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
/**
 * Initializes and returns a Supabase client for server-side operations.
 * @returns A Supabase client instance.
 */
function getSupabase() {
  return createServerSupabase()
}

/**
 * Retrieves the ID of the currently authenticated user.
 * @returns The user's ID if authenticated, otherwise null.
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = getSupabase()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// -----------------------------------------------------------------------------
// Poll persistence helpers
// -----------------------------------------------------------------------------
/**
 * Type representing the minimal information of an inserted poll.
 */
type InsertedPoll = Pick<Poll, 'id'>

/**
 * Inserts a new poll into the 'polls' table in Supabase.
 * @param input The validated poll input data.
 * @param createdBy The ID of the user creating the poll.
 * @returns An object containing the ID of the newly created poll.
 * @throws Error if the poll creation fails.
 */
async function insertPoll(input: CreatePollInput, createdBy: string | null): Promise<InsertedPoll> {
  const supabase = getSupabase()
  const { data: poll, error } = await supabase
    .from('polls')
    .insert({
      question: input.question,
      created_by: createdBy,
      allow_multiple: input.allowMultiple,
      require_login: input.requireLogin,
      // Convert end date to ISO string if provided, otherwise null.
      expires_at: input.endDateRaw ? new Date(input.endDateRaw).toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !poll) {
    throw new Error(error?.message || 'Failed to create poll')
  }

  return { id: poll.id }
}

/**
 * Inserts poll options into the 'poll_options' table in Supabase.
 * @param pollId The ID of the poll to which these options belong.
 * @param options An array of option text strings.
 * @throws Error if the option insertion fails.
 */
async function insertPollOptions(pollId: string, options: string[]): Promise<void> {
  const supabase = getSupabase()
  // Map option text to an array of objects suitable for Supabase insertion.
  const payload = options.map((text) => ({ poll_id: pollId, text }))
  const { error } = await supabase.from('poll_options').insert(payload)
  if (error) {
    throw new Error(error.message)
  }
}

// -----------------------------------------------------------------------------
// Server action
// -----------------------------------------------------------------------------
/**
 * Type definition for the result of the createPoll server action.
 */
export type CreatePollResult = ActionResult<{ pollId: string }>

/**
 * Server action to create a new poll.
 * This function handles the entire poll creation process: parsing form data,
 * validating input, authenticating the user, inserting the poll and its options
 * into the database, and revalidating the /polls path.
 * @param _prevState The previous state (unused in this action).
 * @param formData The FormData object submitted from the client.
 * @returns A CreatePollResult indicating success or failure, with the pollId on success.
 */
export async function createPoll(_prevState: unknown, formData: FormData): Promise<CreatePollResult> {
  try {
    // Parse and validate the incoming form data.
    const input = parseCreatePollForm(formData)
    const fieldErrors = validateCreatePollInput(input)
    if (fieldErrors) {
      return fail('Invalid input', fieldErrors)
    }

    // Get the authenticated user's ID.
    const userId = await getAuthenticatedUserId()
    // Insert the poll into the database and get its ID.
    const { id: pollId } = await insertPoll(input, userId)
    // Insert the poll's options.
    await insertPollOptions(pollId, input.options)

    // Revalidate the /polls path to show the new poll.
    revalidatePath('/polls')
    return { success: true, data: { pollId } }
  } catch (err: unknown) {
    // Catch and standardize any unexpected errors during the process.
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return fail(message)
  }
}

