'use server'

import { revalidatePath } from 'next/cache'
import {
  fail,
  parseCreatePollForm,
  validateCreatePollInput,
  getAuthenticatedUserId,
  insertPoll,
  insertPollOptions,
  ActionResult,
  CreatePollInput,
} from '../server-utils/polls'

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