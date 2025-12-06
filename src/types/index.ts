// StreamSmart Type Definitions

// ===========================================
// User Types
// ===========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  discovery_mode: 'avatar' | 'voice';
  platforms: string[];
  preferred_genres: string[];
  voice_speed: number;
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export interface UserContext {
  userId: string;
  platforms: string[];
  preferredGenres: string[];
  watchHistory: WatchHistoryItem[];
}

export interface WatchHistoryItem {
  id: string;
  user_id: string;
  content_id: string;
  platform: string;
  watched_at: string;
  watch_duration?: number;
  completed: boolean;
  rating?: number;
}

// ===========================================
// Content Types
// ===========================================

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  platform: Platform;
  platformId?: string;
  genre: string;
  year: number;
  rating?: number;
  thumbnail?: string;
  poster?: string;
  runtime?: number;
  language?: string;
  similarityScore?: number;
  slug?: string;
}

export interface Recommendation extends ContentItem {
  matchScore: number;
  reason: string;
  sellingPoints?: string[];
  deepLink?: string;
}

export type Platform =
  | 'tv5monde'
  | 'netflix'
  | 'hbo'
  | 'disney'
  | 'prime'
  | 'apple'
  | 'hulu';

export interface PlatformConfig {
  id: Platform;
  name: string;
  scheme: string;
  webFallback: string;
  appStoreId?: string;
  color: string;
  icon?: string;
}

// ===========================================
// Discovery Types
// ===========================================

export interface Intent {
  genre: string;
  mood: string;
  actors: string[];
  directors: string[];
  themes: string[];
  yearRange?: { min: number; max: number };
  language?: string;
  maxLength?: number;
  minRating?: number;
  userPlatforms: string[];
}

export interface DiscoveryResult {
  recommendations: Recommendation[];
  responseText: string;
  intent: Intent;
  audioUrl?: string;
}

export interface DiscoverySession {
  id: string;
  userId: string;
  query: string;
  intent: Intent;
  recommendations: Recommendation[];
  created_at: string;
}

// ===========================================
// Voice/WebSocket Types
// ===========================================

export type VoiceStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'thinking'
  | 'speaking'
  | 'complete'
  | 'error';

export type DiscoveryMode = 'avatar' | 'voice';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload?: unknown;
  timestamp?: string;
}

export type WebSocketMessageType =
  | 'voice_start'
  | 'voice_chunk'
  | 'voice_end'
  | 'transcript_interim'
  | 'transcript_final'
  | 'status_update'
  | 'response_text'
  | 'recommendations'
  | 'error';

export interface TranscriptMessage {
  type: 'transcript_interim' | 'transcript_final';
  text: string;
  isFinal: boolean;
}

export interface StatusMessage {
  type: 'status_update';
  status: VoiceStatus;
  message?: string;
}

export interface ResponseMessage {
  type: 'response_text';
  text: string;
  voiceUrl?: string;
}

export interface RecommendationsMessage {
  type: 'recommendations';
  recommendations: Recommendation[];
}

export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
  retryable: boolean;
}

// ===========================================
// Subscription Types
// ===========================================

export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

// ===========================================
// Analytics Types
// ===========================================

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp?: string;
}

// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// ===========================================
// User Feedback Types
// ===========================================

export interface UserFeedback {
  contentId: string;
  launched: boolean;
  liked?: boolean;
  watchDuration?: number;
}
