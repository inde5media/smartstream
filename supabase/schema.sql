-- StreamSmart Database Schema
-- Run this in Supabase SQL Editor

-- ===========================================
-- Preferences Table
-- ===========================================
CREATE TABLE IF NOT EXISTS public.preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  discovery_mode TEXT DEFAULT 'avatar' CHECK (discovery_mode IN ('avatar', 'voice')),
  platforms TEXT[] DEFAULT ARRAY['netflix', 'tv5monde'],
  preferred_genres TEXT[] DEFAULT ARRAY[]::TEXT[],
  voice_speed NUMERIC DEFAULT 1.0,
  notifications_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Watch History Table
-- ===========================================
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  title TEXT,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  watch_duration INTEGER, -- seconds
  completed BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Recommendations History Table
-- ===========================================
CREATE TABLE IF NOT EXISTS public.recommendations_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  intent JSONB,
  recommendations JSONB NOT NULL,
  launched_content_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Subscriptions Table
-- ===========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  queries_used INTEGER DEFAULT 0,
  queries_limit INTEGER DEFAULT 10, -- Free tier limit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Analytics Events Table
-- ===========================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Content Catalog Table (for caching/search)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.content_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL,
  platform_id TEXT,
  genre TEXT,
  year INTEGER,
  rating NUMERIC,
  thumbnail TEXT,
  poster TEXT,
  runtime INTEGER, -- minutes
  language TEXT DEFAULT 'en',
  deep_link TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Indexes for Performance
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON public.preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_watched_at ON public.watch_history(watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON public.recommendations_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_content_platform ON public.content_catalog(platform);
CREATE INDEX IF NOT EXISTS idx_content_genre ON public.content_catalog(genre);

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_catalog ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- RLS Policies - Preferences
-- ===========================================
CREATE POLICY "Users can view own preferences" ON public.preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- RLS Policies - Watch History
-- ===========================================
CREATE POLICY "Users can view own watch history" ON public.watch_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history" ON public.watch_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history" ON public.watch_history
  FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- RLS Policies - Recommendations History
-- ===========================================
CREATE POLICY "Users can view own recommendations" ON public.recommendations_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" ON public.recommendations_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- RLS Policies - Subscriptions
-- ===========================================
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ===========================================
-- RLS Policies - Analytics Events
-- ===========================================
CREATE POLICY "Users can insert own analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- RLS Policies - Content Catalog (Public Read)
-- ===========================================
CREATE POLICY "Anyone can view content catalog" ON public.content_catalog
  FOR SELECT USING (true);

-- ===========================================
-- Functions
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_updated_at ON public.content_catalog;
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- Insert Sample Content
-- ===========================================
INSERT INTO public.content_catalog (external_id, title, description, platform, genre, year, rating, thumbnail) VALUES
  ('versailles-1', 'Versailles', 'The rise of Louis XIV and the construction of Versailles', 'tv5monde', 'historical drama', 2015, 8.2, 'https://images.unsplash.com/photo-1548504769-900b70ed122e?w=400&h=225&fit=crop'),
  ('bureau-1', 'Le Bureau des Légendes', 'French intelligence officers work undercover across the globe', 'tv5monde', 'thriller', 2015, 8.6, 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop'),
  ('spiral-1', 'Spiral (Engrenages)', 'French crime drama following Paris police and prosecutors', 'tv5monde', 'crime drama', 2005, 8.3, 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=400&h=225&fit=crop'),
  ('call-agent-1', 'Call My Agent!', 'Comedy-drama about talent agents in Paris', 'tv5monde', 'comedy', 2015, 8.2, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop'),
  ('crown-1', 'The Crown', 'Follows the reign of Queen Elizabeth II', 'netflix', 'historical drama', 2016, 8.7, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=225&fit=crop'),
  ('stranger-1', 'Stranger Things', 'Kids uncover supernatural mysteries in 1980s Indiana', 'netflix', 'sci-fi', 2016, 8.7, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=225&fit=crop'),
  ('succession-1', 'Succession', 'A dysfunctional family media empire', 'hbo', 'drama', 2018, 8.9, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=225&fit=crop'),
  ('white-lotus-1', 'The White Lotus', 'Dark comedy at luxury resorts', 'hbo', 'comedy', 2021, 8.0, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=225&fit=crop'),
  ('ted-lasso-1', 'Ted Lasso', 'American football coach leads a British soccer team', 'apple', 'comedy', 2020, 8.8, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop'),
  ('mandalorian-1', 'The Mandalorian', 'A bounty hunter in the Star Wars universe', 'disney', 'sci-fi', 2019, 8.7, 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&h=225&fit=crop'),
  ('fleabag-1', 'Fleabag', 'A dry-witted woman navigates life in London', 'prime', 'comedy', 2016, 8.7, 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=225&fit=crop'),
  ('mad-max-1', 'Mad Max: Fury Road', 'Post-apocalyptic action with incredible car chases', 'hbo', 'action', 2015, 8.1, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=225&fit=crop'),
  ('john-wick-1', 'John Wick', 'Retired hitman seeks vengeance', 'netflix', 'action', 2014, 7.4, 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=225&fit=crop'),
  ('schitts-1', 'Schitts Creek', 'A wealthy family loses everything and moves to a small town', 'netflix', 'comedy', 2015, 8.5, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=225&fit=crop'),
  ('lupin-1', 'Lupin', 'A gentleman thief seeks revenge in Paris', 'netflix', 'thriller', 2021, 7.5, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop')
ON CONFLICT (external_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();
