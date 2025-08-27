import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // TODO: Implement Supabase authentication
    console.log('Login attempt:', { email });
    
    // Mock successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'user-1',
        email,
        name: 'Demo User',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    );
  }
}