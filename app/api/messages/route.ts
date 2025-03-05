import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const USER_GUIDE_ASSISTANT_ID = process.env.USER_GUIDE_ASSISTANT_ID || 'asst_V6h7cG2GvnjnurFBMX4QpHxZ';

export async function POST(req: NextRequest) {
  try {
    const { threadId, message } = await req.json();

    if (!threadId || !message) {
      return NextResponse.json(
        { error: 'Thread ID and message are required' },
        { status: 400 }
      );
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: USER_GUIDE_ASSISTANT_ID,
    });

    const pollRun = async (maxAttempts = 30): Promise<any> => {
      if (maxAttempts === 0) {
        throw new Error('Run timed out');
      }

      const currentRun = await openai.beta.threads.runs.retrieve(
        threadId, 
        run.id
      );

      if (currentRun.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        
        const assistantMessages = messages.data
          .filter(msg => msg.role === 'assistant')
          .sort((a, b) => b.created_at - a.created_at);

        const lastAssistantMessage = assistantMessages[0];
        const responseContent = lastAssistantMessage?.content[0]?.type === 'text' 
          ? lastAssistantMessage.content[0].text.value 
          : '';

        return { 
          status: 'completed', 
          message: responseContent 
        };
      }

      if (['failed', 'cancelled', 'expired'].includes(currentRun.status)) {
        throw new Error(`Run ${currentRun.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      return pollRun(maxAttempts - 1);
    };

    const result = await pollRun();

    return NextResponse.json({
      threadId,
      message: result.message,
      success: true
    });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}