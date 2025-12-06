import { NextRequest, NextResponse } from 'next/server';
import { extractIntent, rankRecommendations, generateResponse } from '@/lib/claude';
import type { ContentItem, UserContext, Recommendation } from '@/types';

// Sample content catalog (in production, this would come from AgentDB)
const SAMPLE_CONTENT: ContentItem[] = [
  {
    id: 'versailles-1',
    title: 'Versailles',
    description: 'The rise of Louis XIV and the construction of Versailles',
    platform: 'tv5monde',
    platformId: 'versailles-s1',
    genre: 'historical drama',
    year: 2015,
    rating: 8.2,
    thumbnail: 'https://images.unsplash.com/photo-1548504769-900b70ed122e?w=400&h=225&fit=crop',
  },
  {
    id: 'bureau-1',
    title: 'Le Bureau des Légendes',
    description: 'French intelligence officers work undercover across the globe',
    platform: 'tv5monde',
    platformId: 'bureau-s1',
    genre: 'thriller',
    year: 2015,
    rating: 8.6,
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop',
  },
  {
    id: 'crown-1',
    title: 'The Crown',
    description: 'Follows the reign of Queen Elizabeth II',
    platform: 'netflix',
    platformId: 'crown-s1',
    genre: 'historical drama',
    year: 2016,
    rating: 8.7,
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=225&fit=crop',
  },
  {
    id: 'succession-1',
    title: 'Succession',
    description: 'A dysfunctional family media empire',
    platform: 'hbo',
    platformId: 'succession-s1',
    genre: 'drama',
    year: 2018,
    rating: 8.9,
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=225&fit=crop',
  },
  {
    id: 'ted-lasso-1',
    title: 'Ted Lasso',
    description: 'American football coach leads a British soccer team',
    platform: 'apple',
    platformId: 'ted-lasso-s1',
    genre: 'comedy',
    year: 2020,
    rating: 8.8,
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop',
  },
  {
    id: 'schitts-1',
    title: "Schitt's Creek",
    description: 'A wealthy family loses everything and moves to a small town',
    platform: 'netflix',
    platformId: 'schitts-s1',
    genre: 'comedy',
    year: 2015,
    rating: 8.5,
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=225&fit=crop',
  },
  {
    id: 'fleabag-1',
    title: 'Fleabag',
    description: 'A dry-witted woman navigates life in London',
    platform: 'prime',
    platformId: 'fleabag-s1',
    genre: 'comedy',
    year: 2016,
    rating: 8.7,
    thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=225&fit=crop',
  },
  {
    id: 'mad-max-1',
    title: 'Mad Max: Fury Road',
    description: 'Post-apocalyptic action with incredible car chases',
    platform: 'hbo',
    platformId: 'madmax-fr',
    genre: 'action',
    year: 2015,
    rating: 8.1,
    thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=225&fit=crop',
  },
  {
    id: 'john-wick-1',
    title: 'John Wick',
    description: 'Retired hitman seeks vengeance for his dog',
    platform: 'netflix',
    platformId: 'johnwick-1',
    genre: 'action',
    year: 2014,
    rating: 7.4,
    thumbnail: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=225&fit=crop',
  },
  {
    id: 'spirited-1',
    title: 'Spirited Away',
    description: 'A girl enters a magical world of spirits',
    platform: 'hbo',
    platformId: 'spirited-away',
    genre: 'animation',
    year: 2001,
    rating: 8.6,
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=225&fit=crop',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, platforms = ['netflix', 'tv5monde'], userId = 'demo-user' } = body;

    if (!query) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Query is required' } },
        { status: 400 }
      );
    }

    // Build user context
    const userContext: UserContext = {
      userId,
      platforms,
      preferredGenres: [], // Would come from user preferences
      watchHistory: [], // Would come from database
    };

    // Step 1: Extract intent from query
    let intent;
    try {
      intent = await extractIntent(query, userContext);
    } catch (error) {
      console.error('Intent extraction failed:', error);
      // Use fallback intent
      intent = {
        genre: 'drama',
        mood: 'engaging',
        actors: [],
        directors: [],
        themes: [],
        userPlatforms: platforms,
      };
    }

    // Step 2: Filter content by user's platforms
    const filteredContent = SAMPLE_CONTENT.filter((item) =>
      platforms.includes(item.platform)
    );

    // Step 3: Simple semantic matching (in production, use AgentDB vector search)
    const scoredContent: ContentItem[] = filteredContent.map((item) => {
      let score = 0.5; // Base score

      // Genre match
      if (intent.genre && item.genre?.toLowerCase().includes(intent.genre.toLowerCase())) {
        score += 0.3;
      }

      // Query keyword matching
      const queryLower = query.toLowerCase();
      if (item.title.toLowerCase().includes(queryLower)) score += 0.2;
      if (item.description?.toLowerCase().includes(queryLower)) score += 0.1;

      // Mood-based boosting
      const uplifting = ['comedy', 'feel-good', 'inspirational'];
      const intense = ['thriller', 'action', 'drama'];

      if (intent.mood?.toLowerCase().includes('uplifting') && uplifting.some(g => item.genre?.includes(g))) {
        score += 0.2;
      }
      if (intent.mood?.toLowerCase().includes('intense') && intense.some(g => item.genre?.includes(g))) {
        score += 0.2;
      }

      return { ...item, similarityScore: Math.min(score, 1) };
    });

    // Sort by score
    scoredContent.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

    // Step 4: Rank recommendations using Claude
    let recommendations: Recommendation[];
    try {
      recommendations = await rankRecommendations(
        scoredContent.slice(0, 10),
        userContext,
        { hackathonMode: true } // Prioritize TV5Monde
      );
    } catch (error) {
      console.error('Ranking failed, using fallback:', error);
      // Fallback: Use top 3 scored items
      recommendations = scoredContent.slice(0, 3).map((item, index) => ({
        ...item,
        matchScore: 95 - index * 5,
        reason: `Great match for "${query}"`,
        sellingPoints: ['Highly rated', 'Popular choice', 'Matches your taste'],
      }));
    }

    // Ensure TV5Monde content is prioritized for hackathon
    recommendations.sort((a, b) => {
      if (a.platform === 'tv5monde' && b.platform !== 'tv5monde') return -1;
      if (a.platform !== 'tv5monde' && b.platform === 'tv5monde') return 1;
      return b.matchScore - a.matchScore;
    });

    // Limit to top 3
    recommendations = recommendations.slice(0, 3);

    // Step 5: Generate natural language response
    let responseText: string;
    try {
      responseText = await generateResponse(recommendations, query);
    } catch (error) {
      console.error('Response generation failed:', error);
      responseText = `I found some great options for you! "${recommendations[0]?.title}" on ${recommendations[0]?.platform} looks like a perfect match.`;
    }

    return NextResponse.json({
      recommendations,
      responseText,
      intent,
    });
  } catch (error) {
    console.error('Discovery API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process discovery request',
        },
      },
      { status: 500 }
    );
  }
}
