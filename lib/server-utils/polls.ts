import { createServerSupabase } from '../supabase/server'
import type { Poll } from '../types'

// -----------------------------------------------------------------------------
// Standardized action result types
// -----------------------------------------------------------------------------
/**
 * Defines the structure for field-specific errors.
 */
export type FieldErrors = Record<string, string>

/**
 * Represents a failed action result.
 * @property success Always false for a failure.
 * @property message A general error message.
 * @property fieldErrors Optional, an object containing specific field validation errors.
 */
export type ActionFailure = { success: false; message: string; fieldErrors?: FieldErrors }

/**
 * Represents a successful action result.
 * @property success Always true for a success.
 * @property data The data returned by the successful action.
 */
export type ActionSuccess<TData> = { success: true; data: TData }

/**
 * A union type for any action result, which can be either a success or a failure.
 */
export type ActionResult<TData> = ActionFailure | ActionSuccess<TData>

/**
 * Helper function to create a standardized failure response.
 * @param message The main error message.
 * @param fieldErrors Optional, an object of field-specific errors.
 * @returns An ActionFailure object.
 */
export function fail(message: string, fieldErrors?: FieldErrors): ActionFailure {
  return { success: false, message, fieldErrors }
}

// -----------------------------------------------------------------------------
// Input typing and parsing
// -----------------------------------------------------------------------------
/**
 * Defines the expected structure of input when creating a poll.
 */
export interface CreatePollInput {
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
export function parseCreatePollForm(formData: FormData): CreatePollInput {
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
export function validateCreatePollInput(input: CreatePollInput): FieldErrors | null {
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
export function getSupabase() {
  return createServerSupabase()
}

/**
 * Retrieves the ID of the currently authenticated user.
 * @returns The user\'s ID if authenticated, otherwise null.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
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
export type InsertedPoll = Pick<Poll, 'id'>

/**
 * Inserts a new poll into the 'polls' table in Supabase.
 * @param input The validated poll input data.
 * @param createdBy The ID of the user creating the poll.
 * @returns An object containing the ID of the newly created poll.
 * @throws Error if the poll creation fails.
 */
export async function insertPoll(input: CreatePollInput, createdBy: string | null): Promise<InsertedPoll> {
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
export async function insertPollOptions(pollId: string, options: string[]): Promise<void> {
  const supabase = getSupabase()
  // Map option text to an array of objects suitable for Supabase insertion.
  const payload = options.map((text) => ({ poll_id: pollId, text }))
  const { error } = await supabase.from('poll_options').insert(payload)
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Retrieves all polls created by a specific user.
 * @param userId The ID of the user whose polls to retrieve.
 * @returns An array of Poll objects.
 */
export async function getUserPolls(userId: string): Promise<Poll[]> {
  const supabase = getSupabase();
  
  // First, get all polls created by the user
  const { data: pollsData, error: pollsError } = await supabase
    .from('polls')
    .select('id, question, created_at, created_by, allow_multiple, require_login, expires_at')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (pollsError) {
    throw new Error(`Failed to fetch polls: ${pollsError.message}`);
  }

  if (!pollsData || pollsData.length === 0) {
    return [];
  }

  // Get all options for these polls
  const pollIds = pollsData.map(poll => poll.id);
  const { data: optionsData, error: optionsError } = await supabase
    .from('poll_options')
    .select('id, poll_id, text, votes')
    .in('poll_id', pollIds);

  if (optionsError) {
    throw new Error(`Failed to fetch poll options: ${optionsError.message}`);
  }

  // Map the database results to our Poll type
  const polls: Poll[] = pollsData.map(poll => {
    const options = optionsData
      ? optionsData
          .filter(option => option.poll_id === poll.id)
          .map(option => ({
            id: option.id,
            text: option.text,
            votes: option.votes || 0
          }))
      : [];

    return {
      id: poll.id,
      question: poll.question,
      options,
      createdBy: poll.created_by,
      createdAt: new Date(poll.created_at),
      isActive: poll.is_active,
      allowMultiple: poll.allow_multiple,
      requireLogin: poll.require_login,
      endDate: poll.expires_at ? new Date(poll.expires_at) : undefined
    };
  });

  return polls;
}
