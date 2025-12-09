import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/deepgram';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Audio file is required' } },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer();

    // Determine mimetype
    const mimeType = audioFile.type || 'audio/webm';

    // Transcribe using Deepgram
    const result = await transcribeAudio(arrayBuffer, mimeType);

    return NextResponse.json({
      transcript: result.transcript,
      confidence: result.confidence,
      words: result.words,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'TRANSCRIPTION_FAILED',
          message: 'Failed to transcribe audio',
        },
      },
      { status: 500 }
    );
  }
}
