import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

// Client-side Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Server-side Supabase client with service role (for API routes)
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured');
  }

  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    serviceRoleKey || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      preferences: {
        Row: {
          id: string;
          user_id: string;
          discovery_mode: 'avatar' | 'voice';
          platforms: string[];
          preferred_genres: string[];
          voice_speed: number;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['preferences']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['preferences']['Insert']>;
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          platform: string;
          watched_at: string;
          watch_duration: number | null;
          completed: boolean;
          rating: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['watch_history']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['watch_history']['Insert']>;
      };
      recommendations_history: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          intent: Record<string, unknown>;
          recommendations: Record<string, unknown>[];
          launched_content_id: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['recommendations_history']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['recommendations_history']['Insert']
        >;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'pro';
          status: 'active' | 'canceled' | 'past_due';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['subscriptions']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string;
          event_name: string;
          properties: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['analytics_events']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<
          Database['public']['Tables']['analytics_events']['Insert']
        >;
      };
    };
  };
}
