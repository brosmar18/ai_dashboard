import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const thread = await openai.beta.threads.create();
    
    return NextResponse.json({ 
      threadId: thread.id,
      success: true 
    });
  } catch (error: any) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create thread' },
      { status: 500 }
    );
  }
}