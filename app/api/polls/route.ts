import { NextResponse } from 'next/server';
import { generatePollId } from '../../../lib/utils';

// GET all polls
export async function GET() {
  try {
    // TODO: Implement fetching polls from Supabase
    
    // Mock polls data
    const polls = [
      {
        id: '1',
        question: 'What is your favorite programming language?',
        options: [
          { id: '1-1', text: 'JavaScript', votes: 10 },
          { id: '1-2', text: 'Python', votes: 8 },
          { id: '1-3', text: 'Java', votes: 5 },
        ],
        createdBy: 'user-1',
        createdAt: new Date(),
        isActive: true,
      },
      {
        id: '2',
        question: 'Which frontend framework do you prefer?',
        options: [
          { id: '2-1', text: 'React', votes: 12 },
          { id: '2-2', text: 'Vue', votes: 7 },
          { id: '2-3', text: 'Angular', votes: 4 },
        ],
        createdBy: 'user-1',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        isActive: true,
      },
    ];
    
    return NextResponse.json({ success: true, polls });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}

// POST create new poll
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, options } = body;
    
    // Validate input
    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Invalid poll data' },
        { status: 400 }
      );
    }
    
    // TODO: Implement creating poll in Supabase
    
    // Create poll with mock data
    const newPoll = {
      id: generatePollId(),
      question,
      options: options.map((text: string, index: number) => ({
        id: `option-${index}`,
        text,
        votes: 0
      })),
      createdBy: 'user-1', // This would come from the authenticated user
      createdAt: new Date(),
      isActive: true,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Poll created successfully',
      poll: newPoll,
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create poll' },
      { status: 500 }
    );
  }
}