'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useDiscoveryStore, usePreferencesStore } from '@/lib/store';
import { Mic, MicOff, Loader2, Square } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function VoiceButton() {
  const {
    status,
    setStatus,
    setTranscript,
    setInterimTranscript,
    setRecommendations,
    setResponseText,
    setError,
  } = useDiscoveryStore();

  const { platforms } = usePreferencesStore();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const isListening = status === 'listening';
  const isProcessing = status === 'processing' || status === 'thinking';
  const isSpeaking = status === 'speaking';

  const startListening = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setStatus('listening');
      setInterimTranscript('');
      setTranscript('');

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        if (chunks.length === 0) {
          setStatus('idle');
          return;
        }

        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          stopListening();
        }
      }, 30000);
    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('Could not access microphone. Please check permissions.');
      setStatus('idle');
    }
  }, [setStatus, setInterimTranscript, setTranscript]);

  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  const processAudio = async (audioBlob: Blob) => {
    setStatus('processing');

    try {
      // For now, simulate transcription with a demo query
      // In production, this would send to Deepgram or another STT service
      const demoQueries = [
        "Show me something like The Crown",
        "I need something uplifting after a long day",
        "Find me action movies with car chases",
        "What's good on TV5Monde?",
        "Something funny but not too silly",
      ];

      const simulatedTranscript = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      setTranscript(simulatedTranscript);

      setStatus('thinking');

      // Call discovery API
      const response = await fetch('/api/discovery/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: simulatedTranscript,
          platforms,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();

      setStatus('speaking');
      setResponseText(data.responseText);
      setRecommendations(data.recommendations);

      // Simulate speaking duration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('complete');

      // Return to idle after a moment
      setTimeout(() => setStatus('idle'), 1000);
    } catch (error) {
      console.error('Discovery error:', error);
      setError('Failed to process your request. Please try again.');
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else if (status === 'idle' || status === 'complete') {
      startListening();
    }
  };

  const getButtonContent = () => {
    if (isListening) {
      return (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <MicOff className="w-8 h-8 relative z-10" />
        </>
      );
    }

    if (isProcessing) {
      return <Loader2 className="w-8 h-8 animate-spin" />;
    }

    if (isSpeaking) {
      return <Square className="w-8 h-8" />;
    }

    return <Mic className="w-8 h-8" />;
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening... (tap to stop)';
      case 'processing':
        return 'Processing...';
      case 'thinking':
        return 'Alex is thinking...';
      case 'speaking':
        return 'Alex is speaking...';
      case 'complete':
        return 'Tap to ask again';
      default:
        return 'Tap to talk to Alex';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        size="lg"
        onClick={handleClick}
        disabled={isProcessing || isSpeaking}
        className={cn(
          'w-20 h-20 rounded-full relative transition-all duration-300',
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
          (isProcessing || isSpeaking) && 'opacity-75 cursor-not-allowed'
        )}
      >
        {getButtonContent()}
      </Button>
      <span className="text-sm text-slate-400">{getStatusText()}</span>
    </div>
  );
}
