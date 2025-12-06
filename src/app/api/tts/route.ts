import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech, streamTextToSpeech } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId, stream = false } = body;

    if (!text) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Text is required' } },
        { status: 400 }
      );
    }

    if (stream) {
      // Return streaming audio response
      const audioStream = await streamTextToSpeech(text, voiceId);

      return new NextResponse(audioStream as unknown as ReadableStream, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Transfer-Encoding': 'chunked',
        },
      });
    } else {
      // Return complete audio file
      const audioBuffer = await textToSpeech(text, voiceId);

      if (!audioBuffer) {
        return NextResponse.json(
          { error: { code: 'TTS_FAILED', message: 'Failed to generate audio' } },
          { status: 500 }
        );
      }

      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      });
    }
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'TTS_FAILED',
          message: 'Failed to generate speech',
        },
      },
      { status: 500 }
    );
  }
}
