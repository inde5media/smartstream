import { create } from 'zustand';
import type {
  VoiceStatus,
  DiscoveryMode,
  Recommendation,
  Intent,
} from '@/types';

// ===========================================
// Discovery Store
// ===========================================

interface DiscoveryState {
  // Mode
  mode: DiscoveryMode;
  setMode: (mode: DiscoveryMode) => void;

  // Voice status
  status: VoiceStatus;
  setStatus: (status: VoiceStatus) => void;

  // Transcript
  transcript: string;
  interimTranscript: string;
  setTranscript: (transcript: string) => void;
  setInterimTranscript: (transcript: string) => void;
  clearTranscript: () => void;

  // Recommendations
  recommendations: Recommendation[];
  setRecommendations: (recommendations: Recommendation[]) => void;
  clearRecommendations: () => void;

  // Response
  responseText: string;
  setResponseText: (text: string) => void;

  // Intent (for debugging/display)
  intent: Intent | null;
  setIntent: (intent: Intent | null) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Connection status
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  mode: 'avatar' as DiscoveryMode,
  status: 'idle' as VoiceStatus,
  transcript: '',
  interimTranscript: '',
  recommendations: [],
  responseText: '',
  intent: null,
  error: null,
  isConnected: false,
};

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),
  setStatus: (status) => set({ status }),

  setTranscript: (transcript) => set({ transcript }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  clearTranscript: () => set({ transcript: '', interimTranscript: '' }),

  setRecommendations: (recommendations) => set({ recommendations }),
  clearRecommendations: () => set({ recommendations: [] }),

  setResponseText: (responseText) => set({ responseText }),

  setIntent: (intent) => set({ intent }),

  setError: (error) => set({ error }),

  setIsConnected: (isConnected) => set({ isConnected }),

  reset: () => set(initialState),
}));

// ===========================================
// User Preferences Store
// ===========================================

interface PreferencesState {
  platforms: string[];
  preferredGenres: string[];
  discoveryMode: DiscoveryMode;
  voiceSpeed: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';

  setPlatforms: (platforms: string[]) => void;
  setPreferredGenres: (genres: string[]) => void;
  setDiscoveryMode: (mode: DiscoveryMode) => void;
  setVoiceSpeed: (speed: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  loadPreferences: (prefs: Partial<PreferencesState>) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  platforms: ['netflix', 'tv5monde'],
  preferredGenres: [],
  discoveryMode: 'avatar',
  voiceSpeed: 1.0,
  notificationsEnabled: true,
  theme: 'system',

  setPlatforms: (platforms) => set({ platforms }),
  setPreferredGenres: (preferredGenres) => set({ preferredGenres }),
  setDiscoveryMode: (discoveryMode) => set({ discoveryMode }),
  setVoiceSpeed: (voiceSpeed) => set({ voiceSpeed }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setTheme: (theme) => set({ theme }),
  loadPreferences: (prefs) => set(prefs),
}));

// ===========================================
// Onboarding Store
// ===========================================

interface OnboardingState {
  step: number;
  selectedPlatforms: string[];
  selectedMode: DiscoveryMode;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  togglePlatform: (platform: string) => void;
  setSelectedMode: (mode: DiscoveryMode) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  selectedPlatforms: [],
  selectedMode: 'avatar',

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  setSelectedPlatforms: (selectedPlatforms) => set({ selectedPlatforms }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
  setSelectedMode: (selectedMode) => set({ selectedMode }),
  reset: () =>
    set({
      step: 1,
      selectedPlatforms: [],
      selectedMode: 'avatar',
    }),
}));
