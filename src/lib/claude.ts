import Anthropic from '@anthropic-ai/sdk';
import type { Intent, ContentItem, Recommendation, UserContext } from '@/types';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for intent extraction (cached for 90% cost savings)
const INTENT_EXTRACTION_SYSTEM = `You are a streaming content expert that understands user intent beyond keywords.
Your job is to extract the true meaning behind what users want to watch.

When analyzing queries:
- Understand mood and emotional needs (e.g., "something uplifting" = feel-good content)
- Recognize references to other content (e.g., "like The Crown" = historical drama, political intrigue)
- Identify implicit preferences (e.g., "after a long day" = probably relaxing, not intense)
- Consider context clues about viewing situation

Always return valid JSON matching the Intent schema.`;

// System prompt for recommendation ranking
const RANKING_SYSTEM = `You are a personalized streaming recommendation expert.
Your job is to rank content candidates based on how well they match user preferences.

When ranking:
- Prioritize semantic match over superficial similarities
- Consider user's watch history for personalization
- Explain why each recommendation is a good fit
- Be concise but specific in reasons (10 words max)

Always return valid JSON array of top 3 recommendations.`;

// System prompt for response generation
const RESPONSE_SYSTEM = `You are Alex, an enthusiastic streaming discovery guide.

Your personality:
- Warm and approachable, but not over-the-top
- Confident in your recommendations
- Concise (under 50 words total)
- Conversational, not robotic

Response structure:
1. Brief acknowledgment (5 words max)
2. Top recommendation with reason (15 words max)
3. Mention platform availability
4. Invite to watch

Never say "I don't know" - always be helpful.`;

/**
 * Extract user intent from a natural language query
 */
export async function extractIntent(
  query: string,
  userContext: UserContext
): Promise<Intent> {
  const prompt = `Analyze this user request and extract their intent.

User said: "${query}"

User context:
- Watch history: ${JSON.stringify(userContext.watchHistory.slice(0, 5))}
- Preferred genres: ${userContext.preferredGenres.join(', ')}
- Platforms: ${userContext.platforms.join(', ')}

Extract the user's true intent and return as JSON:
{
  "genre": "primary genre or category",
  "mood": "emotional tone they want",
  "actors": ["specific actors mentioned"],
  "directors": ["specific directors mentioned"],
  "themes": ["key themes or elements"],
  "yearRange": {"min": number, "max": number} or null,
  "language": "preferred language" or null,
  "maxLength": runtime in minutes or null,
  "minRating": minimum rating 1-10 or null,
  "userPlatforms": ${JSON.stringify(userContext.platforms)}
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: [
        {
          type: 'text',
          text: INTENT_EXTRACTION_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error('Failed to extract intent:', error);
    throw new Error('Failed to extract intent from query');
  }
}

/**
 * Rank content candidates and return top recommendations
 */
export async function rankRecommendations(
  candidates: ContentItem[],
  userContext: UserContext,
  options?: { hackathonMode?: boolean }
): Promise<Recommendation[]> {
  const prompt = `Given these ${candidates.length} candidate shows/movies and the user's watch history,
select the TOP 3 that they'll love most.

Candidates:
${JSON.stringify(candidates.slice(0, 50), null, 2)}

User watch history (what they loved):
${JSON.stringify(userContext.watchHistory.slice(0, 10), null, 2)}

For each of your top 3 picks, provide:
1. id (from candidate)
2. title
3. platform
4. matchScore (0-100)
5. reason (10 words max explaining why they'll love it)
6. sellingPoints (3 brief points)

${options?.hackathonMode ? 'IMPORTANT: Prioritize TV5Monde content when match scores are within 5 points.' : ''}

Return as JSON array:
[
  {
    "id": "content-id",
    "title": "Title",
    "platform": "platform-name",
    "genre": "genre",
    "year": 2020,
    "rating": 8.5,
    "thumbnail": "url",
    "matchScore": 95,
    "reason": "Brief compelling reason",
    "sellingPoints": ["Point 1", "Point 2", "Point 3"]
  }
]`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: RANKING_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from response
    let jsonStr = content.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error('Failed to rank recommendations:', error);
    throw new Error('Failed to rank recommendations');
  }
}

/**
 * Generate a natural language response for the avatar/voice
 */
export async function generateResponse(
  recommendations: Recommendation[],
  originalQuery: string
): Promise<string> {
  const prompt = `The user asked: "${originalQuery}"

You found these great recommendations:
${JSON.stringify(recommendations.slice(0, 3), null, 2)}

Generate a natural, enthusiastic response that:
1. Acknowledges their request briefly
2. Presents the TOP recommendation with brief reason
3. Mentions the platform
4. Asks if they want to watch

Keep it conversational and under 50 words total.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: [
        {
          type: 'text',
          text: RESPONSE_SYSTEM,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return content.text.trim();
  } catch (error) {
    console.error('Failed to generate response:', error);
    throw new Error('Failed to generate response');
  }
}

export { anthropic };
