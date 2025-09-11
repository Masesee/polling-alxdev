import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  fail,
  validateCreatePollInput,
  getAuthenticatedUserId,
  insertPoll,
  insertPollOptions,
  CreatePollInput,
} from '../../../lib/server-utils/polls'

/**
 * Parses a JSON request body into a structured CreatePollInput object.
 * @param body The JSON body from the request.
 * @returns A CreatePollInput object.
 */
function parseCreatePollJson(body: any): CreatePollInput {
  const question = String(body.question || '').trim()
  const options = Array.isArray(body.options)
    ? body.options.map((o: any) => String(o || '').trim()).filter((o: string) => o.length > 0)
    : []
  const allowMultiple = Boolean(body.allowMultiple)
  const requireLogin = Boolean(body.requireLogin)
  const endDateRaw = String(body.endDateRaw || '').trim()
  return { question, options, allowMultiple, requireLogin, endDateRaw }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = parseCreatePollJson(body)
    const fieldErrors = validateCreatePollInput(input)

    if (fieldErrors) {
      return NextResponse.json(fail('Invalid input', fieldErrors), { status: 400 })
    }

    const userId = await getAuthenticatedUserId()
    const { id: pollId } = await insertPoll(input, userId)
    await insertPollOptions(pollId, input.options)

    revalidatePath('/polls')
    return NextResponse.json({ success: true, data: { pollId } }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json(fail(message), { status: 500 })
  }
}
