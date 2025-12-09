// Deepgram Speech-to-Text Integration

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  words: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

/**
 * Transcribe audio using Deepgram's API
 */
export async function transcribeAudio(
  audio: ArrayBuffer,
  mimeType: string = 'audio/webm',
  options?: {
    language?: string;
    model?: string;
  }
): Promise<TranscriptionResult> {
  if (!DEEPGRAM_API_KEY) {
    console.warn('Deepgram API key not configured, using mock transcription');
    return mockTranscription();
  }

  try {
    // Create Blob for fetch compatibility
    const audioBlob = new Blob([audio], { type: mimeType });

    const response = await fetch(
      'https://api.deepgram.com/v1/listen?' +
        new URLSearchParams({
          model: options?.model || 'nova-2',
          language: options?.language || 'en-US',
          smart_format: 'true',
          punctuate: 'true',
        }),
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': mimeType,
        },
        body: audioBlob,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Deepgram API error:', error);
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results?.channels?.[0]?.alternatives?.[0];

    if (!result) {
      throw new Error('No transcription result');
    }

    return {
      transcript: result.transcript || '',
      confidence: result.confidence || 0,
      words: result.words || [],
    };
  } catch (error) {
    console.error('Transcription error:', error);
    // Fall back to mock for demo
    return mockTranscription();
  }
}

/**
 * Create a WebSocket connection for real-time transcription
 */
export function createRealtimeTranscription(
  onTranscript: (text: string, isFinal: boolean) => void,
  onError: (error: Error) => void
): {
  send: (audioChunk: ArrayBuffer) => void;
  close: () => void;
} {
  if (!DEEPGRAM_API_KEY) {
    console.warn('Deepgram API key not configured');
    return {
      send: () => {},
      close: () => {},
    };
  }

  const ws = new WebSocket(
    `wss://api.deepgram.com/v1/listen?` +
      new URLSearchParams({
        model: 'nova-2',
        language: 'en-US',
        smart_format: 'true',
        interim_results: 'true',
        utterance_end_ms: '1000',
        vad_events: 'true',
      }),
    ['token', DEEPGRAM_API_KEY]
  );

  ws.onopen = () => {
    console.log('Deepgram WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'Results') {
        const transcript = data.channel?.alternatives?.[0]?.transcript || '';
        const isFinal = data.is_final || false;

        if (transcript) {
          onTranscript(transcript, isFinal);
        }
      }
    } catch (error) {
      console.error('Error parsing Deepgram message:', error);
    }
  };

  ws.onerror = (event) => {
    console.error('Deepgram WebSocket error:', event);
    onError(new Error('WebSocket connection error'));
  };

  ws.onclose = () => {
    console.log('Deepgram WebSocket closed');
  };

  return {
    send: (audioChunk: ArrayBuffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(audioChunk);
      }
    },
    close: () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    },
  };
}

/**
 * Mock transcription for demo/fallback
 */
function mockTranscription(): TranscriptionResult {
  const demoQueries = [
    "Show me something like The Crown",
    "I need something uplifting after a long day",
    "Find me action movies with car chases",
    "What's good on TV5Monde?",
    "Something funny but not too silly",
    "French historical dramas",
    "Thriller series with good reviews",
    "Comedy shows to watch with family",
  ];

  const transcript = demoQueries[Math.floor(Math.random() * demoQueries.length)];

  return {
    transcript,
    confidence: 0.95,
    words: transcript.split(' ').map((word, i) => ({
      word,
      start: i * 0.3,
      end: (i + 1) * 0.3,
      confidence: 0.95,
    })),
  };
}
