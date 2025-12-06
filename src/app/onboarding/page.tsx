'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStore, usePreferencesStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { PLATFORM_LIST, getPlatformColor } from '@/config/platforms';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  Mic,
  Check,
  Loader2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    step,
    nextStep,
    prevStep,
    selectedPlatforms,
    togglePlatform,
    selectedMode,
    setSelectedMode,
    reset,
  } = useOnboardingStore();
  const { setPlatforms, setDiscoveryMode } = usePreferencesStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // Welcome step always can proceed
      case 2:
        return selectedPlatforms.length > 0;
      case 3:
        return true; // Mode selection always has default
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    try {
      // Save preferences to Supabase
      const { error } = await supabase.from('preferences').upsert({
        user_id: user?.id,
        platforms: selectedPlatforms,
        discovery_mode: selectedMode,
      });

      if (error) {
        console.error('Failed to save preferences:', error);
        // Continue anyway for demo
      }

      // Update local state
      setPlatforms(selectedPlatforms);
      setDiscoveryMode(selectedMode);

      // Mark onboarding as complete
      await supabase.auth.updateUser({
        data: { onboarding_completed: true },
      });

      toast.success("You're all set! Let's find something great to watch.");
      reset();
      router.push('/discovery');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleNext = () => {
    if (step === totalSteps) {
      handleComplete();
    } else {
      nextStep();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StreamSmart</span>
            </div>
            <span className="text-sm text-slate-400">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <main className="pt-32 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to StreamSmart{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                Let&apos;s personalize your experience in 30 seconds so Alex can find your perfect shows.
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-sm mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Alex</p>
                    <p className="text-sm text-slate-400">Your AI Discovery Guide</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platform Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Which streaming services do you have?
                </h1>
                <p className="text-slate-400">
                  Select all that apply. Alex will search across all your platforms.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PLATFORM_LIST.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <Card
                      key={platform.id}
                      className={cn(
                        'cursor-pointer transition-all duration-200',
                        'hover:shadow-lg',
                        isSelected
                          ? 'border-2 bg-slate-800'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      )}
                      style={{
                        borderColor: isSelected ? platform.color : undefined,
                      }}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{platform.name}</p>
                        </div>
                        {isSelected && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: platform.color }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedPlatforms.length === 0 && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  Select at least one platform to continue
                </p>
              )}
            </div>
          )}

          {/* Step 3: Mode Selection */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">
                  How do you want to discover content?
                </h1>
                <p className="text-slate-400">
                  You can always change this later in settings.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Avatar Mode */}
                <Card
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    'hover:shadow-lg',
                    selectedMode === 'avatar'
                      ? 'border-2 border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  )}
                  onClick={() => setSelectedMode('avatar')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Avatar Mode
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Chat with Alex through an interactive visual avatar
                    </p>
                    <ul className="text-sm text-slate-500 space-y-1">
                      <li>• Full conversational AI</li>
                      <li>• Visual engagement</li>
                      <li>• Best for discovery</li>
                    </ul>
                    {selectedMode === 'avatar' && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-blue-400">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Selected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Voice-Only Mode */}
                <Card
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    'hover:shadow-lg',
                    selectedMode === 'voice'
                      ? 'border-2 border-purple-500 bg-purple-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  )}
                  onClick={() => setSelectedMode('voice')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Voice-Only Mode
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Quick voice recommendations without video
                    </p>
                    <ul className="text-sm text-slate-500 space-y-1">
                      <li>• Fast and efficient</li>
                      <li>• Low bandwidth</li>
                      <li>• Best for quick searches</li>
                    </ul>
                    {selectedMode === 'voice' && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-purple-400">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Selected</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 w-full bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            variant="outline"
            className="border-slate-700"
            onClick={prevStep}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === totalSteps ? (
              <>
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
