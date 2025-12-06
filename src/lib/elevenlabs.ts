// ElevenLabs Text-to-Speech Integration

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different personas
export const VOICE_IDS = {
  alex_female: 'EXAVITQu4vr4xnSDxMaL', // Bella - friendly female
  alex_male: 'VR6AewLTigWG4xSOukaG', // Arnold - friendly male
  default: 'EXAVITQu4vr4xnSDxMaL', // Default to Bella
};

export interface VoiceSettings {
  stability: number; // 0-1
  similarity_boost: number; // 0-1
  style: number; // 0-1
  use_speaker_boost: boolean;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true,
};

/**
 * Convert text to speech using ElevenLabs
 */
export async function textToSpeech(
  text: string,
  options?: {
    voiceId?: string;
    modelId?: string;
    settings?: Partial<VoiceSettings>;
  }
): Promise<ArrayBuffer | null> {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not configured');
    return null;
  }

  const voiceId = options?.voiceId || VOICE_IDS.default;
  const modelId = options?.modelId || 'eleven_turbo_v2'; // Fastest model

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            ...DEFAULT_VOICE_SETTINGS,
            ...options?.settings,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return null;
  }
}

/**
 * Stream text to speech (for lower latency)
 */
export async function streamTextToSpeech(
  text: string,
  onChunk: (chunk: Uint8Array) => void,
  options?: {
    voiceId?: string;
    modelId?: string;
  }
): Promise<void> {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not configured');
    return;
  }

  const voiceId = options?.voiceId || VOICE_IDS.default;
  const modelId = options?.modelId || 'eleven_turbo_v2';

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: DEFAULT_VOICE_SETTINGS,
        }),
      }
    );

    if (!response.ok || !response.body) {
      console.error('ElevenLabs streaming error');
      return;
    }

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        onChunk(value);
      }
    }
  } catch (error) {
    console.error('Streaming TTS error:', error);
  }
}

/**
 * Get available voices from ElevenLabs
 */
export async function getVoices(): Promise<
  Array<{ voice_id: string; name: string; preview_url: string }>
> {
  if (!ELEVENLABS_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Failed to get voices:', error);
    return [];
  }
}

/**
 * Check if ElevenLabs is available
 */
export function isElevenLabsAvailable(): boolean {
  return !!ELEVENLABS_API_KEY;
}

/**
 * Play audio in the browser
 */
export function playAudio(audioData: ArrayBuffer): HTMLAudioElement {
  const blob = new Blob([audioData], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.onended = () => {
    URL.revokeObjectURL(url);
  };

  audio.play().catch(console.error);
  return audio;
}
