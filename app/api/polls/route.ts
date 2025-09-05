import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Handles GET requests to fetch a list of polls.
 * This route retrieves polls from the Supabase database.
 * It supports pagination and filtering for polls created by the authenticated user.
 * @param request The incoming Next.js request object, potentially containing search parameters for pagination and user-specific polls.
 * @returns A JSON response containing the list of polls and pagination information.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const userPollsOnly = searchParams.get('userPollsOnly') === 'true';
  const offset = (page - 1) * limit;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    let query = supabase.from('polls').select('*, options(*)', { count: 'exact' });

    // If userPollsOnly is true, filter polls by the authenticated user's ID.
    if (userPollsOnly) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      query = query.eq('user_id', user.id);
    }

    // Apply pagination to the query.
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching polls:', error);
      return NextResponse.json({ message: 'Error fetching polls' }, { status: 500 });
    }

    // Return the fetched polls along with pagination metadata.
    return NextResponse.json({
      data,
      count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    });
  } catch (error) {
    console.error('Unexpected error fetching polls:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new poll.
 * This route receives poll data, including question and options, and stores it in the Supabase database.
 * It requires user authentication.
 * @param request The incoming Next.js request object, containing the poll data in its body.
 * @returns A JSON response indicating the success or failure of poll creation.
 */
export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { question, options } = body;

    // Basic validation for poll data.
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ message: 'Invalid poll data' }, { status: 400 });
    }

    // Insert the new poll into the 'polls' table.
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({ question, user_id: user.id })
      .select()
      .single();

    if (pollError) {
      console.error('Error creating poll:', pollError);
      return NextResponse.json({ message: 'Error creating poll' }, { status: 500 });
    }

    // Prepare options for insertion, linking them to the newly created poll.
    const optionsToInsert = options.map((option: string) => ({
      poll_id: poll.id,
      option_text: option,
    }));

    // Insert the poll options into the 'options' table.
    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optionsError) {
      console.error('Error creating poll options:', optionsError);
      // Consider rolling back poll creation here if options fail.
      return NextResponse.json({ message: 'Error creating poll options' }, { status: 500 });
    }

    // Return a success response with the created poll's ID.
    return NextResponse.json({ message: 'Poll created successfully', pollId: poll.id }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating poll:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}