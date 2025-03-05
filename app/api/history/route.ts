// history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    // Retrieve all messages from the thread
    const messageList = await openai.beta.threads.messages.list(threadId);

    // Format messages for the client
    const formattedMessages = messageList.data.map(message => {
      let content = '';
      if (message.content && message.content.length > 0) {
        const textContent = message.content.find(item => item.type === 'text');
        if (textContent && 'text' in textContent) {
          content = textContent.text.value;
        }
      }

      return {
        id: message.id,
        role: message.role,
        content,
        createdAt: message.created_at
      };
    });

    // Return messages in reverse chronological order (newest first)
    return NextResponse.json({
      messages: formattedMessages.reverse(),
      success: true
    });
  } catch (error: any) {
    console.error('Error retrieving message history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve message history' },
      { status: 500 }
    );
  }
}