import { NextRequest, NextResponse } from 'next/server';
import { extractIntent, rankRecommendations, generateResponse } from '@/lib/claude';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { ContentItem, UserContext, Recommendation } from '@/types';

// Fallback content catalog (used if database is not set up)
const FALLBACK_CONTENT: ContentItem[] = [
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
    id: 'spiral-1',
    title: 'Spiral (Engrenages)',
    description: 'French crime drama following Paris police and prosecutors',
    platform: 'tv5monde',
    genre: 'crime drama',
    year: 2005,
    rating: 8.3,
    thumbnail: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=400&h=225&fit=crop',
  },
  {
    id: 'call-agent-1',
    title: 'Call My Agent!',
    description: 'Comedy-drama about talent agents in Paris',
    platform: 'tv5monde',
    genre: 'comedy',
    year: 2015,
    rating: 8.2,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
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
    id: 'stranger-1',
    title: 'Stranger Things',
    description: 'Kids uncover supernatural mysteries in 1980s Indiana',
    platform: 'netflix',
    genre: 'sci-fi',
    year: 2016,
    rating: 8.7,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=225&fit=crop',
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
    id: 'white-lotus-1',
    title: 'The White Lotus',
    description: 'Dark comedy at luxury resorts',
    platform: 'hbo',
    genre: 'comedy',
    year: 2021,
    rating: 8.0,
    thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=225&fit=crop',
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
    id: 'mandalorian-1',
    title: 'The Mandalorian',
    description: 'A bounty hunter in the Star Wars universe',
    platform: 'disney',
    genre: 'sci-fi',
    year: 2019,
    rating: 8.7,
    thumbnail: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&h=225&fit=crop',
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
    description: 'Retired hitman seeks vengeance',
    platform: 'netflix',
    platformId: 'johnwick-1',
    genre: 'action',
    year: 2014,
    rating: 7.4,
    thumbnail: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=225&fit=crop',
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
    id: 'lupin-1',
    title: 'Lupin',
    description: 'A gentleman thief seeks revenge in Paris',
    platform: 'netflix',
    genre: 'thriller',
    year: 2021,
    rating: 7.5,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
  },
];

async function getContentCatalog(platforms: string[]): Promise<ContentItem[]> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('content_catalog')
      .select('*')
      .in('platform', platforms);

    if (error || !data || data.length === 0) {
      console.log('Using fallback content catalog');
      return FALLBACK_CONTENT.filter((item) => platforms.includes(item.platform));
    }

    return data.map((item) => ({
      id: item.external_id,
      title: item.title,
      description: item.description,
      platform: item.platform,
      platformId: item.platform_id,
      genre: item.genre,
      year: item.year,
      rating: item.rating,
      thumbnail: item.thumbnail,
      poster: item.poster,
      runtime: item.runtime,
      language: item.language,
    }));
  } catch (error) {
    console.error('Database error, using fallback:', error);
    return FALLBACK_CONTENT.filter((item) => platforms.includes(item.platform));
  }
}

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
      preferredGenres: [],
      watchHistory: [],
    };

    // Step 1: Extract intent from query
    let intent;
    try {
      intent = await extractIntent(query, userContext);
    } catch (error) {
      console.error('Intent extraction failed:', error);
      intent = {
        genre: 'drama',
        mood: 'engaging',
        actors: [],
        directors: [],
        themes: [],
        userPlatforms: platforms,
      };
    }

    // Step 2: Get content from database or fallback
    const contentCatalog = await getContentCatalog(platforms);

    // Step 3: Simple semantic matching (in production, use AgentDB vector search)
    const scoredContent: ContentItem[] = contentCatalog.map((item) => {
      let score = 0.5;

      // Genre match
      if (intent.genre && item.genre?.toLowerCase().includes(intent.genre.toLowerCase())) {
        score += 0.3;
      }

      // Query keyword matching
      const queryLower = query.toLowerCase();
      if (item.title.toLowerCase().includes(queryLower)) score += 0.2;
      if (item.description?.toLowerCase().includes(queryLower)) score += 0.1;

      // Reference matching (e.g., "like The Crown")
      const referenceMatch = query.match(/like\s+["']?([^"']+)["']?/i);
      if (referenceMatch) {
        const reference = referenceMatch[1].toLowerCase();
        if (item.title.toLowerCase().includes(reference)) {
          score += 0.3;
        }
        // Also boost similar genres
        const referenceItem = contentCatalog.find((c) =>
          c.title.toLowerCase().includes(reference)
        );
        if (referenceItem && referenceItem.genre === item.genre) {
          score += 0.2;
        }
      }

      // Mood-based boosting
      const uplifting = ['comedy', 'feel-good', 'inspirational'];
      const intense = ['thriller', 'action', 'drama'];

      if (
        intent.mood?.toLowerCase().includes('uplifting') &&
        uplifting.some((g) => item.genre?.includes(g))
      ) {
        score += 0.2;
      }
      if (
        intent.mood?.toLowerCase().includes('intense') &&
        intense.some((g) => item.genre?.includes(g))
      ) {
        score += 0.2;
      }

      // TV5Monde boost for hackathon demo
      if (item.platform === 'tv5monde') {
        score += 0.1;
      }

      return { ...item, similarityScore: Math.min(score, 1) };
    });

    // Sort by score
    scoredContent.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

    // Step 4: Rank recommendations using Claude
    let recommendations: Recommendation[];
    try {
      recommendations = await rankRecommendations(scoredContent.slice(0, 10), userContext, {
        hackathonMode: true,
      });
    } catch (error) {
      console.error('Ranking failed, using fallback:', error);
      recommendations = scoredContent.slice(0, 3).map((item, index) => ({
        ...item,
        matchScore: 95 - index * 5,
        reason: `Great match for "${query}"`,
        sellingPoints: ['Highly rated', 'Popular choice', 'Matches your taste'],
      }));
    }

    // Ensure TV5Monde content is prioritized
    recommendations.sort((a, b) => {
      if (a.platform === 'tv5monde' && b.platform !== 'tv5monde') return -1;
      if (a.platform !== 'tv5monde' && b.platform === 'tv5monde') return 1;
      return b.matchScore - a.matchScore;
    });

    recommendations = recommendations.slice(0, 3);

    // Step 5: Generate natural language response
    let responseText: string;
    try {
      responseText = await generateResponse(recommendations, query);
    } catch (error) {
      console.error('Response generation failed:', error);
      responseText = `I found some great options for you! "${recommendations[0]?.title}" on ${recommendations[0]?.platform} looks like a perfect match.`;
    }

    // Log to recommendations history (async, don't wait)
    try {
      const supabase = createServerSupabaseClient();
      supabase
        .from('recommendations_history')
        .insert({
          user_id: userId !== 'demo-user' ? userId : null,
          query,
          intent,
          recommendations,
        })
        .then(() => {});
    } catch {
      // Ignore logging errors
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
