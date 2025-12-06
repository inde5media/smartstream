'use client';

import { cn } from '@/lib/utils';
import type { VoiceStatus } from '@/types';

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  status: VoiceStatus;
}

export function TranscriptDisplay({
  transcript,
  interimTranscript,
  status,
}: TranscriptDisplayProps) {
  const showTranscript = transcript || interimTranscript;
  const isListening = status === 'listening';

  if (!showTranscript && !isListening) {
    return null;
  }

  return (
    <div className="mt-6 text-center">
      <div
        className={cn(
          'inline-block px-4 py-2 rounded-xl',
          'bg-slate-800/50 border border-slate-700'
        )}
      >
        {/* Final Transcript */}
        {transcript && (
          <span className="text-white">{transcript}</span>
        )}

        {/* Interim Transcript (while listening) */}
        {interimTranscript && !transcript && (
          <span className="text-slate-400 italic">{interimTranscript}</span>
        )}

        {/* Listening indicator */}
        {isListening && !transcript && !interimTranscript && (
          <span className="text-slate-400 flex items-center gap-2">
            Listening
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
