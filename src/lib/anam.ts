// ANAM Avatar Integration
// Documentation: https://docs.anam.ai

const ANAM_API_KEY = process.env.ANAM_API_KEY;
const ANAM_API_URL = 'https://api.anam.ai/v1';

export interface AnamSession {
  sessionId: string;
  streamUrl: string;
  status: 'active' | 'ended';
}

export interface AnamPersona {
  id: string;
  name: string;
  voiceId: string;
  avatarId: string;
}

// Alex persona configuration for StreamSmart
export const ALEX_PERSONA = {
  personaId: '30fa96d0-26c4-4e55-94a0-517025942e18', // Demo persona ID
  voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
  name: 'Alex',
  systemPrompt: `You are Alex, a streaming discovery guide for StreamSmart.

Your personality:
- Enthusiastic but not over-the-top
- Concise (30 words or less per response)
- Confident in recommendations
- Warm and approachable

Response structure:
1. Acknowledge request briefly (5 words max)
2. Present recommendation with reason (15 words max)
3. Ask if they want to watch

Always be positive. Never say "I don't know."
Match the user's energy level.`,
};

/**
 * Create a new ANAM session for avatar interaction
 */
export async function createAnamSession(): Promise<AnamSession | null> {
  if (!ANAM_API_KEY) {
    console.warn('ANAM API key not configured, avatar mode unavailable');
    return null;
  }

  try {
    const response = await fetch(`${ANAM_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        persona_id: ALEX_PERSONA.personaId,
        voice_id: ALEX_PERSONA.voiceId,
        system_prompt: ALEX_PERSONA.systemPrompt,
        settings: {
          voice_speed: 1.0,
          emotion: 'friendly',
          interruption_enabled: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ANAM session creation error:', error);
      return null;
    }

    const data = await response.json();
    return {
      sessionId: data.session_id,
      streamUrl: data.stream_url,
      status: 'active',
    };
  } catch (error) {
    console.error('Failed to create ANAM session:', error);
    return null;
  }
}

/**
 * Send a message to the ANAM avatar
 */
export async function sendAnamMessage(
  sessionId: string,
  text: string,
  context?: Record<string, unknown>
): Promise<boolean> {
  if (!ANAM_API_KEY) {
    return false;
  }

  try {
    const response = await fetch(`${ANAM_API_URL}/sessions/${sessionId}/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        context,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send ANAM message:', error);
    return false;
  }
}

/**
 * End an ANAM session
 */
export async function endAnamSession(sessionId: string): Promise<void> {
  if (!ANAM_API_KEY) {
    return;
  }

  try {
    await fetch(`${ANAM_API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${ANAM_API_KEY}`,
      },
    });
  } catch (error) {
    console.error('Failed to end ANAM session:', error);
  }
}

/**
 * Get available personas from ANAM
 */
export async function getAnamPersonas(): Promise<AnamPersona[]> {
  if (!ANAM_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(`${ANAM_API_URL}/personas`, {
      headers: {
        Authorization: `Bearer ${ANAM_API_KEY}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.personas || [];
  } catch (error) {
    console.error('Failed to get ANAM personas:', error);
    return [];
  }
}

/**
 * Check if ANAM is available (API key configured)
 */
export function isAnamAvailable(): boolean {
  return !!ANAM_API_KEY;
}
