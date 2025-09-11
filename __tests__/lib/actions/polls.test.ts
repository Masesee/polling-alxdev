import { createPoll } from '../../../lib/actions/polls';
import { createServerSupabase } from '../../../lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('../../../lib/supabase/server');
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// #File: lib/actions/polls.ts
// #Docs: Tests for the poll actions

describe('createPoll', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return field errors when question is empty', async () => {
    // Create FormData with empty question
    const formData = new FormData();
    formData.append('question', '');
    formData.append('options', 'Option 1\nOption 2');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: false,
      message: 'Invalid input',
      fieldErrors: {
        question: 'Question is required',
      },
    });

    // Verify that Supabase was not called
    expect(createServerSupabase).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should return field errors when less than 2 options are provided', async () => {
    // Create FormData with only one option
    const formData = new FormData();
    formData.append('question', 'Test Question');
    formData.append('options', 'Option 1');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: false,
      message: 'Invalid input',
      fieldErrors: {
        options: 'Please provide at least 2 options',
      },
    });

    // Verify that Supabase was not called
    expect(createServerSupabase).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should handle successful poll creation', async () => {
    // Mock Supabase responses
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'test-poll-id', question: 'Test Question' },
        error: null,
      }),
    };

    (createServerSupabase as jest.Mock).mockReturnValue(mockSupabase);

    // Create FormData with valid data
    const formData = new FormData();
    formData.append('question', 'Test Question');
    formData.append('options', 'Option 1\nOption 2');
    formData.append('allowMultiple', 'on');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: true,
      data: {
        pollId: 'test-poll-id',
      },
    });

    // Verify that Supabase was called correctly
    expect(createServerSupabase).toHaveBeenCalled();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('polls');
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      question: 'Test Question',
      created_by: 'test-user-id',
      allow_multiple: true,
      require_login: false,
      expires_at: null,
    });
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
  });

  it('should handle poll creation error', async () => {
    // Mock Supabase error response
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    };

    (createServerSupabase as jest.Mock).mockReturnValue(mockSupabase);

    // Create FormData with valid data
    const formData = new FormData();
    formData.append('question', 'Test Question');
    formData.append('options', 'Option 1\nOption 2');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: false,
      message: 'Database error',
    });

    // Verify that revalidatePath was not called
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should handle options insertion error', async () => {
    // Mock successful poll creation but failed options insertion
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
      },
      from: jest.fn().mockImplementation((table) => {
        if (table === 'polls') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: 'test-poll-id', question: 'Test Question' },
              error: null,
            }),
          };
        } else if (table === 'poll_options') {
          return {
            insert: jest.fn().mockResolvedValue({
              error: { message: 'Options insertion error' },
            }),
          };
        }
        return mockSupabase;
      }),
    };

    (createServerSupabase as jest.Mock).mockReturnValue(mockSupabase);

    // Create FormData with valid data
    const formData = new FormData();
    formData.append('question', 'Test Question');
    formData.append('options', 'Option 1\nOption 2');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: false,
      message: 'Options insertion error',
    });

    // Verify that revalidatePath was not called
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    // Mock an unexpected error
    (createServerSupabase as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Create FormData with valid data
    const formData = new FormData();
    formData.append('question', 'Test Question');
    formData.append('options', 'Option 1\nOption 2');

    const result = await createPoll({}, formData);

    expect(result).toEqual({
      success: false,
      message: 'Unexpected error',
    });

    // Verify that revalidatePath was not called
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});