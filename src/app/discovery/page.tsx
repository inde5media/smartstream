'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscoveryStore, usePreferencesStore } from '@/lib/store';
import { VoiceButton } from '@/components/discovery/VoiceButton';
import { RecommendationCarousel } from '@/components/discovery/RecommendationCarousel';
import { AvatarView } from '@/components/discovery/AvatarView';
import { VoiceOnlyView } from '@/components/discovery/VoiceOnlyView';
import { TranscriptDisplay } from '@/components/discovery/TranscriptDisplay';
import { Settings, User, Sparkles, Mic } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DiscoveryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    mode,
    setMode,
    status,
    recommendations,
    responseText,
    transcript,
    interimTranscript,
  } = useDiscoveryStore();
  const { platforms } = usePreferencesStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const toggleMode = () => {
    const newMode = mode === 'avatar' ? 'voice' : 'avatar';
    setMode(newMode);
    toast.success(`Switched to ${newMode === 'avatar' ? 'Avatar' : 'Voice-Only'} mode`);
  };

  if (!isClient || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
          <Skeleton className="w-48 h-6 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StreamSmart</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">
                  {mode === 'avatar' ? 'Avatar' : 'Voice'}
                </span>
                <Switch
                  checked={mode === 'avatar'}
                  onCheckedChange={toggleMode}
                />
              </div>

              {/* Settings */}
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-slate-300">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>

              {/* Profile */}
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-slate-300">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Platform Badges */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-sm text-slate-500">Searching:</span>
            {platforms.slice(0, 4).map((platform) => (
              <Badge
                key={platform}
                variant="outline"
                className="capitalize border-slate-700 text-slate-400"
              >
                {platform}
              </Badge>
            ))}
            {platforms.length > 4 && (
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                +{platforms.length - 4} more
              </Badge>
            )}
          </div>

          {/* Avatar or Voice View */}
          <div className="mb-8">
            {mode === 'avatar' ? (
              <AvatarView status={status} responseText={responseText} />
            ) : (
              <VoiceOnlyView status={status} responseText={responseText} />
            )}
          </div>

          {/* Transcript Display */}
          <TranscriptDisplay
            transcript={transcript}
            interimTranscript={interimTranscript}
            status={status}
          />

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recommendations for you
              </h3>
              <RecommendationCarousel recommendations={recommendations} />
            </div>
          )}

          {/* Empty State */}
          {recommendations.length === 0 && status === 'idle' && (
            <div className="text-center mt-12">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ask Alex anything
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Try &quot;Show me something like The Crown&quot; or &quot;I need something uplifting after a long day&quot;
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Voice Button (Fixed at bottom) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <VoiceButton />
      </div>
    </div>
  );
}
